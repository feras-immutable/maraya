/**
 * Pivot function classifications for all 114 surahs.
 * Source: classifications_claude.json
 *
 * Category keys → display labels:
 *   COMMAND_LEGISLATION    → "Command"
 *   THEOLOGICAL_DECLARATION → "Declaration"
 *   WARNING_CONSEQUENCE    → "Warning"
 *   NARRATIVE_RECOLLECTION → "Narrative"
 *   SIGN_EVIDENTIARY       → "Sign"
 *   COMMUNAL_ADDRESS       → "Address"
 *   POLEMIC_APOLOGETIC     → "Polemic"
 */

const DISPUTED = new Set([1,3,14,15,18,30,31,33,34,35,40,41,46,59,60,67,69,75,79,80,82,89,90,91,94,95,100,102,103,105]);

const PIVOT_FUNCTIONS = {
  1:  { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(1) },
  2:  { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(2) },
  3:  { fn: "COMMUNAL_ADDRESS", disputed: DISPUTED.has(3) },
  4:  { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(4) },
  5:  { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(5) },
  6:  { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(6) },
  7:  { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(7) },
  8:  { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(8) },
  9:  { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(9) },
  10: { fn: "COMMUNAL_ADDRESS", disputed: DISPUTED.has(10) },
  11: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(11) },
  12: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(12) },
  13: { fn: "COMMUNAL_ADDRESS", disputed: DISPUTED.has(13) },
  14: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(14) },
  15: { fn: "COMMUNAL_ADDRESS", disputed: DISPUTED.has(15) },
  16: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(16) },
  17: { fn: "POLEMIC_APOLOGETIC", disputed: DISPUTED.has(17) },
  18: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(18) },
  19: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(19) },
  20: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(20) },
  21: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(21) },
  22: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(22) },
  23: { fn: "COMMUNAL_ADDRESS", disputed: DISPUTED.has(23) },
  24: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(24) },
  25: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(25) },
  26: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(26) },
  27: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(27) },
  28: { fn: "POLEMIC_APOLOGETIC", disputed: DISPUTED.has(28) },
  29: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(29) },
  30: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(30) },
  31: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(31) },
  32: { fn: "COMMUNAL_ADDRESS", disputed: DISPUTED.has(32) },
  33: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(33), secondary: "COMMAND_LEGISLATION" },
  34: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(34) },
  35: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(35) },
  36: { fn: "POLEMIC_APOLOGETIC", disputed: DISPUTED.has(36) },
  37: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(37) },
  38: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(38) },
  39: { fn: "POLEMIC_APOLOGETIC", disputed: DISPUTED.has(39) },
  40: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(40) },
  41: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(41) },
  42: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(42) },
  43: { fn: "POLEMIC_APOLOGETIC", disputed: DISPUTED.has(43) },
  44: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(44) },
  45: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(45) },
  46: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(46) },
  47: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(47) },
  48: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(48) },
  49: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(49) },
  50: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(50) },
  51: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(51) },
  52: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(52) },
  53: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(53) },
  54: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(54) },
  55: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(55) },
  56: { fn: "SIGN_EVIDENTIARY", disputed: DISPUTED.has(56) },
  57: { fn: "COMMUNAL_ADDRESS", disputed: DISPUTED.has(57) },
  58: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(58) },
  59: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(59), secondary: "POLEMIC_APOLOGETIC" },
  60: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(60) },
  61: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(61) },
  62: { fn: "POLEMIC_APOLOGETIC", disputed: DISPUTED.has(62) },
  63: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(63) },
  64: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(64) },
  65: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(65) },
  66: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(66) },
  67: { fn: "COMMUNAL_ADDRESS", disputed: DISPUTED.has(67) },
  68: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(68) },
  69: { fn: "COMMUNAL_ADDRESS", disputed: DISPUTED.has(69), secondary: "WARNING_CONSEQUENCE" },
  70: { fn: "COMMUNAL_ADDRESS", disputed: DISPUTED.has(70) },
  71: { fn: "SIGN_EVIDENTIARY", disputed: DISPUTED.has(71) },
  72: { fn: "COMMUNAL_ADDRESS", disputed: DISPUTED.has(72) },
  73: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(73) },
  74: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(74) },
  75: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(75), secondary: "POLEMIC_APOLOGETIC" },
  76: { fn: "COMMUNAL_ADDRESS", disputed: DISPUTED.has(76) },
  77: { fn: "SIGN_EVIDENTIARY", disputed: DISPUTED.has(77) },
  78: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(78) },
  79: { fn: "COMMUNAL_ADDRESS", disputed: DISPUTED.has(79) },
  80: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(80) },
  81: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(81) },
  82: { fn: "POLEMIC_APOLOGETIC", disputed: DISPUTED.has(82) },
  83: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(83) },
  84: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(84) },
  85: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(85) },
  86: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(86) },
  87: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(87) },
  88: { fn: "SIGN_EVIDENTIARY", disputed: DISPUTED.has(88) },
  89: { fn: "POLEMIC_APOLOGETIC", disputed: DISPUTED.has(89) },
  90: { fn: "POLEMIC_APOLOGETIC", disputed: DISPUTED.has(90) },
  91: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(91) },
  92: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(92) },
  93: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(93) },
  94: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(94) },
  95: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(95) },
  96: { fn: "POLEMIC_APOLOGETIC", disputed: DISPUTED.has(96) },
  97: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(97) },
  98: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(98) },
  99: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(99), secondary: "SIGN_EVIDENTIARY" },
  100: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(100) },
  101: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(101) },
  102: { fn: "COMMUNAL_ADDRESS", disputed: DISPUTED.has(102), secondary: "WARNING_CONSEQUENCE" },
  103: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(103) },
  104: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(104) },
  105: { fn: "NARRATIVE_RECOLLECTION", disputed: DISPUTED.has(105) },
  106: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(106) },
  107: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(107) },
  108: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(108) },
  109: { fn: "POLEMIC_APOLOGETIC", disputed: DISPUTED.has(109) },
  110: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(110) },
  111: { fn: "WARNING_CONSEQUENCE", disputed: DISPUTED.has(111) },
  112: { fn: "THEOLOGICAL_DECLARATION", disputed: DISPUTED.has(112) },
  113: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(113) },
  114: { fn: "COMMAND_LEGISLATION", disputed: DISPUTED.has(114) },
};

export const FN_LABELS = {
  COMMAND_LEGISLATION: "Command",
  THEOLOGICAL_DECLARATION: "Declaration",
  WARNING_CONSEQUENCE: "Warning",
  NARRATIVE_RECOLLECTION: "Narrative",
  SIGN_EVIDENTIARY: "Sign",
  COMMUNAL_ADDRESS: "Address",
  POLEMIC_APOLOGETIC: "Polemic",
};

export function getPivotFunction(surahNum) {
  return PIVOT_FUNCTIONS[surahNum] || null;
}

export function getPivotFunctionLabel(surahNum) {
  const pf = PIVOT_FUNCTIONS[surahNum];
  if (!pf) return null;
  return FN_LABELS[pf.fn] || pf.fn;
}

export function getPivotFunctionCounts() {
  const counts = {};
  for (const entry of Object.values(PIVOT_FUNCTIONS)) {
    counts[entry.fn] = (counts[entry.fn] || 0) + 1;
  }
  return counts;
}

export default PIVOT_FUNCTIONS;
