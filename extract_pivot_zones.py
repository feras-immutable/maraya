#!/usr/bin/env python3
"""
extract_pivot_zones.py

Extracts pivot zone and control zone data for all 114 surahs.
Reads structural data from quran_structural_dataset_v1_2_final.json (if it exists)
or falls back to extracting RAW_DATASET from src/maraya_v1_7.jsx.
Reads block map from src/data/blockMap.json.
Fetches Arabic + English verse text from api.alquran.cloud.

Outputs:
  - pivot_classification_input.json
  - extract_log.txt
"""

import json
import os
import random
import re
import sys
import time

import requests

# ── Paths ──────────────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(SCRIPT_DIR, "src", "data", "quran_structural_dataset_v1.2_final.json")
JSX_PATH = os.path.join(SCRIPT_DIR, "src", "maraya_v1_7.jsx")
BLOCKMAP_PATH = os.path.join(SCRIPT_DIR, "src", "data", "blockMap.json")
CACHE_PATH = os.path.join(SCRIPT_DIR, "quran_english_cache.json")
OUTPUT_PATH = os.path.join(SCRIPT_DIR, "pivot_classification_input.json")
LOG_PATH = os.path.join(SCRIPT_DIR, "extract_log.txt")

API_BASE = "https://api.alquran.cloud/v1/surah"
REQUEST_DELAY = 0.5  # seconds between API requests


# ── Load structural dataset ───────────────────────────────────────────────

def load_dataset():
    """Load surah dataset from standalone JSON or extract from JSX."""
    # Try standalone JSON first
    if os.path.exists(DATASET_PATH):
        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        # Handle both {surahs: [...]} wrapper and flat array
        if isinstance(data, dict) and "surahs" in data:
            return data["surahs"]
        if isinstance(data, list):
            return data
        raise ValueError(f"Unexpected JSON structure in {DATASET_PATH}")

    # Fall back: extract RAW_DATASET from JSX
    if not os.path.exists(JSX_PATH):
        print(f"ERROR: Neither {DATASET_PATH} nor {JSX_PATH} found.")
        sys.exit(1)

    print(f"Dataset JSON not found. Extracting RAW_DATASET from {JSX_PATH}...")
    with open(JSX_PATH, "r", encoding="utf-8") as f:
        jsx = f.read()

    match = re.search(r"const RAW_DATASET\s*=\s*\[", jsx)
    if not match:
        print("ERROR: Could not find RAW_DATASET in JSX file.")
        sys.exit(1)

    start = match.start() + len("const RAW_DATASET = ")
    # Find the matching closing bracket
    depth = 0
    end = start
    for i in range(start, len(jsx)):
        if jsx[i] == "[":
            depth += 1
        elif jsx[i] == "]":
            depth -= 1
            if depth == 0:
                end = i + 1
                break

    raw_json = jsx[start:end]
    # RAW_DATASET uses JS object syntax (no quotes on keys). Fix it.
    # Actually, looking at the actual data, it IS valid JSON (keys are quoted).
    try:
        dataset = json.loads(raw_json)
    except json.JSONDecodeError:
        # Try fixing unquoted keys
        fixed = re.sub(r'(\{|,)\s*(\w+)\s*:', r'\1"\2":', raw_json)
        dataset = json.loads(fixed)

    return dataset


# ── Load block map ─────────────────────────────────────────────────────────

def load_blockmap():
    with open(BLOCKMAP_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


# ── Parse pivot verse range ────────────────────────────────────────────────

def parse_pivot_range(pivot_verse):
    """
    Parse pivot_verse field into (start, end) integers.

    Handles:
      - Integer: 5
      - String integer: "5"
      - Range: "100–108" or "100-108"
      - Range with axis: "142–152 (axis: v.143)"
    """
    if isinstance(pivot_verse, int):
        return pivot_verse, pivot_verse

    s = str(pivot_verse).strip()

    # Remove parenthetical axis notation
    s = re.sub(r"\s*\(.*?\)", "", s).strip()

    # Try range with en-dash or hyphen
    range_match = re.match(r"(\d+)\s*[–\-]\s*(\d+)", s)
    if range_match:
        return int(range_match.group(1)), int(range_match.group(2))

    # Single number
    num_match = re.match(r"(\d+)", s)
    if num_match:
        n = int(num_match.group(1))
        return n, n

    raise ValueError(f"Cannot parse pivot_verse: {pivot_verse!r}")


# ── API fetching with cache ───────────────────────────────────────────────

def load_cache():
    if os.path.exists(CACHE_PATH):
        with open(CACHE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_cache(cache):
    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)


def fetch_surah_verses(surah_num, edition, cache, log_errors):
    """
    Fetch all verses for a surah in a given edition.
    Returns dict mapping verse number -> text.
    Uses cache keyed by "{surah_num}_{edition}".
    """
    cache_key = f"{surah_num}_{edition}"
    if cache_key in cache:
        return {v["n"]: v["text"] for v in cache[cache_key]}

    url = f"{API_BASE}/{surah_num}/{edition}"
    try:
        time.sleep(REQUEST_DELAY)
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        if data.get("code") != 200 or "data" not in data:
            msg = f"API error for surah {surah_num} ({edition}): {data.get('status', 'unknown')}"
            log_errors.append(msg)
            print(f"  WARNING: {msg}")
            return {}

        ayahs = data["data"]["ayahs"]
        verses = {a["numberInSurah"]: a["text"] for a in ayahs}

        # Save to cache
        cache[cache_key] = [{"n": a["numberInSurah"], "text": a["text"]} for a in ayahs]
        save_cache(cache)

        return verses

    except requests.RequestException as e:
        msg = f"Fetch error for surah {surah_num} ({edition}): {e}"
        log_errors.append(msg)
        print(f"  WARNING: {msg}")
        return {}


# ── Control zone selection ─────────────────────────────────────────────────

def pick_control_zone(verse_count, pivot_start, pivot_end, pivot_length):
    """
    Pick a control zone of the same length as the pivot zone.
    Must not overlap pivot and must not fall within ±10% of center.
    Returns (start, end) or None.
    """
    center = (verse_count + 1) / 2.0
    exclusion_radius = verse_count * 0.10

    candidates = []
    for start in range(1, verse_count - pivot_length + 2):
        end = start + pivot_length - 1
        if end > verse_count:
            break
        # Check overlap with pivot
        if start <= pivot_end and end >= pivot_start:
            continue
        # Check center exclusion: any verse in range within ±10% of center?
        zone_center = (start + end) / 2.0
        if abs(zone_center - center) < exclusion_radius:
            continue
        candidates.append((start, end))

    if not candidates:
        return None
    return random.choice(candidates)


# ── Find pivot block ──────────────────────────────────────────────────────

def find_pivot_block(blockmap, surah_num, pivot_start, pivot_end):
    """Find the block in blockMap that contains the pivot range."""
    blocks = blockmap.get(str(surah_num), [])
    for block in blocks:
        bv = block.get("v", [])
        if len(bv) == 2 and bv[0] <= pivot_start and bv[1] >= pivot_end:
            return block
    # Fallback: find block with role "pivot"
    for block in blocks:
        if block.get("role") == "pivot":
            return block
    return None


# ── Main ───────────────────────────────────────────────────────────────────

def main():
    random.seed(42)  # Reproducible control zone selection

    print("Loading structural dataset...")
    dataset = load_dataset()
    print(f"  {len(dataset)} surahs loaded.")

    print("Loading block map...")
    blockmap = load_blockmap()
    print(f"  {len(blockmap)} surahs in block map.")

    cache = load_cache()
    log_errors = []
    results = []

    single_verse_count = 0
    range_verse_count = 0
    control_skipped = []

    for i, surah in enumerate(dataset):
        surah_num = surah["surah_number"]
        verse_count = surah["verse_count"]
        print(f"Processing surah {surah_num}/114...")

        # Normalize field names — handle both formats
        pivot_obj = surah.get("pivot", {})
        pivot_field = surah.get("pivot_verse") if "pivot_verse" in surah else pivot_obj.get("verse")
        offset = surah.get("pivot_offset") if "pivot_offset" in surah else pivot_obj.get("offset", 0)
        center_logic = surah.get("pivot_center_logic") if "pivot_center_logic" in surah else pivot_obj.get("center_logic", "")
        surah_name_en = surah.get("surah_name_en", "")
        surah_name_ar = surah.get("surah_name_ar", "")

        if pivot_field is None:
            msg = f"Surah {surah_num}: no pivot_verse field found, skipping."
            log_errors.append(msg)
            print(f"  WARNING: {msg}")
            continue

        # Step 1: Parse pivot range
        pivot_start, pivot_end = parse_pivot_range(pivot_field)
        pivot_length = pivot_end - pivot_start + 1

        if pivot_start == pivot_end:
            single_verse_count += 1
        else:
            range_verse_count += 1

        # Step 2 & 3: Fetch Arabic and English
        ar_verses = fetch_surah_verses(surah_num, "quran-uthmani", cache, log_errors)
        en_verses = fetch_surah_verses(surah_num, "en.sahih", cache, log_errors)

        # Build pivot verses
        pivot_verses = []
        for n in range(pivot_start, pivot_end + 1):
            pivot_verses.append({
                "n": n,
                "ar": ar_verses.get(n, ""),
                "en": en_verses.get(n, ""),
            })

        # Step 4: Control zone
        control_zone = pick_control_zone(verse_count, pivot_start, pivot_end, pivot_length)
        control_verses = []
        control_start = None
        control_end = None

        if control_zone:
            control_start, control_end = control_zone
            for n in range(control_start, control_end + 1):
                control_verses.append({
                    "n": n,
                    "ar": ar_verses.get(n, ""),
                    "en": en_verses.get(n, ""),
                })
        else:
            reason = f"Surah {surah_num} ({surah_name_en}): no valid control zone — " \
                     f"verse_count={verse_count}, pivot={pivot_start}–{pivot_end}"
            control_skipped.append(reason)
            print(f"  SKIP control: {reason}")

        # Step 5: Block context
        pivot_block = find_pivot_block(blockmap, surah_num, pivot_start, pivot_end)
        pivot_block_id = pivot_block["id"] if pivot_block else None
        pivot_block_role = pivot_block["role"] if pivot_block else None
        pivot_block_label = pivot_block["label"] if pivot_block else None

        # Step 6: Build output record
        record = {
            "surah_number": surah_num,
            "surah_name_en": surah_name_en,
            "surah_name_ar": surah_name_ar,
            "verse_count": verse_count,
            "center_logic": center_logic,
            "offset": offset,
            "pivot_start": pivot_start,
            "pivot_end": pivot_end,
            "pivot_verse_count": pivot_length,
            "pivot_block_id": pivot_block_id,
            "pivot_block_role": pivot_block_role,
            "pivot_block_label": pivot_block_label,
            "pivot_verses": pivot_verses,
            "control_start": control_start,
            "control_end": control_end,
            "control_verses": control_verses if control_verses else [],
        }
        results.append(record)

    # Write output
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nWrote {OUTPUT_PATH} ({len(results)} surahs)")

    # Write log
    log_lines = [
        "extract_pivot_zones.py — run log",
        "=" * 50,
        f"Total surahs processed: {len(results)}",
        f"Single-verse pivots: {single_verse_count}",
        f"Range pivots: {range_verse_count}",
        f"Control zones skipped: {len(control_skipped)}",
    ]
    if control_skipped:
        log_lines.append("")
        log_lines.append("Skipped control zones:")
        for reason in control_skipped:
            log_lines.append(f"  - {reason}")
    if log_errors:
        log_lines.append("")
        log_lines.append("Errors:")
        for err in log_errors:
            log_lines.append(f"  - {err}")
    else:
        log_lines.append("")
        log_lines.append("No errors.")

    log_text = "\n".join(log_lines) + "\n"
    with open(LOG_PATH, "w", encoding="utf-8") as f:
        f.write(log_text)
    print(f"Wrote {LOG_PATH}")
    print("\n" + log_text)


if __name__ == "__main__":
    main()
