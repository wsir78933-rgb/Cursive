export type StyleFilter =
  | "all"
  | "social"
  | "google-docs-default"
  | "google-docs-installable"
  | "ms-word";

export type TextStyleKind = "unicode" | "google-font" | "system-font";

export type TextStyle = {
  id: string;
  displayName: string;
  kind: TextStyleKind;
  fontFamily: string;
  sampleText: string;
  filters: StyleFilter[];
  sourceBadges: string[];
  unicodeMap?: Record<string, string>;
};

const scriptLowercaseMap: Record<string, string> = {
  a: "𝒶",
  b: "𝒷",
  c: "𝒸",
  d: "𝒹",
  e: "𝑒",
  f: "𝒻",
  g: "𝑔",
  h: "𝒽",
  i: "𝒾",
  j: "𝒿",
  k: "𝓀",
  l: "𝓁",
  m: "𝓂",
  n: "𝓃",
  o: "𝑜",
  p: "𝓅",
  q: "𝓆",
  r: "𝓇",
  s: "𝓈",
  t: "𝓉",
  u: "𝓊",
  v: "𝓋",
  w: "𝓌",
  x: "𝓍",
  y: "𝓎",
  z: "𝓏"
};

const scriptUppercaseMap: Record<string, string> = {
  A: "𝒜",
  B: "ℬ",
  C: "𝒞",
  D: "𝒟",
  E: "ℰ",
  F: "ℱ",
  G: "𝒢",
  H: "ℋ",
  I: "ℐ",
  J: "𝒥",
  K: "𝒦",
  L: "ℒ",
  M: "ℳ",
  N: "𝒩",
  O: "𝒪",
  P: "𝒫",
  Q: "𝒬",
  R: "ℛ",
  S: "𝒮",
  T: "𝒯",
  U: "𝒰",
  V: "𝒱",
  W: "𝒲",
  X: "𝒳",
  Y: "𝒴",
  Z: "𝒵"
};

const boldScriptLowercaseMap: Record<string, string> = {
  a: "𝓪",
  b: "𝓫",
  c: "𝓬",
  d: "𝓭",
  e: "𝓮",
  f: "𝓯",
  g: "𝓰",
  h: "𝓱",
  i: "𝓲",
  j: "𝓳",
  k: "𝓴",
  l: "𝓵",
  m: "𝓶",
  n: "𝓷",
  o: "𝓸",
  p: "𝓹",
  q: "𝓺",
  r: "𝓻",
  s: "𝓼",
  t: "𝓽",
  u: "𝓾",
  v: "𝓿",
  w: "𝔀",
  x: "𝔁",
  y: "𝔂",
  z: "𝔃"
};

const boldScriptUppercaseMap: Record<string, string> = {
  A: "𝓐",
  B: "𝓑",
  C: "𝓒",
  D: "𝓓",
  E: "𝓔",
  F: "𝓕",
  G: "𝓖",
  H: "𝓗",
  I: "𝓘",
  J: "𝓙",
  K: "𝓚",
  L: "𝓛",
  M: "𝓜",
  N: "𝓝",
  O: "𝓞",
  P: "𝓟",
  Q: "𝓠",
  R: "𝓡",
  S: "𝓢",
  T: "𝓣",
  U: "𝓤",
  V: "𝓥",
  W: "𝓦",
  X: "𝓧",
  Y: "𝓨",
  Z: "𝓩"
};

const socialFilters: StyleFilter[] = ["all", "social"];
const googleInstallableFilters: StyleFilter[] = ["all", "google-docs-installable"];
const googleDefaultFilters: StyleFilter[] = ["all", "google-docs-default"];
const msWordFilters: StyleFilter[] = ["all", "ms-word"];

export const textStyles: TextStyle[] = [
  {
    id: "unicode-script",
    displayName: "Unicode Script",
    kind: "unicode",
    fontFamily: "Georgia, serif",
    sampleText: "𝒜𝒷𝒸",
    filters: socialFilters,
    sourceBadges: ["IG", "TT", "YT"],
    unicodeMap: { ...scriptLowercaseMap, ...scriptUppercaseMap }
  },
  {
    id: "unicode-bold",
    displayName: "Unicode Bold",
    kind: "unicode",
    fontFamily: "Georgia, serif",
    sampleText: "𝓐𝓫𝓬",
    filters: socialFilters,
    sourceBadges: ["IG", "TT", "YT"],
    unicodeMap: { ...boldScriptLowercaseMap, ...boldScriptUppercaseMap }
  },
  {
    id: "dancing-script",
    displayName: "Dancing Script",
    kind: "google-font",
    fontFamily: "'Dancing Script', cursive",
    sampleText: "Abc",
    filters: googleInstallableFilters,
    sourceBadges: []
  },
  {
    id: "lucida-handwriting",
    displayName: "Lucida Handwriting",
    kind: "system-font",
    fontFamily: "'Lucida Handwriting', cursive",
    sampleText: "Abc",
    filters: ["all"],
    sourceBadges: []
  },
  {
    id: "brush-script-mt",
    displayName: "Brush Script MT",
    kind: "system-font",
    fontFamily: "'Brush Script MT', cursive",
    sampleText: "Abc",
    filters: msWordFilters,
    sourceBadges: ["W"]
  },
  {
    id: "segoe-script",
    displayName: "Segoe Script",
    kind: "system-font",
    fontFamily: "'Segoe Script', cursive",
    sampleText: "Abc",
    filters: ["all"],
    sourceBadges: []
  },
  {
    id: "pacifico",
    displayName: "Pacifico",
    kind: "google-font",
    fontFamily: "'Pacifico', cursive",
    sampleText: "Abc",
    filters: googleDefaultFilters,
    sourceBadges: ["G"]
  },
  {
    id: "apple-chancery",
    displayName: "Apple Chancery",
    kind: "system-font",
    fontFamily: "'Apple Chancery', cursive",
    sampleText: "Abc",
    filters: msWordFilters,
    sourceBadges: ["W"]
  },
  {
    id: "mistral",
    displayName: "Mistral",
    kind: "system-font",
    fontFamily: "Mistral, cursive",
    sampleText: "Abc",
    filters: msWordFilters,
    sourceBadges: ["W"]
  },
  {
    id: "signpainter",
    displayName: "SignPainter",
    kind: "system-font",
    fontFamily: "SignPainter, cursive",
    sampleText: "Abc",
    filters: ["all"],
    sourceBadges: []
  },
  {
    id: "snell-roundhand",
    displayName: "Snell Roundhand",
    kind: "system-font",
    fontFamily: "'Snell Roundhand', cursive",
    sampleText: "Abc",
    filters: msWordFilters,
    sourceBadges: ["W"]
  },
  ...[
    "Style Script",
    "WindSong",
    "Satisfy",
    "Sacramento",
    "Parisienne",
    "Damion",
    "Yellowtail",
    "Cedarville Cursive",
    "Homemade Apple",
    "Allura",
    "Calligraffitti",
    "Dawning of a New Day",
    "Beth Ellen",
    "Lovers Quarrel",
    "Ruthie",
    "Zeyada",
    "Lobster",
    "Fuggles",
    "Caveat"
  ].map<TextStyle>((displayName) => ({
    id: displayName.toLowerCase().replaceAll(" ", "-"),
    displayName,
    kind: "google-font",
    fontFamily: `'${displayName}', cursive`,
    sampleText: "Abc",
    filters: googleDefaultFilters,
    sourceBadges: ["G"]
  }))
];

export function filterTextStyles(filter: StyleFilter): TextStyle[] {
  if (filter === "all") {
    return textStyles;
  }

  return textStyles.filter((textStyle) => textStyle.filters.includes(filter));
}
