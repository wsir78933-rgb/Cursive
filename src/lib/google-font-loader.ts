import type { TextStyle } from "./text-styles";

const googleFontsStylesheetOrigin = "https://fonts.googleapis.com";
const googleFontsFileOrigin = "https://fonts.gstatic.com";

const googleFontFamilyQueriesByStyleId: Record<string, string> = {
  allura: "Allura",
  "beth-ellen": "Beth+Ellen",
  calligraffitti: "Calligraffitti",
  caveat: "Caveat:wght@400;700",
  "cedarville-cursive": "Cedarville+Cursive",
  damion: "Damion",
  "dancing-script": "Dancing+Script:wght@400;700",
  "dawning-of-a-new-day": "Dawning+of+a+New+Day",
  fuggles: "Fuggles",
  "homemade-apple": "Homemade+Apple",
  lobster: "Lobster",
  "lovers-quarrel": "Lovers+Quarrel",
  pacifico: "Pacifico",
  parisienne: "Parisienne",
  ruthie: "Ruthie",
  sacramento: "Sacramento",
  satisfy: "Satisfy",
  "style-script": "Style+Script",
  windsong: "WindSong:wght@400;500",
  yellowtail: "Yellowtail",
  zeyada: "Zeyada"
};

const fontLoadPromisesByStyleId = new Map<string, Promise<void>>();

export function ensureGoogleFontForStyle(textStyle: TextStyle): Promise<void> {
  if (textStyle.kind !== "google-font") {
    return Promise.resolve();
  }

  const cachedLoadPromise = fontLoadPromisesByStyleId.get(textStyle.id);

  if (cachedLoadPromise) {
    return cachedLoadPromise;
  }

  const familyQuery = googleFontFamilyQueriesByStyleId[textStyle.id];

  if (!familyQuery) {
    throw new Error(`Missing Google Fonts query for style ${textStyle.id}`);
  }

  ensurePreconnectLink(googleFontsStylesheetOrigin);
  ensurePreconnectLink(googleFontsFileOrigin, true);

  const loadPromise = createStylesheetLoadPromise(textStyle, familyQuery);
  fontLoadPromisesByStyleId.set(textStyle.id, loadPromise);

  return loadPromise;
}

function createStylesheetLoadPromise(textStyle: TextStyle, familyQuery: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const stylesheetLink = document.createElement("link");
    stylesheetLink.dataset.googleFontStyleId = textStyle.id;
    stylesheetLink.href = `${googleFontsStylesheetOrigin}/css2?family=${familyQuery}&display=swap`;
    stylesheetLink.rel = "stylesheet";

    stylesheetLink.addEventListener(
      "load",
      () => {
        resolve();
      },
      { once: true }
    );
    stylesheetLink.addEventListener(
      "error",
      () => {
        fontLoadPromisesByStyleId.delete(textStyle.id);
        reject(new Error(`Failed to load Google font stylesheet for ${textStyle.displayName}`));
      },
      { once: true }
    );

    document.head.appendChild(stylesheetLink);
  });
}

function ensurePreconnectLink(origin: string, isCrossOrigin = false) {
  const existingLink = document.head.querySelector<HTMLLinkElement>(
    `link[rel="preconnect"][href="${origin}"]`
  );

  if (existingLink) {
    return;
  }

  const preconnectLink = document.createElement("link");
  preconnectLink.href = origin;
  preconnectLink.rel = "preconnect";

  if (isCrossOrigin) {
    preconnectLink.crossOrigin = "anonymous";
  }

  document.head.appendChild(preconnectLink);
}
