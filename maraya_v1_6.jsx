import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X, Eye, ArrowUpDown, BookOpen } from "lucide-react";

/*
 * MARAYA DESIGN RULES
 * - The structural bar is always the visual hero — it appears before and above text
 * - Structure before language: show the shape, then explain it
 * - Arabic text is always white (#fff) at display size
 * - Gold is reserved for pivot signals, active states, and branding
 * - No decorative illustrations, icons, or ornaments
 * - No gradients on backgrounds
 * - No glassmorphism or heavy blur
 * - No more than one glowing element per screen
 * - Borders are a last resort — use tonal depth instead
 * - Motion must reveal structure, not decorate
 * - Every screen has exactly one dominant focal point
 * - Ambient animations must be barely perceptible — if you're sure it's animated, it's too much
 */

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 1: RAW STRUCTURAL DATASET
   Source: quran_structural_dataset_v1.2_final.json
   Generated programmatically — zero hand-typed values.
   ═══════════════════════════════════════════════════════════════════ */
const DATASET_VERSION = "v1.2";

const RAW_DATASET = [
{"surah_number":1,"surah_name_ar":"الفاتحة","surah_name_en":"Al-Fatiha","verse_count":7,"pivot_verse":"5","pivot_offset":0.2143,"pivot_center_logic":"single_concentration"},
{"surah_number":2,"surah_name_ar":"البقرة","surah_name_en":"Al-Baqarah","verse_count":286,"pivot_verse":"142–152 (axis: v.143)","pivot_offset":-0.0017,"pivot_center_logic":"single_concentration"},
{"surah_number":3,"surah_name_ar":"آل عمران","surah_name_en":"Āl ʿImrān","verse_count":200,"pivot_verse":"100–108","pivot_offset":0.02,"pivot_center_logic":"compound_seam"},
{"surah_number":4,"surah_name_ar":"النساء","surah_name_en":"Al-Nisāʾ","verse_count":176,"pivot_verse":"82–95","pivot_offset":0.0028,"pivot_center_logic":"compound_seam"},
{"surah_number":5,"surah_name_ar":"المائدة","surah_name_en":"Al-Māʾidah","verse_count":120,"pivot_verse":"51–69","pivot_offset":0.0,"pivot_center_logic":"compound_seam"},
{"surah_number":6,"surah_name_ar":"الأنعام","surah_name_en":"Al-Anʿām","verse_count":165,"pivot_verse":"74–90","pivot_offset":-0.003,"pivot_center_logic":"compound_seam"},
{"surah_number":7,"surah_name_ar":"الأعراف","surah_name_en":"Al-Aʿrāf","verse_count":206,"pivot_verse":"94–102","pivot_offset":-0.0243,"pivot_center_logic":"compound_seam"},
{"surah_number":8,"surah_name_ar":"الأنفال","surah_name_en":"Al-Anfāl","verse_count":75,"pivot_verse":"41–44","pivot_offset":0.0667,"pivot_center_logic":"single_concentration"},
{"surah_number":9,"surah_name_ar":"التَّوْبَة","surah_name_en":"Al-Tawbah","verse_count":129,"pivot_verse":"73–80","pivot_offset":0.093,"pivot_center_logic":"compound_seam"},
{"surah_number":10,"surah_name_ar":"يُونُس","surah_name_en":"Yūnus","verse_count":109,"pivot_verse":"57–70","pivot_offset":0.0826,"pivot_center_logic":"compound_seam"},
{"surah_number":11,"surah_name_ar":"هُود","surah_name_en":"Hūd","verse_count":123,"pivot_verse":"61–83","pivot_offset":0.0854,"pivot_center_logic":"compound_seam"},
{"surah_number":12,"surah_name_ar":"يُوسُف","surah_name_en":"Yūsuf","verse_count":111,"pivot_verse":"36–57","pivot_offset":-0.0811,"pivot_center_logic":"compound_seam"},
{"surah_number":13,"surah_name_ar":"الرَّعْد","surah_name_en":"Al-Raʿd","verse_count":43,"pivot_verse":"19–29","pivot_offset":0.0581,"pivot_center_logic":"compound_seam"},
{"surah_number":14,"surah_name_ar":"إبراهيم","surah_name_en":"Ibrāhīm","verse_count":52,"pivot_verse":"21–27","pivot_offset":-0.0385,"pivot_center_logic":"compound_seam"},
{"surah_number":15,"surah_name_ar":"الحِجْر","surah_name_en":"Al-Ḥijr","verse_count":99,"pivot_verse":"45–50","pivot_offset":-0.0202,"pivot_center_logic":"single_concentration"},
{"surah_number":16,"surah_name_ar":"النَّحْل","surah_name_en":"Al-Naḥl","verse_count":128,"pivot_verse":"61–70","pivot_offset":0.0117,"pivot_center_logic":"compound_seam"},
{"surah_number":17,"surah_name_ar":"الإسراء","surah_name_en":"Al-Isrāʾ","verse_count":111,"pivot_verse":"45–52","pivot_offset":-0.0631,"pivot_center_logic":"compound_seam"},
{"surah_number":18,"surah_name_ar":"الكَهْف","surah_name_en":"Al-Kahf","verse_count":110,"pivot_verse":"54","pivot_offset":-0.0091,"pivot_center_logic":"single_concentration"},
{"surah_number":19,"surah_name_ar":"مَرْيَم","surah_name_en":"Maryam","verse_count":98,"pivot_verse":"51–58","pivot_offset":0.0561,"pivot_center_logic":"compound_seam"},
{"surah_number":20,"surah_name_ar":"طه","surah_name_en":"Ṭā Hā","verse_count":135,"pivot_verse":"83–98","pivot_offset":0.1704,"pivot_center_logic":"compound_seam"},
{"surah_number":21,"surah_name_ar":"الأنبِيَاء","surah_name_en":"Al-Anbiyāʾ","verse_count":112,"pivot_verse":"51–73","pivot_offset":0.0536,"pivot_center_logic":"compound_seam"},
{"surah_number":22,"surah_name_ar":"الحَجّ","surah_name_en":"Al-Ḥajj","verse_count":78,"pivot_verse":"38–41","pivot_offset":0.0064,"pivot_center_logic":"compound_seam"},
{"surah_number":23,"surah_name_ar":"المُؤْمِنُون","surah_name_en":"Al-Muʾminūn","verse_count":118,"pivot_verse":"57–61","pivot_offset":0.0,"pivot_center_logic":"single_concentration"},
{"surah_number":24,"surah_name_ar":"النُّور","surah_name_en":"Al-Nūr","verse_count":64,"pivot_verse":"35–40","pivot_offset":0.0859,"pivot_center_logic":"compound_seam"},
{"surah_number":25,"surah_name_ar":"الفُرْقَان","surah_name_en":"Al-Furqān","verse_count":77,"pivot_verse":"35–44","pivot_offset":0.013,"pivot_center_logic":"compound_seam"},
{"surah_number":26,"surah_name_ar":"الشُّعَرَاء","surah_name_en":"Al-Shuʿarāʾ","verse_count":227,"pivot_verse":"105–122","pivot_offset":0.0,"pivot_center_logic":"refrain_governed"},
{"surah_number":27,"surah_name_ar":"النَّمْل","surah_name_en":"Al-Naml","verse_count":93,"pivot_verse":"45–58","pivot_offset":0.0538,"pivot_center_logic":"compound_seam"},
{"surah_number":28,"surah_name_ar":"القَصَص","surah_name_en":"Al-Qaṣaṣ","verse_count":88,"pivot_verse":"44–46","pivot_offset":0.0114,"pivot_center_logic":"compound_seam"},
{"surah_number":29,"surah_name_ar":"العَنْكَبُوت","surah_name_en":"Al-ʿAnkabūt","verse_count":69,"pivot_verse":"36–44","pivot_offset":0.0797,"pivot_center_logic":"compound_seam"},
{"surah_number":30,"surah_name_ar":"الرُّوم","surah_name_en":"Al-Rūm","verse_count":60,"pivot_verse":"28–32","pivot_offset":0.0,"pivot_center_logic":"compound_seam"},
{"surah_number":31,"surah_name_ar":"لُقْمَان","surah_name_en":"Luqmān","verse_count":34,"pivot_verse":"16–19","pivot_offset":0.0147,"pivot_center_logic":"compound_seam"},
{"surah_number":32,"surah_name_ar":"السَّجْدَة","surah_name_en":"Al-Sajdah","verse_count":30,"pivot_verse":"15–17","pivot_offset":0.0333,"pivot_center_logic":"compound_seam"},
{"surah_number":33,"surah_name_ar":"الأحزاب","surah_name_en":"Al-Aḥzāb","verse_count":73,"pivot_verse":"35–40","pivot_offset":0.0137,"pivot_center_logic":"compound_seam"},
{"surah_number":34,"surah_name_ar":"سَبَأ","surah_name_en":"Sabaʾ","verse_count":54,"pivot_verse":"28–30","pivot_offset":0.037,"pivot_center_logic":"compound_seam"},
{"surah_number":35,"surah_name_ar":"فَاطِر","surah_name_en":"Fāṭir","verse_count":45,"pivot_verse":"19–22","pivot_offset":-0.0444,"pivot_center_logic":"compound_seam"},
{"surah_number":36,"surah_name_ar":"يس","surah_name_en":"Yā Sīn","verse_count":83,"pivot_verse":"45–47","pivot_offset":0.0542,"pivot_center_logic":"compound_seam"},
{"surah_number":37,"surah_name_ar":"الصَّافَّات","surah_name_en":"Al-Ṣāffāt","verse_count":182,"pivot_verse":"91–96","pivot_offset":0.0137,"pivot_center_logic":"compound_seam"},
{"surah_number":38,"surah_name_ar":"ص","surah_name_en":"Ṣād","verse_count":88,"pivot_verse":"41–44","pivot_offset":-0.017,"pivot_center_logic":"compound_seam"},
{"surah_number":39,"surah_name_ar":"الزُّمَر","surah_name_en":"Al-Zumar","verse_count":75,"pivot_verse":"38","pivot_offset":0.0067,"pivot_center_logic":"single_concentration"},
{"surah_number":40,"surah_name_ar":"غَافِر","surah_name_en":"Ghāfir","verse_count":85,"pivot_verse":"43","pivot_offset":0.0059,"pivot_center_logic":"single_concentration"},
{"surah_number":41,"surah_name_ar":"فُصِّلَت","surah_name_en":"Fuṣṣilat","verse_count":54,"pivot_verse":"26–29","pivot_offset":0.0093,"pivot_center_logic":"compound_seam"},
{"surah_number":42,"surah_name_ar":"الشُّورَى","surah_name_en":"Al-Shūrā","verse_count":53,"pivot_verse":"27–29","pivot_offset":0.0283,"pivot_center_logic":"compound_seam"},
{"surah_number":43,"surah_name_ar":"الزُّخْرُف","surah_name_en":"Al-Zukhruf","verse_count":89,"pivot_verse":"45","pivot_offset":0.0056,"pivot_center_logic":"single_concentration"},
{"surah_number":44,"surah_name_ar":"الدُّخَان","surah_name_en":"Al-Dukhān","verse_count":59,"pivot_verse":"30–31","pivot_offset":0.0169,"pivot_center_logic":"compound_seam"},
{"surah_number":45,"surah_name_ar":"الجاثية","surah_name_en":"Al-Jathiyah","verse_count":37,"pivot_verse":"18","pivot_offset":-0.0135,"pivot_center_logic":"single_concentration"},
{"surah_number":46,"surah_name_ar":"الأحقاف","surah_name_en":"Al-Ahqaf","verse_count":35,"pivot_verse":"17-19","pivot_offset":0.0143,"pivot_center_logic":"compound_seam"},
{"surah_number":47,"surah_name_ar":"مُحَمَّد","surah_name_en":"Muhammad","verse_count":38,"pivot_verse":"19","pivot_offset":0.0,"pivot_center_logic":"single_concentration"},
{"surah_number":48,"surah_name_ar":"الفَتْح","surah_name_en":"Al-Fath","verse_count":29,"pivot_verse":"14","pivot_offset":-0.0172,"pivot_center_logic":"single_concentration"},
{"surah_number":49,"surah_name_ar":"الحُجُرَات","surah_name_en":"Al-Hujurat","verse_count":18,"pivot_verse":"9-10","pivot_offset":0.0278,"pivot_center_logic":"compound_seam"},
{"surah_number":50,"surah_name_ar":"ق","surah_name_en":"Qaf","verse_count":45,"pivot_verse":"22-23","pivot_offset":0.0,"pivot_center_logic":"compound_seam"},
{"surah_number":51,"surah_name_ar":"الذَّارِيَات","surah_name_en":"Al-Dhariyat","verse_count":60,"pivot_verse":"30-31","pivot_offset":0.0083,"pivot_center_logic":"compound_seam"},
{"surah_number":52,"surah_name_ar":"الطُّور","surah_name_en":"Al-Tur","verse_count":49,"pivot_verse":"25-28","pivot_offset":0.0408,"pivot_center_logic":"compound_seam"},
{"surah_number":53,"surah_name_ar":"النَّجْم","surah_name_en":"Al-Najm","verse_count":62,"pivot_verse":"29-32","pivot_offset":-0.0081,"pivot_center_logic":"compound_seam"},
{"surah_number":54,"surah_name_ar":"الْقَمَر","surah_name_en":"Al-Qamar","verse_count":55,"pivot_verse":"23-32","pivot_offset":0.0,"pivot_center_logic":"compound_seam"},
{"surah_number":55,"surah_name_ar":"الرَّحْمَٰن","surah_name_en":"Al-Rahman","verse_count":78,"pivot_verse":"26-27","pivot_offset":-0.1603,"pivot_center_logic":"compound_seam"},
{"surah_number":56,"surah_name_ar":"الْوَاقِعَة","surah_name_en":"Al-Waqiah","verse_count":96,"pivot_verse":"57-74","pivot_offset":0.1823,"pivot_center_logic":"compound_seam"},
{"surah_number":57,"surah_name_ar":"الْحَدِيد","surah_name_en":"Al-Ḥadīd","verse_count":29,"pivot_verse":"16-18","pivot_offset":0.0862,"pivot_center_logic":"single_concentration"},
{"surah_number":58,"surah_name_ar":"الْمُجَادِلَة","surah_name_en":"Al-Mujādilah","verse_count":22,"pivot_verse":"8-10","pivot_offset":-0.0909,"pivot_center_logic":"compound_seam"},
{"surah_number":59,"surah_name_ar":"الْحَشْرِ","surah_name_en":"Al-Hashr","verse_count":24,"pivot_verse":"12-13","pivot_offset":0.0208,"pivot_center_logic":"compound_seam"},
{"surah_number":60,"surah_name_ar":"الْمُمْتَحَنَةِ","surah_name_en":"Al-Mumtahanah","verse_count":13,"pivot_verse":"7","pivot_offset":0.0385,"pivot_center_logic":"single_concentration"},
{"surah_number":61,"surah_name_ar":"الصَّفِّ","surah_name_en":"As-Saff","verse_count":14,"pivot_verse":"5–7","pivot_offset":-0.0714,"pivot_center_logic":"compound_seam"},
{"surah_number":62,"surah_name_ar":"الْجُمُعَةِ","surah_name_en":"Al-Jumuah","verse_count":11,"pivot_verse":"6","pivot_offset":0.0455,"pivot_center_logic":"single_concentration"},
{"surah_number":63,"surah_name_ar":"الْمُنَافِقُونَ","surah_name_en":"Al-Munafiqun","verse_count":11,"pivot_verse":"5-6","pivot_offset":0.0,"pivot_center_logic":"compound_seam"},
{"surah_number":64,"surah_name_ar":"التَّغَابُنِ","surah_name_en":"At-Taghabun","verse_count":18,"pivot_verse":"9-10","pivot_offset":0.0278,"pivot_center_logic":"compound_seam"},
{"surah_number":65,"surah_name_ar":"الطَّلَاقِ","surah_name_en":"At-Talaq","verse_count":12,"pivot_verse":"6-7","pivot_offset":0.0417,"pivot_center_logic":"compound_seam"},
{"surah_number":66,"surah_name_ar":"التَّحْرِيمِ","surah_name_en":"At-Tahrim","verse_count":12,"pivot_verse":"6-8","pivot_offset":0.0833,"pivot_center_logic":"distributed_convergence"},
{"surah_number":67,"surah_name_ar":"الْمُلْكِ","surah_name_en":"Al-Mulk","verse_count":30,"pivot_verse":"12-15","pivot_offset":-0.05,"pivot_center_logic":"distributed_convergence"},
{"surah_number":68,"surah_name_ar":"الْقَلَمِ","surah_name_en":"Al-Qalam","verse_count":52,"pivot_verse":"17-32","pivot_offset":-0.0288,"pivot_center_logic":"compound_seam"},
{"surah_number":69,"surah_name_ar":"الْحَاقَّةُ","surah_name_en":"Al-Haqqah","verse_count":52,"pivot_verse":"19-29","pivot_offset":-0.0385,"pivot_center_logic":"compound_seam"},
{"surah_number":70,"surah_name_ar":"الْمَعَارِجِ","surah_name_en":"Al-Ma'arij","verse_count":44,"pivot_verse":"22","pivot_offset":0.0,"pivot_center_logic":"single_concentration"},
{"surah_number":71,"surah_name_ar":"نُوح","surah_name_en":"Nuh","verse_count":28,"pivot_verse":"15-16","pivot_offset":0.0536,"pivot_center_logic":"compound_seam"},
{"surah_number":72,"surah_name_ar":"الْجِنِّ","surah_name_en":"Al-Jinn","verse_count":28,"pivot_verse":"13","pivot_offset":-0.0357,"pivot_center_logic":"single_concentration"},
{"surah_number":73,"surah_name_ar":"الْمُزَّمِّلِ","surah_name_en":"Al-Muzzammil","verse_count":20,"pivot_verse":"10-11","pivot_offset":0.025,"pivot_center_logic":"compound_seam"},
{"surah_number":74,"surah_name_ar":"الْمُدَّثِّرِ","surah_name_en":"Al-Muddaththir","verse_count":56,"pivot_verse":"27","pivot_offset":-0.0179,"pivot_center_logic":"single_concentration"},
{"surah_number":75,"surah_name_ar":"الْقِيَامَةِ","surah_name_en":"Al-Qiyamah","verse_count":40,"pivot_verse":"19-20","pivot_offset":-0.0125,"pivot_center_logic":"compound_seam"},
{"surah_number":76,"surah_name_ar":"الْإِنسَانِ","surah_name_en":"Al-Insan","verse_count":31,"pivot_verse":"22-23","pivot_offset":0.2258,"pivot_center_logic":"compound_seam"},
{"surah_number":77,"surah_name_ar":"الْمُرْسَلَاتِ","surah_name_en":"Al-Mursalat","verse_count":50,"pivot_verse":"26","pivot_offset":0.02,"pivot_center_logic":"refrain_governed"},
{"surah_number":78,"surah_name_ar":"النَّبَأِ","surah_name_en":"An-Naba","verse_count":40,"pivot_verse":"21","pivot_offset":0.025,"pivot_center_logic":"single_concentration"},
{"surah_number":79,"surah_name_ar":"النَّازِعَاتِ","surah_name_en":"An-Naziat","verse_count":46,"pivot_verse":"26-27","pivot_offset":0.0761,"pivot_center_logic":"compound_seam"},
{"surah_number":80,"surah_name_ar":"عَبَسَ","surah_name_en":"Abasa","verse_count":42,"pivot_verse":"23","pivot_offset":0.0476,"pivot_center_logic":"single_concentration"},
{"surah_number":81,"surah_name_ar":"التَّكوِير","surah_name_en":"At-Takwir","verse_count":29,"pivot_verse":"14–15","pivot_offset":0.0,"pivot_center_logic":"distributed_convergence"},
{"surah_number":82,"surah_name_ar":"الانفِطَار","surah_name_en":"Al-Infitar","verse_count":19,"pivot_verse":"9","pivot_offset":-0.0263,"pivot_center_logic":"multi_pivot"},
{"surah_number":83,"surah_name_ar":"الْمُطَفِّفِين","surah_name_en":"Al-Mutaffifin","verse_count":36,"pivot_verse":"17–18","pivot_offset":-0.0139,"pivot_center_logic":"distributed_convergence"},
{"surah_number":84,"surah_name_ar":"الِانشِقَاق","surah_name_en":"Al-Inshiqaq","verse_count":25,"pivot_verse":"13–15","pivot_offset":0.06,"pivot_center_logic":"compound_seam"},
{"surah_number":85,"surah_name_ar":"الْبُرُوج","surah_name_en":"Al-Buruj","verse_count":22,"pivot_verse":"10–11","pivot_offset":-0.0227,"pivot_center_logic":"distributed_convergence"},
{"surah_number":86,"surah_name_ar":"الطَّارِق","surah_name_en":"At-Tariq","verse_count":17,"pivot_verse":"9–10","pivot_offset":0.0588,"pivot_center_logic":"compound_seam"},
{"surah_number":87,"surah_name_ar":"الْأَعْلَى","surah_name_en":"Al-A'la","verse_count":19,"pivot_verse":"9–10","pivot_offset":0.0,"pivot_center_logic":"distributed_convergence"},
{"surah_number":88,"surah_name_ar":"الْغَاشِيَة","surah_name_en":"Al-Ghashiyah","verse_count":26,"pivot_verse":"17","pivot_offset":0.1538,"pivot_center_logic":"distributed_convergence"},
{"surah_number":89,"surah_name_ar":"الْفَجْر","surah_name_en":"Al-Fajr","verse_count":30,"pivot_verse":"17","pivot_offset":0.0667,"pivot_center_logic":"distributed_convergence"},
{"surah_number":90,"surah_name_ar":"الْبَلَد","surah_name_en":"Al-Balad","verse_count":20,"pivot_verse":"11–12","pivot_offset":0.075,"pivot_center_logic":"compound_seam"},
{"surah_number":91,"surah_name_ar":"الشَّمْس","surah_name_en":"Ash-Shams","verse_count":15,"pivot_verse":"9–10","pivot_offset":0.1333,"pivot_center_logic":"distributed_convergence"},
{"surah_number":92,"surah_name_ar":"اللَّيْل","surah_name_en":"Al-Layl","verse_count":21,"pivot_verse":"11","pivot_offset":0.0238,"pivot_center_logic":"single_concentration"},
{"surah_number":93,"surah_name_ar":"الضُّحَى","surah_name_en":"Ad-Duha","verse_count":11,"pivot_verse":"8–9","pivot_offset":0.2727,"pivot_center_logic":"distributed_convergence"},
{"surah_number":94,"surah_name_ar":"الشَّرْح","surah_name_en":"Al-Inshirah","verse_count":8,"pivot_verse":"5–6","pivot_offset":0.1875,"pivot_center_logic":"compound_seam"},
{"surah_number":95,"surah_name_ar":"التِّين","surah_name_en":"At-Tin","verse_count":8,"pivot_verse":"5","pivot_offset":0.125,"pivot_center_logic":"single_concentration"},
{"surah_number":96,"surah_name_ar":"العَلَق","surah_name_en":"Al-Alaq","verse_count":19,"pivot_verse":"9–10","pivot_offset":0.0,"pivot_center_logic":"compound_seam"},
{"surah_number":97,"surah_name_ar":"القَدْر","surah_name_en":"Al-Qadr","verse_count":5,"pivot_verse":"3","pivot_offset":0.1,"pivot_center_logic":"single_concentration"},
{"surah_number":98,"surah_name_ar":"البَيِّنَة","surah_name_en":"Al-Bayyinah","verse_count":8,"pivot_verse":"5","pivot_offset":0.125,"pivot_center_logic":"single_concentration"},
{"surah_number":99,"surah_name_ar":"الزَّلْزَلَة","surah_name_en":"Al-Zalzalah","verse_count":8,"pivot_verse":"4–5","pivot_offset":0.0625,"pivot_center_logic":"compound_seam"},
{"surah_number":100,"surah_name_ar":"العَادِيَات","surah_name_en":"Al-Adiyat","verse_count":11,"pivot_verse":"6","pivot_offset":0.0455,"pivot_center_logic":"single_concentration"},
{"surah_number":101,"surah_name_ar":"القَارِعَة","surah_name_en":"Al-Qariah","verse_count":11,"pivot_verse":"3–4","pivot_offset":-0.1818,"pivot_center_logic":"compound_seam"},
{"surah_number":102,"surah_name_ar":"التَّكَاثُر","surah_name_en":"Al-Takathur","verse_count":8,"pivot_verse":"5","pivot_offset":0.125,"pivot_center_logic":"single_concentration"},
{"surah_number":103,"surah_name_ar":"العَصْر","surah_name_en":"Al-Asr","verse_count":3,"pivot_verse":"2","pivot_offset":0.1667,"pivot_center_logic":"single_concentration"},
{"surah_number":104,"surah_name_ar":"الهُمَزَة","surah_name_en":"Al-Humazah","verse_count":9,"pivot_verse":"4–5","pivot_offset":0.0,"pivot_center_logic":"compound_seam"},
{"surah_number":105,"surah_name_ar":"الفِيل","surah_name_en":"Al-Fil","verse_count":5,"pivot_verse":"3","pivot_offset":0.1,"pivot_center_logic":"distributed_convergence"},
{"surah_number":106,"surah_name_ar":"قُرَيْش","surah_name_en":"Quraysh","verse_count":4,"pivot_verse":"3","pivot_offset":0.25,"pivot_center_logic":"distributed_convergence"},
{"surah_number":107,"surah_name_ar":"المَاعُون","surah_name_en":"Al-Ma'un","verse_count":7,"pivot_verse":"4","pivot_offset":0.0714,"pivot_center_logic":"single_concentration"},
{"surah_number":108,"surah_name_ar":"الكَوْثَر","surah_name_en":"Al-Kawthar","verse_count":3,"pivot_verse":"2","pivot_offset":0.1667,"pivot_center_logic":"single_concentration"},
{"surah_number":109,"surah_name_ar":"الكَافِرُون","surah_name_en":"Al-Kafirun","verse_count":6,"pivot_verse":"6","pivot_offset":0.5,"pivot_center_logic":"terminal"},
{"surah_number":110,"surah_name_ar":"النَّصْر","surah_name_en":"An-Nasr","verse_count":3,"pivot_verse":"3","pivot_offset":0.5,"pivot_center_logic":"terminal"},
{"surah_number":111,"surah_name_ar":"المَسَد","surah_name_en":"Al-Masad","verse_count":5,"pivot_verse":"3","pivot_offset":0.1,"pivot_center_logic":"single_concentration"},
{"surah_number":112,"surah_name_ar":"الإِخْلَاص","surah_name_en":"Al-Ikhlas","verse_count":4,"pivot_verse":"3","pivot_offset":0.25,"pivot_center_logic":"single_concentration"},
{"surah_number":113,"surah_name_ar":"الفَلَق","surah_name_en":"Al-Falaq","verse_count":5,"pivot_verse":"3","pivot_offset":0.1,"pivot_center_logic":"single_concentration"},
{"surah_number":114,"surah_name_ar":"النَّاس","surah_name_en":"An-Nas","verse_count":6,"pivot_verse":"4","pivot_offset":0.1667,"pivot_center_logic":"single_concentration"}
];

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 2: PIVOT VERSE TEXT
   Source: tanzil.net Uthmani Minimal (Arabic) + Sahih International (English)
   Generated programmatically — every verse in every pivot range, zero hand-curation.
   114 surahs · 528 pivot verses · validated against source text files.
   ═══════════════════════════════════════════════════════════════════ */
const PIVOT_VERSES = {
  1:[{v:5,ar:"إِيّاكَ نَعبُدُ وَإِيّاكَ نَستَعينُ",en:"It is You we worship and You we ask for help."}],
  2:[{v:142,ar:"سَيَقولُ السُّفَهاءُ مِنَ النّاسِ ما وَلّىٰهُم عَن قِبلَتِهِمُ الَّتى كانوا عَلَيها قُل لِلَّهِ المَشرِقُ وَالمَغرِبُ يَهدى مَن يَشاءُ إِلىٰ صِرٰطٍ مُستَقيمٍ",en:"The foolish among the people will say, \"What has turned them away from their qiblah, which they used to face?\" Say, \"To Allah belongs the east and the west. He guides whom He wills to a straight path.\""},{v:143,ar:"وَكَذٰلِكَ جَعَلنٰكُم أُمَّةً وَسَطًا لِتَكونوا شُهَداءَ عَلَى النّاسِ وَيَكونَ الرَّسولُ عَلَيكُم شَهيدًا وَما جَعَلنَا القِبلَةَ الَّتى كُنتَ عَلَيها إِلّا لِنَعلَمَ مَن يَتَّبِعُ الرَّسولَ مِمَّن يَنقَلِبُ عَلىٰ عَقِبَيهِ وَإِن كانَت لَكَبيرَةً إِلّا عَلَى الَّذينَ هَدَى اللَّهُ وَما كانَ اللَّهُ لِيُضيعَ إيمٰنَكُم إِنَّ اللَّهَ بِالنّاسِ لَرَءوفٌ رَحيمٌ",en:"And thus we have made you a just community that you will be witnesses over the people and the Messenger will be a witness over you. And We did not make the qiblah which you used to face except that We might make evident who would follow the Messenger from who would turn back on his heels. And indeed, it is difficult except for those whom Allah has guided. And never would Allah have caused you to lose your faith. Indeed Allah is, to the people, Kind and Merciful."},{v:144,ar:"قَد نَرىٰ تَقَلُّبَ وَجهِكَ فِى السَّماءِ فَلَنُوَلِّيَنَّكَ قِبلَةً تَرضىٰها فَوَلِّ وَجهَكَ شَطرَ المَسجِدِ الحَرامِ وَحَيثُ ما كُنتُم فَوَلّوا وُجوهَكُم شَطرَهُ وَإِنَّ الَّذينَ أوتُوا الكِتٰبَ لَيَعلَمونَ أَنَّهُ الحَقُّ مِن رَبِّهِم وَمَا اللَّهُ بِغٰفِلٍ عَمّا يَعمَلونَ",en:"We have certainly seen the turning of your face, [O Muhammad], toward the heaven, and We will surely turn you to a qiblah with which you will be pleased. So turn your face toward al-Masjid al-Haram. And wherever you [believers] are, turn your faces toward it [in prayer]. Indeed, those who have been given the Scripture well know that it is the truth from their Lord. And Allah is not unaware of what they do."},{v:145,ar:"وَلَئِن أَتَيتَ الَّذينَ أوتُوا الكِتٰبَ بِكُلِّ ءايَةٍ ما تَبِعوا قِبلَتَكَ وَما أَنتَ بِتابِعٍ قِبلَتَهُم وَما بَعضُهُم بِتابِعٍ قِبلَةَ بَعضٍ وَلَئِنِ اتَّبَعتَ أَهواءَهُم مِن بَعدِ ما جاءَكَ مِنَ العِلمِ إِنَّكَ إِذًا لَمِنَ الظّٰلِمينَ",en:"And if you brought to those who were given the Scripture every sign, they would not follow your qiblah. Nor will you be a follower of their qiblah. Nor would they be followers of one another's qiblah. So if you were to follow their desires after what has come to you of knowledge, indeed, you would then be among the wrongdoers."},{v:146,ar:"الَّذينَ ءاتَينٰهُمُ الكِتٰبَ يَعرِفونَهُ كَما يَعرِفونَ أَبناءَهُم وَإِنَّ فَريقًا مِنهُم لَيَكتُمونَ الحَقَّ وَهُم يَعلَمونَ",en:"Those to whom We gave the Scripture know him as they know their own sons. But indeed, a party of them conceal the truth while they know [it]."},{v:147,ar:"الحَقُّ مِن رَبِّكَ فَلا تَكونَنَّ مِنَ المُمتَرينَ",en:"The truth is from your Lord, so never be among the doubters."},{v:148,ar:"وَلِكُلٍّ وِجهَةٌ هُوَ مُوَلّيها فَاستَبِقُوا الخَيرٰتِ أَينَ ما تَكونوا يَأتِ بِكُمُ اللَّهُ جَميعًا إِنَّ اللَّهَ عَلىٰ كُلِّ شَىءٍ قَديرٌ",en:"For each [religious following] is a direction toward which it faces. So race to [all that is] good. Wherever you may be, Allah will bring you forth [for judgement] all together. Indeed, Allah is over all things competent."},{v:149,ar:"وَمِن حَيثُ خَرَجتَ فَوَلِّ وَجهَكَ شَطرَ المَسجِدِ الحَرامِ وَإِنَّهُ لَلحَقُّ مِن رَبِّكَ وَمَا اللَّهُ بِغٰفِلٍ عَمّا تَعمَلونَ",en:"So from wherever you go out [for prayer, O Muhammad] turn your face toward al- Masjid al-Haram, and indeed, it is the truth from your Lord. And Allah is not unaware of what you do."},{v:150,ar:"وَمِن حَيثُ خَرَجتَ فَوَلِّ وَجهَكَ شَطرَ المَسجِدِ الحَرامِ وَحَيثُ ما كُنتُم فَوَلّوا وُجوهَكُم شَطرَهُ لِئَلّا يَكونَ لِلنّاسِ عَلَيكُم حُجَّةٌ إِلَّا الَّذينَ ظَلَموا مِنهُم فَلا تَخشَوهُم وَاخشَونى وَلِأُتِمَّ نِعمَتى عَلَيكُم وَلَعَلَّكُم تَهتَدونَ",en:"And from wherever you go out [for prayer], turn your face toward al-Masjid al-Haram. And wherever you [believers] may be, turn your faces toward it in order that the people will not have any argument against you, except for those of them who commit wrong; so fear them not but fear Me. And [it is] so I may complete My favor upon you and that you may be guided."},{v:151,ar:"كَما أَرسَلنا فيكُم رَسولًا مِنكُم يَتلوا عَلَيكُم ءايٰتِنا وَيُزَكّيكُم وَيُعَلِّمُكُمُ الكِتٰبَ وَالحِكمَةَ وَيُعَلِّمُكُم ما لَم تَكونوا تَعلَمونَ",en:"Just as We have sent among you a messenger from yourselves reciting to you Our verses and purifying you and teaching you the Book and wisdom and teaching you that which you did not know."},{v:152,ar:"فَاذكُرونى أَذكُركُم وَاشكُروا لى وَلا تَكفُرونِ",en:"So remember Me; I will remember you. And be grateful to Me and do not deny Me."}],
  3:[{v:100,ar:"يٰأَيُّهَا الَّذينَ ءامَنوا إِن تُطيعوا فَريقًا مِنَ الَّذينَ أوتُوا الكِتٰبَ يَرُدّوكُم بَعدَ إيمٰنِكُم كٰفِرينَ",en:"O you who have believed, if you obey a party of those who were given the Scripture, they would turn you back, after your belief, [to being] unbelievers."},{v:101,ar:"وَكَيفَ تَكفُرونَ وَأَنتُم تُتلىٰ عَلَيكُم ءايٰتُ اللَّهِ وَفيكُم رَسولُهُ وَمَن يَعتَصِم بِاللَّهِ فَقَد هُدِىَ إِلىٰ صِرٰطٍ مُستَقيمٍ",en:"And how could you disbelieve while to you are being recited the verses of Allah and among you is His Messenger? And whoever holds firmly to Allah has [indeed] been guided to a straight path."},{v:102,ar:"يٰأَيُّهَا الَّذينَ ءامَنُوا اتَّقُوا اللَّهَ حَقَّ تُقاتِهِ وَلا تَموتُنَّ إِلّا وَأَنتُم مُسلِمونَ",en:"O you who have believed, fear Allah as He should be feared and do not die except as Muslims [in submission to Him]."},{v:103,ar:"وَاعتَصِموا بِحَبلِ اللَّهِ جَميعًا وَلا تَفَرَّقوا وَاذكُروا نِعمَتَ اللَّهِ عَلَيكُم إِذ كُنتُم أَعداءً فَأَلَّفَ بَينَ قُلوبِكُم فَأَصبَحتُم بِنِعمَتِهِ إِخوٰنًا وَكُنتُم عَلىٰ شَفا حُفرَةٍ مِنَ النّارِ فَأَنقَذَكُم مِنها كَذٰلِكَ يُبَيِّنُ اللَّهُ لَكُم ءايٰتِهِ لَعَلَّكُم تَهتَدونَ",en:"And hold firmly to the rope of Allah all together and do not become divided. And remember the favor of Allah upon you - when you were enemies and He brought your hearts together and you became, by His favor, brothers. And you were on the edge of a pit of the Fire, and He saved you from it. Thus does Allah make clear to you His verses that you may be guided."},{v:104,ar:"وَلتَكُن مِنكُم أُمَّةٌ يَدعونَ إِلَى الخَيرِ وَيَأمُرونَ بِالمَعروفِ وَيَنهَونَ عَنِ المُنكَرِ وَأُولٰئِكَ هُمُ المُفلِحونَ",en:"And let there be [arising] from you a nation inviting to [all that is] good, enjoining what is right and forbidding what is wrong, and those will be the successful."},{v:105,ar:"وَلا تَكونوا كَالَّذينَ تَفَرَّقوا وَاختَلَفوا مِن بَعدِ ما جاءَهُمُ البَيِّنٰتُ وَأُولٰئِكَ لَهُم عَذابٌ عَظيمٌ",en:"And do not be like the ones who became divided and differed after the clear proofs had come to them. And those will have a great punishment."},{v:106,ar:"يَومَ تَبيَضُّ وُجوهٌ وَتَسوَدُّ وُجوهٌ فَأَمَّا الَّذينَ اسوَدَّت وُجوهُهُم أَكَفَرتُم بَعدَ إيمٰنِكُم فَذوقُوا العَذابَ بِما كُنتُم تَكفُرونَ",en:"On the Day [some] faces will turn white and [some] faces will turn black. As for those whose faces turn black, [to them it will be said], \"Did you disbelieve after your belief? Then taste the punishment for what you used to reject.\""},{v:107,ar:"وَأَمَّا الَّذينَ ابيَضَّت وُجوهُهُم فَفى رَحمَةِ اللَّهِ هُم فيها خٰلِدونَ",en:"But as for those whose faces will turn white, [they will be] within the mercy of Allah. They will abide therein eternally."},{v:108,ar:"تِلكَ ءايٰتُ اللَّهِ نَتلوها عَلَيكَ بِالحَقِّ وَمَا اللَّهُ يُريدُ ظُلمًا لِلعٰلَمينَ",en:"These are the verses of Allah. We recite them to you, [O Muhammad], in truth; and Allah wants no injustice to the worlds."}],
  4:[{v:82,ar:"أَفَلا يَتَدَبَّرونَ القُرءانَ وَلَو كانَ مِن عِندِ غَيرِ اللَّهِ لَوَجَدوا فيهِ اختِلٰفًا كَثيرًا",en:"Then do they not reflect upon the Qur'an? If it had been from [any] other than Allah, they would have found within it much contradiction."},{v:83,ar:"وَإِذا جاءَهُم أَمرٌ مِنَ الأَمنِ أَوِ الخَوفِ أَذاعوا بِهِ وَلَو رَدّوهُ إِلَى الرَّسولِ وَإِلىٰ أُولِى الأَمرِ مِنهُم لَعَلِمَهُ الَّذينَ يَستَنبِطونَهُ مِنهُم وَلَولا فَضلُ اللَّهِ عَلَيكُم وَرَحمَتُهُ لَاتَّبَعتُمُ الشَّيطٰنَ إِلّا قَليلًا",en:"And when there comes to them information about [public] security or fear, they spread it around. But if they had referred it back to the Messenger or to those of authority among them, then the ones who [can] draw correct conclusions from it would have known about it. And if not for the favor of Allah upon you and His mercy, you would have followed Satan, except for a few."},{v:84,ar:"فَقٰتِل فى سَبيلِ اللَّهِ لا تُكَلَّفُ إِلّا نَفسَكَ وَحَرِّضِ المُؤمِنينَ عَسَى اللَّهُ أَن يَكُفَّ بَأسَ الَّذينَ كَفَروا وَاللَّهُ أَشَدُّ بَأسًا وَأَشَدُّ تَنكيلًا",en:"So fight, [O Muhammad], in the cause of Allah; you are not held responsible except for yourself. And encourage the believers [to join you] that perhaps Allah will restrain the [military] might of those who disbelieve. And Allah is greater in might and stronger in [exemplary] punishment."},{v:85,ar:"مَن يَشفَع شَفٰعَةً حَسَنَةً يَكُن لَهُ نَصيبٌ مِنها وَمَن يَشفَع شَفٰعَةً سَيِّئَةً يَكُن لَهُ كِفلٌ مِنها وَكانَ اللَّهُ عَلىٰ كُلِّ شَىءٍ مُقيتًا",en:"Whoever intercedes for a good cause will have a reward therefrom; and whoever intercedes for an evil cause will have a burden therefrom. And ever is Allah, over all things, a Keeper."},{v:86,ar:"وَإِذا حُيّيتُم بِتَحِيَّةٍ فَحَيّوا بِأَحسَنَ مِنها أَو رُدّوها إِنَّ اللَّهَ كانَ عَلىٰ كُلِّ شَىءٍ حَسيبًا",en:"And when you are greeted with a greeting, greet [in return] with one better than it or [at least] return it [in a like manner]. Indeed, Allah is ever, over all things, an Accountant."},{v:87,ar:"اللَّهُ لا إِلٰهَ إِلّا هُوَ لَيَجمَعَنَّكُم إِلىٰ يَومِ القِيٰمَةِ لا رَيبَ فيهِ وَمَن أَصدَقُ مِنَ اللَّهِ حَديثًا",en:"Allah - there is no deity except Him. He will surely assemble you for [account on] the Day of Resurrection, about which there is no doubt. And who is more truthful than Allah in statement."},{v:88,ar:"فَما لَكُم فِى المُنٰفِقينَ فِئَتَينِ وَاللَّهُ أَركَسَهُم بِما كَسَبوا أَتُريدونَ أَن تَهدوا مَن أَضَلَّ اللَّهُ وَمَن يُضلِلِ اللَّهُ فَلَن تَجِدَ لَهُ سَبيلًا",en:"What is [the matter] with you [that you are] two groups concerning the hypocrites, while Allah has made them fall back [into error and disbelief] for what they earned. Do you wish to guide those whom Allah has sent astray? And he whom Allah sends astray - never will you find for him a way [of guidance]."},{v:89,ar:"وَدّوا لَو تَكفُرونَ كَما كَفَروا فَتَكونونَ سَواءً فَلا تَتَّخِذوا مِنهُم أَولِياءَ حَتّىٰ يُهاجِروا فى سَبيلِ اللَّهِ فَإِن تَوَلَّوا فَخُذوهُم وَاقتُلوهُم حَيثُ وَجَدتُموهُم وَلا تَتَّخِذوا مِنهُم وَلِيًّا وَلا نَصيرًا",en:"They wish you would disbelieve as they disbelieved so you would be alike. So do not take from among them allies until they emigrate for the cause of Allah. But if they turn away, then seize them and kill them wherever you find them and take not from among them any ally or helper."},{v:90,ar:"إِلَّا الَّذينَ يَصِلونَ إِلىٰ قَومٍ بَينَكُم وَبَينَهُم ميثٰقٌ أَو جاءوكُم حَصِرَت صُدورُهُم أَن يُقٰتِلوكُم أَو يُقٰتِلوا قَومَهُم وَلَو شاءَ اللَّهُ لَسَلَّطَهُم عَلَيكُم فَلَقٰتَلوكُم فَإِنِ اعتَزَلوكُم فَلَم يُقٰتِلوكُم وَأَلقَوا إِلَيكُمُ السَّلَمَ فَما جَعَلَ اللَّهُ لَكُم عَلَيهِم سَبيلًا",en:"Except for those who take refuge with a people between yourselves and whom is a treaty or those who come to you, their hearts strained at [the prospect of] fighting you or fighting their own people. And if Allah had willed, He could have given them power over you, and they would have fought you. So if they remove themselves from you and do not fight you and offer you peace, then Allah has not made for you a cause [for fighting] against them."},{v:91,ar:"سَتَجِدونَ ءاخَرينَ يُريدونَ أَن يَأمَنوكُم وَيَأمَنوا قَومَهُم كُلَّ ما رُدّوا إِلَى الفِتنَةِ أُركِسوا فيها فَإِن لَم يَعتَزِلوكُم وَيُلقوا إِلَيكُمُ السَّلَمَ وَيَكُفّوا أَيدِيَهُم فَخُذوهُم وَاقتُلوهُم حَيثُ ثَقِفتُموهُم وَأُولٰئِكُم جَعَلنا لَكُم عَلَيهِم سُلطٰنًا مُبينًا",en:"You will find others who wish to obtain security from you and [to] obtain security from their people. Every time they are returned to [the influence of] disbelief, they fall back into it. So if they do not withdraw from you or offer you peace or restrain their hands, then seize them and kill them wherever you overtake them. And those - We have made for you against them a clear authorization."},{v:92,ar:"وَما كانَ لِمُؤمِنٍ أَن يَقتُلَ مُؤمِنًا إِلّا خَطَـًٔا وَمَن قَتَلَ مُؤمِنًا خَطَـًٔا فَتَحريرُ رَقَبَةٍ مُؤمِنَةٍ وَدِيَةٌ مُسَلَّمَةٌ إِلىٰ أَهلِهِ إِلّا أَن يَصَّدَّقوا فَإِن كانَ مِن قَومٍ عَدُوٍّ لَكُم وَهُوَ مُؤمِنٌ فَتَحريرُ رَقَبَةٍ مُؤمِنَةٍ وَإِن كانَ مِن قَومٍ بَينَكُم وَبَينَهُم ميثٰقٌ فَدِيَةٌ مُسَلَّمَةٌ إِلىٰ أَهلِهِ وَتَحريرُ رَقَبَةٍ مُؤمِنَةٍ فَمَن لَم يَجِد فَصِيامُ شَهرَينِ مُتَتابِعَينِ تَوبَةً مِنَ اللَّهِ وَكانَ اللَّهُ عَليمًا حَكيمًا",en:"And never is it for a believer to kill a believer except by mistake. And whoever kills a believer by mistake - then the freeing of a believing slave and a compensation payment presented to the deceased's family [is required] unless they give [up their right as] charity. But if the deceased was from a people at war with you and he was a believer - then [only] the freeing of a believing slave; and if he was from a people with whom you have a treaty - then a compensation payment presented to his family and the freeing of a believing slave. And whoever does not find [one or cannot afford to buy one] - then [instead], a fast for two months consecutively, [seeking] acceptance of repentance from Allah. And Allah is ever Knowing and Wise."},{v:93,ar:"وَمَن يَقتُل مُؤمِنًا مُتَعَمِّدًا فَجَزاؤُهُ جَهَنَّمُ خٰلِدًا فيها وَغَضِبَ اللَّهُ عَلَيهِ وَلَعَنَهُ وَأَعَدَّ لَهُ عَذابًا عَظيمًا",en:"But whoever kills a believer intentionally - his recompense is Hell, wherein he will abide eternally, and Allah has become angry with him and has cursed him and has prepared for him a great punishment."},{v:94,ar:"يٰأَيُّهَا الَّذينَ ءامَنوا إِذا ضَرَبتُم فى سَبيلِ اللَّهِ فَتَبَيَّنوا وَلا تَقولوا لِمَن أَلقىٰ إِلَيكُمُ السَّلٰمَ لَستَ مُؤمِنًا تَبتَغونَ عَرَضَ الحَيوٰةِ الدُّنيا فَعِندَ اللَّهِ مَغانِمُ كَثيرَةٌ كَذٰلِكَ كُنتُم مِن قَبلُ فَمَنَّ اللَّهُ عَلَيكُم فَتَبَيَّنوا إِنَّ اللَّهَ كانَ بِما تَعمَلونَ خَبيرًا",en:"O you who have believed, when you go forth [to fight] in the cause of Allah, investigate; and do not say to one who gives you [a greeting of] peace \"You are not a believer,\" aspiring for the goods of worldly life; for with Allah are many acquisitions. You [yourselves] were like that before; then Allah conferred His favor upon you, so investigate. Indeed Allah is ever, with what you do, Acquainted."},{v:95,ar:"لا يَستَوِى القٰعِدونَ مِنَ المُؤمِنينَ غَيرُ أُولِى الضَّرَرِ وَالمُجٰهِدونَ فى سَبيلِ اللَّهِ بِأَموٰلِهِم وَأَنفُسِهِم فَضَّلَ اللَّهُ المُجٰهِدينَ بِأَموٰلِهِم وَأَنفُسِهِم عَلَى القٰعِدينَ دَرَجَةً وَكُلًّا وَعَدَ اللَّهُ الحُسنىٰ وَفَضَّلَ اللَّهُ المُجٰهِدينَ عَلَى القٰعِدينَ أَجرًا عَظيمًا",en:"Not equal are those believers remaining [at home] - other than the disabled - and the mujahideen, [who strive and fight] in the cause of Allah with their wealth and their lives. Allah has preferred the mujahideen through their wealth and their lives over those who remain [behind], by degrees. And to both Allah has promised the best [reward]. But Allah has preferred the mujahideen over those who remain [behind] with a great reward -"}],
  5:[{v:51,ar:"يٰأَيُّهَا الَّذينَ ءامَنوا لا تَتَّخِذُوا اليَهودَ وَالنَّصٰرىٰ أَولِياءَ بَعضُهُم أَولِياءُ بَعضٍ وَمَن يَتَوَلَّهُم مِنكُم فَإِنَّهُ مِنهُم إِنَّ اللَّهَ لا يَهدِى القَومَ الظّٰلِمينَ",en:"O you who have believed, do not take the Jews and the Christians as allies. They are [in fact] allies of one another. And whoever is an ally to them among you - then indeed, he is [one] of them. Indeed, Allah guides not the wrongdoing people."},{v:52,ar:"فَتَرَى الَّذينَ فى قُلوبِهِم مَرَضٌ يُسٰرِعونَ فيهِم يَقولونَ نَخشىٰ أَن تُصيبَنا دائِرَةٌ فَعَسَى اللَّهُ أَن يَأتِىَ بِالفَتحِ أَو أَمرٍ مِن عِندِهِ فَيُصبِحوا عَلىٰ ما أَسَرّوا فى أَنفُسِهِم نٰدِمينَ",en:"So you see those in whose hearts is disease hastening into [association with] them, saying, \"We are afraid a misfortune may strike us.\" But perhaps Allah will bring conquest or a decision from Him, and they will become, over what they have been concealing within themselves, regretful."},{v:53,ar:"وَيَقولُ الَّذينَ ءامَنوا أَهٰؤُلاءِ الَّذينَ أَقسَموا بِاللَّهِ جَهدَ أَيمٰنِهِم إِنَّهُم لَمَعَكُم حَبِطَت أَعمٰلُهُم فَأَصبَحوا خٰسِرينَ",en:"And those who believe will say, \"Are these the ones who swore by Allah their strongest oaths that indeed they were with you?\" Their deeds have become worthless, and they have become losers."},{v:54,ar:"يٰأَيُّهَا الَّذينَ ءامَنوا مَن يَرتَدَّ مِنكُم عَن دينِهِ فَسَوفَ يَأتِى اللَّهُ بِقَومٍ يُحِبُّهُم وَيُحِبّونَهُ أَذِلَّةٍ عَلَى المُؤمِنينَ أَعِزَّةٍ عَلَى الكٰفِرينَ يُجٰهِدونَ فى سَبيلِ اللَّهِ وَلا يَخافونَ لَومَةَ لائِمٍ ذٰلِكَ فَضلُ اللَّهِ يُؤتيهِ مَن يَشاءُ وَاللَّهُ وٰسِعٌ عَليمٌ",en:"O you who have believed, whoever of you should revert from his religion - Allah will bring forth [in place of them] a people He will love and who will love Him [who are] humble toward the believers, powerful against the disbelievers; they strive in the cause of Allah and do not fear the blame of a critic. That is the favor of Allah; He bestows it upon whom He wills. And Allah is all-Encompassing and Knowing."},{v:55,ar:"إِنَّما وَلِيُّكُمُ اللَّهُ وَرَسولُهُ وَالَّذينَ ءامَنُوا الَّذينَ يُقيمونَ الصَّلوٰةَ وَيُؤتونَ الزَّكوٰةَ وَهُم رٰكِعونَ",en:"Your ally is none but Allah and [therefore] His Messenger and those who have believed - those who establish prayer and give zakah, and they bow [in worship]."},{v:56,ar:"وَمَن يَتَوَلَّ اللَّهَ وَرَسولَهُ وَالَّذينَ ءامَنوا فَإِنَّ حِزبَ اللَّهِ هُمُ الغٰلِبونَ",en:"And whoever is an ally of Allah and His Messenger and those who have believed - indeed, the party of Allah - they will be the predominant."},{v:57,ar:"يٰأَيُّهَا الَّذينَ ءامَنوا لا تَتَّخِذُوا الَّذينَ اتَّخَذوا دينَكُم هُزُوًا وَلَعِبًا مِنَ الَّذينَ أوتُوا الكِتٰبَ مِن قَبلِكُم وَالكُفّارَ أَولِياءَ وَاتَّقُوا اللَّهَ إِن كُنتُم مُؤمِنينَ",en:"O you who have believed, take not those who have taken your religion in ridicule and amusement among the ones who were given the Scripture before you nor the disbelievers as allies. And fear Allah, if you should [truly] be believers."},{v:58,ar:"وَإِذا نادَيتُم إِلَى الصَّلوٰةِ اتَّخَذوها هُزُوًا وَلَعِبًا ذٰلِكَ بِأَنَّهُم قَومٌ لا يَعقِلونَ",en:"And when you call to prayer, they take it in ridicule and amusement. That is because they are a people who do not use reason."},{v:59,ar:"قُل يٰأَهلَ الكِتٰبِ هَل تَنقِمونَ مِنّا إِلّا أَن ءامَنّا بِاللَّهِ وَما أُنزِلَ إِلَينا وَما أُنزِلَ مِن قَبلُ وَأَنَّ أَكثَرَكُم فٰسِقونَ",en:"Say, \"O People of the Scripture, do you resent us except [for the fact] that we have believed in Allah and what was revealed to us and what was revealed before and because most of you are defiantly disobedient?\""},{v:60,ar:"قُل هَل أُنَبِّئُكُم بِشَرٍّ مِن ذٰلِكَ مَثوبَةً عِندَ اللَّهِ مَن لَعَنَهُ اللَّهُ وَغَضِبَ عَلَيهِ وَجَعَلَ مِنهُمُ القِرَدَةَ وَالخَنازيرَ وَعَبَدَ الطّٰغوتَ أُولٰئِكَ شَرٌّ مَكانًا وَأَضَلُّ عَن سَواءِ السَّبيلِ",en:"Say, \"Shall I inform you of [what is] worse than that as penalty from Allah? [It is that of] those whom Allah has cursed and with whom He became angry and made of them apes and pigs and slaves of Taghut. Those are worse in position and further astray from the sound way.\""},{v:61,ar:"وَإِذا جاءوكُم قالوا ءامَنّا وَقَد دَخَلوا بِالكُفرِ وَهُم قَد خَرَجوا بِهِ وَاللَّهُ أَعلَمُ بِما كانوا يَكتُمونَ",en:"And when they come to you, they say, \"We believe.\" But they have entered with disbelief [in their hearts], and they have certainly left with it. And Allah is most knowing of what they were concealing."},{v:62,ar:"وَتَرىٰ كَثيرًا مِنهُم يُسٰرِعونَ فِى الإِثمِ وَالعُدوٰنِ وَأَكلِهِمُ السُّحتَ لَبِئسَ ما كانوا يَعمَلونَ",en:"And you see many of them hastening into sin and aggression and the devouring of [what is] unlawful. How wretched is what they have been doing."},{v:63,ar:"لَولا يَنهىٰهُمُ الرَّبّٰنِيّونَ وَالأَحبارُ عَن قَولِهِمُ الإِثمَ وَأَكلِهِمُ السُّحتَ لَبِئسَ ما كانوا يَصنَعونَ",en:"Why do the rabbis and religious scholars not forbid them from saying what is sinful and devouring what is unlawful? How wretched is what they have been practicing."},{v:64,ar:"وَقالَتِ اليَهودُ يَدُ اللَّهِ مَغلولَةٌ غُلَّت أَيديهِم وَلُعِنوا بِما قالوا بَل يَداهُ مَبسوطَتانِ يُنفِقُ كَيفَ يَشاءُ وَلَيَزيدَنَّ كَثيرًا مِنهُم ما أُنزِلَ إِلَيكَ مِن رَبِّكَ طُغيٰنًا وَكُفرًا وَأَلقَينا بَينَهُمُ العَدٰوَةَ وَالبَغضاءَ إِلىٰ يَومِ القِيٰمَةِ كُلَّما أَوقَدوا نارًا لِلحَربِ أَطفَأَهَا اللَّهُ وَيَسعَونَ فِى الأَرضِ فَسادًا وَاللَّهُ لا يُحِبُّ المُفسِدينَ",en:"And the Jews say, \"The hand of Allah is chained.\" Chained are their hands, and cursed are they for what they say. Rather, both His hands are extended; He spends however He wills. And that which has been revealed to you from your Lord will surely increase many of them in transgression and disbelief. And We have cast among them animosity and hatred until the Day of Resurrection. Every time they kindled the fire of war [against you], Allah extinguished it. And they strive throughout the land [causing] corruption, and Allah does not like corrupters."},{v:65,ar:"وَلَو أَنَّ أَهلَ الكِتٰبِ ءامَنوا وَاتَّقَوا لَكَفَّرنا عَنهُم سَيِّـٔاتِهِم وَلَأَدخَلنٰهُم جَنّٰتِ النَّعيمِ",en:"And if only the People of the Scripture had believed and feared Allah, We would have removed from them their misdeeds and admitted them to Gardens of Pleasure."},{v:66,ar:"وَلَو أَنَّهُم أَقامُوا التَّورىٰةَ وَالإِنجيلَ وَما أُنزِلَ إِلَيهِم مِن رَبِّهِم لَأَكَلوا مِن فَوقِهِم وَمِن تَحتِ أَرجُلِهِم مِنهُم أُمَّةٌ مُقتَصِدَةٌ وَكَثيرٌ مِنهُم ساءَ ما يَعمَلونَ",en:"And if only they upheld [the law of] the Torah, the Gospel, and what has been revealed to them from their Lord, they would have consumed [provision] from above them and from beneath their feet. Among them are a moderate community, but many of them - evil is that which they do."},{v:67,ar:"يٰأَيُّهَا الرَّسولُ بَلِّغ ما أُنزِلَ إِلَيكَ مِن رَبِّكَ وَإِن لَم تَفعَل فَما بَلَّغتَ رِسالَتَهُ وَاللَّهُ يَعصِمُكَ مِنَ النّاسِ إِنَّ اللَّهَ لا يَهدِى القَومَ الكٰفِرينَ",en:"O Messenger, announce that which has been revealed to you from your Lord, and if you do not, then you have not conveyed His message. And Allah will protect you from the people. Indeed, Allah does not guide the disbelieving people."},{v:68,ar:"قُل يٰأَهلَ الكِتٰبِ لَستُم عَلىٰ شَىءٍ حَتّىٰ تُقيمُوا التَّورىٰةَ وَالإِنجيلَ وَما أُنزِلَ إِلَيكُم مِن رَبِّكُم وَلَيَزيدَنَّ كَثيرًا مِنهُم ما أُنزِلَ إِلَيكَ مِن رَبِّكَ طُغيٰنًا وَكُفرًا فَلا تَأسَ عَلَى القَومِ الكٰفِرينَ",en:"Say, \"O People of the Scripture, you are [standing] on nothing until you uphold [the law of] the Torah, the Gospel, and what has been revealed to you from your Lord.\" And that which has been revealed to you from your Lord will surely increase many of them in transgression and disbelief. So do not grieve over the disbelieving people."},{v:69,ar:"إِنَّ الَّذينَ ءامَنوا وَالَّذينَ هادوا وَالصّٰبِـٔونَ وَالنَّصٰرىٰ مَن ءامَنَ بِاللَّهِ وَاليَومِ الـٔاخِرِ وَعَمِلَ صٰلِحًا فَلا خَوفٌ عَلَيهِم وَلا هُم يَحزَنونَ",en:"Indeed, those who have believed [in Prophet Muhammad] and those [before Him] who were Jews or Sabeans or Christians - those [among them] who believed in Allah and the Last Day and did righteousness - no fear will there be concerning them, nor will they grieve."}],
  6:[{v:74,ar:"وَإِذ قالَ إِبرٰهيمُ لِأَبيهِ ءازَرَ أَتَتَّخِذُ أَصنامًا ءالِهَةً إِنّى أَرىٰكَ وَقَومَكَ فى ضَلٰلٍ مُبينٍ",en:"And [mention, O Muhammad], when Abraham said to his father Azar, \"Do you take idols as deities? Indeed, I see you and your people to be in manifest error.\""},{v:75,ar:"وَكَذٰلِكَ نُرى إِبرٰهيمَ مَلَكوتَ السَّمٰوٰتِ وَالأَرضِ وَلِيَكونَ مِنَ الموقِنينَ",en:"And thus did We show Abraham the realm of the heavens and the earth that he would be among the certain [in faith]"},{v:76,ar:"فَلَمّا جَنَّ عَلَيهِ الَّيلُ رَءا كَوكَبًا قالَ هٰذا رَبّى فَلَمّا أَفَلَ قالَ لا أُحِبُّ الـٔافِلينَ",en:"So when the night covered him [with darkness], he saw a star. He said, \"This is my lord.\" But when it set, he said, \"I like not those that disappear.\""},{v:77,ar:"فَلَمّا رَءَا القَمَرَ بازِغًا قالَ هٰذا رَبّى فَلَمّا أَفَلَ قالَ لَئِن لَم يَهدِنى رَبّى لَأَكونَنَّ مِنَ القَومِ الضّالّينَ",en:"And when he saw the moon rising, he said, \"This is my lord.\" But when it set, he said, \"Unless my Lord guides me, I will surely be among the people gone astray.\""},{v:78,ar:"فَلَمّا رَءَا الشَّمسَ بازِغَةً قالَ هٰذا رَبّى هٰذا أَكبَرُ فَلَمّا أَفَلَت قالَ يٰقَومِ إِنّى بَرىءٌ مِمّا تُشرِكونَ",en:"And when he saw the sun rising, he said, \"This is my lord; this is greater.\" But when it set, he said, \"O my people, indeed I am free from what you associate with Allah."},{v:79,ar:"إِنّى وَجَّهتُ وَجهِىَ لِلَّذى فَطَرَ السَّمٰوٰتِ وَالأَرضَ حَنيفًا وَما أَنا۠ مِنَ المُشرِكينَ",en:"Indeed, I have turned my face toward He who created the heavens and the earth, inclining toward truth, and I am not of those who associate others with Allah.\""},{v:80,ar:"وَحاجَّهُ قَومُهُ قالَ أَتُحٰجّونّى فِى اللَّهِ وَقَد هَدىٰنِ وَلا أَخافُ ما تُشرِكونَ بِهِ إِلّا أَن يَشاءَ رَبّى شَيـًٔا وَسِعَ رَبّى كُلَّ شَىءٍ عِلمًا أَفَلا تَتَذَكَّرونَ",en:"And his people argued with him. He said, \"Do you argue with me concerning Allah while He has guided me? And I fear not what you associate with Him [and will not be harmed] unless my Lord should will something. My Lord encompasses all things in knowledge; then will you not remember?"},{v:81,ar:"وَكَيفَ أَخافُ ما أَشرَكتُم وَلا تَخافونَ أَنَّكُم أَشرَكتُم بِاللَّهِ ما لَم يُنَزِّل بِهِ عَلَيكُم سُلطٰنًا فَأَىُّ الفَريقَينِ أَحَقُّ بِالأَمنِ إِن كُنتُم تَعلَمونَ",en:"And how should I fear what you associate while you do not fear that you have associated with Allah that for which He has not sent down to you any authority? So which of the two parties has more right to security, if you should know?"},{v:82,ar:"الَّذينَ ءامَنوا وَلَم يَلبِسوا إيمٰنَهُم بِظُلمٍ أُولٰئِكَ لَهُمُ الأَمنُ وَهُم مُهتَدونَ",en:"They who believe and do not mix their belief with injustice - those will have security, and they are [rightly] guided."},{v:83,ar:"وَتِلكَ حُجَّتُنا ءاتَينٰها إِبرٰهيمَ عَلىٰ قَومِهِ نَرفَعُ دَرَجٰتٍ مَن نَشاءُ إِنَّ رَبَّكَ حَكيمٌ عَليمٌ",en:"And that was Our [conclusive] argument which We gave Abraham against his people. We raise by degrees whom We will. Indeed, your Lord is Wise and Knowing."},{v:84,ar:"وَوَهَبنا لَهُ إِسحٰقَ وَيَعقوبَ كُلًّا هَدَينا وَنوحًا هَدَينا مِن قَبلُ وَمِن ذُرِّيَّتِهِ داوۥدَ وَسُلَيمٰنَ وَأَيّوبَ وَيوسُفَ وَموسىٰ وَهٰرونَ وَكَذٰلِكَ نَجزِى المُحسِنينَ",en:"And We gave to Abraham, Isaac and Jacob - all [of them] We guided. And Noah, We guided before; and among his descendants, David and Solomon and Job and Joseph and Moses and Aaron. Thus do We reward the doers of good."},{v:85,ar:"وَزَكَرِيّا وَيَحيىٰ وَعيسىٰ وَإِلياسَ كُلٌّ مِنَ الصّٰلِحينَ",en:"And Zechariah and John and Jesus and Elias - and all were of the righteous."},{v:86,ar:"وَإِسمٰعيلَ وَاليَسَعَ وَيونُسَ وَلوطًا وَكُلًّا فَضَّلنا عَلَى العٰلَمينَ",en:"And Ishmael and Elisha and Jonah and Lot - and all [of them] We preferred over the worlds."},{v:87,ar:"وَمِن ءابائِهِم وَذُرِّيّٰتِهِم وَإِخوٰنِهِم وَاجتَبَينٰهُم وَهَدَينٰهُم إِلىٰ صِرٰطٍ مُستَقيمٍ",en:"And [some] among their fathers and their descendants and their brothers - and We chose them and We guided them to a straight path."},{v:88,ar:"ذٰلِكَ هُدَى اللَّهِ يَهدى بِهِ مَن يَشاءُ مِن عِبادِهِ وَلَو أَشرَكوا لَحَبِطَ عَنهُم ما كانوا يَعمَلونَ",en:"That is the guidance of Allah by which He guides whomever He wills of His servants. But if they had associated others with Allah, then worthless for them would be whatever they were doing."},{v:89,ar:"أُولٰئِكَ الَّذينَ ءاتَينٰهُمُ الكِتٰبَ وَالحُكمَ وَالنُّبُوَّةَ فَإِن يَكفُر بِها هٰؤُلاءِ فَقَد وَكَّلنا بِها قَومًا لَيسوا بِها بِكٰفِرينَ",en:"Those are the ones to whom We gave the Scripture and authority and prophethood. But if the disbelievers deny it, then We have entrusted it to a people who are not therein disbelievers."},{v:90,ar:"أُولٰئِكَ الَّذينَ هَدَى اللَّهُ فَبِهُدىٰهُمُ اقتَدِه قُل لا أَسـَٔلُكُم عَلَيهِ أَجرًا إِن هُوَ إِلّا ذِكرىٰ لِلعٰلَمينَ",en:"Those are the ones whom Allah has guided, so from their guidance take an example. Say, \"I ask of you for this message no payment. It is not but a reminder for the worlds.\""}],
  7:[{v:94,ar:"وَما أَرسَلنا فى قَريَةٍ مِن نَبِىٍّ إِلّا أَخَذنا أَهلَها بِالبَأساءِ وَالضَّرّاءِ لَعَلَّهُم يَضَّرَّعونَ",en:"And We sent to no city a prophet [who was denied] except that We seized its people with poverty and hardship that they might humble themselves [to Allah]."},{v:95,ar:"ثُمَّ بَدَّلنا مَكانَ السَّيِّئَةِ الحَسَنَةَ حَتّىٰ عَفَوا وَقالوا قَد مَسَّ ءاباءَنَا الضَّرّاءُ وَالسَّرّاءُ فَأَخَذنٰهُم بَغتَةً وَهُم لا يَشعُرونَ",en:"Then We exchanged in place of the bad [condition], good, until they increased [and prospered] and said, \"Our fathers [also] were touched with hardship and ease.\" So We seized them suddenly while they did not perceive."},{v:96,ar:"وَلَو أَنَّ أَهلَ القُرىٰ ءامَنوا وَاتَّقَوا لَفَتَحنا عَلَيهِم بَرَكٰتٍ مِنَ السَّماءِ وَالأَرضِ وَلٰكِن كَذَّبوا فَأَخَذنٰهُم بِما كانوا يَكسِبونَ",en:"And if only the people of the cities had believed and feared Allah, We would have opened upon them blessings from the heaven and the earth; but they denied [the messengers], so We seized them for what they were earning.\""},{v:97,ar:"أَفَأَمِنَ أَهلُ القُرىٰ أَن يَأتِيَهُم بَأسُنا بَيٰتًا وَهُم نائِمونَ",en:"Then, did the people of the cities feel secure from Our punishment coming to them at night while they were asleep?"},{v:98,ar:"أَوَأَمِنَ أَهلُ القُرىٰ أَن يَأتِيَهُم بَأسُنا ضُحًى وَهُم يَلعَبونَ",en:"Or did the people of the cities feel secure from Our punishment coming to them in the morning while they were at play?"},{v:99,ar:"أَفَأَمِنوا مَكرَ اللَّهِ فَلا يَأمَنُ مَكرَ اللَّهِ إِلَّا القَومُ الخٰسِرونَ",en:"Then did they feel secure from the plan of Allah? But no one feels secure from the plan of Allah except the losing people."},{v:100,ar:"أَوَلَم يَهدِ لِلَّذينَ يَرِثونَ الأَرضَ مِن بَعدِ أَهلِها أَن لَو نَشاءُ أَصَبنٰهُم بِذُنوبِهِم وَنَطبَعُ عَلىٰ قُلوبِهِم فَهُم لا يَسمَعونَ",en:"Has it not become clear to those who inherited the earth after its [previous] people that if We willed, We could afflict them for their sins? But We seal over their hearts so they do not hear."},{v:101,ar:"تِلكَ القُرىٰ نَقُصُّ عَلَيكَ مِن أَنبائِها وَلَقَد جاءَتهُم رُسُلُهُم بِالبَيِّنٰتِ فَما كانوا لِيُؤمِنوا بِما كَذَّبوا مِن قَبلُ كَذٰلِكَ يَطبَعُ اللَّهُ عَلىٰ قُلوبِ الكٰفِرينَ",en:"Those cities - We relate to you, [O Muhammad], some of their news. And certainly did their messengers come to them with clear proofs, but they were not to believe in that which they had denied before. Thus does Allah seal over the hearts of the disbelievers."},{v:102,ar:"وَما وَجَدنا لِأَكثَرِهِم مِن عَهدٍ وَإِن وَجَدنا أَكثَرَهُم لَفٰسِقينَ",en:"And We did not find for most of them any covenant; but indeed, We found most of them defiantly disobedient."}],
  8:[{v:41,ar:"وَاعلَموا أَنَّما غَنِمتُم مِن شَىءٍ فَأَنَّ لِلَّهِ خُمُسَهُ وَلِلرَّسولِ وَلِذِى القُربىٰ وَاليَتٰمىٰ وَالمَسٰكينِ وَابنِ السَّبيلِ إِن كُنتُم ءامَنتُم بِاللَّهِ وَما أَنزَلنا عَلىٰ عَبدِنا يَومَ الفُرقانِ يَومَ التَقَى الجَمعانِ وَاللَّهُ عَلىٰ كُلِّ شَىءٍ قَديرٌ",en:"And know that anything you obtain of war booty - then indeed, for Allah is one fifth of it and for the Messenger and for [his] near relatives and the orphans, the needy, and the [stranded] traveler, if you have believed in Allah and in that which We sent down to Our Servant on the day of criterion - the day when the two armies met. And Allah, over all things, is competent."},{v:42,ar:"إِذ أَنتُم بِالعُدوَةِ الدُّنيا وَهُم بِالعُدوَةِ القُصوىٰ وَالرَّكبُ أَسفَلَ مِنكُم وَلَو تَواعَدتُم لَاختَلَفتُم فِى الميعٰدِ وَلٰكِن لِيَقضِىَ اللَّهُ أَمرًا كانَ مَفعولًا لِيَهلِكَ مَن هَلَكَ عَن بَيِّنَةٍ وَيَحيىٰ مَن حَىَّ عَن بَيِّنَةٍ وَإِنَّ اللَّهَ لَسَميعٌ عَليمٌ",en:"[Remember] when you were on the near side of the valley, and they were on the farther side, and the caravan was lower [in position] than you. If you had made an appointment [to meet], you would have missed the appointment. But [it was] so that Allah might accomplish a matter already destined - that those who perished [through disbelief] would perish upon evidence and those who lived [in faith] would live upon evidence; and indeed, Allah is Hearing and Knowing."},{v:43,ar:"إِذ يُريكَهُمُ اللَّهُ فى مَنامِكَ قَليلًا وَلَو أَرىٰكَهُم كَثيرًا لَفَشِلتُم وَلَتَنٰزَعتُم فِى الأَمرِ وَلٰكِنَّ اللَّهَ سَلَّمَ إِنَّهُ عَليمٌ بِذاتِ الصُّدورِ",en:"[Remember, O Muhammad], when Allah showed them to you in your dream as few; and if He had shown them to you as many, you [believers] would have lost courage and would have disputed in the matter [of whether to fight], but Allah saved [you from that]. Indeed, He is Knowing of that within the breasts."},{v:44,ar:"وَإِذ يُريكُموهُم إِذِ التَقَيتُم فى أَعيُنِكُم قَليلًا وَيُقَلِّلُكُم فى أَعيُنِهِم لِيَقضِىَ اللَّهُ أَمرًا كانَ مَفعولًا وَإِلَى اللَّهِ تُرجَعُ الأُمورُ",en:"And [remember] when He showed them to you, when you met, as few in your eyes, and He made you [appear] as few in their eyes so that Allah might accomplish a matter already destined. And to Allah are [all] matters returned."}],
  9:[{v:73,ar:"يٰأَيُّهَا النَّبِىُّ جٰهِدِ الكُفّارَ وَالمُنٰفِقينَ وَاغلُظ عَلَيهِم وَمَأوىٰهُم جَهَنَّمُ وَبِئسَ المَصيرُ",en:"O Prophet, fight against the disbelievers and the hypocrites and be harsh upon them. And their refuge is Hell, and wretched is the destination."},{v:74,ar:"يَحلِفونَ بِاللَّهِ ما قالوا وَلَقَد قالوا كَلِمَةَ الكُفرِ وَكَفَروا بَعدَ إِسلٰمِهِم وَهَمّوا بِما لَم يَنالوا وَما نَقَموا إِلّا أَن أَغنىٰهُمُ اللَّهُ وَرَسولُهُ مِن فَضلِهِ فَإِن يَتوبوا يَكُ خَيرًا لَهُم وَإِن يَتَوَلَّوا يُعَذِّبهُمُ اللَّهُ عَذابًا أَليمًا فِى الدُّنيا وَالـٔاخِرَةِ وَما لَهُم فِى الأَرضِ مِن وَلِىٍّ وَلا نَصيرٍ",en:"They swear by Allah that they did not say [anything against the Prophet] while they had said the word of disbelief and disbelieved after their [pretense of] Islam and planned that which they were not to attain. And they were not resentful except [for the fact] that Allah and His Messenger had enriched them of His bounty. So if they repent, it is better for them; but if they turn away, Allah will punish them with a painful punishment in this world and the Hereafter. And there will not be for them on earth any protector or helper."},{v:75,ar:"وَمِنهُم مَن عٰهَدَ اللَّهَ لَئِن ءاتىٰنا مِن فَضلِهِ لَنَصَّدَّقَنَّ وَلَنَكونَنَّ مِنَ الصّٰلِحينَ",en:"And among them are those who made a covenant with Allah, [saying], \"If He should give us from His bounty, we will surely spend in charity, and we will surely be among the righteous.\""},{v:76,ar:"فَلَمّا ءاتىٰهُم مِن فَضلِهِ بَخِلوا بِهِ وَتَوَلَّوا وَهُم مُعرِضونَ",en:"But when he gave them from His bounty, they were stingy with it and turned away while they refused."},{v:77,ar:"فَأَعقَبَهُم نِفاقًا فى قُلوبِهِم إِلىٰ يَومِ يَلقَونَهُ بِما أَخلَفُوا اللَّهَ ما وَعَدوهُ وَبِما كانوا يَكذِبونَ",en:"So He penalized them with hypocrisy in their hearts until the Day they will meet Him - because they failed Allah in what they promised Him and because they [habitually] used to lie."},{v:78,ar:"أَلَم يَعلَموا أَنَّ اللَّهَ يَعلَمُ سِرَّهُم وَنَجوىٰهُم وَأَنَّ اللَّهَ عَلّٰمُ الغُيوبِ",en:"Did they not know that Allah knows their secrets and their private conversations and that Allah is the Knower of the unseen?"},{v:79,ar:"الَّذينَ يَلمِزونَ المُطَّوِّعينَ مِنَ المُؤمِنينَ فِى الصَّدَقٰتِ وَالَّذينَ لا يَجِدونَ إِلّا جُهدَهُم فَيَسخَرونَ مِنهُم سَخِرَ اللَّهُ مِنهُم وَلَهُم عَذابٌ أَليمٌ",en:"Those who criticize the contributors among the believers concerning [their] charities and [criticize] the ones who find nothing [to spend] except their effort, so they ridicule them - Allah will ridicule them, and they will have a painful punishment."},{v:80,ar:"استَغفِر لَهُم أَو لا تَستَغفِر لَهُم إِن تَستَغفِر لَهُم سَبعينَ مَرَّةً فَلَن يَغفِرَ اللَّهُ لَهُم ذٰلِكَ بِأَنَّهُم كَفَروا بِاللَّهِ وَرَسولِهِ وَاللَّهُ لا يَهدِى القَومَ الفٰسِقينَ",en:"Ask forgiveness for them, [O Muhammad], or do not ask forgiveness for them. If you should ask forgiveness for them seventy times - never will Allah forgive them. That is because they disbelieved in Allah and His Messenger, and Allah does not guide the defiantly disobedient people."}],
  10:[{v:57,ar:"يٰأَيُّهَا النّاسُ قَد جاءَتكُم مَوعِظَةٌ مِن رَبِّكُم وَشِفاءٌ لِما فِى الصُّدورِ وَهُدًى وَرَحمَةٌ لِلمُؤمِنينَ",en:"O mankind, there has to come to you instruction from your Lord and healing for what is in the breasts and guidance and mercy for the believers."},{v:58,ar:"قُل بِفَضلِ اللَّهِ وَبِرَحمَتِهِ فَبِذٰلِكَ فَليَفرَحوا هُوَ خَيرٌ مِمّا يَجمَعونَ",en:"Say, \"In the bounty of Allah and in His mercy - in that let them rejoice; it is better than what they accumulate.\""},{v:59,ar:"قُل أَرَءَيتُم ما أَنزَلَ اللَّهُ لَكُم مِن رِزقٍ فَجَعَلتُم مِنهُ حَرامًا وَحَلٰلًا قُل ءاللَّهُ أَذِنَ لَكُم أَم عَلَى اللَّهِ تَفتَرونَ",en:"Say, \"Have you seen what Allah has sent down to you of provision of which you have made [some] lawful and [some] unlawful?\" Say, \"Has Allah permitted you [to do so], or do you invent [something] about Allah?\""},{v:60,ar:"وَما ظَنُّ الَّذينَ يَفتَرونَ عَلَى اللَّهِ الكَذِبَ يَومَ القِيٰمَةِ إِنَّ اللَّهَ لَذو فَضلٍ عَلَى النّاسِ وَلٰكِنَّ أَكثَرَهُم لا يَشكُرونَ",en:"And what will be the supposition of those who invent falsehood about Allah on the Day of Resurrection? Indeed, Allah is full of bounty to the people, but most of them are not grateful.\""},{v:61,ar:"وَما تَكونُ فى شَأنٍ وَما تَتلوا مِنهُ مِن قُرءانٍ وَلا تَعمَلونَ مِن عَمَلٍ إِلّا كُنّا عَلَيكُم شُهودًا إِذ تُفيضونَ فيهِ وَما يَعزُبُ عَن رَبِّكَ مِن مِثقالِ ذَرَّةٍ فِى الأَرضِ وَلا فِى السَّماءِ وَلا أَصغَرَ مِن ذٰلِكَ وَلا أَكبَرَ إِلّا فى كِتٰبٍ مُبينٍ",en:"And, [O Muhammad], you are not [engaged] in any matter or recite any of the Qur'an and you [people] do not do any deed except that We are witness over you when you are involved in it. And not absent from your Lord is any [part] of an atom's weight within the earth or within the heaven or [anything] smaller than that or greater but that it is in a clear register."},{v:62,ar:"أَلا إِنَّ أَولِياءَ اللَّهِ لا خَوفٌ عَلَيهِم وَلا هُم يَحزَنونَ",en:"Unquestionably, [for] the allies of Allah there will be no fear concerning them, nor will they grieve"},{v:63,ar:"الَّذينَ ءامَنوا وَكانوا يَتَّقونَ",en:"Those who believed and were fearing Allah"},{v:64,ar:"لَهُمُ البُشرىٰ فِى الحَيوٰةِ الدُّنيا وَفِى الـٔاخِرَةِ لا تَبديلَ لِكَلِمٰتِ اللَّهِ ذٰلِكَ هُوَ الفَوزُ العَظيمُ",en:"For them are good tidings in the worldly life and in the Hereafter. No change is there in the words of Allah. That is what is the great attainment."},{v:65,ar:"وَلا يَحزُنكَ قَولُهُم إِنَّ العِزَّةَ لِلَّهِ جَميعًا هُوَ السَّميعُ العَليمُ",en:"And let not their speech grieve you. Indeed, honor [due to power] belongs to Allah entirely. He is the Hearing, the Knowing."},{v:66,ar:"أَلا إِنَّ لِلَّهِ مَن فِى السَّمٰوٰتِ وَمَن فِى الأَرضِ وَما يَتَّبِعُ الَّذينَ يَدعونَ مِن دونِ اللَّهِ شُرَكاءَ إِن يَتَّبِعونَ إِلَّا الظَّنَّ وَإِن هُم إِلّا يَخرُصونَ",en:"Unquestionably, to Allah belongs whoever is in the heavens and whoever is on the earth. And those who invoke other than Allah do not [actually] follow [His] \"partners.\" They follow not except assumption, and they are not but falsifying"},{v:67,ar:"هُوَ الَّذى جَعَلَ لَكُمُ الَّيلَ لِتَسكُنوا فيهِ وَالنَّهارَ مُبصِرًا إِنَّ فى ذٰلِكَ لَـٔايٰتٍ لِقَومٍ يَسمَعونَ",en:"It is He who made for you the night to rest therein and the day, giving sight. Indeed in that are signs for a people who listen."},{v:68,ar:"قالُوا اتَّخَذَ اللَّهُ وَلَدًا سُبحٰنَهُ هُوَ الغَنِىُّ لَهُ ما فِى السَّمٰوٰتِ وَما فِى الأَرضِ إِن عِندَكُم مِن سُلطٰنٍ بِهٰذا أَتَقولونَ عَلَى اللَّهِ ما لا تَعلَمونَ",en:"They have said, \"Allah has taken a son.\" Exalted is He; He is the [one] Free of need. To Him belongs whatever is in the heavens and whatever is in the earth. You have no authority for this [claim]. Do you say about Allah that which you do not know?"},{v:69,ar:"قُل إِنَّ الَّذينَ يَفتَرونَ عَلَى اللَّهِ الكَذِبَ لا يُفلِحونَ",en:"Say, \"Indeed, those who invent falsehood about Allah will not succeed.\""},{v:70,ar:"مَتٰعٌ فِى الدُّنيا ثُمَّ إِلَينا مَرجِعُهُم ثُمَّ نُذيقُهُمُ العَذابَ الشَّديدَ بِما كانوا يَكفُرونَ",en:"[For them is brief] enjoyment in this world; then to Us is their return; then We will make them taste the severe punishment because they used to disbelieve"}],
  11:[{v:61,ar:"وَإِلىٰ ثَمودَ أَخاهُم صٰلِحًا قالَ يٰقَومِ اعبُدُوا اللَّهَ ما لَكُم مِن إِلٰهٍ غَيرُهُ هُوَ أَنشَأَكُم مِنَ الأَرضِ وَاستَعمَرَكُم فيها فَاستَغفِروهُ ثُمَّ توبوا إِلَيهِ إِنَّ رَبّى قَريبٌ مُجيبٌ",en:"And to Thamud [We sent] their brother Salih. He said, \"O my people, worship Allah; you have no deity other than Him. He has produced you from the earth and settled you in it, so ask forgiveness of Him and then repent to Him. Indeed, my Lord is near and responsive.\""},{v:62,ar:"قالوا يٰصٰلِحُ قَد كُنتَ فينا مَرجُوًّا قَبلَ هٰذا أَتَنهىٰنا أَن نَعبُدَ ما يَعبُدُ ءاباؤُنا وَإِنَّنا لَفى شَكٍّ مِمّا تَدعونا إِلَيهِ مُريبٍ",en:"They said, \"O Salih, you were among us a man of promise before this. Do you forbid us to worship what our fathers worshipped? And indeed we are, about that to which you invite us, in disquieting doubt.\""},{v:63,ar:"قالَ يٰقَومِ أَرَءَيتُم إِن كُنتُ عَلىٰ بَيِّنَةٍ مِن رَبّى وَءاتىٰنى مِنهُ رَحمَةً فَمَن يَنصُرُنى مِنَ اللَّهِ إِن عَصَيتُهُ فَما تَزيدونَنى غَيرَ تَخسيرٍ",en:"He said, \"O my people, have you considered: if I should be upon clear evidence from my Lord and He has given me mercy from Himself, who would protect me from Allah if I disobeyed Him? So you would not increase me except in loss."},{v:64,ar:"وَيٰقَومِ هٰذِهِ ناقَةُ اللَّهِ لَكُم ءايَةً فَذَروها تَأكُل فى أَرضِ اللَّهِ وَلا تَمَسّوها بِسوءٍ فَيَأخُذَكُم عَذابٌ قَريبٌ",en:"And O my people, this is the she-camel of Allah - [she is] to you a sign. So let her feed upon Allah 's earth and do not touch her with harm, or you will be taken by an impending punishment.\""},{v:65,ar:"فَعَقَروها فَقالَ تَمَتَّعوا فى دارِكُم ثَلٰثَةَ أَيّامٍ ذٰلِكَ وَعدٌ غَيرُ مَكذوبٍ",en:"But they hamstrung her, so he said, \"Enjoy yourselves in your homes for three days. That is a promise not to be denied.\""},{v:66,ar:"فَلَمّا جاءَ أَمرُنا نَجَّينا صٰلِحًا وَالَّذينَ ءامَنوا مَعَهُ بِرَحمَةٍ مِنّا وَمِن خِزىِ يَومِئِذٍ إِنَّ رَبَّكَ هُوَ القَوِىُّ العَزيزُ",en:"So when Our command came, We saved Salih and those who believed with him, by mercy from Us, and [saved them] from the disgrace of that day. Indeed, it is your Lord who is the Powerful, the Exalted in Might."},{v:67,ar:"وَأَخَذَ الَّذينَ ظَلَمُوا الصَّيحَةُ فَأَصبَحوا فى دِيٰرِهِم جٰثِمينَ",en:"And the shriek seized those who had wronged, and they became within their homes [corpses] fallen prone"},{v:68,ar:"كَأَن لَم يَغنَوا فيها أَلا إِنَّ ثَمودَا۟ كَفَروا رَبَّهُم أَلا بُعدًا لِثَمودَ",en:"As if they had never prospered therein. Unquestionably, Thamud denied their Lord; then, away with Thamud."},{v:69,ar:"وَلَقَد جاءَت رُسُلُنا إِبرٰهيمَ بِالبُشرىٰ قالوا سَلٰمًا قالَ سَلٰمٌ فَما لَبِثَ أَن جاءَ بِعِجلٍ حَنيذٍ",en:"And certainly did Our messengers come to Abraham with good tidings; they said, \"Peace.\" He said, \"Peace,\" and did not delay in bringing [them] a roasted calf."},{v:70,ar:"فَلَمّا رَءا أَيدِيَهُم لا تَصِلُ إِلَيهِ نَكِرَهُم وَأَوجَسَ مِنهُم خيفَةً قالوا لا تَخَف إِنّا أُرسِلنا إِلىٰ قَومِ لوطٍ",en:"But when he saw their hands not reaching for it, he distrusted them and felt from them apprehension. They said, \"Fear not. We have been sent to the people of Lot.\""},{v:71,ar:"وَامرَأَتُهُ قائِمَةٌ فَضَحِكَت فَبَشَّرنٰها بِإِسحٰقَ وَمِن وَراءِ إِسحٰقَ يَعقوبَ",en:"And his Wife was standing, and she smiled. Then We gave her good tidings of Isaac and after Isaac, Jacob."},{v:72,ar:"قالَت يٰوَيلَتىٰ ءَأَلِدُ وَأَنا۠ عَجوزٌ وَهٰذا بَعلى شَيخًا إِنَّ هٰذا لَشَىءٌ عَجيبٌ",en:"She said, \"Woe to me! Shall I give birth while I am an old woman and this, my husband, is an old man? Indeed, this is an amazing thing!\""},{v:73,ar:"قالوا أَتَعجَبينَ مِن أَمرِ اللَّهِ رَحمَتُ اللَّهِ وَبَرَكٰتُهُ عَلَيكُم أَهلَ البَيتِ إِنَّهُ حَميدٌ مَجيدٌ",en:"They said, \"Are you amazed at the decree of Allah? May the mercy of Allah and His blessings be upon you, people of the house. Indeed, He is Praiseworthy and Honorable.\""},{v:74,ar:"فَلَمّا ذَهَبَ عَن إِبرٰهيمَ الرَّوعُ وَجاءَتهُ البُشرىٰ يُجٰدِلُنا فى قَومِ لوطٍ",en:"And when the fright had left Abraham and the good tidings had reached him, he began to argue with Us concerning the people of Lot."},{v:75,ar:"إِنَّ إِبرٰهيمَ لَحَليمٌ أَوّٰهٌ مُنيبٌ",en:"Indeed, Abraham was forbearing, grieving and [frequently] returning [to Allah]."},{v:76,ar:"يٰإِبرٰهيمُ أَعرِض عَن هٰذا إِنَّهُ قَد جاءَ أَمرُ رَبِّكَ وَإِنَّهُم ءاتيهِم عَذابٌ غَيرُ مَردودٍ",en:"[The angels said], \"O Abraham, give up this [plea]. Indeed, the command of your Lord has come, and indeed, there will reach them a punishment that cannot be repelled.\""},{v:77,ar:"وَلَمّا جاءَت رُسُلُنا لوطًا سىءَ بِهِم وَضاقَ بِهِم ذَرعًا وَقالَ هٰذا يَومٌ عَصيبٌ",en:"And when Our messengers, [the angels], came to Lot, he was anguished for them and felt for them great discomfort and said, \"This is a trying day.\""},{v:78,ar:"وَجاءَهُ قَومُهُ يُهرَعونَ إِلَيهِ وَمِن قَبلُ كانوا يَعمَلونَ السَّيِّـٔاتِ قالَ يٰقَومِ هٰؤُلاءِ بَناتى هُنَّ أَطهَرُ لَكُم فَاتَّقُوا اللَّهَ وَلا تُخزونِ فى ضَيفى أَلَيسَ مِنكُم رَجُلٌ رَشيدٌ",en:"And his people came hastening to him, and before [this] they had been doing evil deeds. He said, \"O my people, these are my daughters; they are purer for you. So fear Allah and do not disgrace me concerning my guests. Is there not among you a man of reason?\""},{v:79,ar:"قالوا لَقَد عَلِمتَ ما لَنا فى بَناتِكَ مِن حَقٍّ وَإِنَّكَ لَتَعلَمُ ما نُريدُ",en:"They said, \"You have already known that we have not concerning your daughters any claim, and indeed, you know what we want.\""},{v:80,ar:"قالَ لَو أَنَّ لى بِكُم قُوَّةً أَو ءاوى إِلىٰ رُكنٍ شَديدٍ",en:"He said, \"If only I had against you some power or could take refuge in a strong support.\""},{v:81,ar:"قالوا يٰلوطُ إِنّا رُسُلُ رَبِّكَ لَن يَصِلوا إِلَيكَ فَأَسرِ بِأَهلِكَ بِقِطعٍ مِنَ الَّيلِ وَلا يَلتَفِت مِنكُم أَحَدٌ إِلَّا امرَأَتَكَ إِنَّهُ مُصيبُها ما أَصابَهُم إِنَّ مَوعِدَهُمُ الصُّبحُ أَلَيسَ الصُّبحُ بِقَريبٍ",en:"The angels said, \"O Lot, indeed we are messengers of your Lord; [therefore], they will never reach you. So set out with your family during a portion of the night and let not any among you look back - except your wife; indeed, she will be struck by that which strikes them. Indeed, their appointment is [for] the morning. Is not the morning near?\""},{v:82,ar:"فَلَمّا جاءَ أَمرُنا جَعَلنا عٰلِيَها سافِلَها وَأَمطَرنا عَلَيها حِجارَةً مِن سِجّيلٍ مَنضودٍ",en:"So when Our command came, We made the highest part [of the city] its lowest and rained upon them stones of layered hard clay, [which were]"},{v:83,ar:"مُسَوَّمَةً عِندَ رَبِّكَ وَما هِىَ مِنَ الظّٰلِمينَ بِبَعيدٍ",en:"Marked from your Lord. And Allah 's punishment is not from the wrongdoers [very] far."}],
  12:[{v:36,ar:"وَدَخَلَ مَعَهُ السِّجنَ فَتَيانِ قالَ أَحَدُهُما إِنّى أَرىٰنى أَعصِرُ خَمرًا وَقالَ الـٔاخَرُ إِنّى أَرىٰنى أَحمِلُ فَوقَ رَأسى خُبزًا تَأكُلُ الطَّيرُ مِنهُ نَبِّئنا بِتَأويلِهِ إِنّا نَرىٰكَ مِنَ المُحسِنينَ",en:"And there entered the prison with him two young men. One of them said, \"Indeed, I have seen myself [in a dream] pressing wine.\" The other said, \"Indeed, I have seen myself carrying upon my head [some] bread, from which the birds were eating. Inform us of its interpretation; indeed, we see you to be of those who do good.\""},{v:37,ar:"قالَ لا يَأتيكُما طَعامٌ تُرزَقانِهِ إِلّا نَبَّأتُكُما بِتَأويلِهِ قَبلَ أَن يَأتِيَكُما ذٰلِكُما مِمّا عَلَّمَنى رَبّى إِنّى تَرَكتُ مِلَّةَ قَومٍ لا يُؤمِنونَ بِاللَّهِ وَهُم بِالـٔاخِرَةِ هُم كٰفِرونَ",en:"He said, \"You will not receive food that is provided to you except that I will inform you of its interpretation before it comes to you. That is from what my Lord has taught me. Indeed, I have left the religion of a people who do not believe in Allah, and they, in the Hereafter, are disbelievers."},{v:38,ar:"وَاتَّبَعتُ مِلَّةَ ءاباءى إِبرٰهيمَ وَإِسحٰقَ وَيَعقوبَ ما كانَ لَنا أَن نُشرِكَ بِاللَّهِ مِن شَىءٍ ذٰلِكَ مِن فَضلِ اللَّهِ عَلَينا وَعَلَى النّاسِ وَلٰكِنَّ أَكثَرَ النّاسِ لا يَشكُرونَ",en:"And I have followed the religion of my fathers, Abraham, Isaac and Jacob. And it was not for us to associate anything with Allah. That is from the favor of Allah upon us and upon the people, but most of the people are not grateful."},{v:39,ar:"يٰصٰحِبَىِ السِّجنِ ءَأَربابٌ مُتَفَرِّقونَ خَيرٌ أَمِ اللَّهُ الوٰحِدُ القَهّارُ",en:"O [my] two companions of prison, are separate lords better or Allah, the One, the Prevailing?"},{v:40,ar:"ما تَعبُدونَ مِن دونِهِ إِلّا أَسماءً سَمَّيتُموها أَنتُم وَءاباؤُكُم ما أَنزَلَ اللَّهُ بِها مِن سُلطٰنٍ إِنِ الحُكمُ إِلّا لِلَّهِ أَمَرَ أَلّا تَعبُدوا إِلّا إِيّاهُ ذٰلِكَ الدّينُ القَيِّمُ وَلٰكِنَّ أَكثَرَ النّاسِ لا يَعلَمونَ",en:"You worship not besides Him except [mere] names you have named them, you and your fathers, for which Allah has sent down no authority. Legislation is not but for Allah. He has commanded that you worship not except Him. That is the correct religion, but most of the people do not know."},{v:41,ar:"يٰصٰحِبَىِ السِّجنِ أَمّا أَحَدُكُما فَيَسقى رَبَّهُ خَمرًا وَأَمَّا الـٔاخَرُ فَيُصلَبُ فَتَأكُلُ الطَّيرُ مِن رَأسِهِ قُضِىَ الأَمرُ الَّذى فيهِ تَستَفتِيانِ",en:"O two companions of prison, as for one of you, he will give drink to his master of wine; but as for the other, he will be crucified, and the birds will eat from his head. The matter has been decreed about which you both inquire.\""},{v:42,ar:"وَقالَ لِلَّذى ظَنَّ أَنَّهُ ناجٍ مِنهُمَا اذكُرنى عِندَ رَبِّكَ فَأَنسىٰهُ الشَّيطٰنُ ذِكرَ رَبِّهِ فَلَبِثَ فِى السِّجنِ بِضعَ سِنينَ",en:"And he said to the one whom he knew would go free, \"Mention me before your master.\" But Satan made him forget the mention [to] his master, and Joseph remained in prison several years."},{v:43,ar:"وَقالَ المَلِكُ إِنّى أَرىٰ سَبعَ بَقَرٰتٍ سِمانٍ يَأكُلُهُنَّ سَبعٌ عِجافٌ وَسَبعَ سُنبُلٰتٍ خُضرٍ وَأُخَرَ يابِسٰتٍ يٰأَيُّهَا المَلَأُ أَفتونى فى رُءيٰىَ إِن كُنتُم لِلرُّءيا تَعبُرونَ",en:"And [subsequently] the king said, \"Indeed, I have seen [in a dream] seven fat cows being eaten by seven [that were] lean, and seven green spikes [of grain] and others [that were] dry. O eminent ones, explain to me my vision, if you should interpret visions.\""},{v:44,ar:"قالوا أَضغٰثُ أَحلٰمٍ وَما نَحنُ بِتَأويلِ الأَحلٰمِ بِعٰلِمينَ",en:"They said, \"[It is but] a mixture of false dreams, and we are not learned in the interpretation of dreams.\""},{v:45,ar:"وَقالَ الَّذى نَجا مِنهُما وَادَّكَرَ بَعدَ أُمَّةٍ أَنا۠ أُنَبِّئُكُم بِتَأويلِهِ فَأَرسِلونِ",en:"But the one who was freed and remembered after a time said, \"I will inform you of its interpretation, so send me forth.\""},{v:46,ar:"يوسُفُ أَيُّهَا الصِّدّيقُ أَفتِنا فى سَبعِ بَقَرٰتٍ سِمانٍ يَأكُلُهُنَّ سَبعٌ عِجافٌ وَسَبعِ سُنبُلٰتٍ خُضرٍ وَأُخَرَ يابِسٰتٍ لَعَلّى أَرجِعُ إِلَى النّاسِ لَعَلَّهُم يَعلَمونَ",en:"[He said], \"Joseph, O man of truth, explain to us about seven fat cows eaten by seven [that were] lean, and seven green spikes [of grain] and others [that were] dry - that I may return to the people; perhaps they will know [about you].\""},{v:47,ar:"قالَ تَزرَعونَ سَبعَ سِنينَ دَأَبًا فَما حَصَدتُم فَذَروهُ فى سُنبُلِهِ إِلّا قَليلًا مِمّا تَأكُلونَ",en:"[Joseph] said, \"You will plant for seven years consecutively; and what you harvest leave in its spikes, except a little from which you will eat."},{v:48,ar:"ثُمَّ يَأتى مِن بَعدِ ذٰلِكَ سَبعٌ شِدادٌ يَأكُلنَ ما قَدَّمتُم لَهُنَّ إِلّا قَليلًا مِمّا تُحصِنونَ",en:"Then will come after that seven difficult [years] which will consume what you saved for them, except a little from which you will store."},{v:49,ar:"ثُمَّ يَأتى مِن بَعدِ ذٰلِكَ عامٌ فيهِ يُغاثُ النّاسُ وَفيهِ يَعصِرونَ",en:"Then will come after that a year in which the people will be given rain and in which they will press [olives and grapes].\""},{v:50,ar:"وَقالَ المَلِكُ ائتونى بِهِ فَلَمّا جاءَهُ الرَّسولُ قالَ ارجِع إِلىٰ رَبِّكَ فَسـَٔلهُ ما بالُ النِّسوَةِ الّٰتى قَطَّعنَ أَيدِيَهُنَّ إِنَّ رَبّى بِكَيدِهِنَّ عَليمٌ",en:"And the king said, \"Bring him to me.\" But when the messenger came to him, [Joseph] said, \"Return to your master and ask him what is the case of the women who cut their hands. Indeed, my Lord is Knowing of their plan.\""},{v:51,ar:"قالَ ما خَطبُكُنَّ إِذ رٰوَدتُنَّ يوسُفَ عَن نَفسِهِ قُلنَ حٰشَ لِلَّهِ ما عَلِمنا عَلَيهِ مِن سوءٍ قالَتِ امرَأَتُ العَزيزِ الـٰٔنَ حَصحَصَ الحَقُّ أَنا۠ رٰوَدتُهُ عَن نَفسِهِ وَإِنَّهُ لَمِنَ الصّٰدِقينَ",en:"Said [the king to the women], \"What was your condition when you sought to seduce Joseph?\" They said, \"Perfect is Allah! We know about him no evil.\" The wife of al-'Azeez said, \"Now the truth has become evident. It was I who sought to seduce him, and indeed, he is of the truthful."},{v:52,ar:"ذٰلِكَ لِيَعلَمَ أَنّى لَم أَخُنهُ بِالغَيبِ وَأَنَّ اللَّهَ لا يَهدى كَيدَ الخائِنينَ",en:"That is so al-'Azeez will know that I did not betray him in [his] absence and that Allah does not guide the plan of betrayers."},{v:53,ar:"وَما أُبَرِّئُ نَفسى إِنَّ النَّفسَ لَأَمّارَةٌ بِالسّوءِ إِلّا ما رَحِمَ رَبّى إِنَّ رَبّى غَفورٌ رَحيمٌ",en:"And I do not acquit myself. Indeed, the soul is a persistent enjoiner of evil, except those upon which my Lord has mercy. Indeed, my Lord is Forgiving and Merciful.\""},{v:54,ar:"وَقالَ المَلِكُ ائتونى بِهِ أَستَخلِصهُ لِنَفسى فَلَمّا كَلَّمَهُ قالَ إِنَّكَ اليَومَ لَدَينا مَكينٌ أَمينٌ",en:"And the king said, \"Bring him to me; I will appoint him exclusively for myself.\" And when he spoke to him, he said, \"Indeed, you are today established [in position] and trusted.\""},{v:55,ar:"قالَ اجعَلنى عَلىٰ خَزائِنِ الأَرضِ إِنّى حَفيظٌ عَليمٌ",en:"[Joseph] said, \"Appoint me over the storehouses of the land. Indeed, I will be a knowing guardian.\""},{v:56,ar:"وَكَذٰلِكَ مَكَّنّا لِيوسُفَ فِى الأَرضِ يَتَبَوَّأُ مِنها حَيثُ يَشاءُ نُصيبُ بِرَحمَتِنا مَن نَشاءُ وَلا نُضيعُ أَجرَ المُحسِنينَ",en:"And thus We established Joseph in the land to settle therein wherever he willed. We touch with Our mercy whom We will, and We do not allow to be lost the reward of those who do good."},{v:57,ar:"وَلَأَجرُ الـٔاخِرَةِ خَيرٌ لِلَّذينَ ءامَنوا وَكانوا يَتَّقونَ",en:"And the reward of the Hereafter is better for those who believed and were fearing Allah."}],
  13:[{v:19,ar:"أَفَمَن يَعلَمُ أَنَّما أُنزِلَ إِلَيكَ مِن رَبِّكَ الحَقُّ كَمَن هُوَ أَعمىٰ إِنَّما يَتَذَكَّرُ أُولُوا الأَلبٰبِ",en:"Then is he who knows that what has been revealed to you from your Lord is the truth like one who is blind? They will only be reminded who are people of understanding -"},{v:20,ar:"الَّذينَ يوفونَ بِعَهدِ اللَّهِ وَلا يَنقُضونَ الميثٰقَ",en:"Those who fulfill the covenant of Allah and do not break the contract,"},{v:21,ar:"وَالَّذينَ يَصِلونَ ما أَمَرَ اللَّهُ بِهِ أَن يوصَلَ وَيَخشَونَ رَبَّهُم وَيَخافونَ سوءَ الحِسابِ",en:"And those who join that which Allah has ordered to be joined and fear their Lord and are afraid of the evil of [their] account,"},{v:22,ar:"وَالَّذينَ صَبَرُوا ابتِغاءَ وَجهِ رَبِّهِم وَأَقامُوا الصَّلوٰةَ وَأَنفَقوا مِمّا رَزَقنٰهُم سِرًّا وَعَلانِيَةً وَيَدرَءونَ بِالحَسَنَةِ السَّيِّئَةَ أُولٰئِكَ لَهُم عُقبَى الدّارِ",en:"And those who are patient, seeking the countenance of their Lord, and establish prayer and spend from what We have provided for them secretly and publicly and prevent evil with good - those will have the good consequence of [this] home -"},{v:23,ar:"جَنّٰتُ عَدنٍ يَدخُلونَها وَمَن صَلَحَ مِن ءابائِهِم وَأَزوٰجِهِم وَذُرِّيّٰتِهِم وَالمَلٰئِكَةُ يَدخُلونَ عَلَيهِم مِن كُلِّ بابٍ",en:"Gardens of perpetual residence; they will enter them with whoever were righteous among their fathers, their spouses and their descendants. And the angels will enter upon them from every gate, [saying],"},{v:24,ar:"سَلٰمٌ عَلَيكُم بِما صَبَرتُم فَنِعمَ عُقبَى الدّارِ",en:"\"Peace be upon you for what you patiently endured. And excellent is the final home.\""},{v:25,ar:"وَالَّذينَ يَنقُضونَ عَهدَ اللَّهِ مِن بَعدِ ميثٰقِهِ وَيَقطَعونَ ما أَمَرَ اللَّهُ بِهِ أَن يوصَلَ وَيُفسِدونَ فِى الأَرضِ أُولٰئِكَ لَهُمُ اللَّعنَةُ وَلَهُم سوءُ الدّارِ",en:"But those who break the covenant of Allah after contracting it and sever that which Allah has ordered to be joined and spread corruption on earth - for them is the curse, and they will have the worst home."},{v:26,ar:"اللَّهُ يَبسُطُ الرِّزقَ لِمَن يَشاءُ وَيَقدِرُ وَفَرِحوا بِالحَيوٰةِ الدُّنيا وَمَا الحَيوٰةُ الدُّنيا فِى الـٔاخِرَةِ إِلّا مَتٰعٌ",en:"Allah extends provision for whom He wills and restricts [it]. And they rejoice in the worldly life, while the worldly life is not, compared to the Hereafter, except [brief] enjoyment."},{v:27,ar:"وَيَقولُ الَّذينَ كَفَروا لَولا أُنزِلَ عَلَيهِ ءايَةٌ مِن رَبِّهِ قُل إِنَّ اللَّهَ يُضِلُّ مَن يَشاءُ وَيَهدى إِلَيهِ مَن أَنابَ",en:"And those who disbelieved say, \"Why has a sign not been sent down to him from his Lord?\" Say, [O Muhammad], \"Indeed, Allah leaves astray whom He wills and guides to Himself whoever turns back [to Him] -"},{v:28,ar:"الَّذينَ ءامَنوا وَتَطمَئِنُّ قُلوبُهُم بِذِكرِ اللَّهِ أَلا بِذِكرِ اللَّهِ تَطمَئِنُّ القُلوبُ",en:"Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured.\""},{v:29,ar:"الَّذينَ ءامَنوا وَعَمِلُوا الصّٰلِحٰتِ طوبىٰ لَهُم وَحُسنُ مَـٔابٍ",en:"Those who have believed and done righteous deeds - a good state is theirs and a good return."}],
  14:[{v:21,ar:"وَبَرَزوا لِلَّهِ جَميعًا فَقالَ الضُّعَفٰؤُا۟ لِلَّذينَ استَكبَروا إِنّا كُنّا لَكُم تَبَعًا فَهَل أَنتُم مُغنونَ عَنّا مِن عَذابِ اللَّهِ مِن شَىءٍ قالوا لَو هَدىٰنَا اللَّهُ لَهَدَينٰكُم سَواءٌ عَلَينا أَجَزِعنا أَم صَبَرنا ما لَنا مِن مَحيصٍ",en:"And they will come out [for judgement] before Allah all together, and the weak will say to those who were arrogant, \"Indeed, we were your followers, so can you avail us anything against the punishment of Allah?\" They will say, \"If Allah had guided us, we would have guided you. It is all the same for us whether we show intolerance or are patient: there is for us no place of escape.\""},{v:22,ar:"وَقالَ الشَّيطٰنُ لَمّا قُضِىَ الأَمرُ إِنَّ اللَّهَ وَعَدَكُم وَعدَ الحَقِّ وَوَعَدتُكُم فَأَخلَفتُكُم وَما كانَ لِىَ عَلَيكُم مِن سُلطٰنٍ إِلّا أَن دَعَوتُكُم فَاستَجَبتُم لى فَلا تَلومونى وَلوموا أَنفُسَكُم ما أَنا۠ بِمُصرِخِكُم وَما أَنتُم بِمُصرِخِىَّ إِنّى كَفَرتُ بِما أَشرَكتُمونِ مِن قَبلُ إِنَّ الظّٰلِمينَ لَهُم عَذابٌ أَليمٌ",en:"And Satan will say when the matter has been concluded, \"Indeed, Allah had promised you the promise of truth. And I promised you, but I betrayed you. But I had no authority over you except that I invited you, and you responded to me. So do not blame me; but blame yourselves. I cannot be called to your aid, nor can you be called to my aid. Indeed, I deny your association of me [with Allah] before. Indeed, for the wrongdoers is a painful punishment.\""},{v:23,ar:"وَأُدخِلَ الَّذينَ ءامَنوا وَعَمِلُوا الصّٰلِحٰتِ جَنّٰتٍ تَجرى مِن تَحتِهَا الأَنهٰرُ خٰلِدينَ فيها بِإِذنِ رَبِّهِم تَحِيَّتُهُم فيها سَلٰمٌ",en:"And those who believed and did righteous deeds will be admitted to gardens beneath which rivers flow, abiding eternally therein by permission of their Lord; and their greeting therein will be, \"Peace!\""},{v:24,ar:"أَلَم تَرَ كَيفَ ضَرَبَ اللَّهُ مَثَلًا كَلِمَةً طَيِّبَةً كَشَجَرَةٍ طَيِّبَةٍ أَصلُها ثابِتٌ وَفَرعُها فِى السَّماءِ",en:"Have you not considered how Allah presents an example, [making] a good word like a good tree, whose root is firmly fixed and its branches [high] in the sky?"},{v:25,ar:"تُؤتى أُكُلَها كُلَّ حينٍ بِإِذنِ رَبِّها وَيَضرِبُ اللَّهُ الأَمثالَ لِلنّاسِ لَعَلَّهُم يَتَذَكَّرونَ",en:"It produces its fruit all the time, by permission of its Lord. And Allah presents examples for the people that perhaps they will be reminded."},{v:26,ar:"وَمَثَلُ كَلِمَةٍ خَبيثَةٍ كَشَجَرَةٍ خَبيثَةٍ اجتُثَّت مِن فَوقِ الأَرضِ ما لَها مِن قَرارٍ",en:"And the example of a bad word is like a bad tree, uprooted from the surface of the earth, not having any stability."},{v:27,ar:"يُثَبِّتُ اللَّهُ الَّذينَ ءامَنوا بِالقَولِ الثّابِتِ فِى الحَيوٰةِ الدُّنيا وَفِى الـٔاخِرَةِ وَيُضِلُّ اللَّهُ الظّٰلِمينَ وَيَفعَلُ اللَّهُ ما يَشاءُ",en:"Allah keeps firm those who believe, with the firm word, in worldly life and in the Hereafter. And Allah sends astray the wrongdoers. And Allah does what He wills."}],
  15:[{v:45,ar:"إِنَّ المُتَّقينَ فى جَنّٰتٍ وَعُيونٍ",en:"Indeed, the righteous will be within gardens and springs."},{v:46,ar:"ادخُلوها بِسَلٰمٍ ءامِنينَ",en:"[Having been told], \"Enter it in peace, safe [and secure].\""},{v:47,ar:"وَنَزَعنا ما فى صُدورِهِم مِن غِلٍّ إِخوٰنًا عَلىٰ سُرُرٍ مُتَقٰبِلينَ",en:"And We will remove whatever is in their breasts of resentment, [so they will be] brothers, on thrones facing each other."},{v:48,ar:"لا يَمَسُّهُم فيها نَصَبٌ وَما هُم مِنها بِمُخرَجينَ",en:"No fatigue will touch them therein, nor from it will they [ever] be removed."},{v:49,ar:"نَبِّئ عِبادى أَنّى أَنَا الغَفورُ الرَّحيمُ",en:"[O Muhammad], inform My servants that it is I who am the Forgiving, the Merciful."},{v:50,ar:"وَأَنَّ عَذابى هُوَ العَذابُ الأَليمُ",en:"And that it is My punishment which is the painful punishment."}],
  16:[{v:61,ar:"وَلَو يُؤاخِذُ اللَّهُ النّاسَ بِظُلمِهِم ما تَرَكَ عَلَيها مِن دابَّةٍ وَلٰكِن يُؤَخِّرُهُم إِلىٰ أَجَلٍ مُسَمًّى فَإِذا جاءَ أَجَلُهُم لا يَستَـٔخِرونَ ساعَةً وَلا يَستَقدِمونَ",en:"And if Allah were to impose blame on the people for their wrongdoing, He would not have left upon the earth any creature, but He defers them for a specified term. And when their term has come, they will not remain behind an hour, nor will they precede [it]."},{v:62,ar:"وَيَجعَلونَ لِلَّهِ ما يَكرَهونَ وَتَصِفُ أَلسِنَتُهُمُ الكَذِبَ أَنَّ لَهُمُ الحُسنىٰ لا جَرَمَ أَنَّ لَهُمُ النّارَ وَأَنَّهُم مُفرَطونَ",en:"And they attribute to Allah that which they dislike, and their tongues assert the lie that they will have the best [from Him]. Assuredly, they will have the Fire, and they will be [therein] neglected."},{v:63,ar:"تَاللَّهِ لَقَد أَرسَلنا إِلىٰ أُمَمٍ مِن قَبلِكَ فَزَيَّنَ لَهُمُ الشَّيطٰنُ أَعمٰلَهُم فَهُوَ وَلِيُّهُمُ اليَومَ وَلَهُم عَذابٌ أَليمٌ",en:"By Allah, We did certainly send [messengers] to nations before you, but Satan made their deeds attractive to them. And he is the disbelievers' ally today [as well], and they will have a painful punishment."},{v:64,ar:"وَما أَنزَلنا عَلَيكَ الكِتٰبَ إِلّا لِتُبَيِّنَ لَهُمُ الَّذِى اختَلَفوا فيهِ وَهُدًى وَرَحمَةً لِقَومٍ يُؤمِنونَ",en:"And We have not revealed to you the Book, [O Muhammad], except for you to make clear to them that wherein they have differed and as guidance and mercy for a people who believe."},{v:65,ar:"وَاللَّهُ أَنزَلَ مِنَ السَّماءِ ماءً فَأَحيا بِهِ الأَرضَ بَعدَ مَوتِها إِنَّ فى ذٰلِكَ لَـٔايَةً لِقَومٍ يَسمَعونَ",en:"And Allah has sent down rain from the sky and given life thereby to the earth after its lifelessness. Indeed in that is a sign for a people who listen."},{v:66,ar:"وَإِنَّ لَكُم فِى الأَنعٰمِ لَعِبرَةً نُسقيكُم مِمّا فى بُطونِهِ مِن بَينِ فَرثٍ وَدَمٍ لَبَنًا خالِصًا سائِغًا لِلشّٰرِبينَ",en:"And indeed, for you in grazing livestock is a lesson. We give you drink from what is in their bellies - between excretion and blood - pure milk, palatable to drinkers."},{v:67,ar:"وَمِن ثَمَرٰتِ النَّخيلِ وَالأَعنٰبِ تَتَّخِذونَ مِنهُ سَكَرًا وَرِزقًا حَسَنًا إِنَّ فى ذٰلِكَ لَـٔايَةً لِقَومٍ يَعقِلونَ",en:"And from the fruits of the palm trees and grapevines you take intoxicant and good provision. Indeed in that is a sign for a people who reason."},{v:68,ar:"وَأَوحىٰ رَبُّكَ إِلَى النَّحلِ أَنِ اتَّخِذى مِنَ الجِبالِ بُيوتًا وَمِنَ الشَّجَرِ وَمِمّا يَعرِشونَ",en:"And your Lord inspired to the bee, \"Take for yourself among the mountains, houses, and among the trees and [in] that which they construct."},{v:69,ar:"ثُمَّ كُلى مِن كُلِّ الثَّمَرٰتِ فَاسلُكى سُبُلَ رَبِّكِ ذُلُلًا يَخرُجُ مِن بُطونِها شَرابٌ مُختَلِفٌ أَلوٰنُهُ فيهِ شِفاءٌ لِلنّاسِ إِنَّ فى ذٰلِكَ لَـٔايَةً لِقَومٍ يَتَفَكَّرونَ",en:"Then eat from all the fruits and follow the ways of your Lord laid down [for you].\" There emerges from their bellies a drink, varying in colors, in which there is healing for people. Indeed in that is a sign for a people who give thought."},{v:70,ar:"وَاللَّهُ خَلَقَكُم ثُمَّ يَتَوَفّىٰكُم وَمِنكُم مَن يُرَدُّ إِلىٰ أَرذَلِ العُمُرِ لِكَى لا يَعلَمَ بَعدَ عِلمٍ شَيـًٔا إِنَّ اللَّهَ عَليمٌ قَديرٌ",en:"And Allah created you; then He will take you in death. And among you is he who is reversed to the most decrepit [old] age so that he will not know, after [having had] knowledge, a thing. Indeed, Allah is Knowing and Competent."}],
  17:[{v:45,ar:"وَإِذا قَرَأتَ القُرءانَ جَعَلنا بَينَكَ وَبَينَ الَّذينَ لا يُؤمِنونَ بِالـٔاخِرَةِ حِجابًا مَستورًا",en:"And when you recite the Qur'an, We put between you and those who do not believe in the Hereafter a concealed partition."},{v:46,ar:"وَجَعَلنا عَلىٰ قُلوبِهِم أَكِنَّةً أَن يَفقَهوهُ وَفى ءاذانِهِم وَقرًا وَإِذا ذَكَرتَ رَبَّكَ فِى القُرءانِ وَحدَهُ وَلَّوا عَلىٰ أَدبٰرِهِم نُفورًا",en:"And We have placed over their hearts coverings, lest they understand it, and in their ears deafness. And when you mention your Lord alone in the Qur'an, they turn back in aversion."},{v:47,ar:"نَحنُ أَعلَمُ بِما يَستَمِعونَ بِهِ إِذ يَستَمِعونَ إِلَيكَ وَإِذ هُم نَجوىٰ إِذ يَقولُ الظّٰلِمونَ إِن تَتَّبِعونَ إِلّا رَجُلًا مَسحورًا",en:"We are most knowing of how they listen to it when they listen to you and [of] when they are in private conversation, when the wrongdoers say, \"You follow not but a man affected by magic.\""},{v:48,ar:"انظُر كَيفَ ضَرَبوا لَكَ الأَمثالَ فَضَلّوا فَلا يَستَطيعونَ سَبيلًا",en:"Look how they strike for you comparisons; but they have strayed, so they cannot [find] a way."},{v:49,ar:"وَقالوا أَءِذا كُنّا عِظٰمًا وَرُفٰتًا أَءِنّا لَمَبعوثونَ خَلقًا جَديدًا",en:"And they say, \"When we are bones and crumbled particles, will we [truly] be resurrected as a new creation?\""},{v:50,ar:"قُل كونوا حِجارَةً أَو حَديدًا",en:"Say, \"Be you stones or iron"},{v:51,ar:"أَو خَلقًا مِمّا يَكبُرُ فى صُدورِكُم فَسَيَقولونَ مَن يُعيدُنا قُلِ الَّذى فَطَرَكُم أَوَّلَ مَرَّةٍ فَسَيُنغِضونَ إِلَيكَ رُءوسَهُم وَيَقولونَ مَتىٰ هُوَ قُل عَسىٰ أَن يَكونَ قَريبًا",en:"Or [any] creation of that which is great within your breasts.\" And they will say, \"Who will restore us?\" Say, \"He who brought you forth the first time.\" Then they will nod their heads toward you and say, \"When is that?\" Say, \"Perhaps it will be soon -"},{v:52,ar:"يَومَ يَدعوكُم فَتَستَجيبونَ بِحَمدِهِ وَتَظُنّونَ إِن لَبِثتُم إِلّا قَليلًا",en:"On the Day He will call you and you will respond with praise of Him and think that you had not remained [in the world] except for a little.\""}],
  18:[{v:54,ar:"وَلَقَد صَرَّفنا فى هٰذَا القُرءانِ لِلنّاسِ مِن كُلِّ مَثَلٍ وَكانَ الإِنسٰنُ أَكثَرَ شَىءٍ جَدَلًا",en:"And We have certainly diversified in this Qur'an for the people from every [kind of] example; but man has ever been, most of anything, [prone to] dispute."}],
  19:[{v:51,ar:"وَاذكُر فِى الكِتٰبِ موسىٰ إِنَّهُ كانَ مُخلَصًا وَكانَ رَسولًا نَبِيًّا",en:"And mention in the Book, Moses. Indeed, he was chosen, and he was a messenger and a prophet."},{v:52,ar:"وَنٰدَينٰهُ مِن جانِبِ الطّورِ الأَيمَنِ وَقَرَّبنٰهُ نَجِيًّا",en:"And We called him from the side of the mount at [his] right and brought him near, confiding [to him]."},{v:53,ar:"وَوَهَبنا لَهُ مِن رَحمَتِنا أَخاهُ هٰرونَ نَبِيًّا",en:"And We gave him out of Our mercy his brother Aaron as a prophet."},{v:54,ar:"وَاذكُر فِى الكِتٰبِ إِسمٰعيلَ إِنَّهُ كانَ صادِقَ الوَعدِ وَكانَ رَسولًا نَبِيًّا",en:"And mention in the Book, Ishmael. Indeed, he was true to his promise, and he was a messenger and a prophet."},{v:55,ar:"وَكانَ يَأمُرُ أَهلَهُ بِالصَّلوٰةِ وَالزَّكوٰةِ وَكانَ عِندَ رَبِّهِ مَرضِيًّا",en:"And he used to enjoin on his people prayer and zakah and was to his Lord pleasing."},{v:56,ar:"وَاذكُر فِى الكِتٰبِ إِدريسَ إِنَّهُ كانَ صِدّيقًا نَبِيًّا",en:"And mention in the Book, Idrees. Indeed, he was a man of truth and a prophet."},{v:57,ar:"وَرَفَعنٰهُ مَكانًا عَلِيًّا",en:"And We raised him to a high station."},{v:58,ar:"أُولٰئِكَ الَّذينَ أَنعَمَ اللَّهُ عَلَيهِم مِنَ النَّبِيّـۧنَ مِن ذُرِّيَّةِ ءادَمَ وَمِمَّن حَمَلنا مَعَ نوحٍ وَمِن ذُرِّيَّةِ إِبرٰهيمَ وَإِسرٰءيلَ وَمِمَّن هَدَينا وَاجتَبَينا إِذا تُتلىٰ عَلَيهِم ءايٰتُ الرَّحمٰنِ خَرّوا سُجَّدًا وَبُكِيًّا",en:"Those were the ones upon whom Allah bestowed favor from among the prophets of the descendants of Adam and of those We carried [in the ship] with Noah, and of the descendants of Abraham and Israel, and of those whom We guided and chose. When the verses of the Most Merciful were recited to them, they fell in prostration and weeping."}],
  20:[{v:83,ar:"وَما أَعجَلَكَ عَن قَومِكَ يٰموسىٰ",en:"[Allah] said, \"And what made you hasten from your people, O Moses?\""},{v:84,ar:"قالَ هُم أُولاءِ عَلىٰ أَثَرى وَعَجِلتُ إِلَيكَ رَبِّ لِتَرضىٰ",en:"He said, \"They are close upon my tracks, and I hastened to You, my Lord, that You be pleased.\""},{v:85,ar:"قالَ فَإِنّا قَد فَتَنّا قَومَكَ مِن بَعدِكَ وَأَضَلَّهُمُ السّامِرِىُّ",en:"[Allah] said, \"But indeed, We have tried your people after you [departed], and the Samiri has led them astray.\""},{v:86,ar:"فَرَجَعَ موسىٰ إِلىٰ قَومِهِ غَضبٰنَ أَسِفًا قالَ يٰقَومِ أَلَم يَعِدكُم رَبُّكُم وَعدًا حَسَنًا أَفَطالَ عَلَيكُمُ العَهدُ أَم أَرَدتُم أَن يَحِلَّ عَلَيكُم غَضَبٌ مِن رَبِّكُم فَأَخلَفتُم مَوعِدى",en:"So Moses returned to his people, angry and grieved. He said, \"O my people, did your Lord not make you a good promise? Then, was the time [of its fulfillment] too long for you, or did you wish that wrath from your Lord descend upon you, so you broke your promise [of obedience] to me?\""},{v:87,ar:"قالوا ما أَخلَفنا مَوعِدَكَ بِمَلكِنا وَلٰكِنّا حُمِّلنا أَوزارًا مِن زينَةِ القَومِ فَقَذَفنٰها فَكَذٰلِكَ أَلقَى السّامِرِىُّ",en:"They said, \"We did not break our promise to you by our will, but we were made to carry burdens from the ornaments of the people [of Pharaoh], so we threw them [into the fire], and thus did the Samiri throw.\""},{v:88,ar:"فَأَخرَجَ لَهُم عِجلًا جَسَدًا لَهُ خُوارٌ فَقالوا هٰذا إِلٰهُكُم وَإِلٰهُ موسىٰ فَنَسِىَ",en:"And he extracted for them [the statue of] a calf which had a lowing sound, and they said, \"This is your god and the god of Moses, but he forgot.\""},{v:89,ar:"أَفَلا يَرَونَ أَلّا يَرجِعُ إِلَيهِم قَولًا وَلا يَملِكُ لَهُم ضَرًّا وَلا نَفعًا",en:"Did they not see that it could not return to them any speech and that it did not possess for them any harm or benefit?"},{v:90,ar:"وَلَقَد قالَ لَهُم هٰرونُ مِن قَبلُ يٰقَومِ إِنَّما فُتِنتُم بِهِ وَإِنَّ رَبَّكُمُ الرَّحمٰنُ فَاتَّبِعونى وَأَطيعوا أَمرى",en:"And Aaron had already told them before [the return of Moses], \"O my people, you are only being tested by it, and indeed, your Lord is the Most Merciful, so follow me and obey my order.\""},{v:91,ar:"قالوا لَن نَبرَحَ عَلَيهِ عٰكِفينَ حَتّىٰ يَرجِعَ إِلَينا موسىٰ",en:"They said, \"We will never cease being devoted to the calf until Moses returns to us.\""},{v:92,ar:"قالَ يٰهٰرونُ ما مَنَعَكَ إِذ رَأَيتَهُم ضَلّوا",en:"[Moses] said, \"O Aaron, what prevented you, when you saw them going astray,"},{v:93,ar:"أَلّا تَتَّبِعَنِ أَفَعَصَيتَ أَمرى",en:"From following me? Then have you disobeyed my order?\""},{v:94,ar:"قالَ يَبنَؤُمَّ لا تَأخُذ بِلِحيَتى وَلا بِرَأسى إِنّى خَشيتُ أَن تَقولَ فَرَّقتَ بَينَ بَنى إِسرٰءيلَ وَلَم تَرقُب قَولى",en:"[Aaron] said, \"O son of my mother, do not seize [me] by my beard or by my head. Indeed, I feared that you would say, 'You caused division among the Children of Israel, and you did not observe [or await] my word.' \""},{v:95,ar:"قالَ فَما خَطبُكَ يٰسٰمِرِىُّ",en:"[Moses] said, \"And what is your case, O Samiri?\""},{v:96,ar:"قالَ بَصُرتُ بِما لَم يَبصُروا بِهِ فَقَبَضتُ قَبضَةً مِن أَثَرِ الرَّسولِ فَنَبَذتُها وَكَذٰلِكَ سَوَّلَت لى نَفسى",en:"He said, \"I saw what they did not see, so I took a handful [of dust] from the track of the messenger and threw it, and thus did my soul entice me.\""},{v:97,ar:"قالَ فَاذهَب فَإِنَّ لَكَ فِى الحَيوٰةِ أَن تَقولَ لا مِساسَ وَإِنَّ لَكَ مَوعِدًا لَن تُخلَفَهُ وَانظُر إِلىٰ إِلٰهِكَ الَّذى ظَلتَ عَلَيهِ عاكِفًا لَنُحَرِّقَنَّهُ ثُمَّ لَنَنسِفَنَّهُ فِى اليَمِّ نَسفًا",en:"[Moses] said, \"Then go. And indeed, it is [decreed] for you in [this] life to say, 'No contact.' And indeed, you have an appointment [in the Hereafter] you will not fail to keep. And look at your 'god' to which you remained devoted. We will surely burn it and blow it into the sea with a blast."},{v:98,ar:"إِنَّما إِلٰهُكُمُ اللَّهُ الَّذى لا إِلٰهَ إِلّا هُوَ وَسِعَ كُلَّ شَىءٍ عِلمًا",en:"Your god is only Allah, except for whom there is no deity. He has encompassed all things in knowledge.\""}],
  21:[{v:51,ar:"وَلَقَد ءاتَينا إِبرٰهيمَ رُشدَهُ مِن قَبلُ وَكُنّا بِهِ عٰلِمينَ",en:"And We had certainly given Abraham his sound judgement before, and We were of him well-Knowing"},{v:52,ar:"إِذ قالَ لِأَبيهِ وَقَومِهِ ما هٰذِهِ التَّماثيلُ الَّتى أَنتُم لَها عٰكِفونَ",en:"When he said to his father and his people, \"What are these statues to which you are devoted?\""},{v:53,ar:"قالوا وَجَدنا ءاباءَنا لَها عٰبِدينَ",en:"They said, \"We found our fathers worshippers of them.\""},{v:54,ar:"قالَ لَقَد كُنتُم أَنتُم وَءاباؤُكُم فى ضَلٰلٍ مُبينٍ",en:"He said, \"You were certainly, you and your fathers, in manifest error.\""},{v:55,ar:"قالوا أَجِئتَنا بِالحَقِّ أَم أَنتَ مِنَ اللّٰعِبينَ",en:"They said, \"Have you come to us with truth, or are you of those who jest?\""},{v:56,ar:"قالَ بَل رَبُّكُم رَبُّ السَّمٰوٰتِ وَالأَرضِ الَّذى فَطَرَهُنَّ وَأَنا۠ عَلىٰ ذٰلِكُم مِنَ الشّٰهِدينَ",en:"He said, \"[No], rather, your Lord is the Lord of the heavens and the earth who created them, and I, to that, am of those who testify."},{v:57,ar:"وَتَاللَّهِ لَأَكيدَنَّ أَصنٰمَكُم بَعدَ أَن تُوَلّوا مُدبِرينَ",en:"And [I swear] by Allah, I will surely plan against your idols after you have turned and gone away.\""},{v:58,ar:"فَجَعَلَهُم جُذٰذًا إِلّا كَبيرًا لَهُم لَعَلَّهُم إِلَيهِ يَرجِعونَ",en:"So he made them into fragments, except a large one among them, that they might return to it [and question]."},{v:59,ar:"قالوا مَن فَعَلَ هٰذا بِـٔالِهَتِنا إِنَّهُ لَمِنَ الظّٰلِمينَ",en:"They said, \"Who has done this to our gods? Indeed, he is of the wrongdoers.\""},{v:60,ar:"قالوا سَمِعنا فَتًى يَذكُرُهُم يُقالُ لَهُ إِبرٰهيمُ",en:"They said, \"We heard a young man mention them who is called Abraham.\""},{v:61,ar:"قالوا فَأتوا بِهِ عَلىٰ أَعيُنِ النّاسِ لَعَلَّهُم يَشهَدونَ",en:"They said, \"Then bring him before the eyes of the people that they may testify.\""},{v:62,ar:"قالوا ءَأَنتَ فَعَلتَ هٰذا بِـٔالِهَتِنا يٰإِبرٰهيمُ",en:"They said, \"Have you done this to our gods, O Abraham?\""},{v:63,ar:"قالَ بَل فَعَلَهُ كَبيرُهُم هٰذا فَسـَٔلوهُم إِن كانوا يَنطِقونَ",en:"He said, \"Rather, this - the largest of them - did it, so ask them, if they should [be able to] speak.\""},{v:64,ar:"فَرَجَعوا إِلىٰ أَنفُسِهِم فَقالوا إِنَّكُم أَنتُمُ الظّٰلِمونَ",en:"So they returned to [blaming] themselves and said [to each other], \"Indeed, you are the wrongdoers.\""},{v:65,ar:"ثُمَّ نُكِسوا عَلىٰ رُءوسِهِم لَقَد عَلِمتَ ما هٰؤُلاءِ يَنطِقونَ",en:"Then they reversed themselves, [saying], \"You have already known that these do not speak!\""},{v:66,ar:"قالَ أَفَتَعبُدونَ مِن دونِ اللَّهِ ما لا يَنفَعُكُم شَيـًٔا وَلا يَضُرُّكُم",en:"He said, \"Then do you worship instead of Allah that which does not benefit you at all or harm you?"},{v:67,ar:"أُفٍّ لَكُم وَلِما تَعبُدونَ مِن دونِ اللَّهِ أَفَلا تَعقِلونَ",en:"Uff to you and to what you worship instead of Allah. Then will you not use reason?\""},{v:68,ar:"قالوا حَرِّقوهُ وَانصُروا ءالِهَتَكُم إِن كُنتُم فٰعِلينَ",en:"They said, \"Burn him and support your gods - if you are to act.\""},{v:69,ar:"قُلنا يٰنارُ كونى بَردًا وَسَلٰمًا عَلىٰ إِبرٰهيمَ",en:"Allah said, \"O fire, be coolness and safety upon Abraham.\""},{v:70,ar:"وَأَرادوا بِهِ كَيدًا فَجَعَلنٰهُمُ الأَخسَرينَ",en:"And they intended for him harm, but We made them the greatest losers."},{v:71,ar:"وَنَجَّينٰهُ وَلوطًا إِلَى الأَرضِ الَّتى بٰرَكنا فيها لِلعٰلَمينَ",en:"And We delivered him and Lot to the land which We had blessed for the worlds."},{v:72,ar:"وَوَهَبنا لَهُ إِسحٰقَ وَيَعقوبَ نافِلَةً وَكُلًّا جَعَلنا صٰلِحينَ",en:"And We gave him Isaac and Jacob in addition, and all [of them] We made righteous."},{v:73,ar:"وَجَعَلنٰهُم أَئِمَّةً يَهدونَ بِأَمرِنا وَأَوحَينا إِلَيهِم فِعلَ الخَيرٰتِ وَإِقامَ الصَّلوٰةِ وَإيتاءَ الزَّكوٰةِ وَكانوا لَنا عٰبِدينَ",en:"And We made them leaders guiding by Our command. And We inspired to them the doing of good deeds, establishment of prayer, and giving of zakah; and they were worshippers of Us."}],
  22:[{v:38,ar:"إِنَّ اللَّهَ يُدٰفِعُ عَنِ الَّذينَ ءامَنوا إِنَّ اللَّهَ لا يُحِبُّ كُلَّ خَوّانٍ كَفورٍ",en:"Indeed, Allah defends those who have believed. Indeed, Allah does not like everyone treacherous and ungrateful."},{v:39,ar:"أُذِنَ لِلَّذينَ يُقٰتَلونَ بِأَنَّهُم ظُلِموا وَإِنَّ اللَّهَ عَلىٰ نَصرِهِم لَقَديرٌ",en:"Permission [to fight] has been given to those who are being fought, because they were wronged. And indeed, Allah is competent to give them victory."},{v:40,ar:"الَّذينَ أُخرِجوا مِن دِيٰرِهِم بِغَيرِ حَقٍّ إِلّا أَن يَقولوا رَبُّنَا اللَّهُ وَلَولا دَفعُ اللَّهِ النّاسَ بَعضَهُم بِبَعضٍ لَهُدِّمَت صَوٰمِعُ وَبِيَعٌ وَصَلَوٰتٌ وَمَسٰجِدُ يُذكَرُ فيهَا اسمُ اللَّهِ كَثيرًا وَلَيَنصُرَنَّ اللَّهُ مَن يَنصُرُهُ إِنَّ اللَّهَ لَقَوِىٌّ عَزيزٌ",en:"[They are] those who have been evicted from their homes without right - only because they say, \"Our Lord is Allah.\" And were it not that Allah checks the people, some by means of others, there would have been demolished monasteries, churches, synagogues, and mosques in which the name of Allah is much mentioned. And Allah will surely support those who support Him. Indeed, Allah is Powerful and Exalted in Might."},{v:41,ar:"الَّذينَ إِن مَكَّنّٰهُم فِى الأَرضِ أَقامُوا الصَّلوٰةَ وَءاتَوُا الزَّكوٰةَ وَأَمَروا بِالمَعروفِ وَنَهَوا عَنِ المُنكَرِ وَلِلَّهِ عٰقِبَةُ الأُمورِ",en:"[And they are] those who, if We give them authority in the land, establish prayer and give zakah and enjoin what is right and forbid what is wrong. And to Allah belongs the outcome of [all] matters."}],
  23:[{v:57,ar:"إِنَّ الَّذينَ هُم مِن خَشيَةِ رَبِّهِم مُشفِقونَ",en:"Indeed, they who are apprehensive from fear of their Lord"},{v:58,ar:"وَالَّذينَ هُم بِـٔايٰتِ رَبِّهِم يُؤمِنونَ",en:"And they who believe in the signs of their Lord"},{v:59,ar:"وَالَّذينَ هُم بِرَبِّهِم لا يُشرِكونَ",en:"And they who do not associate anything with their Lord"},{v:60,ar:"وَالَّذينَ يُؤتونَ ما ءاتَوا وَقُلوبُهُم وَجِلَةٌ أَنَّهُم إِلىٰ رَبِّهِم رٰجِعونَ",en:"And they who give what they give while their hearts are fearful because they will be returning to their Lord -"},{v:61,ar:"أُولٰئِكَ يُسٰرِعونَ فِى الخَيرٰتِ وَهُم لَها سٰبِقونَ",en:"It is those who hasten to good deeds, and they outstrip [others] therein."}],
  24:[{v:35,ar:"اللَّهُ نورُ السَّمٰوٰتِ وَالأَرضِ مَثَلُ نورِهِ كَمِشكوٰةٍ فيها مِصباحٌ المِصباحُ فى زُجاجَةٍ الزُّجاجَةُ كَأَنَّها كَوكَبٌ دُرِّىٌّ يوقَدُ مِن شَجَرَةٍ مُبٰرَكَةٍ زَيتونَةٍ لا شَرقِيَّةٍ وَلا غَربِيَّةٍ يَكادُ زَيتُها يُضىءُ وَلَو لَم تَمسَسهُ نارٌ نورٌ عَلىٰ نورٍ يَهدِى اللَّهُ لِنورِهِ مَن يَشاءُ وَيَضرِبُ اللَّهُ الأَمثٰلَ لِلنّاسِ وَاللَّهُ بِكُلِّ شَىءٍ عَليمٌ",en:"Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp, the lamp is within glass, the glass as if it were a pearly [white] star lit from [the oil of] a blessed olive tree, neither of the east nor of the west, whose oil would almost glow even if untouched by fire. Light upon light. Allah guides to His light whom He wills. And Allah presents examples for the people, and Allah is Knowing of all things."},{v:36,ar:"فى بُيوتٍ أَذِنَ اللَّهُ أَن تُرفَعَ وَيُذكَرَ فيهَا اسمُهُ يُسَبِّحُ لَهُ فيها بِالغُدُوِّ وَالـٔاصالِ",en:"[Such niches are] in mosques which Allah has ordered to be raised and that His name be mentioned therein; exalting Him within them in the morning and the evenings"},{v:37,ar:"رِجالٌ لا تُلهيهِم تِجٰرَةٌ وَلا بَيعٌ عَن ذِكرِ اللَّهِ وَإِقامِ الصَّلوٰةِ وَإيتاءِ الزَّكوٰةِ يَخافونَ يَومًا تَتَقَلَّبُ فيهِ القُلوبُ وَالأَبصٰرُ",en:"[Are] men whom neither commerce nor sale distracts from the remembrance of Allah and performance of prayer and giving of zakah. They fear a Day in which the hearts and eyes will [fearfully] turn about -"},{v:38,ar:"لِيَجزِيَهُمُ اللَّهُ أَحسَنَ ما عَمِلوا وَيَزيدَهُم مِن فَضلِهِ وَاللَّهُ يَرزُقُ مَن يَشاءُ بِغَيرِ حِسابٍ",en:"That Allah may reward them [according to] the best of what they did and increase them from His bounty. And Allah gives provision to whom He wills without account."},{v:39,ar:"وَالَّذينَ كَفَروا أَعمٰلُهُم كَسَرابٍ بِقيعَةٍ يَحسَبُهُ الظَّمـٔانُ ماءً حَتّىٰ إِذا جاءَهُ لَم يَجِدهُ شَيـًٔا وَوَجَدَ اللَّهَ عِندَهُ فَوَفّىٰهُ حِسابَهُ وَاللَّهُ سَريعُ الحِسابِ",en:"But those who disbelieved - their deeds are like a mirage in a lowland which a thirsty one thinks is water until, when he comes to it, he finds it is nothing but finds Allah before Him, and He will pay him in full his due; and Allah is swift in account."},{v:40,ar:"أَو كَظُلُمٰتٍ فى بَحرٍ لُجِّىٍّ يَغشىٰهُ مَوجٌ مِن فَوقِهِ مَوجٌ مِن فَوقِهِ سَحابٌ ظُلُمٰتٌ بَعضُها فَوقَ بَعضٍ إِذا أَخرَجَ يَدَهُ لَم يَكَد يَرىٰها وَمَن لَم يَجعَلِ اللَّهُ لَهُ نورًا فَما لَهُ مِن نورٍ",en:"Or [they are] like darknesses within an unfathomable sea which is covered by waves, upon which are waves, over which are clouds - darknesses, some of them upon others. When one puts out his hand [therein], he can hardly see it. And he to whom Allah has not granted light - for him there is no light."}],
  25:[{v:35,ar:"وَلَقَد ءاتَينا موسَى الكِتٰبَ وَجَعَلنا مَعَهُ أَخاهُ هٰرونَ وَزيرًا",en:"And We had certainly given Moses the Scripture and appointed with him his brother Aaron as an assistant."},{v:36,ar:"فَقُلنَا اذهَبا إِلَى القَومِ الَّذينَ كَذَّبوا بِـٔايٰتِنا فَدَمَّرنٰهُم تَدميرًا",en:"And We said, \"Go both of you to the people who have denied Our signs.\" Then We destroyed them with [complete] destruction."},{v:37,ar:"وَقَومَ نوحٍ لَمّا كَذَّبُوا الرُّسُلَ أَغرَقنٰهُم وَجَعَلنٰهُم لِلنّاسِ ءايَةً وَأَعتَدنا لِلظّٰلِمينَ عَذابًا أَليمًا",en:"And the people of Noah - when they denied the messengers, We drowned them, and We made them for mankind a sign. And We have prepared for the wrongdoers a painful punishment."},{v:38,ar:"وَعادًا وَثَمودَا۟ وَأَصحٰبَ الرَّسِّ وَقُرونًا بَينَ ذٰلِكَ كَثيرًا",en:"And [We destroyed] 'Aad and Thamud and the companions of the well and many generations between them."},{v:39,ar:"وَكُلًّا ضَرَبنا لَهُ الأَمثٰلَ وَكُلًّا تَبَّرنا تَتبيرًا",en:"And for each We presented examples [as warnings], and each We destroyed with [total] destruction."},{v:40,ar:"وَلَقَد أَتَوا عَلَى القَريَةِ الَّتى أُمطِرَت مَطَرَ السَّوءِ أَفَلَم يَكونوا يَرَونَها بَل كانوا لا يَرجونَ نُشورًا",en:"And they have already come upon the town which was showered with a rain of evil. So have they not seen it? But they are not expecting resurrection."},{v:41,ar:"وَإِذا رَأَوكَ إِن يَتَّخِذونَكَ إِلّا هُزُوًا أَهٰذَا الَّذى بَعَثَ اللَّهُ رَسولًا",en:"And when they see you, [O Muhammad], they take you not except in ridicule, [saying], \"Is this the one whom Allah has sent as a messenger?"},{v:42,ar:"إِن كادَ لَيُضِلُّنا عَن ءالِهَتِنا لَولا أَن صَبَرنا عَلَيها وَسَوفَ يَعلَمونَ حينَ يَرَونَ العَذابَ مَن أَضَلُّ سَبيلًا",en:"He almost would have misled us from our gods had we not been steadfast in [worship of] them.\" But they are going to know, when they see the punishment, who is farthest astray in [his] way."},{v:43,ar:"أَرَءَيتَ مَنِ اتَّخَذَ إِلٰهَهُ هَوىٰهُ أَفَأَنتَ تَكونُ عَلَيهِ وَكيلًا",en:"Have you seen the one who takes as his god his own desire? Then would you be responsible for him?"},{v:44,ar:"أَم تَحسَبُ أَنَّ أَكثَرَهُم يَسمَعونَ أَو يَعقِلونَ إِن هُم إِلّا كَالأَنعٰمِ بَل هُم أَضَلُّ سَبيلًا",en:"Or do you think that most of them hear or reason? They are not except like livestock. Rather, they are [even] more astray in [their] way."}],
  26:[{v:105,ar:"كَذَّبَت قَومُ نوحٍ المُرسَلينَ",en:"The people of Noah denied the messengers"},{v:106,ar:"إِذ قالَ لَهُم أَخوهُم نوحٌ أَلا تَتَّقونَ",en:"When their brother Noah said to them, \"Will you not fear Allah?"},{v:107,ar:"إِنّى لَكُم رَسولٌ أَمينٌ",en:"Indeed, I am to you a trustworthy messenger."},{v:108,ar:"فَاتَّقُوا اللَّهَ وَأَطيعونِ",en:"So fear Allah and obey me."},{v:109,ar:"وَما أَسـَٔلُكُم عَلَيهِ مِن أَجرٍ إِن أَجرِىَ إِلّا عَلىٰ رَبِّ العٰلَمينَ",en:"And I do not ask you for it any payment. My payment is only from the Lord of the worlds."},{v:110,ar:"فَاتَّقُوا اللَّهَ وَأَطيعونِ",en:"So fear Allah and obey me.\""},{v:111,ar:"قالوا أَنُؤمِنُ لَكَ وَاتَّبَعَكَ الأَرذَلونَ",en:"They said, \"Should we believe you while you are followed by the lowest [class of people]?\""},{v:112,ar:"قالَ وَما عِلمى بِما كانوا يَعمَلونَ",en:"He said, \"And what is my knowledge of what they used to do?"},{v:113,ar:"إِن حِسابُهُم إِلّا عَلىٰ رَبّى لَو تَشعُرونَ",en:"Their account is only upon my Lord, if you [could] perceive."},{v:114,ar:"وَما أَنا۠ بِطارِدِ المُؤمِنينَ",en:"And I am not one to drive away the believers."},{v:115,ar:"إِن أَنا۠ إِلّا نَذيرٌ مُبينٌ",en:"I am only a clear warner.\""},{v:116,ar:"قالوا لَئِن لَم تَنتَهِ يٰنوحُ لَتَكونَنَّ مِنَ المَرجومينَ",en:"They said, \"If you do not desist, O Noah, you will surely be of those who are stoned.\""},{v:117,ar:"قالَ رَبِّ إِنَّ قَومى كَذَّبونِ",en:"He said, \"My Lord, indeed my people have denied me."},{v:118,ar:"فَافتَح بَينى وَبَينَهُم فَتحًا وَنَجِّنى وَمَن مَعِىَ مِنَ المُؤمِنينَ",en:"Then judge between me and them with decisive judgement and save me and those with me of the believers.\""},{v:119,ar:"فَأَنجَينٰهُ وَمَن مَعَهُ فِى الفُلكِ المَشحونِ",en:"So We saved him and those with him in the laden ship."},{v:120,ar:"ثُمَّ أَغرَقنا بَعدُ الباقينَ",en:"Then We drowned thereafter the remaining ones."},{v:121,ar:"إِنَّ فى ذٰلِكَ لَـٔايَةً وَما كانَ أَكثَرُهُم مُؤمِنينَ",en:"Indeed in that is a sign, but most of them were not to be believers."},{v:122,ar:"وَإِنَّ رَبَّكَ لَهُوَ العَزيزُ الرَّحيمُ",en:"And indeed, your Lord - He is the Exalted in Might, the Merciful."}],
  27:[{v:45,ar:"وَلَقَد أَرسَلنا إِلىٰ ثَمودَ أَخاهُم صٰلِحًا أَنِ اعبُدُوا اللَّهَ فَإِذا هُم فَريقانِ يَختَصِمونَ",en:"And We had certainly sent to Thamud their brother Salih, [saying], \"Worship Allah,\" and at once they were two parties conflicting."},{v:46,ar:"قالَ يٰقَومِ لِمَ تَستَعجِلونَ بِالسَّيِّئَةِ قَبلَ الحَسَنَةِ لَولا تَستَغفِرونَ اللَّهَ لَعَلَّكُم تُرحَمونَ",en:"He said, \"O my people, why are you impatient for evil instead of good? Why do you not seek forgiveness of Allah that you may receive mercy?\""},{v:47,ar:"قالُوا اطَّيَّرنا بِكَ وَبِمَن مَعَكَ قالَ طٰئِرُكُم عِندَ اللَّهِ بَل أَنتُم قَومٌ تُفتَنونَ",en:"They said, \"We consider you a bad omen, you and those with you.\" He said, \"Your omen is with Allah. Rather, you are a people being tested.\""},{v:48,ar:"وَكانَ فِى المَدينَةِ تِسعَةُ رَهطٍ يُفسِدونَ فِى الأَرضِ وَلا يُصلِحونَ",en:"And there were in the city nine family heads causing corruption in the land and not amending [its affairs]."},{v:49,ar:"قالوا تَقاسَموا بِاللَّهِ لَنُبَيِّتَنَّهُ وَأَهلَهُ ثُمَّ لَنَقولَنَّ لِوَلِيِّهِ ما شَهِدنا مَهلِكَ أَهلِهِ وَإِنّا لَصٰدِقونَ",en:"They said, \"Take a mutual oath by Allah that we will kill him by night, he and his family. Then we will say to his executor, 'We did not witness the destruction of his family, and indeed, we are truthful.' \""},{v:50,ar:"وَمَكَروا مَكرًا وَمَكَرنا مَكرًا وَهُم لا يَشعُرونَ",en:"And they planned a plan, and We planned a plan, while they perceived not."},{v:51,ar:"فَانظُر كَيفَ كانَ عٰقِبَةُ مَكرِهِم أَنّا دَمَّرنٰهُم وَقَومَهُم أَجمَعينَ",en:"Then look how was the outcome of their plan - that We destroyed them and their people, all."},{v:52,ar:"فَتِلكَ بُيوتُهُم خاوِيَةً بِما ظَلَموا إِنَّ فى ذٰلِكَ لَـٔايَةً لِقَومٍ يَعلَمونَ",en:"So those are their houses, desolate because of the wrong they had done. Indeed in that is a sign for people who know."},{v:53,ar:"وَأَنجَينَا الَّذينَ ءامَنوا وَكانوا يَتَّقونَ",en:"And We saved those who believed and used to fear Allah."},{v:54,ar:"وَلوطًا إِذ قالَ لِقَومِهِ أَتَأتونَ الفٰحِشَةَ وَأَنتُم تُبصِرونَ",en:"And [mention] Lot, when he said to his people, \"Do you commit immorality while you are seeing?"},{v:55,ar:"أَئِنَّكُم لَتَأتونَ الرِّجالَ شَهوَةً مِن دونِ النِّساءِ بَل أَنتُم قَومٌ تَجهَلونَ",en:"Do you indeed approach men with desire instead of women? Rather, you are a people behaving ignorantly.\""},{v:56,ar:"فَما كانَ جَوابَ قَومِهِ إِلّا أَن قالوا أَخرِجوا ءالَ لوطٍ مِن قَريَتِكُم إِنَّهُم أُناسٌ يَتَطَهَّرونَ",en:"But the answer of his people was not except that they said, \"Expel the family of Lot from your city. Indeed, they are people who keep themselves pure.\""},{v:57,ar:"فَأَنجَينٰهُ وَأَهلَهُ إِلَّا امرَأَتَهُ قَدَّرنٰها مِنَ الغٰبِرينَ",en:"So We saved him and his family, except for his wife; We destined her to be of those who remained behind."},{v:58,ar:"وَأَمطَرنا عَلَيهِم مَطَرًا فَساءَ مَطَرُ المُنذَرينَ",en:"And We rained upon them a rain [of stones], and evil was the rain of those who were warned."}],
  28:[{v:44,ar:"وَما كُنتَ بِجانِبِ الغَربِىِّ إِذ قَضَينا إِلىٰ موسَى الأَمرَ وَما كُنتَ مِنَ الشّٰهِدينَ",en:"And you, [O Muhammad], were not on the western side [of the mount] when We revealed to Moses the command, and you were not among the witnesses [to that]."},{v:45,ar:"وَلٰكِنّا أَنشَأنا قُرونًا فَتَطاوَلَ عَلَيهِمُ العُمُرُ وَما كُنتَ ثاوِيًا فى أَهلِ مَديَنَ تَتلوا عَلَيهِم ءايٰتِنا وَلٰكِنّا كُنّا مُرسِلينَ",en:"But We produced [many] generations [after Moses], and prolonged was their duration. And you were not a resident among the people of Madyan, reciting to them Our verses, but We were senders [of this message]."},{v:46,ar:"وَما كُنتَ بِجانِبِ الطّورِ إِذ نادَينا وَلٰكِن رَحمَةً مِن رَبِّكَ لِتُنذِرَ قَومًا ما أَتىٰهُم مِن نَذيرٍ مِن قَبلِكَ لَعَلَّهُم يَتَذَكَّرونَ",en:"And you were not at the side of the mount when We called [Moses] but [were sent] as a mercy from your Lord to warn a people to whom no warner had come before you that they might be reminded."}],
  29:[{v:36,ar:"وَإِلىٰ مَديَنَ أَخاهُم شُعَيبًا فَقالَ يٰقَومِ اعبُدُوا اللَّهَ وَارجُوا اليَومَ الـٔاخِرَ وَلا تَعثَوا فِى الأَرضِ مُفسِدينَ",en:"And to Madyan [We sent] their brother Shu'ayb, and he said, \"O my people, worship Allah and expect the Last Day and do not commit abuse on the earth, spreading corruption.\""},{v:37,ar:"فَكَذَّبوهُ فَأَخَذَتهُمُ الرَّجفَةُ فَأَصبَحوا فى دارِهِم جٰثِمينَ",en:"But they denied him, so the earthquake seized them, and they became within their home [corpses] fallen prone."},{v:38,ar:"وَعادًا وَثَمودَا۟ وَقَد تَبَيَّنَ لَكُم مِن مَسٰكِنِهِم وَزَيَّنَ لَهُمُ الشَّيطٰنُ أَعمٰلَهُم فَصَدَّهُم عَنِ السَّبيلِ وَكانوا مُستَبصِرينَ",en:"And [We destroyed] 'Aad and Thamud, and it has become clear to you from their [ruined] dwellings. And Satan had made pleasing to them their deeds and averted them from the path, and they were endowed with perception."},{v:39,ar:"وَقٰرونَ وَفِرعَونَ وَهٰمٰنَ وَلَقَد جاءَهُم موسىٰ بِالبَيِّنٰتِ فَاستَكبَروا فِى الأَرضِ وَما كانوا سٰبِقينَ",en:"And [We destroyed] Qarun and Pharaoh and Haman. And Moses had already come to them with clear evidences, and they were arrogant in the land, but they were not outrunners [of Our punishment]."},{v:40,ar:"فَكُلًّا أَخَذنا بِذَنبِهِ فَمِنهُم مَن أَرسَلنا عَلَيهِ حاصِبًا وَمِنهُم مَن أَخَذَتهُ الصَّيحَةُ وَمِنهُم مَن خَسَفنا بِهِ الأَرضَ وَمِنهُم مَن أَغرَقنا وَما كانَ اللَّهُ لِيَظلِمَهُم وَلٰكِن كانوا أَنفُسَهُم يَظلِمونَ",en:"So each We seized for his sin; and among them were those upon whom We sent a storm of stones, and among them were those who were seized by the blast [from the sky], and among them were those whom We caused the earth to swallow, and among them were those whom We drowned. And Allah would not have wronged them, but it was they who were wronging themselves."},{v:41,ar:"مَثَلُ الَّذينَ اتَّخَذوا مِن دونِ اللَّهِ أَولِياءَ كَمَثَلِ العَنكَبوتِ اتَّخَذَت بَيتًا وَإِنَّ أَوهَنَ البُيوتِ لَبَيتُ العَنكَبوتِ لَو كانوا يَعلَمونَ",en:"The example of those who take allies other than Allah is like that of the spider who takes a home. And indeed, the weakest of homes is the home of the spider, if they only knew."},{v:42,ar:"إِنَّ اللَّهَ يَعلَمُ ما يَدعونَ مِن دونِهِ مِن شَىءٍ وَهُوَ العَزيزُ الحَكيمُ",en:"Indeed, Allah knows whatever thing they call upon other than Him. And He is the Exalted in Might, the Wise."},{v:43,ar:"وَتِلكَ الأَمثٰلُ نَضرِبُها لِلنّاسِ وَما يَعقِلُها إِلَّا العٰلِمونَ",en:"And these examples We present to the people, but none will understand them except those of knowledge."},{v:44,ar:"خَلَقَ اللَّهُ السَّمٰوٰتِ وَالأَرضَ بِالحَقِّ إِنَّ فى ذٰلِكَ لَـٔايَةً لِلمُؤمِنينَ",en:"Allah created the heavens and the earth in truth. Indeed in that is a sign for the believers."}],
  30:[{v:28,ar:"ضَرَبَ لَكُم مَثَلًا مِن أَنفُسِكُم هَل لَكُم مِن ما مَلَكَت أَيمٰنُكُم مِن شُرَكاءَ فى ما رَزَقنٰكُم فَأَنتُم فيهِ سَواءٌ تَخافونَهُم كَخيفَتِكُم أَنفُسَكُم كَذٰلِكَ نُفَصِّلُ الـٔايٰتِ لِقَومٍ يَعقِلونَ",en:"He presents to you an example from yourselves. Do you have among those whom your right hands possess any partners in what We have provided for you so that you are equal therein [and] would fear them as your fear of one another [within a partnership]? Thus do We detail the verses for a people who use reason."},{v:29,ar:"بَلِ اتَّبَعَ الَّذينَ ظَلَموا أَهواءَهُم بِغَيرِ عِلمٍ فَمَن يَهدى مَن أَضَلَّ اللَّهُ وَما لَهُم مِن نٰصِرينَ",en:"But those who wrong follow their [own] desires without knowledge. Then who can guide one whom Allah has sent astray? And for them there are no helpers."},{v:30,ar:"فَأَقِم وَجهَكَ لِلدّينِ حَنيفًا فِطرَتَ اللَّهِ الَّتى فَطَرَ النّاسَ عَلَيها لا تَبديلَ لِخَلقِ اللَّهِ ذٰلِكَ الدّينُ القَيِّمُ وَلٰكِنَّ أَكثَرَ النّاسِ لا يَعلَمونَ",en:"So direct your face toward the religion, inclining to truth. [Adhere to] the fitrah of Allah upon which He has created [all] people. No change should there be in the creation of Allah. That is the correct religion, but most of the people do not know."},{v:31,ar:"مُنيبينَ إِلَيهِ وَاتَّقوهُ وَأَقيمُوا الصَّلوٰةَ وَلا تَكونوا مِنَ المُشرِكينَ",en:"[Adhere to it], turning in repentance to Him, and fear Him and establish prayer and do not be of those who associate others with Allah"},{v:32,ar:"مِنَ الَّذينَ فَرَّقوا دينَهُم وَكانوا شِيَعًا كُلُّ حِزبٍ بِما لَدَيهِم فَرِحونَ",en:"[Or] of those who have divided their religion and become sects, every faction rejoicing in what it has."}],
  31:[{v:16,ar:"يٰبُنَىَّ إِنَّها إِن تَكُ مِثقالَ حَبَّةٍ مِن خَردَلٍ فَتَكُن فى صَخرَةٍ أَو فِى السَّمٰوٰتِ أَو فِى الأَرضِ يَأتِ بِهَا اللَّهُ إِنَّ اللَّهَ لَطيفٌ خَبيرٌ",en:"[And Luqman said], \"O my son, indeed if wrong should be the weight of a mustard seed and should be within a rock or [anywhere] in the heavens or in the earth, Allah will bring it forth. Indeed, Allah is Subtle and Acquainted."},{v:17,ar:"يٰبُنَىَّ أَقِمِ الصَّلوٰةَ وَأمُر بِالمَعروفِ وَانهَ عَنِ المُنكَرِ وَاصبِر عَلىٰ ما أَصابَكَ إِنَّ ذٰلِكَ مِن عَزمِ الأُمورِ",en:"O my son, establish prayer, enjoin what is right, forbid what is wrong, and be patient over what befalls you. Indeed, [all] that is of the matters [requiring] determination."},{v:18,ar:"وَلا تُصَعِّر خَدَّكَ لِلنّاسِ وَلا تَمشِ فِى الأَرضِ مَرَحًا إِنَّ اللَّهَ لا يُحِبُّ كُلَّ مُختالٍ فَخورٍ",en:"And do not turn your cheek [in contempt] toward people and do not walk through the earth exultantly. Indeed, Allah does not like everyone self-deluded and boastful."},{v:19,ar:"وَاقصِد فى مَشيِكَ وَاغضُض مِن صَوتِكَ إِنَّ أَنكَرَ الأَصوٰتِ لَصَوتُ الحَميرِ",en:"And be moderate in your pace and lower your voice; indeed, the most disagreeable of sounds is the voice of donkeys.\""}],
  32:[{v:15,ar:"إِنَّما يُؤمِنُ بِـٔايٰتِنَا الَّذينَ إِذا ذُكِّروا بِها خَرّوا سُجَّدًا وَسَبَّحوا بِحَمدِ رَبِّهِم وَهُم لا يَستَكبِرونَ",en:"Only those believe in Our verses who, when they are reminded by them, fall down in prostration and exalt [Allah] with praise of their Lord, and they are not arrogant."},{v:16,ar:"تَتَجافىٰ جُنوبُهُم عَنِ المَضاجِعِ يَدعونَ رَبَّهُم خَوفًا وَطَمَعًا وَمِمّا رَزَقنٰهُم يُنفِقونَ",en:"They arise from [their] beds; they supplicate their Lord in fear and aspiration, and from what We have provided them, they spend."},{v:17,ar:"فَلا تَعلَمُ نَفسٌ ما أُخفِىَ لَهُم مِن قُرَّةِ أَعيُنٍ جَزاءً بِما كانوا يَعمَلونَ",en:"And no soul knows what has been hidden for them of comfort for eyes as reward for what they used to do."}],
  33:[{v:35,ar:"إِنَّ المُسلِمينَ وَالمُسلِمٰتِ وَالمُؤمِنينَ وَالمُؤمِنٰتِ وَالقٰنِتينَ وَالقٰنِتٰتِ وَالصّٰدِقينَ وَالصّٰدِقٰتِ وَالصّٰبِرينَ وَالصّٰبِرٰتِ وَالخٰشِعينَ وَالخٰشِعٰتِ وَالمُتَصَدِّقينَ وَالمُتَصَدِّقٰتِ وَالصّٰئِمينَ وَالصّٰئِمٰتِ وَالحٰفِظينَ فُروجَهُم وَالحٰفِظٰتِ وَالذّٰكِرينَ اللَّهَ كَثيرًا وَالذّٰكِرٰتِ أَعَدَّ اللَّهُ لَهُم مَغفِرَةً وَأَجرًا عَظيمًا",en:"Indeed, the Muslim men and Muslim women, the believing men and believing women, the obedient men and obedient women, the truthful men and truthful women, the patient men and patient women, the humble men and humble women, the charitable men and charitable women, the fasting men and fasting women, the men who guard their private parts and the women who do so, and the men who remember Allah often and the women who do so - for them Allah has prepared forgiveness and a great reward."},{v:36,ar:"وَما كانَ لِمُؤمِنٍ وَلا مُؤمِنَةٍ إِذا قَضَى اللَّهُ وَرَسولُهُ أَمرًا أَن يَكونَ لَهُمُ الخِيَرَةُ مِن أَمرِهِم وَمَن يَعصِ اللَّهَ وَرَسولَهُ فَقَد ضَلَّ ضَلٰلًا مُبينًا",en:"It is not for a believing man or a believing woman, when Allah and His Messenger have decided a matter, that they should [thereafter] have any choice about their affair. And whoever disobeys Allah and His Messenger has certainly strayed into clear error."},{v:37,ar:"وَإِذ تَقولُ لِلَّذى أَنعَمَ اللَّهُ عَلَيهِ وَأَنعَمتَ عَلَيهِ أَمسِك عَلَيكَ زَوجَكَ وَاتَّقِ اللَّهَ وَتُخفى فى نَفسِكَ مَا اللَّهُ مُبديهِ وَتَخشَى النّاسَ وَاللَّهُ أَحَقُّ أَن تَخشىٰهُ فَلَمّا قَضىٰ زَيدٌ مِنها وَطَرًا زَوَّجنٰكَها لِكَى لا يَكونَ عَلَى المُؤمِنينَ حَرَجٌ فى أَزوٰجِ أَدعِيائِهِم إِذا قَضَوا مِنهُنَّ وَطَرًا وَكانَ أَمرُ اللَّهِ مَفعولًا",en:"And [remember, O Muhammad], when you said to the one on whom Allah bestowed favor and you bestowed favor, \"Keep your wife and fear Allah,\" while you concealed within yourself that which Allah is to disclose. And you feared the people, while Allah has more right that you fear Him. So when Zayd had no longer any need for her, We married her to you in order that there not be upon the believers any discomfort concerning the wives of their adopted sons when they no longer have need of them. And ever is the command of Allah accomplished."},{v:38,ar:"ما كانَ عَلَى النَّبِىِّ مِن حَرَجٍ فيما فَرَضَ اللَّهُ لَهُ سُنَّةَ اللَّهِ فِى الَّذينَ خَلَوا مِن قَبلُ وَكانَ أَمرُ اللَّهِ قَدَرًا مَقدورًا",en:"There is not to be upon the Prophet any discomfort concerning that which Allah has imposed upon him. [This is] the established way of Allah with those [prophets] who have passed on before. And ever is the command of Allah a destiny decreed."},{v:39,ar:"الَّذينَ يُبَلِّغونَ رِسٰلٰتِ اللَّهِ وَيَخشَونَهُ وَلا يَخشَونَ أَحَدًا إِلَّا اللَّهَ وَكَفىٰ بِاللَّهِ حَسيبًا",en:"[Allah praises] those who convey the messages of Allah and fear Him and do not fear anyone but Allah. And sufficient is Allah as Accountant."},{v:40,ar:"ما كانَ مُحَمَّدٌ أَبا أَحَدٍ مِن رِجالِكُم وَلٰكِن رَسولَ اللَّهِ وَخاتَمَ النَّبِيّـۧنَ وَكانَ اللَّهُ بِكُلِّ شَىءٍ عَليمًا",en:"Muhammad is not the father of [any] one of your men, but [he is] the Messenger of Allah and last of the prophets. And ever is Allah, of all things, Knowing."}],
  34:[{v:28,ar:"وَما أَرسَلنٰكَ إِلّا كافَّةً لِلنّاسِ بَشيرًا وَنَذيرًا وَلٰكِنَّ أَكثَرَ النّاسِ لا يَعلَمونَ",en:"And We have not sent you except comprehensively to mankind as a bringer of good tidings and a warner. But most of the people do not know."},{v:29,ar:"وَيَقولونَ مَتىٰ هٰذَا الوَعدُ إِن كُنتُم صٰدِقينَ",en:"And they say, \"When is this promise, if you should be truthful?\""},{v:30,ar:"قُل لَكُم ميعادُ يَومٍ لا تَستَـٔخِرونَ عَنهُ ساعَةً وَلا تَستَقدِمونَ",en:"Say, \"For you is the appointment of a Day [when] you will not remain thereafter an hour, nor will you precede [it].\""}],
  35:[{v:19,ar:"وَما يَستَوِى الأَعمىٰ وَالبَصيرُ",en:"Not equal are the blind and the seeing,"},{v:20,ar:"وَلَا الظُّلُمٰتُ وَلَا النّورُ",en:"Nor are the darknesses and the light,"},{v:21,ar:"وَلَا الظِّلُّ وَلَا الحَرورُ",en:"Nor are the shade and the heat,"},{v:22,ar:"وَما يَستَوِى الأَحياءُ وَلَا الأَموٰتُ إِنَّ اللَّهَ يُسمِعُ مَن يَشاءُ وَما أَنتَ بِمُسمِعٍ مَن فِى القُبورِ",en:"And not equal are the living and the dead. Indeed, Allah causes to hear whom He wills, but you cannot make hear those in the graves."}],
  36:[{v:45,ar:"وَإِذا قيلَ لَهُمُ اتَّقوا ما بَينَ أَيديكُم وَما خَلفَكُم لَعَلَّكُم تُرحَمونَ",en:"But when it is said to them, \"Beware of what is before you and what is behind you; perhaps you will receive mercy... \""},{v:46,ar:"وَما تَأتيهِم مِن ءايَةٍ مِن ءايٰتِ رَبِّهِم إِلّا كانوا عَنها مُعرِضينَ",en:"And no sign comes to them from the signs of their Lord except that they are from it turning away."},{v:47,ar:"وَإِذا قيلَ لَهُم أَنفِقوا مِمّا رَزَقَكُمُ اللَّهُ قالَ الَّذينَ كَفَروا لِلَّذينَ ءامَنوا أَنُطعِمُ مَن لَو يَشاءُ اللَّهُ أَطعَمَهُ إِن أَنتُم إِلّا فى ضَلٰلٍ مُبينٍ",en:"And when it is said to them, \"Spend from that which Allah has provided for you,\" those who disbelieve say to those who believe, \"Should we feed one whom, if Allah had willed, He would have fed? You are not but in clear error.\""}],
  37:[{v:91,ar:"فَراغَ إِلىٰ ءالِهَتِهِم فَقالَ أَلا تَأكُلونَ",en:"Then he turned to their gods and said, \"Do you not eat?"},{v:92,ar:"ما لَكُم لا تَنطِقونَ",en:"What is [wrong] with you that you do not speak?\""},{v:93,ar:"فَراغَ عَلَيهِم ضَربًا بِاليَمينِ",en:"And he turned upon them a blow with [his] right hand."},{v:94,ar:"فَأَقبَلوا إِلَيهِ يَزِفّونَ",en:"Then the people came toward him, hastening."},{v:95,ar:"قالَ أَتَعبُدونَ ما تَنحِتونَ",en:"He said, \"Do you worship that which you [yourselves] carve,"},{v:96,ar:"وَاللَّهُ خَلَقَكُم وَما تَعمَلونَ",en:"While Allah created you and that which you do?\""}],
  38:[{v:41,ar:"وَاذكُر عَبدَنا أَيّوبَ إِذ نادىٰ رَبَّهُ أَنّى مَسَّنِىَ الشَّيطٰنُ بِنُصبٍ وَعَذابٍ",en:"And remember Our servant Job, when he called to his Lord, \"Indeed, Satan has touched me with hardship and torment.\""},{v:42,ar:"اركُض بِرِجلِكَ هٰذا مُغتَسَلٌ بارِدٌ وَشَرابٌ",en:"[So he was told], \"Strike [the ground] with your foot; this is a [spring for] a cool bath and drink.\""},{v:43,ar:"وَوَهَبنا لَهُ أَهلَهُ وَمِثلَهُم مَعَهُم رَحمَةً مِنّا وَذِكرىٰ لِأُولِى الأَلبٰبِ",en:"And We granted him his family and a like [number] with them as mercy from Us and a reminder for those of understanding."},{v:44,ar:"وَخُذ بِيَدِكَ ضِغثًا فَاضرِب بِهِ وَلا تَحنَث إِنّا وَجَدنٰهُ صابِرًا نِعمَ العَبدُ إِنَّهُ أَوّابٌ",en:"[We said], \"And take in your hand a bunch [of grass] and strike with it and do not break your oath.\" Indeed, We found him patient, an excellent servant. Indeed, he was one repeatedly turning back [to Allah]."}],
  39:[{v:38,ar:"وَلَئِن سَأَلتَهُم مَن خَلَقَ السَّمٰوٰتِ وَالأَرضَ لَيَقولُنَّ اللَّهُ قُل أَفَرَءَيتُم ما تَدعونَ مِن دونِ اللَّهِ إِن أَرادَنِىَ اللَّهُ بِضُرٍّ هَل هُنَّ كٰشِفٰتُ ضُرِّهِ أَو أَرادَنى بِرَحمَةٍ هَل هُنَّ مُمسِكٰتُ رَحمَتِهِ قُل حَسبِىَ اللَّهُ عَلَيهِ يَتَوَكَّلُ المُتَوَكِّلونَ",en:"And if you asked them, \"Who created the heavens and the earth?\" they would surely say, \"Allah.\" Say, \"Then have you considered what you invoke besides Allah? If Allah intended me harm, are they removers of His harm; or if He intended me mercy, are they withholders of His mercy?\" Say, \"Sufficient for me is Allah; upon Him [alone] rely the [wise] reliers.\""}],
  40:[{v:43,ar:"لا جَرَمَ أَنَّما تَدعونَنى إِلَيهِ لَيسَ لَهُ دَعوَةٌ فِى الدُّنيا وَلا فِى الـٔاخِرَةِ وَأَنَّ مَرَدَّنا إِلَى اللَّهِ وَأَنَّ المُسرِفينَ هُم أَصحٰبُ النّارِ",en:"Assuredly, that to which you invite me has no [response to a] supplication in this world or in the Hereafter; and indeed, our return is to Allah, and indeed, the transgressors will be companions of the Fire."}],
  41:[{v:26,ar:"وَقالَ الَّذينَ كَفَروا لا تَسمَعوا لِهٰذَا القُرءانِ وَالغَوا فيهِ لَعَلَّكُم تَغلِبونَ",en:"And those who disbelieve say, \"Do not listen to this Qur'an and speak noisily during [the recitation of] it that perhaps you will overcome.\""},{v:27,ar:"فَلَنُذيقَنَّ الَّذينَ كَفَروا عَذابًا شَديدًا وَلَنَجزِيَنَّهُم أَسوَأَ الَّذى كانوا يَعمَلونَ",en:"But We will surely cause those who disbelieve to taste a severe punishment, and We will surely recompense them for the worst of what they had been doing."},{v:28,ar:"ذٰلِكَ جَزاءُ أَعداءِ اللَّهِ النّارُ لَهُم فيها دارُ الخُلدِ جَزاءً بِما كانوا بِـٔايٰتِنا يَجحَدونَ",en:"That is the recompense of the enemies of Allah - the Fire. For them therein is the home of eternity as recompense for what they, of Our verses, were rejecting."},{v:29,ar:"وَقالَ الَّذينَ كَفَروا رَبَّنا أَرِنَا الَّذَينِ أَضَلّانا مِنَ الجِنِّ وَالإِنسِ نَجعَلهُما تَحتَ أَقدامِنا لِيَكونا مِنَ الأَسفَلينَ",en:"And those who disbelieved will [then] say, \"Our Lord, show us those who misled us of the jinn and men [so] we may put them under our feet that they will be among the lowest.\""}],
  42:[{v:27,ar:"وَلَو بَسَطَ اللَّهُ الرِّزقَ لِعِبادِهِ لَبَغَوا فِى الأَرضِ وَلٰكِن يُنَزِّلُ بِقَدَرٍ ما يَشاءُ إِنَّهُ بِعِبادِهِ خَبيرٌ بَصيرٌ",en:"And if Allah had extended [excessively] provision for His servants, they would have committed tyranny throughout the earth. But He sends [it] down in an amount which He wills. Indeed He is, of His servants, Acquainted and Seeing."},{v:28,ar:"وَهُوَ الَّذى يُنَزِّلُ الغَيثَ مِن بَعدِ ما قَنَطوا وَيَنشُرُ رَحمَتَهُ وَهُوَ الوَلِىُّ الحَميدُ",en:"And it is He who sends down the rain after they had despaired and spreads His mercy. And He is the Protector, the Praiseworthy."},{v:29,ar:"وَمِن ءايٰتِهِ خَلقُ السَّمٰوٰتِ وَالأَرضِ وَما بَثَّ فيهِما مِن دابَّةٍ وَهُوَ عَلىٰ جَمعِهِم إِذا يَشاءُ قَديرٌ",en:"And of his signs is the creation of the heavens and earth and what He has dispersed throughout them of creatures. And He, for gathering them when He wills, is competent."}],
  43:[{v:45,ar:"وَسـَٔل مَن أَرسَلنا مِن قَبلِكَ مِن رُسُلِنا أَجَعَلنا مِن دونِ الرَّحمٰنِ ءالِهَةً يُعبَدونَ",en:"And ask those We sent before you of Our messengers; have We made besides the Most Merciful deities to be worshipped?"}],
  44:[{v:30,ar:"وَلَقَد نَجَّينا بَنى إِسرٰءيلَ مِنَ العَذابِ المُهينِ",en:"And We certainly saved the Children of Israel from the humiliating torment -"},{v:31,ar:"مِن فِرعَونَ إِنَّهُ كانَ عالِيًا مِنَ المُسرِفينَ",en:"From Pharaoh. Indeed, he was a haughty one among the transgressors."}],
  45:[{v:18,ar:"ثُمَّ جَعَلنٰكَ عَلىٰ شَريعَةٍ مِنَ الأَمرِ فَاتَّبِعها وَلا تَتَّبِع أَهواءَ الَّذينَ لا يَعلَمونَ",en:"Then We put you, [O Muhammad], on an ordained way concerning the matter [of religion]; so follow it and do not follow the inclinations of those who do not know."}],
  46:[{v:17,ar:"وَالَّذى قالَ لِوٰلِدَيهِ أُفٍّ لَكُما أَتَعِدانِنى أَن أُخرَجَ وَقَد خَلَتِ القُرونُ مِن قَبلى وَهُما يَستَغيثانِ اللَّهَ وَيلَكَ ءامِن إِنَّ وَعدَ اللَّهِ حَقٌّ فَيَقولُ ما هٰذا إِلّا أَسٰطيرُ الأَوَّلينَ",en:"But one who says to his parents, \"Uff to you; do you promise me that I will be brought forth [from the earth] when generations before me have already passed on [into oblivion]?\" while they call to Allah for help [and to their son], \"Woe to you! Believe! Indeed, the promise of Allah is truth.\" But he says, \"This is not but legends of the former people\" -"},{v:18,ar:"أُولٰئِكَ الَّذينَ حَقَّ عَلَيهِمُ القَولُ فى أُمَمٍ قَد خَلَت مِن قَبلِهِم مِنَ الجِنِّ وَالإِنسِ إِنَّهُم كانوا خٰسِرينَ",en:"Those are the ones upon whom the word has come into effect, [who will be] among nations which had passed on before them of jinn and men. Indeed, they [all] were losers."},{v:19,ar:"وَلِكُلٍّ دَرَجٰتٌ مِمّا عَمِلوا وَلِيُوَفِّيَهُم أَعمٰلَهُم وَهُم لا يُظلَمونَ",en:"And for all there are degrees [of reward and punishment] for what they have done, and [it is] so that He may fully compensate them for their deeds, and they will not be wronged."}],
  47:[{v:19,ar:"فَاعلَم أَنَّهُ لا إِلٰهَ إِلَّا اللَّهُ وَاستَغفِر لِذَنبِكَ وَلِلمُؤمِنينَ وَالمُؤمِنٰتِ وَاللَّهُ يَعلَمُ مُتَقَلَّبَكُم وَمَثوىٰكُم",en:"So know, [O Muhammad], that there is no deity except Allah and ask forgiveness for your sin and for the believing men and believing women. And Allah knows of your movement and your resting place."}],
  48:[{v:14,ar:"وَلِلَّهِ مُلكُ السَّمٰوٰتِ وَالأَرضِ يَغفِرُ لِمَن يَشاءُ وَيُعَذِّبُ مَن يَشاءُ وَكانَ اللَّهُ غَفورًا رَحيمًا",en:"And to Allah belongs the dominion of the heavens and the earth. He forgives whom He wills and punishes whom He wills. And ever is Allah Forgiving and Merciful."}],
  49:[{v:9,ar:"وَإِن طائِفَتانِ مِنَ المُؤمِنينَ اقتَتَلوا فَأَصلِحوا بَينَهُما فَإِن بَغَت إِحدىٰهُما عَلَى الأُخرىٰ فَقٰتِلُوا الَّتى تَبغى حَتّىٰ تَفىءَ إِلىٰ أَمرِ اللَّهِ فَإِن فاءَت فَأَصلِحوا بَينَهُما بِالعَدلِ وَأَقسِطوا إِنَّ اللَّهَ يُحِبُّ المُقسِطينَ",en:"And if two factions among the believers should fight, then make settlement between the two. But if one of them oppresses the other, then fight against the one that oppresses until it returns to the ordinance of Allah. And if it returns, then make settlement between them in justice and act justly. Indeed, Allah loves those who act justly."},{v:10,ar:"إِنَّمَا المُؤمِنونَ إِخوَةٌ فَأَصلِحوا بَينَ أَخَوَيكُم وَاتَّقُوا اللَّهَ لَعَلَّكُم تُرحَمونَ",en:"The believers are but brothers, so make settlement between your brothers. And fear Allah that you may receive mercy."}],
  50:[{v:22,ar:"لَقَد كُنتَ فى غَفلَةٍ مِن هٰذا فَكَشَفنا عَنكَ غِطاءَكَ فَبَصَرُكَ اليَومَ حَديدٌ",en:"[It will be said], \"You were certainly in unmindfulness of this, and We have removed from you your cover, so your sight, this Day, is sharp.\""},{v:23,ar:"وَقالَ قَرينُهُ هٰذا ما لَدَىَّ عَتيدٌ",en:"And his companion, [the angel], will say, \"This [record] is what is with me, prepared.\""}],
  51:[{v:30,ar:"قالوا كَذٰلِكِ قالَ رَبُّكِ إِنَّهُ هُوَ الحَكيمُ العَليمُ",en:"They said, \"Thus has said your Lord; indeed, He is the Wise, the Knowing.\""},{v:31,ar:"قالَ فَما خَطبُكُم أَيُّهَا المُرسَلونَ",en:"[Abraham] said, \"Then what is your business [here], O messengers?\""}],
  52:[{v:25,ar:"وَأَقبَلَ بَعضُهُم عَلىٰ بَعضٍ يَتَساءَلونَ",en:"And they will approach one another, inquiring of each other."},{v:26,ar:"قالوا إِنّا كُنّا قَبلُ فى أَهلِنا مُشفِقينَ",en:"They will say, \"Indeed, we were previously among our people fearful [of displeasing Allah]."},{v:27,ar:"فَمَنَّ اللَّهُ عَلَينا وَوَقىٰنا عَذابَ السَّمومِ",en:"So Allah conferred favor upon us and protected us from the punishment of the Scorching Fire."},{v:28,ar:"إِنّا كُنّا مِن قَبلُ نَدعوهُ إِنَّهُ هُوَ البَرُّ الرَّحيمُ",en:"Indeed, we used to supplicate Him before. Indeed, it is He who is the Beneficent, the Merciful.\""}],
  53:[{v:29,ar:"فَأَعرِض عَن مَن تَوَلّىٰ عَن ذِكرِنا وَلَم يُرِد إِلَّا الحَيوٰةَ الدُّنيا",en:"So turn away from whoever turns his back on Our message and desires not except the worldly life."},{v:30,ar:"ذٰلِكَ مَبلَغُهُم مِنَ العِلمِ إِنَّ رَبَّكَ هُوَ أَعلَمُ بِمَن ضَلَّ عَن سَبيلِهِ وَهُوَ أَعلَمُ بِمَنِ اهتَدىٰ",en:"That is their sum of knowledge. Indeed, your Lord is most knowing of who strays from His way, and He is most knowing of who is guided."},{v:31,ar:"وَلِلَّهِ ما فِى السَّمٰوٰتِ وَما فِى الأَرضِ لِيَجزِىَ الَّذينَ أَسٰـٔوا بِما عَمِلوا وَيَجزِىَ الَّذينَ أَحسَنوا بِالحُسنَى",en:"And to Allah belongs whatever is in the heavens and whatever is in the earth - that He may recompense those who do evil with [the penalty of] what they have done and recompense those who do good with the best [reward] -"},{v:32,ar:"الَّذينَ يَجتَنِبونَ كَبٰئِرَ الإِثمِ وَالفَوٰحِشَ إِلَّا اللَّمَمَ إِنَّ رَبَّكَ وٰسِعُ المَغفِرَةِ هُوَ أَعلَمُ بِكُم إِذ أَنشَأَكُم مِنَ الأَرضِ وَإِذ أَنتُم أَجِنَّةٌ فى بُطونِ أُمَّهٰتِكُم فَلا تُزَكّوا أَنفُسَكُم هُوَ أَعلَمُ بِمَنِ اتَّقىٰ",en:"Those who avoid the major sins and immoralities, only [committing] slight ones. Indeed, your Lord is vast in forgiveness. He was most knowing of you when He produced you from the earth and when you were fetuses in the wombs of your mothers. So do not claim yourselves to be pure; He is most knowing of who fears Him."}],
  54:[{v:23,ar:"كَذَّبَت ثَمودُ بِالنُّذُرِ",en:"Thamud denied the warning"},{v:24,ar:"فَقالوا أَبَشَرًا مِنّا وٰحِدًا نَتَّبِعُهُ إِنّا إِذًا لَفى ضَلٰلٍ وَسُعُرٍ",en:"And said, \"Is it one human being among us that we should follow? Indeed, we would then be in error and madness."},{v:25,ar:"أَءُلقِىَ الذِّكرُ عَلَيهِ مِن بَينِنا بَل هُوَ كَذّابٌ أَشِرٌ",en:"Has the message been sent down upon him from among us? Rather, he is an insolent liar.\""},{v:26,ar:"سَيَعلَمونَ غَدًا مَنِ الكَذّابُ الأَشِرُ",en:"They will know tomorrow who is the insolent liar."},{v:27,ar:"إِنّا مُرسِلُوا النّاقَةِ فِتنَةً لَهُم فَارتَقِبهُم وَاصطَبِر",en:"Indeed, We are sending the she-camel as trial for them, so watch them and be patient."},{v:28,ar:"وَنَبِّئهُم أَنَّ الماءَ قِسمَةٌ بَينَهُم كُلُّ شِربٍ مُحتَضَرٌ",en:"And inform them that the water is shared between them, each [day of] drink attended [by turn]."},{v:29,ar:"فَنادَوا صاحِبَهُم فَتَعاطىٰ فَعَقَرَ",en:"But they called their companion, and he dared and hamstrung [her]."},{v:30,ar:"فَكَيفَ كانَ عَذابى وَنُذُرِ",en:"And how [severe] were My punishment and warning."},{v:31,ar:"إِنّا أَرسَلنا عَلَيهِم صَيحَةً وٰحِدَةً فَكانوا كَهَشيمِ المُحتَظِرِ",en:"Indeed, We sent upon them one blast from the sky, and they became like the dry twig fragments of an [animal] pen."},{v:32,ar:"وَلَقَد يَسَّرنَا القُرءانَ لِلذِّكرِ فَهَل مِن مُدَّكِرٍ",en:"And We have certainly made the Qur'an easy for remembrance, so is there any who will remember?"}],
  55:[{v:26,ar:"كُلُّ مَن عَلَيها فانٍ",en:"Everyone upon the earth will perish,"},{v:27,ar:"وَيَبقىٰ وَجهُ رَبِّكَ ذُو الجَلٰلِ وَالإِكرامِ",en:"And there will remain the Face of your Lord, Owner of Majesty and Honor."}],
  56:[{v:57,ar:"نَحنُ خَلَقنٰكُم فَلَولا تُصَدِّقونَ",en:"We have created you, so why do you not believe?"},{v:58,ar:"أَفَرَءَيتُم ما تُمنونَ",en:"Have you seen that which you emit?"},{v:59,ar:"ءَأَنتُم تَخلُقونَهُ أَم نَحنُ الخٰلِقونَ",en:"Is it you who creates it, or are We the Creator?"},{v:60,ar:"نَحنُ قَدَّرنا بَينَكُمُ المَوتَ وَما نَحنُ بِمَسبوقينَ",en:"We have decreed death among you, and We are not to be outdone"},{v:61,ar:"عَلىٰ أَن نُبَدِّلَ أَمثٰلَكُم وَنُنشِئَكُم فى ما لا تَعلَمونَ",en:"In that We will change your likenesses and produce you in that [form] which you do not know."},{v:62,ar:"وَلَقَد عَلِمتُمُ النَّشأَةَ الأولىٰ فَلَولا تَذَكَّرونَ",en:"And you have already known the first creation, so will you not remember?"},{v:63,ar:"أَفَرَءَيتُم ما تَحرُثونَ",en:"And have you seen that [seed] which you sow?"},{v:64,ar:"ءَأَنتُم تَزرَعونَهُ أَم نَحنُ الزّٰرِعونَ",en:"Is it you who makes it grow, or are We the grower?"},{v:65,ar:"لَو نَشاءُ لَجَعَلنٰهُ حُطٰمًا فَظَلتُم تَفَكَّهونَ",en:"If We willed, We could make it [dry] debris, and you would remain in wonder,"},{v:66,ar:"إِنّا لَمُغرَمونَ",en:"[Saying], \"Indeed, we are [now] in debt;"},{v:67,ar:"بَل نَحنُ مَحرومونَ",en:"Rather, we have been deprived.\""},{v:68,ar:"أَفَرَءَيتُمُ الماءَ الَّذى تَشرَبونَ",en:"And have you seen the water that you drink?"},{v:69,ar:"ءَأَنتُم أَنزَلتُموهُ مِنَ المُزنِ أَم نَحنُ المُنزِلونَ",en:"Is it you who brought it down from the clouds, or is it We who bring it down?"},{v:70,ar:"لَو نَشاءُ جَعَلنٰهُ أُجاجًا فَلَولا تَشكُرونَ",en:"If We willed, We could make it bitter, so why are you not grateful?"},{v:71,ar:"أَفَرَءَيتُمُ النّارَ الَّتى تورونَ",en:"And have you seen the fire that you ignite?"},{v:72,ar:"ءَأَنتُم أَنشَأتُم شَجَرَتَها أَم نَحنُ المُنشِـٔونَ",en:"Is it you who produced its tree, or are We the producer?"},{v:73,ar:"نَحنُ جَعَلنٰها تَذكِرَةً وَمَتٰعًا لِلمُقوينَ",en:"We have made it a reminder and provision for the travelers,"},{v:74,ar:"فَسَبِّح بِاسمِ رَبِّكَ العَظيمِ",en:"So exalt the name of your Lord, the Most Great."}],
  57:[{v:16,ar:"أَلَم يَأنِ لِلَّذينَ ءامَنوا أَن تَخشَعَ قُلوبُهُم لِذِكرِ اللَّهِ وَما نَزَلَ مِنَ الحَقِّ وَلا يَكونوا كَالَّذينَ أوتُوا الكِتٰبَ مِن قَبلُ فَطالَ عَلَيهِمُ الأَمَدُ فَقَسَت قُلوبُهُم وَكَثيرٌ مِنهُم فٰسِقونَ",en:"Has the time not come for those who have believed that their hearts should become humbly submissive at the remembrance of Allah and what has come down of the truth? And let them not be like those who were given the Scripture before, and a long period passed over them, so their hearts hardened; and many of them are defiantly disobedient."},{v:17,ar:"اعلَموا أَنَّ اللَّهَ يُحىِ الأَرضَ بَعدَ مَوتِها قَد بَيَّنّا لَكُمُ الـٔايٰتِ لَعَلَّكُم تَعقِلونَ",en:"Know that Allah gives life to the earth after its lifelessness. We have made clear to you the signs; perhaps you will understand."},{v:18,ar:"إِنَّ المُصَّدِّقينَ وَالمُصَّدِّقٰتِ وَأَقرَضُوا اللَّهَ قَرضًا حَسَنًا يُضٰعَفُ لَهُم وَلَهُم أَجرٌ كَريمٌ",en:"Indeed, the men who practice charity and the women who practice charity and [they who] have loaned Allah a goodly loan - it will be multiplied for them, and they will have a noble reward."}],
  58:[{v:8,ar:"أَلَم تَرَ إِلَى الَّذينَ نُهوا عَنِ النَّجوىٰ ثُمَّ يَعودونَ لِما نُهوا عَنهُ وَيَتَنٰجَونَ بِالإِثمِ وَالعُدوٰنِ وَمَعصِيَتِ الرَّسولِ وَإِذا جاءوكَ حَيَّوكَ بِما لَم يُحَيِّكَ بِهِ اللَّهُ وَيَقولونَ فى أَنفُسِهِم لَولا يُعَذِّبُنَا اللَّهُ بِما نَقولُ حَسبُهُم جَهَنَّمُ يَصلَونَها فَبِئسَ المَصيرُ",en:"Have you not considered those who were forbidden from private conversation, then they return to that which they were forbidden and converse among themselves about sin and aggression and disobedience to the Messenger? And when they come to you, they greet you with that [word] by which Allah does not greet you and say among themselves, \"Why does Allah not punish us for what we say?\" Sufficient for them is Hell, which they will [enter to] burn, and wretched is the destination."},{v:9,ar:"يٰأَيُّهَا الَّذينَ ءامَنوا إِذا تَنٰجَيتُم فَلا تَتَنٰجَوا بِالإِثمِ وَالعُدوٰنِ وَمَعصِيَتِ الرَّسولِ وَتَنٰجَوا بِالبِرِّ وَالتَّقوىٰ وَاتَّقُوا اللَّهَ الَّذى إِلَيهِ تُحشَرونَ",en:"O you who have believed, when you converse privately, do not converse about sin and aggression and disobedience to the Messenger but converse about righteousness and piety. And fear Allah, to whom you will be gathered."},{v:10,ar:"إِنَّمَا النَّجوىٰ مِنَ الشَّيطٰنِ لِيَحزُنَ الَّذينَ ءامَنوا وَلَيسَ بِضارِّهِم شَيـًٔا إِلّا بِإِذنِ اللَّهِ وَعَلَى اللَّهِ فَليَتَوَكَّلِ المُؤمِنونَ",en:"Private conversation is only from Satan that he may grieve those who have believed, but he will not harm them at all except by permission of Allah. And upon Allah let the believers rely."}],
  59:[{v:12,ar:"لَئِن أُخرِجوا لا يَخرُجونَ مَعَهُم وَلَئِن قوتِلوا لا يَنصُرونَهُم وَلَئِن نَصَروهُم لَيُوَلُّنَّ الأَدبٰرَ ثُمَّ لا يُنصَرونَ",en:"If they are expelled, they will not leave with them, and if they are fought, they will not aid them. And [even] if they should aid them, they will surely turn their backs; then [thereafter] they will not be aided."},{v:13,ar:"لَأَنتُم أَشَدُّ رَهبَةً فى صُدورِهِم مِنَ اللَّهِ ذٰلِكَ بِأَنَّهُم قَومٌ لا يَفقَهونَ",en:"You [believers] are more fearful within their breasts than Allah. That is because they are a people who do not understand."}],
  60:[{v:7,ar:"عَسَى اللَّهُ أَن يَجعَلَ بَينَكُم وَبَينَ الَّذينَ عادَيتُم مِنهُم مَوَدَّةً وَاللَّهُ قَديرٌ وَاللَّهُ غَفورٌ رَحيمٌ",en:"Perhaps Allah will put, between you and those to whom you have been enemies among them, affection. And Allah is competent, and Allah is Forgiving and Merciful."}],
  61:[{v:5,ar:"وَإِذ قالَ موسىٰ لِقَومِهِ يٰقَومِ لِمَ تُؤذونَنى وَقَد تَعلَمونَ أَنّى رَسولُ اللَّهِ إِلَيكُم فَلَمّا زاغوا أَزاغَ اللَّهُ قُلوبَهُم وَاللَّهُ لا يَهدِى القَومَ الفٰسِقينَ",en:"And [mention, O Muhammad], when Moses said to his people, \"O my people, why do you harm me while you certainly know that I am the messenger of Allah to you?\" And when they deviated, Allah caused their hearts to deviate. And Allah does not guide the defiantly disobedient people."},{v:6,ar:"وَإِذ قالَ عيسَى ابنُ مَريَمَ يٰبَنى إِسرٰءيلَ إِنّى رَسولُ اللَّهِ إِلَيكُم مُصَدِّقًا لِما بَينَ يَدَىَّ مِنَ التَّورىٰةِ وَمُبَشِّرًا بِرَسولٍ يَأتى مِن بَعدِى اسمُهُ أَحمَدُ فَلَمّا جاءَهُم بِالبَيِّنٰتِ قالوا هٰذا سِحرٌ مُبينٌ",en:"And [mention] when Jesus, the son of Mary, said, \"O children of Israel, indeed I am the messenger of Allah to you confirming what came before me of the Torah and bringing good tidings of a messenger to come after me, whose name is Ahmad.\" But when he came to them with clear evidences, they said, \"This is obvious magic.\""},{v:7,ar:"وَمَن أَظلَمُ مِمَّنِ افتَرىٰ عَلَى اللَّهِ الكَذِبَ وَهُوَ يُدعىٰ إِلَى الإِسلٰمِ وَاللَّهُ لا يَهدِى القَومَ الظّٰلِمينَ",en:"And who is more unjust than one who invents about Allah untruth while he is being invited to Islam. And Allah does not guide the wrongdoing people."}],
  62:[{v:6,ar:"قُل يٰأَيُّهَا الَّذينَ هادوا إِن زَعَمتُم أَنَّكُم أَولِياءُ لِلَّهِ مِن دونِ النّاسِ فَتَمَنَّوُا المَوتَ إِن كُنتُم صٰدِقينَ",en:"Say, \"O you who are Jews, if you claim that you are allies of Allah, excluding the [other] people, then wish for death, if you should be truthful.\""}],
  63:[{v:5,ar:"وَإِذا قيلَ لَهُم تَعالَوا يَستَغفِر لَكُم رَسولُ اللَّهِ لَوَّوا رُءوسَهُم وَرَأَيتَهُم يَصُدّونَ وَهُم مُستَكبِرونَ",en:"And when it is said to them, \"Come, the Messenger of Allah will ask forgiveness for you,\" they turn their heads aside and you see them evading while they are arrogant."},{v:6,ar:"سَواءٌ عَلَيهِم أَستَغفَرتَ لَهُم أَم لَم تَستَغفِر لَهُم لَن يَغفِرَ اللَّهُ لَهُم إِنَّ اللَّهَ لا يَهدِى القَومَ الفٰسِقينَ",en:"It is all the same for them whether you ask forgiveness for them or do not ask forgiveness for them; never will Allah forgive them. Indeed, Allah does not guide the defiantly disobedient people."}],
  64:[{v:9,ar:"يَومَ يَجمَعُكُم لِيَومِ الجَمعِ ذٰلِكَ يَومُ التَّغابُنِ وَمَن يُؤمِن بِاللَّهِ وَيَعمَل صٰلِحًا يُكَفِّر عَنهُ سَيِّـٔاتِهِ وَيُدخِلهُ جَنّٰتٍ تَجرى مِن تَحتِهَا الأَنهٰرُ خٰلِدينَ فيها أَبَدًا ذٰلِكَ الفَوزُ العَظيمُ",en:"The Day He will assemble you for the Day of Assembly - that is the Day of Deprivation. And whoever believes in Allah and does righteousness - He will remove from him his misdeeds and admit him to gardens beneath which rivers flow, wherein they will abide forever. That is the great attainment."},{v:10,ar:"وَالَّذينَ كَفَروا وَكَذَّبوا بِـٔايٰتِنا أُولٰئِكَ أَصحٰبُ النّارِ خٰلِدينَ فيها وَبِئسَ المَصيرُ",en:"But the ones who disbelieved and denied Our verses - those are the companions of the Fire, abiding eternally therein; and wretched is the destination."}],
  65:[{v:6,ar:"أَسكِنوهُنَّ مِن حَيثُ سَكَنتُم مِن وُجدِكُم وَلا تُضارّوهُنَّ لِتُضَيِّقوا عَلَيهِنَّ وَإِن كُنَّ أُولٰتِ حَملٍ فَأَنفِقوا عَلَيهِنَّ حَتّىٰ يَضَعنَ حَملَهُنَّ فَإِن أَرضَعنَ لَكُم فَـٔاتوهُنَّ أُجورَهُنَّ وَأتَمِروا بَينَكُم بِمَعروفٍ وَإِن تَعاسَرتُم فَسَتُرضِعُ لَهُ أُخرىٰ",en:"Lodge them [in a section] of where you dwell out of your means and do not harm them in order to oppress them. And if they should be pregnant, then spend on them until they give birth. And if they breastfeed for you, then give them their payment and confer among yourselves in the acceptable way; but if you are in discord, then there may breastfeed for the father another woman."},{v:7,ar:"لِيُنفِق ذو سَعَةٍ مِن سَعَتِهِ وَمَن قُدِرَ عَلَيهِ رِزقُهُ فَليُنفِق مِمّا ءاتىٰهُ اللَّهُ لا يُكَلِّفُ اللَّهُ نَفسًا إِلّا ما ءاتىٰها سَيَجعَلُ اللَّهُ بَعدَ عُسرٍ يُسرًا",en:"Let a man of wealth spend from his wealth, and he whose provision is restricted - let him spend from what Allah has given him. Allah does not charge a soul except [according to] what He has given it. Allah will bring about, after hardship, ease."}],
  66:[{v:6,ar:"يٰأَيُّهَا الَّذينَ ءامَنوا قوا أَنفُسَكُم وَأَهليكُم نارًا وَقودُهَا النّاسُ وَالحِجارَةُ عَلَيها مَلٰئِكَةٌ غِلاظٌ شِدادٌ لا يَعصونَ اللَّهَ ما أَمَرَهُم وَيَفعَلونَ ما يُؤمَرونَ",en:"O you who have believed, protect yourselves and your families from a Fire whose fuel is people and stones, over which are [appointed] angels, harsh and severe; they do not disobey Allah in what He commands them but do what they are commanded."},{v:7,ar:"يٰأَيُّهَا الَّذينَ كَفَروا لا تَعتَذِرُوا اليَومَ إِنَّما تُجزَونَ ما كُنتُم تَعمَلونَ",en:"O you who have disbelieved, make no excuses that Day. You will only be recompensed for what you used to do."},{v:8,ar:"يٰأَيُّهَا الَّذينَ ءامَنوا توبوا إِلَى اللَّهِ تَوبَةً نَصوحًا عَسىٰ رَبُّكُم أَن يُكَفِّرَ عَنكُم سَيِّـٔاتِكُم وَيُدخِلَكُم جَنّٰتٍ تَجرى مِن تَحتِهَا الأَنهٰرُ يَومَ لا يُخزِى اللَّهُ النَّبِىَّ وَالَّذينَ ءامَنوا مَعَهُ نورُهُم يَسعىٰ بَينَ أَيديهِم وَبِأَيمٰنِهِم يَقولونَ رَبَّنا أَتمِم لَنا نورَنا وَاغفِر لَنا إِنَّكَ عَلىٰ كُلِّ شَىءٍ قَديرٌ",en:"O you who have believed, repent to Allah with sincere repentance. Perhaps your Lord will remove from you your misdeeds and admit you into gardens beneath which rivers flow [on] the Day when Allah will not disgrace the Prophet and those who believed with him. Their light will proceed before them and on their right; they will say, \"Our Lord, perfect for us our light and forgive us. Indeed, You are over all things competent.\""}],
  67:[{v:12,ar:"إِنَّ الَّذينَ يَخشَونَ رَبَّهُم بِالغَيبِ لَهُم مَغفِرَةٌ وَأَجرٌ كَبيرٌ",en:"Indeed, those who fear their Lord unseen will have forgiveness and great reward."},{v:13,ar:"وَأَسِرّوا قَولَكُم أَوِ اجهَروا بِهِ إِنَّهُ عَليمٌ بِذاتِ الصُّدورِ",en:"And conceal your speech or publicize it; indeed, He is Knowing of that within the breasts."},{v:14,ar:"أَلا يَعلَمُ مَن خَلَقَ وَهُوَ اللَّطيفُ الخَبيرُ",en:"Does He who created not know, while He is the Subtle, the Acquainted?"},{v:15,ar:"هُوَ الَّذى جَعَلَ لَكُمُ الأَرضَ ذَلولًا فَامشوا فى مَناكِبِها وَكُلوا مِن رِزقِهِ وَإِلَيهِ النُّشورُ",en:"It is He who made the earth tame for you - so walk among its slopes and eat of His provision - and to Him is the resurrection."}],
  68:[{v:17,ar:"إِنّا بَلَونٰهُم كَما بَلَونا أَصحٰبَ الجَنَّةِ إِذ أَقسَموا لَيَصرِمُنَّها مُصبِحينَ",en:"Indeed, We have tried them as We tried the companions of the garden, when they swore to cut its fruit in the [early] morning"},{v:18,ar:"وَلا يَستَثنونَ",en:"Without making exception."},{v:19,ar:"فَطافَ عَلَيها طائِفٌ مِن رَبِّكَ وَهُم نائِمونَ",en:"So there came upon the garden an affliction from your Lord while they were asleep."},{v:20,ar:"فَأَصبَحَت كَالصَّريمِ",en:"And it became as though reaped."},{v:21,ar:"فَتَنادَوا مُصبِحينَ",en:"And they called one another at morning,"},{v:22,ar:"أَنِ اغدوا عَلىٰ حَرثِكُم إِن كُنتُم صٰرِمينَ",en:"[Saying], \"Go early to your crop if you would cut the fruit.\""},{v:23,ar:"فَانطَلَقوا وَهُم يَتَخٰفَتونَ",en:"So they set out, while lowering their voices,"},{v:24,ar:"أَن لا يَدخُلَنَّهَا اليَومَ عَلَيكُم مِسكينٌ",en:"[Saying], \"There will surely not enter it today upon you [any] poor person.\""},{v:25,ar:"وَغَدَوا عَلىٰ حَردٍ قٰدِرينَ",en:"And they went early in determination, [assuming themselves] able."},{v:26,ar:"فَلَمّا رَأَوها قالوا إِنّا لَضالّونَ",en:"But when they saw it, they said, \"Indeed, we are lost;"},{v:27,ar:"بَل نَحنُ مَحرومونَ",en:"Rather, we have been deprived.\""},{v:28,ar:"قالَ أَوسَطُهُم أَلَم أَقُل لَكُم لَولا تُسَبِّحونَ",en:"The most moderate of them said, \"Did I not say to you, 'Why do you not exalt [Allah]?' \""},{v:29,ar:"قالوا سُبحٰنَ رَبِّنا إِنّا كُنّا ظٰلِمينَ",en:"They said, \"Exalted is our Lord! Indeed, we were wrongdoers.\""},{v:30,ar:"فَأَقبَلَ بَعضُهُم عَلىٰ بَعضٍ يَتَلٰوَمونَ",en:"Then they approached one another, blaming each other."},{v:31,ar:"قالوا يٰوَيلَنا إِنّا كُنّا طٰغينَ",en:"They said, \"O woe to us; indeed we were transgressors."},{v:32,ar:"عَسىٰ رَبُّنا أَن يُبدِلَنا خَيرًا مِنها إِنّا إِلىٰ رَبِّنا رٰغِبونَ",en:"Perhaps our Lord will substitute for us [one] better than it. Indeed, we are toward our Lord desirous.\""}],
  69:[{v:19,ar:"فَأَمّا مَن أوتِىَ كِتٰبَهُ بِيَمينِهِ فَيَقولُ هاؤُمُ اقرَءوا كِتٰبِيَه",en:"So as for he who is given his record in his right hand, he will say, \"Here, read my record!"},{v:20,ar:"إِنّى ظَنَنتُ أَنّى مُلٰقٍ حِسابِيَه",en:"Indeed, I was certain that I would be meeting my account.\""},{v:21,ar:"فَهُوَ فى عيشَةٍ راضِيَةٍ",en:"So he will be in a pleasant life -"},{v:22,ar:"فى جَنَّةٍ عالِيَةٍ",en:"In an elevated garden,"},{v:23,ar:"قُطوفُها دانِيَةٌ",en:"Its [fruit] to be picked hanging near."},{v:24,ar:"كُلوا وَاشرَبوا هَنيـًٔا بِما أَسلَفتُم فِى الأَيّامِ الخالِيَةِ",en:"[They will be told], \"Eat and drink in satisfaction for what you put forth in the days past.\""},{v:25,ar:"وَأَمّا مَن أوتِىَ كِتٰبَهُ بِشِمالِهِ فَيَقولُ يٰلَيتَنى لَم أوتَ كِتٰبِيَه",en:"But as for he who is given his record in his left hand, he will say, \"Oh, I wish I had not been given my record"},{v:26,ar:"وَلَم أَدرِ ما حِسابِيَه",en:"And had not known what is my account."},{v:27,ar:"يٰلَيتَها كانَتِ القاضِيَةَ",en:"I wish my death had been the decisive one."},{v:28,ar:"ما أَغنىٰ عَنّى مالِيَه",en:"My wealth has not availed me."},{v:29,ar:"هَلَكَ عَنّى سُلطٰنِيَه",en:"Gone from me is my authority.\""}],
  70:[{v:22,ar:"إِلَّا المُصَلّينَ",en:"Except the observers of prayer -"}],
  71:[{v:15,ar:"أَلَم تَرَوا كَيفَ خَلَقَ اللَّهُ سَبعَ سَمٰوٰتٍ طِباقًا",en:"Do you not consider how Allah has created seven heavens in layers"},{v:16,ar:"وَجَعَلَ القَمَرَ فيهِنَّ نورًا وَجَعَلَ الشَّمسَ سِراجًا",en:"And made the moon therein a [reflected] light and made the sun a burning lamp?"}],
  72:[{v:13,ar:"وَأَنّا لَمّا سَمِعنَا الهُدىٰ ءامَنّا بِهِ فَمَن يُؤمِن بِرَبِّهِ فَلا يَخافُ بَخسًا وَلا رَهَقًا",en:"And when we heard the guidance, we believed in it. And whoever believes in his Lord will not fear deprivation or burden."}],
  73:[{v:10,ar:"وَاصبِر عَلىٰ ما يَقولونَ وَاهجُرهُم هَجرًا جَميلًا",en:"And be patient over what they say and avoid them with gracious avoidance."},{v:11,ar:"وَذَرنى وَالمُكَذِّبينَ أُولِى النَّعمَةِ وَمَهِّلهُم قَليلًا",en:"And leave Me with [the matter of] the deniers, those of ease [in life], and allow them respite a little."}],
  74:[{v:27,ar:"وَما أَدرىٰكَ ما سَقَرُ",en:"And what can make you know what is Saqar?"}],
  75:[{v:19,ar:"ثُمَّ إِنَّ عَلَينا بَيانَهُ",en:"Then upon Us is its clarification [to you]."},{v:20,ar:"كَلّا بَل تُحِبّونَ العاجِلَةَ",en:"No! But you love the immediate"}],
  76:[{v:22,ar:"إِنَّ هٰذا كانَ لَكُم جَزاءً وَكانَ سَعيُكُم مَشكورًا",en:"[And it will be said], \"Indeed, this is for you a reward, and your effort has been appreciated.\""},{v:23,ar:"إِنّا نَحنُ نَزَّلنا عَلَيكَ القُرءانَ تَنزيلًا",en:"Indeed, it is We who have sent down to you, [O Muhammad], the Qur'an progressively."}],
  77:[{v:26,ar:"أَحياءً وَأَموٰتًا",en:"Of the living and the dead?"}],
  78:[{v:21,ar:"إِنَّ جَهَنَّمَ كانَت مِرصادًا",en:"Indeed, Hell has been lying in wait"}],
  79:[{v:26,ar:"إِنَّ فى ذٰلِكَ لَعِبرَةً لِمَن يَخشىٰ",en:"Indeed in that is a warning for whoever would fear [Allah]."},{v:27,ar:"ءَأَنتُم أَشَدُّ خَلقًا أَمِ السَّماءُ بَنىٰها",en:"Are you a more difficult creation or is the heaven? Allah constructed it."}],
  80:[{v:23,ar:"كَلّا لَمّا يَقضِ ما أَمَرَهُ",en:"No! Man has not yet accomplished what He commanded him."}],
  81:[{v:14,ar:"عَلِمَت نَفسٌ ما أَحضَرَت",en:"A soul will [then] know what it has brought [with it]."},{v:15,ar:"فَلا أُقسِمُ بِالخُنَّسِ",en:"So I swear by the retreating stars -"}],
  82:[{v:9,ar:"كَلّا بَل تُكَذِّبونَ بِالدّينِ",en:"No! But you deny the Recompense."}],
  83:[{v:17,ar:"ثُمَّ يُقالُ هٰذَا الَّذى كُنتُم بِهِ تُكَذِّبونَ",en:"Then it will be said [to them], \"This is what you used to deny.\""},{v:18,ar:"كَلّا إِنَّ كِتٰبَ الأَبرارِ لَفى عِلِّيّينَ",en:"No! Indeed, the record of the righteous is in 'illiyyun."}],
  84:[{v:13,ar:"إِنَّهُ كانَ فى أَهلِهِ مَسرورًا",en:"Indeed, he had [once] been among his people in happiness;"},{v:14,ar:"إِنَّهُ ظَنَّ أَن لَن يَحورَ",en:"Indeed, he had thought he would never return [to Allah]."},{v:15,ar:"بَلىٰ إِنَّ رَبَّهُ كانَ بِهِ بَصيرًا",en:"But yes! Indeed, his Lord was ever of him, Seeing."}],
  85:[{v:10,ar:"إِنَّ الَّذينَ فَتَنُوا المُؤمِنينَ وَالمُؤمِنٰتِ ثُمَّ لَم يَتوبوا فَلَهُم عَذابُ جَهَنَّمَ وَلَهُم عَذابُ الحَريقِ",en:"Indeed, those who have tortured the believing men and believing women and then have not repented will have the punishment of Hell, and they will have the punishment of the Burning Fire."},{v:11,ar:"إِنَّ الَّذينَ ءامَنوا وَعَمِلُوا الصّٰلِحٰتِ لَهُم جَنّٰتٌ تَجرى مِن تَحتِهَا الأَنهٰرُ ذٰلِكَ الفَوزُ الكَبيرُ",en:"Indeed, those who have believed and done righteous deeds will have gardens beneath which rivers flow. That is the great attainment."}],
  86:[{v:9,ar:"يَومَ تُبلَى السَّرائِرُ",en:"The Day when secrets will be put on trial,"},{v:10,ar:"فَما لَهُ مِن قُوَّةٍ وَلا ناصِرٍ",en:"Then man will have no power or any helper."}],
  87:[{v:9,ar:"فَذَكِّر إِن نَفَعَتِ الذِّكرىٰ",en:"So remind, if the reminder should benefit;"},{v:10,ar:"سَيَذَّكَّرُ مَن يَخشىٰ",en:"He who fears [Allah] will be reminded."}],
  88:[{v:17,ar:"أَفَلا يَنظُرونَ إِلَى الإِبِلِ كَيفَ خُلِقَت",en:"Then do they not look at the camels - how they are created?"}],
  89:[{v:17,ar:"كَلّا بَل لا تُكرِمونَ اليَتيمَ",en:"No! But you do not honor the orphan"}],
  90:[{v:11,ar:"فَلَا اقتَحَمَ العَقَبَةَ",en:"But he has not broken through the difficult pass."},{v:12,ar:"وَما أَدرىٰكَ مَا العَقَبَةُ",en:"And what can make you know what is [breaking through] the difficult pass?"}],
  91:[{v:9,ar:"قَد أَفلَحَ مَن زَكّىٰها",en:"He has succeeded who purifies it,"},{v:10,ar:"وَقَد خابَ مَن دَسّىٰها",en:"And he has failed who instills it [with corruption]."}],
  92:[{v:11,ar:"وَما يُغنى عَنهُ مالُهُ إِذا تَرَدّىٰ",en:"And what will his wealth avail him when he falls?"}],
  93:[{v:8,ar:"وَوَجَدَكَ عائِلًا فَأَغنىٰ",en:"And He found you poor and made [you] self-sufficient."},{v:9,ar:"فَأَمَّا اليَتيمَ فَلا تَقهَر",en:"So as for the orphan, do not oppress [him]."}],
  94:[{v:5,ar:"فَإِنَّ مَعَ العُسرِ يُسرًا",en:"For indeed, with hardship [will be] ease."},{v:6,ar:"إِنَّ مَعَ العُسرِ يُسرًا",en:"Indeed, with hardship [will be] ease."}],
  95:[{v:5,ar:"ثُمَّ رَدَدنٰهُ أَسفَلَ سٰفِلينَ",en:"Then We return him to the lowest of the low,"}],
  96:[{v:9,ar:"أَرَءَيتَ الَّذى يَنهىٰ",en:"Have you seen the one who forbids"},{v:10,ar:"عَبدًا إِذا صَلّىٰ",en:"A servant when he prays?"}],
  97:[{v:3,ar:"لَيلَةُ القَدرِ خَيرٌ مِن أَلفِ شَهرٍ",en:"The Night of Decree is better than a thousand months."}],
  98:[{v:5,ar:"وَما أُمِروا إِلّا لِيَعبُدُوا اللَّهَ مُخلِصينَ لَهُ الدّينَ حُنَفاءَ وَيُقيمُوا الصَّلوٰةَ وَيُؤتُوا الزَّكوٰةَ وَذٰلِكَ دينُ القَيِّمَةِ",en:"And they were not commanded except to worship Allah, [being] sincere to Him in religion, inclining to truth, and to establish prayer and to give zakah. And that is the correct religion."}],
  99:[{v:4,ar:"يَومَئِذٍ تُحَدِّثُ أَخبارَها",en:"That Day, it will report its news"},{v:5,ar:"بِأَنَّ رَبَّكَ أَوحىٰ لَها",en:"Because your Lord has commanded it."}],
  100:[{v:6,ar:"إِنَّ الإِنسٰنَ لِرَبِّهِ لَكَنودٌ",en:"Indeed mankind, to his Lord, is ungrateful."}],
  101:[{v:3,ar:"وَما أَدرىٰكَ مَا القارِعَةُ",en:"And what can make you know what is the Striking Calamity?"},{v:4,ar:"يَومَ يَكونُ النّاسُ كَالفَراشِ المَبثوثِ",en:"It is the Day when people will be like moths, dispersed,"}],
  102:[{v:5,ar:"كَلّا لَو تَعلَمونَ عِلمَ اليَقينِ",en:"No! If you only knew with knowledge of certainty..."}],
  103:[{v:2,ar:"إِنَّ الإِنسٰنَ لَفى خُسرٍ",en:"Indeed, mankind is in loss,"}],
  104:[{v:4,ar:"كَلّا لَيُنبَذَنَّ فِى الحُطَمَةِ",en:"No! He will surely be thrown into the Crusher."},{v:5,ar:"وَما أَدرىٰكَ مَا الحُطَمَةُ",en:"And what can make you know what is the Crusher?"}],
  105:[{v:3,ar:"وَأَرسَلَ عَلَيهِم طَيرًا أَبابيلَ",en:"And He sent against them birds in flocks,"}],
  106:[{v:3,ar:"فَليَعبُدوا رَبَّ هٰذَا البَيتِ",en:"Let them worship the Lord of this House,"}],
  107:[{v:4,ar:"فَوَيلٌ لِلمُصَلّينَ",en:"So woe to those who pray"}],
  108:[{v:2,ar:"فَصَلِّ لِرَبِّكَ وَانحَر",en:"So pray to your Lord and sacrifice [to Him alone]."}],
  109:[{v:6,ar:"لَكُم دينُكُم وَلِىَ دينِ",en:"For you is your religion, and for me is my religion.\""}],
  110:[{v:3,ar:"فَسَبِّح بِحَمدِ رَبِّكَ وَاستَغفِرهُ إِنَّهُ كانَ تَوّابًا",en:"Then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance."}],
  111:[{v:3,ar:"سَيَصلىٰ نارًا ذاتَ لَهَبٍ",en:"He will [enter to] burn in a Fire of [blazing] flame"}],
  112:[{v:3,ar:"لَم يَلِد وَلَم يولَد",en:"He neither begets nor is born,"}],
  113:[{v:3,ar:"وَمِن شَرِّ غاسِقٍ إِذا وَقَبَ",en:"And from the evil of darkness when it settles"}],
  114:[{v:4,ar:"مِن شَرِّ الوَسواسِ الخَنّاسِ",en:"From the evil of the retreating whisperer -"}],
};

/*
 * GOLD_WORDS — Curated semantic-structural echoes
 *
 * These are pivot verses where a specific Arabic word's MEANING
 * mirrors the surah's STRUCTURAL position.
 *
 * Rules for inclusion:
 * 1. The word must be central to the meaning of the pivot verse
 * 2. The word must have a real semantic echo with the structural position
 * 3. A first-time user can feel the connection without explanation
 *
 * This is curation, not a feature. Do not label, explain, or draw
 * attention to these highlights in the UI. Let people discover them.
 */
const GOLD_WORDS = {
  1: [
    {
      verse: 5,
      words: ["إِيّاكَ"],
      reason: "Grammatical person pivot — shifts from 3rd person to 2nd person addressing Allah directly"
    }
  ],
  2: [
    {
      verse: 143,
      words: ["وَسَطًا"],
      reason: "Middle/just — the word meaning 'middle' sits at the structural middle of the longest surah"
    }
  ],
  3: [
    {
      verse: 103,
      words: ["حَبلِ اللَّهِ"],
      reason: "Rope of Allah — the command to hold together sits at the hinge between theological and communal halves"
    }
  ],
  12: [
    {
      verse: 36,
      words: ["السِّجنَ"],
      reason: "Prison — the narrative nadir, everything before is descent, everything after is ascent"
    }
  ],
  24: [
    {
      verse: 35,
      words: ["نورُ"],
      reason: "Light — at the structural center of the surah named The Light"
    }
  ],
  31: [
    {
      verse: 16,
      words: ["يٰبُنَىَّ"],
      reason: "O my son — Luqman's address to his son at the center of Luqman's surah"
    }
  ],
  47: [
    {
      verse: 19,
      words: ["لا إِلٰهَ إِلَّا اللَّهُ"],
      reason: "The shahada at the dead center (offset 0.0000) of the surah bearing the Prophet's name"
    }
  ],
  55: [
    {
      verse: 26,
      words: ["فانٍ"],
      reason: "Perishing — one half of the mortality pivot"
    },
    {
      verse: 27,
      words: ["يَبقىٰ"],
      reason: "Remains/endures — the structural turn between temporal and eternal"
    }
  ]
};

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 3: VALIDATION — fail hard if anything is wrong
   ═══════════════════════════════════════════════════════════════════ */
const VALID_CL = ["compound_seam","single_concentration","distributed_convergence","refrain_governed","terminal","multi_pivot"];

function validateDataset(data) {
  const errors = [];
  if (data.length !== 114) errors.push(`Expected 114 surahs, got ${data.length}`);
  const nums = new Set(data.map(d => d.surah_number));
  for (let i = 1; i <= 114; i++) if (!nums.has(i)) errors.push(`Missing surah ${i}`);
  if (nums.size !== 114) errors.push("Duplicate surah numbers");
  for (const d of data) {
    if (!Number.isInteger(d.verse_count) || d.verse_count < 1) errors.push(`Q.${d.surah_number}: invalid verse_count`);
    if (typeof d.pivot_offset !== "number" || isNaN(d.pivot_offset)) errors.push(`Q.${d.surah_number}: non-numeric offset`);
    if (Math.abs(d.pivot_offset) > 0.51) errors.push(`Q.${d.surah_number}: offset out of bounds`);
    if (!VALID_CL.includes(d.pivot_center_logic)) errors.push(`Q.${d.surah_number}: invalid classification`);
  }
  // Validate pivot verse existence AND coverage count
  for (const d of data) {
    const pv = PIVOT_VERSES[d.surah_number];
    if (!pv || pv.length === 0) { errors.push(`Q.${d.surah_number}: missing pivot verse text`); continue; }
    // Compute expected verse count from pivot_verse range
    const rng = d.pivot_verse.match(/(\d+)\s*[–\-]\s*(\d+)/);
    const expectedCount = rng ? (parseInt(rng[2]) - parseInt(rng[1]) + 1) : 1;
    if (pv.length !== expectedCount) {
      errors.push(`Q.${d.surah_number}: pivot verse count mismatch — got ${pv.length}, expected ${expectedCount} for range ${d.pivot_verse}`);
    }
  }
  return errors;
}

const VALIDATION_ERRORS = validateDataset(RAW_DATASET);

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 4: DATA LAYER
   Single source of truth. All derived values computed here.
   No component touches RAW_DATASET or PIVOT_VERSES directly.
   ═══════════════════════════════════════════════════════════════════ */
const CL_LABELS = {
  compound_seam: "Compound Seam", single_concentration: "Single Concentration",
  distributed_convergence: "Distributed Convergence", refrain_governed: "Refrain-Governed",
  terminal: "Terminal", multi_pivot: "Multi-Pivot",
};
const CL_COLORS = {
  compound_seam: "#6b9dad", single_concentration: "#d4a843",
  distributed_convergence: "#a68a6d", refrain_governed: "#8b7bb5",
  terminal: "#c47a6e", multi_pivot: "#5a8db5",
};

function parsePivotRange(pv) {
  const ax = pv.match(/axis:\s*v\.(\d+)/);
  if (ax) { const r = pv.match(/(\d+)\s*[–\-]\s*(\d+)/); return { start: r ? +r[1] : +ax[1], end: r ? +r[2] : +ax[1], mid: +ax[1] }; }
  const rng = pv.match(/(\d+)\s*[–\-]\s*(\d+)/);
  if (rng) { const s = +rng[1], e = +rng[2]; return { start: s, end: e, mid: (s + e) / 2 }; }
  const n = parseInt(pv); return { start: n, end: n, mid: n };
}

const SURAHS = RAW_DATASET.map(d => {
  const range = parsePivotRange(d.pivot_verse);
  return { ...d, absOffset: Math.abs(d.pivot_offset), pivotRange: range,
    clLabel: CL_LABELS[d.pivot_center_logic] || d.pivot_center_logic,
    clColor: CL_COLORS[d.pivot_center_logic] || "#666" };
});

function getAllSurahs() { return SURAHS; }
function getSurahByNumber(n) { return SURAHS.find(s => s.surah_number === n); }
function getPivotVerses(n) { return PIVOT_VERSES[n] || []; }
function getAdjacentSurahs(n) { return { prev: n > 1 ? n - 1 : null, next: n < 114 ? n + 1 : null }; }

function getCorpusStats() {
  const abs = SURAHS.map(s => s.absOffset);
  const n = abs.length;
  const mean = abs.reduce((a, b) => a + b, 0) / n;
  const sorted = [...abs].sort((a, b) => a - b);
  const median = n % 2 === 0 ? (sorted[n/2-1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
  const within5 = abs.filter(o => o <= 0.05).length;
  return { n, totalVerses: SURAHS.reduce((a,s) => a + s.verse_count, 0), mean, median, within5, within5pct: within5/n };
}

function getClassificationCounts() {
  const counts = {};
  for (const s of SURAHS) counts[s.pivot_center_logic] = (counts[s.pivot_center_logic] || 0) + 1;
  return counts;
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 5: STRUCTURAL BAR COMPONENT
   The core visual of Maraya — shows the shape of a surah.
   ═══════════════════════════════════════════════════════════════════ */
const StructuralBar = ({ surah, height = 40, showLabels = false, compact = false, pivotHighlighted = false, onPivotInteract }) => {
  const vc = surah.verse_count;
  const r = surah.pivotRange;
  const pivotStartPct = ((r.start - 0.5) / vc) * 100;
  const pivotEndPct = ((r.end + 0.5) / vc) * 100;
  const pivotMidPct = (r.mid / vc) * 100;
  const centerPct = 50;
  const pivotWidth = pivotEndPct - pivotStartPct;
  const glowing = pivotHighlighted;

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div style={{
        position: "relative", height, borderRadius: 4, overflow: "hidden",
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)"
      }}>
        {/* Pre-pivot region */}
        <div style={{
          position: "absolute", top: 0, left: 0, height: "100%",
          width: `${pivotStartPct}%`,
          background: "rgba(212,168,67,0.08)",
        }} />
        {/* Post-pivot region */}
        <div style={{
          position: "absolute", top: 0, left: `${pivotEndPct}%`, height: "100%",
          width: `${100 - pivotEndPct}%`,
          background: "rgba(107,157,173,0.08)",
        }} />
        {/* Pivot zone — interactive when handler provided */}
        <div
          style={{
            position: "absolute", top: 0, height: "100%",
            left: `${pivotStartPct}%`, width: `${Math.max(pivotWidth, 2)}%`,
            background: glowing ? "rgba(212,168,67,0.5)" : "rgba(212,168,67,0.3)",
            borderLeft: `1.5px solid ${glowing ? "rgba(212,168,67,1)" : "rgba(212,168,67,0.7)"}`,
            borderRight: `1.5px solid ${glowing ? "rgba(212,168,67,1)" : "rgba(212,168,67,0.7)"}`,
            cursor: onPivotInteract ? "pointer" : "default",
            transition: "background 0.2s, border-color 0.2s",
            boxShadow: glowing ? "0 0 16px rgba(212,168,67,0.25)" : "none",
          }}
          onMouseEnter={onPivotInteract ? () => onPivotInteract(true) : undefined}
          onMouseLeave={onPivotInteract ? () => onPivotInteract(false) : undefined}
          onClick={onPivotInteract ? (e) => { e.stopPropagation(); onPivotInteract("toggle"); } : undefined}
        />
        {/* Pivot midpoint */}
        <div style={{
          position: "absolute", top: 0, height: "100%",
          left: `${pivotMidPct}%`, width: 2,
          background: glowing ? "#e2c05c" : "#d4a843",
          transition: "background 0.2s",
        }} />
        {/* Geometric center */}
        <div style={{
          position: "absolute", top: 0, height: "100%",
          left: `${centerPct}%`, width: 1,
          borderLeft: "1.5px dashed rgba(200,200,200,0.3)",
        }} />
      </div>
      {showLabels && !compact && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, alignItems: "flex-start", position: "relative" }}>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: "var(--t3)", letterSpacing: "0.05em", opacity: 0.7 }}>v.1</span>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: "rgba(200,200,200,0.25)", position: "absolute", left: "50%", transform: "translateX(-50%)", letterSpacing: "0.05em" }}>center</span>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: "var(--t3)", letterSpacing: "0.05em", opacity: 0.7 }}>v.{vc}</span>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 6: STYLES
   ═══════════════════════════════════════════════════════════════════ */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Source+Sans+3:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&family=Amiri:wght@400;700&display=swap');

/*
 * SPACING SCALE (4px base): 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128
 *
 * TYPOGRAPHY SCALE (locked):
 *   Cormorant Garamond: 48px (h1) · 28px (section titles) · 20px (card names)
 *   Amiri:              30px (display Arabic) · 16px (inline Arabic)
 *   JetBrains Mono:     16px (stat values) · 11px (labels/buttons) · 10px (section labels) · 9px (bar labels)
 *   Source Sans 3:      15px (body)
 */

/* — Hero assembly animation keyframes — */
@keyframes heroMarkFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes heroBarContainer { from { opacity: 0; } to { opacity: 1; } }
@keyframes heroRegionLeft { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
@keyframes heroRegionRight { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
@keyframes heroPivotZone { from { opacity: 0; box-shadow: 0 0 0 rgba(212,168,67,0); } to { opacity: 1; box-shadow: 0 0 24px rgba(212,168,67,0.12); } }
@keyframes heroPivotLine { 0% { opacity: 0; } 50% { opacity: 1; box-shadow: 0 0 12px rgba(212,168,67,0.5); } 100% { opacity: 1; box-shadow: none; } }
@keyframes heroCenterLine { from { opacity: 0; } to { opacity: 1; } }
@keyframes revealUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes revealFade { from { opacity: 0; } to { opacity: 1; } }

:root {
  --bg: #0a0a0b;
  --bg2: #0f0f11;
  --bg3: #141415;
  --bg-card: #121214;
  --bg-card-h: #18181b;
  --border: rgba(255,255,255,0.05);
  --border-h: rgba(255,255,255,0.1);
  --gold: #d4a843;
  --gold-bright: #e2c05c;
  --gold-dim: rgba(212,168,67,0.5);
  --gold-glow: rgba(212,168,67,0.15);
  --teal: #6b9dad;
  --t1: #ebebeb;
  --t2: #9a978f;
  --t3: #5e5c56;
  --t4: #484848;
  --f-head: 'Cormorant Garamond', Georgia, serif;
  --f-body: 'Source Sans 3', system-ui, sans-serif;
  --f-mono: 'JetBrains Mono', 'Menlo', monospace;
  --f-ar: 'Amiri', serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg); color: var(--t1); font-family: var(--f-body); font-size: 15px; line-height: 1.6; -webkit-font-smoothing: antialiased; }

.maraya-root { max-width: 1080px; margin: 0 auto; padding: 0 20px; min-height: 100vh; }

/* === LANDING === */
.landing { padding: 128px 0 48px; }
.landing-hero { text-align: center; margin-bottom: 96px; }

/* — Mark — */
.landing-mark {
  font-family: var(--f-ar); font-size: 20px; color: var(--gold); opacity: 0;
  direction: rtl; margin-bottom: 24px; font-weight: 400; letter-spacing: 0.02em;
  animation: heroMarkFade 0.3s ease 0s both;
}

/* — Hero bar — */
.hero-bar-wrap {
  position: relative; max-width: 660px; margin: 0 auto 48px; opacity: 0;
  animation: heroBarContainer 0.5s ease 0.2s both;
}
.hero-bar {
  position: relative; height: 88px; border-radius: 4px; overflow: hidden;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
}
.hero-bar .hb-pre {
  position: absolute; top: 0; height: 100%; opacity: 0;
  background: rgba(212,168,67,0.07);
  animation: heroRegionLeft 0.4s ease 0.55s both;
}
.hero-bar .hb-post {
  position: absolute; top: 0; height: 100%; opacity: 0;
  background: rgba(107,157,173,0.07);
  animation: heroRegionRight 0.4s ease 0.7s both;
}
.hero-bar .hb-pivot {
  position: absolute; top: 0; height: 100%; opacity: 0;
  background: rgba(212,168,67,0.3);
  border-left: 1.5px solid rgba(212,168,67,0.7);
  border-right: 1.5px solid rgba(212,168,67,0.7);
  animation: heroPivotZone 0.3s ease 0.95s both;
}
.hero-bar .hb-mid {
  position: absolute; top: 0; height: 100%; width: 2px; opacity: 0;
  background: #d4a843;
  animation: heroPivotLine 0.3s ease 1.1s both;
}
.hero-bar .hb-center {
  position: absolute; top: 0; left: 50%; height: 100%; width: 0; opacity: 0;
  border-left: 1.5px dashed rgba(200,200,200,0.25);
  animation: heroCenterLine 0.3s ease 0.8s both;
}

/* — Headline and subtitle below bar — */
.landing-hero h1 {
  font-family: var(--f-head); font-size: 48px; font-weight: 300; letter-spacing: -0.025em;
  line-height: 1.1; color: var(--t1); margin-bottom: 20px; opacity: 0;
  animation: revealUp 0.4s ease 1.35s both;
}
.landing-tagline {
  font-family: var(--f-head); font-size: 20px; font-weight: 300; color: var(--t2); letter-spacing: 0.01em;
  margin-bottom: 40px; font-style: italic; max-width: 440px; margin-left: auto; margin-right: auto;
  line-height: 1.65; opacity: 0;
  animation: revealUp 0.3s ease 1.5s both;
}
.landing-cta {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--gold); border: 0.5px solid rgba(212,168,67,0.25); border-radius: 4px;
  padding: 12px 24px; background: transparent; cursor: pointer; transition: all 0.2s;
  opacity: 0; animation: revealUp 0.3s ease 1.65s both;
}
.landing-cta:hover { background: rgba(212,168,67,0.04); box-shadow: 0 0 20px rgba(212,168,67,0.08); border-color: rgba(212,168,67,0.35); }

/* — Featured surahs — */
.feature-surahs { max-width: 640px; margin: 0 auto 80px; }
.feature-label {
  font-family: var(--f-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--t3); margin-bottom: 24px; text-align: center;
  opacity: 0; animation: revealFade 0.3s ease 1.85s both;
}
.feature-card {
  background: var(--bg-card); border: 1px solid transparent; border-radius: 8px;
  padding: 24px 24px 20px; margin-bottom: 12px; cursor: pointer; transition: all 0.2s;
  opacity: 0; animation: revealUp 0.4s ease both;
}
.feature-card:nth-child(2) { animation-delay: 2.0s; }
.feature-card:nth-child(3) { animation-delay: 2.15s; }
.feature-card:nth-child(4) { animation-delay: 2.3s; }
.feature-card:hover { background: var(--bg-card-h); border-color: rgba(255,255,255,0.04); }
.feature-card-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
.feature-card-name {
  font-family: var(--f-head); font-size: 20px; font-weight: 400; color: var(--t1);
}
.feature-card-ar {
  font-family: var(--f-ar); font-size: 16px; color: var(--t3); direction: rtl; margin-left: 8px;
}
.feature-card-name .num { color: var(--t3); font-family: var(--f-mono); font-size: 11px; margin-right: 8px; }
.feature-card-meta { font-family: var(--f-mono); font-size: 10px; color: var(--t3); display: flex; gap: 16px; letter-spacing: 0.02em; }

/* — Corpus stats — */
.corpus-strip {
  display: flex; gap: 40px; justify-content: center; padding: 32px 0; margin: 0 auto;
  flex-wrap: wrap; opacity: 0; animation: revealFade 0.3s ease 2.4s both;
}
.corpus-stat { text-align: center; }
.corpus-val { font-family: var(--f-mono); font-size: 16px; color: var(--gold); font-weight: 400; opacity: 0.8; }
.corpus-label { font-family: var(--f-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--t3); margin-top: 4px; }

/* === BROWSE === */
.browse { padding: 32px 0; }
.browse-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.browse-title { font-family: var(--f-head); font-size: 28px; font-weight: 300; color: var(--t1); }
.browse-controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.search-box {
  position: relative; width: 220px;
}
.search-box input {
  width: 100%; padding: 8px 12px 8px 32px; font-family: var(--f-body); font-size: 15px;
  border: 1px solid var(--border); border-radius: 4px; background: var(--bg2); color: var(--t1);
  outline: none; transition: border-color 0.2s;
}
.search-box input:focus { border-color: rgba(212,168,67,0.4); }
.search-box input::placeholder { color: var(--t3); }
.search-box .s-icon { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); color: var(--t3); }

.sort-btn {
  font-family: var(--f-mono); font-size: 10px; padding: 8px 12px; border: 1px solid var(--border);
  border-radius: 4px; background: transparent; color: var(--t4); cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; gap: 4px; letter-spacing: 0.02em; white-space: nowrap;
}
.sort-btn:hover { color: var(--t2); border-color: var(--border-h); }
.sort-btn.active { color: var(--gold); border-color: rgba(212,168,67,0.3); background: rgba(212,168,67,0.04); }

.filter-chips { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 20px; }
.chip {
  font-family: var(--f-mono); font-size: 9px; padding: 4px 8px; border: 1px solid var(--border);
  border-radius: 20px; background: transparent; color: var(--t4); cursor: pointer; transition: all 0.2s;
  letter-spacing: 0.03em; white-space: nowrap;
}
.chip:hover { border-color: var(--border-h); color: var(--t2); }
.chip.active { border-color: rgba(212,168,67,0.3); color: var(--gold); background: rgba(212,168,67,0.04); }

.surah-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 8px; }
.surah-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 6px;
  padding: 16px; cursor: pointer; transition: all 0.2s;
}
.surah-card:hover { border-color: rgba(212,168,67,0.15); background: var(--bg-card-h); }
.surah-card-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.sc-name { font-family: var(--f-head); font-size: 20px; font-weight: 400; color: var(--t1); }
.sc-num { font-family: var(--f-mono); font-size: 11px; color: var(--t3); margin-right: 8px; }
.sc-ar { font-family: var(--f-ar); font-size: 16px; color: var(--t2); direction: rtl; }
.sc-stats { display: flex; gap: 16px; margin-top: 8px; }
.sc-stat { font-family: var(--f-mono); font-size: 10px; color: var(--t3); letter-spacing: 0.03em; }
.sc-stat b { color: var(--t2); font-weight: 500; }

/* === DETAIL === */
@keyframes detailBarReveal {
  from { opacity: 0; transform: scaleX(0.94); }
  to { opacity: 1; transform: scaleX(1); }
}
.detail { padding: 24px 0; }
.detail-top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.back-btn {
  font-family: var(--f-mono); font-size: 11px; color: var(--t3); cursor: pointer;
  display: inline-flex; align-items: center; gap: 4px; background: none; border: none; padding: 0;
  transition: color 0.2s; letter-spacing: 0.03em;
}
.back-btn:hover { color: var(--gold); }
.nav-lr { display: flex; gap: 8px; }
.nav-btn {
  font-family: var(--f-mono); font-size: 10px; color: var(--t3); cursor: pointer;
  display: inline-flex; align-items: center; gap: 4px; background: none;
  border: 1px solid var(--border); border-radius: 4px; padding: 4px 8px; transition: all 0.2s;
}
.nav-btn:hover { color: var(--gold); border-color: rgba(212,168,67,0.3); }
.nav-btn:disabled { opacity: 0.2; cursor: default; }

/* Identity — immediate, no animation delay */
.detail-identity { margin-bottom: 48px; text-align: center; }
.detail-identity .di-num { font-family: var(--f-mono); font-size: 11px; color: var(--t3); letter-spacing: 0.12em; margin-bottom: 8px; }
.detail-identity h2 { font-family: var(--f-head); font-size: 48px; font-weight: 300; letter-spacing: -0.02em; margin-bottom: 8px; }
.detail-identity .di-ar { font-family: var(--f-ar); font-size: 30px; color: rgba(212,168,67,0.6); direction: rtl; }

/* Scaffold — THE hero object, reveals at 0.4s */
.scaffold-section {
  margin-bottom: 48px; opacity: 0;
  animation: detailBarReveal 0.6s ease 0.4s both;
}
.scaffold-label {
  font-family: var(--f-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--t3); margin-bottom: 16px;
}
.detail-bar-object {
  border-radius: 4px; overflow: hidden;
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.03);
}
.scaffold-legend {
  display: flex; gap: 24px; justify-content: center; margin-top: 16px; flex-wrap: wrap;
}
.scaffold-legend-item { display: flex; align-items: center; gap: 8px; font-family: var(--f-mono); font-size: 10px; color: var(--t3); }
.legend-swatch { width: 12px; height: 4px; border-radius: 1px; }

/* Metrics strip — settles below bar at 0.6s */
.detail-strip {
  display: flex; gap: 1px; justify-content: center; flex-wrap: wrap;
  background: rgba(255,255,255,0.03); border-radius: 6px; overflow: hidden; margin-bottom: 48px;
  opacity: 0; animation: revealUp 0.5s ease 0.6s both;
}
.strip-item {
  background: var(--bg2); padding: 16px 20px; flex: 1; min-width: 100px; text-align: center;
}
.strip-val { font-family: var(--f-mono); font-size: 16px; color: var(--t2); font-weight: 400; }
.strip-val.gold { color: var(--gold); }
.strip-label { font-family: var(--f-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--t3); margin-top: 4px; }

/* Breakdown text — fades in at 0.8s */
.scaffold-breakdown {
  opacity: 0; animation: revealFade 0.4s ease 0.8s both;
}

/* Pivot verse section — cards stagger from 1.0s */
.pivot-section { margin-bottom: 48px; }
.pivot-section-title {
  font-family: var(--f-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--t3); margin-bottom: 24px;
  opacity: 0; animation: revealFade 0.3s ease 1.0s both;
}
.pivot-card {
  background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px;
  padding: 32px 40px; margin-bottom: 12px;
  opacity: 0; animation: revealUp 0.5s ease both;
}
.pv-ref { font-family: var(--f-mono); font-size: 11px; color: var(--gold); margin-bottom: 16px; letter-spacing: 0.06em; }
.pv-arabic {
  font-family: var(--f-ar); font-size: 30px; line-height: 2.4; direction: rtl; text-align: right;
  color: #ffffff; margin-bottom: 0; padding-bottom: 20px;
}
.pv-separator { border: none; border-top: 1px solid var(--border); margin: 0 0 16px; }
.pv-english { font-family: var(--f-body); font-size: 15px; line-height: 1.8; color: var(--t2); font-weight: 300; }

.cl-badge {
  font-family: var(--f-mono); font-size: 10px; padding: 4px 8px; border-radius: 4px;
  display: inline-block; letter-spacing: 0.02em; opacity: 0.6;
}

/* === PANORAMA === */
@keyframes panCellReveal {
  from { opacity: 0; clip-path: inset(0 0 100% 0); }
  to { opacity: 1; clip-path: inset(0 0 0% 0); }
}
@keyframes panGlow {
  0% { box-shadow: 0 0 0 rgba(212,168,67,0); }
  50% { box-shadow: 0 0 14px rgba(212,168,67,0.18); }
  100% { box-shadow: 0 0 0 rgba(212,168,67,0); }
}
@keyframes panSortFade {
  0% { opacity: 1; }
  40% { opacity: 0; }
  60% { opacity: 0; }
  100% { opacity: 1; }
}
.panorama { padding: 32px 0; }
.panorama-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; flex-wrap: wrap; gap: 12px; }
.panorama-title { font-family: var(--f-head); font-size: 28px; font-weight: 300; color: var(--t1); letter-spacing: -0.015em; }
.panorama-controls { display: flex; gap: 8px; align-items: center; }
.panorama-subtitle {
  font-family: var(--f-body); font-size: 15px; color: var(--t3); font-weight: 300;
  margin-bottom: 32px; letter-spacing: 0.01em;
}
.panorama-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 4px;
  max-width: 1200px;
}
.panorama-grid.pan-sorting { animation: panSortFade 0.35s ease-in-out; }
.pan-cell {
  position: relative; padding: 8px 8px 8px; border-radius: 4px;
  border: 1px solid transparent; cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  background: transparent;
  opacity: 0; animation: panCellReveal 0.3s ease both;
}
.pan-cell:hover { background: var(--bg-card); border-color: rgba(255,255,255,0.06); }
.pan-cell:hover .pan-name { opacity: 1; }
.pan-cell:hover .pan-num { color: var(--gold); }
.pan-cell:hover .pan-bar-wrap { border-color: rgba(255,255,255,0.08); }
.pan-cell:hover .pan-pz { background: rgba(212,168,67,0.5); box-shadow: 0 0 10px rgba(212,168,67,0.15); }
.pan-cell:hover .pan-pm { background: #e2c05c; box-shadow: 0 0 6px rgba(212,168,67,0.4); }
.pan-cell:hover .pan-meta { opacity: 1; }
.pan-cell.breathing .pan-pz { animation: panGlow 3s ease-in-out; }
.pan-num {
  font-family: var(--f-mono); font-size: 9px; color: var(--t3); letter-spacing: 0.03em;
  margin-bottom: 4px; transition: color 0.2s;
}
.pan-name {
  font-family: var(--f-mono); font-size: 9px; color: var(--t3); letter-spacing: 0.02em;
  margin-top: 4px; opacity: 0.35; transition: opacity 0.2s;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.pan-meta {
  font-family: var(--f-mono); font-size: 9px; color: var(--t3); letter-spacing: 0.02em;
  margin-top: 4px; opacity: 0; transition: opacity 0.2s;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.pan-bar-wrap {
  position: relative; height: 32px; border-radius: 2px; overflow: hidden;
  background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.035);
  transition: border-color 0.2s;
}
.pan-pz {
  position: absolute; top: 0; height: 100%;
  background: rgba(212,168,67,0.3);
  border-left: 1px solid rgba(212,168,67,0.6);
  border-right: 1px solid rgba(212,168,67,0.6);
  transition: background 0.2s, box-shadow 0.2s;
}
.pan-pm {
  position: absolute; top: 0; height: 100%; width: 1.5px; background: #d4a843;
  transition: background 0.2s, box-shadow 0.2s;
}
.pan-cl { position: absolute; top: 0; left: 50%; height: 100%; width: 0; border-left: 1px dashed rgba(200,200,200,0.15); }

.pan-view-toggle {
  font-family: var(--f-mono); font-size: 10px; padding: 4px 12px; border: 1px solid var(--border);
  border-radius: 4px; background: transparent; color: var(--t3); cursor: pointer; transition: all 0.2s;
  letter-spacing: 0.03em;
}
.pan-view-toggle:hover { border-color: var(--border-h); color: var(--t2); }
.pan-view-toggle.active { border-color: rgba(212,168,67,0.25); color: var(--gold); background: rgba(212,168,67,0.04); }

.pan-browse-link {
  font-family: var(--f-mono); font-size: 11px; color: var(--t3); cursor: pointer;
  display: inline-flex; align-items: center; gap: 4px; background: none; border: none;
  padding: 0; margin-top: 32px; transition: color 0.2s; letter-spacing: 0.02em;
}
.pan-browse-link:hover { color: var(--gold); }

/* === ABOUT === */
.about { padding: 48px 0; max-width: 600px; margin: 0 auto; }
.about-back { margin-bottom: 32px; }
.about-title {
  font-family: var(--f-head); font-size: 28px; font-weight: 300; color: var(--t1);
  margin-bottom: 24px; letter-spacing: -0.01em;
}
.about-body p {
  font-family: var(--f-body); font-size: 15px; line-height: 1.8; color: var(--t2);
  font-weight: 300; margin-bottom: 20px;
}
.about-body a {
  color: var(--gold); text-decoration: none; border-bottom: 1px solid rgba(212,168,67,0.3);
  transition: border-color 0.2s;
}
.about-body a:hover { border-color: var(--gold); }
.about-sources {
  margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border);
}
.about-sources-title {
  font-family: var(--f-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--t3); margin-bottom: 12px;
}
.about-source-row {
  font-family: var(--f-mono); font-size: 11px; color: var(--t3); line-height: 2.2;
  letter-spacing: 0.02em;
}
.about-source-row span { color: var(--t2); }
.footer-link {
  color: var(--t3); cursor: pointer; border: none; background: none;
  font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.04em;
  text-decoration: none; border-bottom: 1px solid transparent; transition: all 0.2s;
  padding: 0;
}
.footer-link:hover { color: var(--gold); border-bottom-color: rgba(212,168,67,0.3); }

/* === FOOTER === */
.maraya-footer {
  border-top: 1px solid var(--border); padding: 40px 0 32px; margin-top: 64px; text-align: center;
}
.footer-mark { font-family: var(--f-ar); font-size: 16px; color: var(--gold); opacity: 0.4; direction: rtl; margin-bottom: 8px; }
.footer-credit { font-family: var(--f-mono); font-size: 9px; color: var(--t4); letter-spacing: 0.06em; }

/* === MOBILE === */
@media (max-width: 640px) {
  .maraya-root { padding: 0 16px; }
  .landing { padding: 64px 0 24px; }
  .landing-mark { font-size: 16px; margin-bottom: 20px; }
  .hero-bar-wrap { margin-bottom: 32px; }
  .hero-bar { height: 48px; }
  .landing-hero h1 { font-size: 28px; }
  .landing-tagline { font-size: 16px; }
  .landing-hero { margin-bottom: 48px; }
  .feature-card { padding: 20px 16px; }
  .feature-card-head { flex-direction: column; gap: 4px; }
  .feature-card-meta { gap: 8px; }
  .feature-card-ar { margin-left: 0; }
  .corpus-strip { gap: 24px; }
  .corpus-val { font-size: 16px; }
  .surah-grid { grid-template-columns: 1fr; }
  .browse-header { flex-direction: column; align-items: stretch; }
  .search-box { width: 100%; }
  .detail-identity { margin-bottom: 32px; }
  .detail-identity h2 { font-size: 28px; }
  .detail-identity .di-ar { font-size: 20px; }
  .detail-strip { flex-direction: column; }
  .strip-item { min-width: auto; }
  .pv-arabic { font-size: 20px; line-height: 2.2; }
  .pivot-card { padding: 24px 20px; }
  /* Tighter reveal timing on mobile — reduce delays by 40% */
  .scaffold-section { animation-delay: 0.24s; }
  .detail-strip { animation-delay: 0.36s; }
  .scaffold-breakdown { animation-delay: 0.48s; }
  .pivot-section-title { animation-delay: 0.6s; }
  .panorama-grid { grid-template-columns: repeat(auto-fill, minmax(76px, 1fr)); gap: 4px; }
  .pan-bar-wrap { height: 24px; }
  .pan-cell { padding: 4px; }
  .pan-name { display: none; }
  .pan-meta { display: none; }
  .panorama-header { flex-direction: column; align-items: flex-start; }
  /* Tighter animation timing on mobile — reduce delays by ~30% */
  .landing-mark { animation-delay: 0s; }
  .hero-bar-wrap { animation-delay: 0.14s; }
  .hero-bar .hb-pre { animation-delay: 0.38s; }
  .hero-bar .hb-post { animation-delay: 0.49s; }
  .hero-bar .hb-center { animation-delay: 0.56s; }
  .hero-bar .hb-pivot { animation-delay: 0.66s; }
  .hero-bar .hb-mid { animation-delay: 0.77s; }
  .landing-hero h1 { animation-delay: 0.95s; }
  .landing-tagline { animation-delay: 1.05s; }
  .landing-cta { animation-delay: 1.15s; }
  .feature-label { animation-delay: 1.3s; }
  .feature-card:nth-child(2) { animation-delay: 1.4s; }
  .feature-card:nth-child(3) { animation-delay: 1.5s; }
  .feature-card:nth-child(4) { animation-delay: 1.6s; }
  .corpus-strip { animation-delay: 1.7s; }
}

@media (max-width: 380px) {
  .landing-hero h1 { font-size: 20px; }
  .landing-mark { font-size: 16px; }
  .hero-bar { height: 40px; }
  .sc-stats { flex-wrap: wrap; gap: 8px; }
}
`;

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 7: LANDING PAGE
   ═══════════════════════════════════════════════════════════════════ */
const FEATURED = [2, 18, 110]; // Al-Baqarah (near-perfect center), Al-Kahf (single point), An-Nasr (terminal pivot)

const LandingPage = ({ onExplore, onSelect }) => {
  const stats = useMemo(() => getCorpusStats(), []);
  const featured = useMemo(() => FEATURED.map(n => getSurahByNumber(n)), []);

  // Hero bar uses Al-Baqarah — near-perfect center, the most striking first impression
  const hero = useMemo(() => getSurahByNumber(2), []);
  const heroR = hero.pivotRange;
  const heroVc = hero.verse_count;
  const heroPivotStartPct = ((heroR.start - 0.5) / heroVc) * 100;
  const heroPivotEndPct = ((heroR.end + 0.5) / heroVc) * 100;
  const heroPivotMidPct = (heroR.mid / heroVc) * 100;
  const heroPivotWidth = Math.max(heroPivotEndPct - heroPivotStartPct, 2);

  return (
    <div className="landing">
      <div className="landing-hero">
        {/* 1. The mark — quiet, gold, a breath before the object */}
        <div className="landing-mark">مرايا</div>

        {/* 2. THE object — the hero structural bar */}
        <div className="hero-bar-wrap">
          <div className="hero-bar">
            <div className="hb-pre" style={{ left: 0, width: `${heroPivotStartPct}%` }} />
            <div className="hb-post" style={{ left: `${heroPivotEndPct}%`, width: `${100 - heroPivotEndPct}%` }} />
            <div className="hb-center" />
            <div className="hb-pivot" style={{ left: `${heroPivotStartPct}%`, width: `${heroPivotWidth}%` }} />
            <div className="hb-mid" style={{ left: `${heroPivotMidPct}%` }} />
          </div>
        </div>

        {/* 3. The headline — explains what the user just saw */}
        <h1>The architecture of revelation</h1>

        {/* 4. The subtitle */}
        <p className="landing-tagline">
          Every surah has a shape.<br />
          Maraya reveals where it turns.
        </p>

        {/* 5. The CTA — quiet invitation */}
        <button className="landing-cta" onClick={onExplore}>
          <Eye size={13} /> Explore all 114 surahs
        </button>
      </div>

      <div className="feature-surahs">
        <div className="feature-label">Three surahs, three shapes</div>
        {featured.map(s => {
          const pivotDesc = s.pivot_center_logic === "terminal" ? "Terminal pivot"
            : s.absOffset <= 0.01 ? "Pivot centered"
            : s.absOffset <= 0.05 ? "Pivot near center"
            : "Pivot off-center";
          return (
            <div key={s.surah_number} className="feature-card" onClick={() => onSelect(s.surah_number)}>
              <div className="feature-card-head">
                <div className="feature-card-name">
                  <span className="num">Q.{s.surah_number}</span>{s.surah_name_en}
                  <span className="feature-card-ar">{s.surah_name_ar}</span>
                </div>
                <div className="feature-card-meta">
                  <span>{s.verse_count} verses</span>
                  <span>{pivotDesc}</span>
                </div>
              </div>
              <StructuralBar surah={s} height={48} />
            </div>
          );
        })}
      </div>

      <div className="corpus-strip">
        <div className="corpus-stat"><div className="corpus-val">{stats.n}</div><div className="corpus-label">Surahs</div></div>
        <div className="corpus-stat"><div className="corpus-val">{stats.totalVerses.toLocaleString()}</div><div className="corpus-label">Verses</div></div>
        <div className="corpus-stat"><div className="corpus-val">{stats.within5}</div><div className="corpus-label">Pivots near center</div></div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 8: PANORAMA — The Corpus at a Glance
   114 structural bars in a single view. Same visual grammar, different altitude.
   ═══════════════════════════════════════════════════════════════════ */
const PanoramaPage = ({ onSelect, onBack, onBrowse }) => {
  const [arrangement, setArrangement] = useState("mushaf"); // "mushaf" | "length"
  const [sorting, setSorting] = useState(false);
  const [breathingIdx, setBreathingIdx] = useState(-1);
  const data = useMemo(() => getAllSurahs(), []);
  const gridRef = useRef(null);

  const arranged = useMemo(() => {
    if (arrangement === "length") return [...data].sort((a, b) => b.verse_count - a.verse_count);
    return data;
  }, [data, arrangement]);

  // Sort transition: brief crossfade
  const handleArrangement = useCallback((mode) => {
    if (mode === arrangement) return;
    setSorting(true);
    setTimeout(() => { setArrangement(mode); setSorting(false); }, 180);
  }, [arrangement]);

  // Ambient breathing — one random pivot glows every 5s, 3s duration
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    if (mq.matches) return;
    let iv = null;
    const startDelay = setTimeout(() => {
      iv = setInterval(() => {
        const idx = Math.floor(Math.random() * 114);
        setBreathingIdx(idx);
        setTimeout(() => setBreathingIdx(-1), 3000);
      }, 5000);
    }, 2000);
    return () => { clearTimeout(startDelay); if (iv) clearInterval(iv); };
  }, []);

  // Stagger delay per cell: ~1.2s across 114 = ~10.5ms each
  const staggerMs = 10.5;
  // Mobile detection for faster wave
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 640;
  const cellStagger = isMobile ? 5.3 : staggerMs;

  return (
    <div className="panorama">
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
        <button className="back-btn" onClick={onBack}><ChevronLeft size={14} /> Home</button>
      </div>
      <div className="panorama-header">
        <div className="panorama-title">114 Shapes</div>
        <div className="panorama-controls">
          <button className="pan-view-toggle" onClick={onBrowse} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Search size={11} /> Browse
          </button>
          <button
            className={`pan-view-toggle ${arrangement === "mushaf" ? "active" : ""}`}
            onClick={() => handleArrangement("mushaf")}>
            Muṣḥaf order
          </button>
          <button
            className={`pan-view-toggle ${arrangement === "length" ? "active" : ""}`}
            onClick={() => handleArrangement("length")}>
            By length
          </button>
        </div>
      </div>
      <div className="panorama-subtitle">
        Gold marks the pivot. The dashed line marks geometric center.
      </div>

      <div ref={gridRef} className={`panorama-grid${sorting ? " pan-sorting" : ""}`}>
        {arranged.map((s, i) => {
          const vc = s.verse_count;
          const r = s.pivotRange;
          const pStartPct = ((r.start - 0.5) / vc) * 100;
          const pEndPct = ((r.end + 0.5) / vc) * 100;
          const pMidPct = (r.mid / vc) * 100;
          const pWidth = Math.max(pEndPct - pStartPct, 2);
          const isBreathing = breathingIdx === i;

          return (
            <div
              key={s.surah_number}
              className={`pan-cell${isBreathing ? " breathing" : ""}`}
              style={{ animationDelay: `${(i * cellStagger).toFixed(0)}ms` }}
              onClick={() => onSelect(s.surah_number)}
            >
              <div className="pan-num">{s.surah_number}</div>
              <div className="pan-bar-wrap">
                <div className="pan-cl" />
                <div className="pan-pz" style={{ left: `${pStartPct}%`, width: `${pWidth}%` }} />
                <div className="pan-pm" style={{ left: `${pMidPct}%` }} />
              </div>
              <div className="pan-name">{s.surah_name_en}</div>
              <div className="pan-meta">{s.verse_count}v · {s.pivot_offset === 0 ? "centered" : (s.absOffset <= 0.05 ? "near center" : `±${s.absOffset.toFixed(2)}`)}</div>
            </div>
          );
        })}
      </div>

      <button className="pan-browse-link" onClick={onBrowse}>
        <Search size={12} /> Search and filter surahs
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 9: BROWSE PAGE
   ═══════════════════════════════════════════════════════════════════ */
const SORT_OPTIONS = [
  { key: "surah_number", label: "Number", asc: true },
  { key: "verse_count", label: "Length", asc: false },
  { key: "absOffset", label: "Most centered", asc: true },
  { key: "pivot_center_logic", label: "Classification", asc: true },
];

const BrowsePage = ({ onSelect, onBack }) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("surah_number");
  const [sortAsc, setSortAsc] = useState(true);
  const [filterCl, setFilterCl] = useState(null);
  const data = useMemo(() => getAllSurahs(), []);
  const clCounts = useMemo(() => getClassificationCounts(), []);

  const handleSort = (opt) => {
    if (opt.key === sortKey) { setSortAsc(!sortAsc); }
    else { setSortKey(opt.key); setSortAsc(opt.asc); }
  };

  const toggleFilter = (cl) => {
    setFilterCl(prev => prev === cl ? null : cl);
  };

  const sorted = useMemo(() => {
    let f = data;
    if (search) {
      const q = search.toLowerCase();
      f = data.filter(d =>
        d.surah_name_en.toLowerCase().includes(q) ||
        d.surah_name_ar.includes(q) ||
        String(d.surah_number) === q
      );
    }
    if (filterCl) f = f.filter(d => d.pivot_center_logic === filterCl);
    return [...f].sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (typeof va === "string") { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      return va < vb ? (sortAsc ? -1 : 1) : va > vb ? (sortAsc ? 1 : -1) : 0;
    });
  }, [data, sortKey, sortAsc, search, filterCl]);

  const fmt = v => v === 0 ? "0.0000" : v > 0 ? `+${v.toFixed(4)}` : v.toFixed(4);

  return (
    <div className="browse">
      <div className="browse-header">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button className="back-btn" onClick={onBack}><ChevronLeft size={14} /> Home</button>
          <div className="browse-title">All Surahs</div>
        </div>
        <div className="browse-controls">
          <div className="search-box">
            <Search size={14} className="s-icon" />
            <input placeholder="Search name or number..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {SORT_OPTIONS.map(opt => (
            <button key={opt.key}
              className={`sort-btn ${sortKey === opt.key ? "active" : ""}`}
              onClick={() => handleSort(opt)}>
              {opt.label}
              {sortKey === opt.key && <ArrowUpDown size={10} />}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-chips">
        {Object.entries(CL_LABELS).map(([k, l]) => (
          <button key={k} className={`chip ${filterCl === k ? "active" : ""}`} onClick={() => toggleFilter(k)}>
            {l} ({clCounts[k] || 0})
          </button>
        ))}
      </div>

      <div className="surah-grid">
        {sorted.map(s => (
          <div key={s.surah_number} className="surah-card" onClick={() => onSelect(s.surah_number)}>
            <div className="surah-card-top">
              <div>
                <span className="sc-num">{s.surah_number}.</span>
                <span className="sc-name">{s.surah_name_en}</span>
              </div>
              <span className="sc-ar">{s.surah_name_ar}</span>
            </div>
            <StructuralBar surah={s} height={36} compact />
            <div className="sc-stats">
              <span className="sc-stat"><b>{s.verse_count}</b> verses</span>
              <span className="sc-stat">pivot <b>{s.pivot_verse.length > 20 ? s.pivot_verse.substring(0,18)+'…' : s.pivot_verse}</b></span>
              <span className="sc-stat">offset <b>{fmt(s.pivot_offset)}</b></span>
            </div>
          </div>
        ))}
        {sorted.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: 40, textAlign: "center", color: "var(--t3)", fontFamily: "var(--f-mono)", fontSize: 13 }}>
            No surahs match your search.
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 10: DETAIL PAGE
   Core product surface — shows the shape of a single surah.
   ═══════════════════════════════════════════════════════════════════ */
function getGoldWords(surahNum, verseNum) {
  const entries = GOLD_WORDS[surahNum];
  if (!entries) return [];
  const entry = entries.find(e => e.verse === verseNum);
  return entry ? entry.words : [];
}

function renderArabicWithGold(arabicText, goldWords, lit) {
  if (!goldWords || goldWords.length === 0) {
    return <span>{arabicText}</span>;
  }

  let segments = [arabicText];
  for (const word of goldWords) {
    const newSegments = [];
    for (const seg of segments) {
      if (typeof seg !== 'string') {
        newSegments.push(seg);
        continue;
      }
      const idx = seg.indexOf(word);
      if (idx === -1) {
        newSegments.push(seg);
        continue;
      }
      if (idx > 0) newSegments.push(seg.slice(0, idx));
      newSegments.push(
        <span key={word} style={{
          color: '#d4a843',
          textShadow: lit ? '0 0 12px rgba(212,168,67,0.4)' : '0 0 8px rgba(212,168,67,0.3)',
        }}>{word}</span>
      );
      if (idx + word.length < seg.length) newSegments.push(seg.slice(idx + word.length));
    }
    segments = newSegments;
  }

  return <>{segments}</>;
}

const DetailPage = ({ surahNum, onBack, onNavigate }) => {
  const d = useMemo(() => getSurahByNumber(surahNum), [surahNum]);
  const verses = useMemo(() => getPivotVerses(surahNum), [surahNum]);
  const adj = useMemo(() => getAdjacentSurahs(surahNum), [surahNum]);
  const [pivotLit, setPivotLit] = useState(false);

  // Scroll to top on surah change
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); setPivotLit(false); }, [surahNum]);

  if (!d) return null;
  const r = d.pivotRange;
  const fmt = v => v === 0 ? "0.0000" : v > 0 ? `+${v.toFixed(4)}` : v.toFixed(4);
  const preCount = r.start - 1;
  const pivotCount = r.end - r.start + 1;
  const postCount = d.verse_count - r.end;

  // Base delay for pivot cards (1.0s on desktop, reduced on mobile via CSS overrides on .pivot-card)
  const pivotCardBaseDelay = 1.05;

  return (
    <div className="detail">
      <div className="detail-top-nav">
        <button className="back-btn" onClick={onBack}><ChevronLeft size={14} /> All Surahs</button>
        <div className="nav-lr">
          <button className="nav-btn" disabled={!adj.prev} onClick={() => adj.prev && onNavigate(adj.prev)}>
            <ChevronLeft size={11} /> {adj.prev ? `${adj.prev}` : ""}
          </button>
          <button className="nav-btn" disabled={!adj.next} onClick={() => adj.next && onNavigate(adj.next)}>
            {adj.next ? `${adj.next}` : ""} <ChevronRight size={11} />
          </button>
        </div>
      </div>

      {/* 1. IDENTITY — immediate, no delay */}
      <div className="detail-identity">
        <div className="di-num">SURAH {d.surah_number} OF 114</div>
        <h2>{d.surah_name_en}</h2>
        <div className="di-ar">{d.surah_name_ar}</div>
      </div>

      {/* 2. STRUCTURAL BAR — THE hero, reveals at 0.4s */}
      <div className="scaffold-section">
        <div className="scaffold-label">Structural Blueprint</div>
        <div className="detail-bar-object">
          <StructuralBar surah={d} height={72} showLabels pivotHighlighted={pivotLit}
            onPivotInteract={(action) => {
              if (action === "toggle") setPivotLit(p => !p);
              else setPivotLit(action);
            }}
          />
        </div>

        <div className="scaffold-legend">
          <div className="scaffold-legend-item"><div className="legend-swatch" style={{ background: "rgba(212,168,67,0.3)" }} />Pivot zone</div>
          <div className="scaffold-legend-item"><div className="legend-swatch" style={{ background: "#d4a843" }} />Pivot midpoint</div>
          <div className="scaffold-legend-item"><div className="legend-swatch" style={{ background: "rgba(200,200,200,0.3)", borderTop: "1px dashed rgba(200,200,200,0.5)", height: 0 }} />Geometric center</div>
        </div>
      </div>

      {/* 3. METRICS STRIP — settles below bar at 0.6s */}
      <div className="detail-strip">
        <div className="strip-item">
          <div className="strip-val">{d.verse_count}</div>
          <div className="strip-label">Verses</div>
        </div>
        <div className="strip-item">
          <div className="strip-val gold" style={{ fontSize: r.start === r.end ? 16 : 14 }}>{d.pivot_verse}</div>
          <div className="strip-label">Pivot</div>
        </div>
        <div className="strip-item">
          <div className="strip-val">{fmt(d.pivot_offset)}</div>
          <div className="strip-label">Offset</div>
        </div>
        <div className="strip-item">
          <div className="strip-val">{d.absOffset.toFixed(4)}</div>
          <div className="strip-label">|Offset|</div>
        </div>
        <div className="strip-item">
          <div className="strip-val" style={{ fontSize: 13 }}>
            <span className="cl-badge" style={{ background: d.clColor + "18", color: d.clColor }}>{d.clLabel}</span>
          </div>
          <div className="strip-label">Classification</div>
        </div>
      </div>

      {/* 4. STRUCTURAL BREAKDOWN — fades in at 0.8s */}
      <div className="scaffold-breakdown">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 48, gap: 8, flexWrap: "wrap" }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--t3)", letterSpacing: "0.04em" }}>
            Pre-pivot: <span style={{ color: "var(--t2)" }}>{preCount} verses</span>
          </div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--gold)", letterSpacing: "0.04em" }}>
            Pivot zone: <span style={{ color: "var(--t1)" }}>{pivotCount === 1 ? `v.${r.start}` : `v.${r.start}–${r.end}`} ({pivotCount} {pivotCount === 1 ? 'verse' : 'verses'})</span>
          </div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--t3)", letterSpacing: "0.04em" }}>
            Post-pivot: <span style={{ color: "var(--t2)" }}>{postCount} verses</span>
          </div>
        </div>
      </div>

      {/* 5. PIVOT VERSES — fade up from 1.0s, staggered 0.15s each */}
      {verses.length > 0 && (
        <div className="pivot-section">
          <div className="pivot-section-title">
            Pivot {verses.length === 1 ? "Verse" : "Verses"} — {r.start === r.end ? `${d.surah_number}:${r.start}` : `${d.surah_number}:${r.start}–${r.end}`}
          </div>
          {verses.map((v, i) => (
            <div key={v.v} className="pivot-card" style={{
              animationDelay: `${(pivotCardBaseDelay + i * 0.15).toFixed(2)}s`,
              borderColor: pivotLit ? "rgba(212,168,67,0.3)" : undefined,
              boxShadow: pivotLit ? "0 0 20px rgba(212,168,67,0.06), inset 0 0 0 1px rgba(212,168,67,0.08)" : "none",
              transition: "border-color 0.3s, box-shadow 0.3s",
            }}>
              <div className="pv-ref">{d.surah_number}:{v.v}</div>
              <div className="pv-arabic">{renderArabicWithGold(v.ar, getGoldWords(d.surah_number, v.v), pivotLit)}</div>
              <hr className="pv-separator" />
              <div className="pv-english">{v.en}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 11: ABOUT
   Provenance, methodology link, source credits. Quiet and optional.
   ═══════════════════════════════════════════════════════════════════ */
const AboutPage = ({ onBack }) => {
  const stats = useMemo(() => getCorpusStats(), []);

  return (
    <div className="about">
      <div className="about-back">
        <button className="back-btn" onClick={onBack}><ChevronLeft size={14} /> Back</button>
      </div>
      <div className="about-title">About Maraya</div>
      <div className="about-body">
        <p>
          Maraya (مرايا, "mirrors") is a structural reader for the Qurʾān. It visualizes the compositional
          architecture of each surah — where the text turns, how the two halves balance, and where the
          structural pivot falls relative to center.
        </p>
        <p>
          Each pivot is identified through computational structural analysis of thematic transitions and
          compositional centering across the full surah. The full methodology is documented in the accompanying paper.
        </p>
        <p>
          "Structural Centering in the Qurʾān: A Corpus-Wide Analysis of Pivot Positioning Across 114 Surahs"
          — Feras Mansi, March 2026 (preprint).
        </p>
        <p>
          Every number and visual in this interface is generated directly from a frozen structural dataset.
          No values are hand-typed, copied from prose, or inferred. The dataset is validated on load; if
          any entry is missing or malformed, the application will not render.
        </p>
        <p>An Ayah Labs research project.</p>
      </div>
      <div className="about-sources">
        <div className="about-sources-title">Sources &amp; Data</div>
        <div className="about-source-row">Structural dataset: <span>{DATASET_VERSION} · {stats.n} surahs · {stats.totalVerses.toLocaleString()} verses</span></div>
        <div className="about-source-row">Arabic text: <span>Tanzil.net Uthmani Minimal</span></div>
        <div className="about-source-row">English text: <span>Sahih International</span></div>
        <div className="about-source-row">Author: <span>Feras Mansi</span></div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   SECTION 12: APP SHELL
   ═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState("landing");
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [prevView, setPrevView] = useState("panorama");
  const stats = useMemo(() => getCorpusStats(), []);

  if (VALIDATION_ERRORS.length > 0) {
    return (
      <><style>{STYLE}</style>
      <div style={{ background: "#1a0000", color: "#ff6b6b", padding: 40, fontFamily: "monospace", fontSize: 13, maxWidth: 600, margin: "40px auto" }}>
        <h2 style={{ color: "#ff4444", marginBottom: 12 }}>Dataset Validation Failed</h2>
        {VALIDATION_ERRORS.map((e,i) => <div key={i} style={{ marginBottom: 4 }}>{e}</div>)}
      </div></>
    );
  }

  const handleSelect = (n, from) => {
    setSelectedSurah(n);
    if (from) setPrevView(from);
    else if (view !== "detail") setPrevView(view === "landing" ? "panorama" : view);
    setView("detail");
  };
  const handleExplore = () => setView("panorama");
  const handleBack = () => setView(view === "detail" ? prevView : "landing");
  const handleNavigate = (n) => setSelectedSurah(n);

  return (
    <><style>{STYLE}</style>
    <div className="maraya-root">
      {view === "landing" && <LandingPage onExplore={handleExplore} onSelect={(n) => handleSelect(n, "panorama")} />}
      {view === "panorama" && <PanoramaPage onSelect={(n) => handleSelect(n, "panorama")} onBack={() => setView("landing")} onBrowse={() => setView("browse")} />}
      {view === "browse" && <BrowsePage onSelect={(n) => handleSelect(n, "browse")} onBack={() => setView("panorama")} />}
      {view === "detail" && <DetailPage key={selectedSurah} surahNum={selectedSurah} onBack={handleBack} onNavigate={handleNavigate} />}
      {view === "about" && <AboutPage onBack={() => setView(prevView || "landing")} />}

      <footer className="maraya-footer">
        <div className="footer-mark">مرايا</div>
        <div className="footer-credit">Ayah Labs · <button className="footer-link" onClick={() => { setPrevView(view); setView("about"); }}>About</button></div>
      </footer>
    </div></>
  );
}
