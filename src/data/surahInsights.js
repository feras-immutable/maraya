/**
 * Curated one-liner insights for surah detail pages.
 * Each insight is a structural observation grounded in
 * quran_structural_dataset_v1.2_final.json.
 *
 * Tier 1 = pure structural fact (bulletproof)
 * Tier 2 = content-mirrors-position observation (strong)
 *
 * Not every surah needs one. Only add insights that make
 * someone stop and think.
 */

/**
 * Override which verse to show as the hero pivot verse.
 * By default the first verse in the pivot range is shown.
 * Use this when a later verse in the range is more recognizable.
 * Key = surah number, value = verse number within the surah.
 */
export const HERO_VERSE_OVERRIDE = {
  2: 143,  // "ummatan wasatan" — the word "middle" at the middle
};

export const SURAH_INSIGHTS = {
  // Category A: Perfect Center (offset = 0.000)
  1: "The shift from describing God to speaking directly to Him — at the structural center of the surah you read 17 times a day.",
  23: "A surah that opens with 'the believers have succeeded' places the reason for that success at its exact center.",
  26: "The surah's geometric center falls within the Noah story — the longest single prophetic narrative in the surah, beginning at exactly verse 105.",
  30: "A surah about the rise and fall of empires places 'an example from yourselves' at its exact center.",
  47: "The only verse where God tells the Prophet directly: 'Know that there is no deity except Allah.' At the exact mathematical center of the surah named after him.",
  50: "The moment the veil is lifted on the Day of Judgment — 'your sight this Day is sharp' — at the exact center.",
  54: "The surah's geometric center falls on the pivotal moment where every nation that denied was seized — exact mathematical midpoint.",
  70: "21 verses of human failure. Then one word at the exact center: 'Except.'",
  81: "13 verses of the universe ending. Then the exact center: 'A soul will know what it has brought.'",
  87: "A surah made entirely of divine reminders places the command 'So remind' at its exact center.",
  96: "The first surah revealed. Created. Taught. Then the exact center: 'man transgresses.'",
  104: "Three verses of indictment. Then Hellfire named at the exact center. Then five verses describing it.",

  // Category B: The Word at the Center
  2: "The word 'middle' sits at the middle of the Quran's longest surah — 286 verses.",
  18: "Four famous stories. The center: the only verse where the Quran names itself.",
  29: "The spider sits at the structural center of the spider surah.",
  41: "A surah named 'Made Clear' places at its center: 'Do not listen to this Quran.'",
  64: "The surah withholds its own name until the exact center — then names itself.",
  97: "'Laylat al-Qadr' appears three times. All three are at the center of the surah named after it.",

  // Category C: Scale
  3: "'Hold fast to the rope of Allah and do not be divided' — near the exact center of 200 verses.",
  4: "The Quran's challenge to find contradiction in itself sits near the center of its longest legislative surah.",
  5: "'Your ally is none but Allah' — at the exact center of a surah about covenant and belonging.",

  // Category D: Mirror Architecture
  60: "A surah about not taking enemies as allies. The exact center: 'Perhaps Allah will put affection between you and your enemies.'",
  55: "78 verses of blessings. Then suddenly: 'Everyone upon the earth will perish.' The pivot between creation and eternity.",

  // Category E: Theologically Charged
  39: "Even the polytheists admit God created everything — and that admission sits at the surah's exact center.",
  43: "'Has God ever authorized worship of anything other than Himself?' — posed at the geometric center.",
  57: "'Has the time not come for believers' hearts to be humble?' — placed near the exact center.",

  // Category F: Cross-Surah
  // (These work better as tweets than as on-page insights)

  // Category G: Edge Cases
  109: "One of only two surahs in the entire Quran that builds to the end instead of centering.",
  110: "One of only two surahs in the entire Quran that builds to the end instead of centering.",
  82: "The only surah in the dataset classified as multi-pivot — three independent zones, no single resolved center.",
  49: "'The believers are but brothers' — at the exact center of the Quran's primary surah on social ethics.",
  12: "The prison — the lowest point of Yusuf's story — sits at the structural center. Before: betrayal. After: power.",
};
