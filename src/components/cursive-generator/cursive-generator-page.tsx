"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { Copy, Download, Eye } from "lucide-react";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { FaqSection } from "./faq-section";
import { FontGrid } from "./font-grid";
import { GeneratorHeader } from "./generator-header";
import { GeneratorToolbar } from "./generator-toolbar";
import { PreviewDialog } from "./preview-dialog";
import { StyleFilterTabs } from "./style-filter-tabs";
import { AnimatedButtonBorder } from "./animated-button-border";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { writeClipboardText } from "@/lib/clipboard-writer";
import { saveNodeAsPng } from "@/lib/export-image";
import { ensureGoogleFontForStyle } from "@/lib/google-font-loader";
import type { getDictionary, Locale } from "@/lib/i18n";
import { getCopyText, transformUnicodeText } from "@/lib/text-transform";
import {
  filterTextStyles,
  textStyles,
  type StyleFilter,
  type TextStyle
} from "@/lib/text-styles";

type Dictionary = ReturnType<typeof getDictionary>;

type CursiveGeneratorPageProps = {
  dictionary: Dictionary;
  locale: Locale;
};

const defaultInputText = "hello world";
const defaultTextColor = "#1c2430";
const defaultFontSize = 48;
const suggestedInputCharacterCount = 60;

const filterOptions: Array<{
  value: StyleFilter;
  labelKey:
    | "all"
    | "social"
    | "googleDocsDefault"
    | "googleDocsInstallable"
    | "msWord";
}> = [
  { value: "all", labelKey: "all" },
  { value: "social", labelKey: "social" },
  { value: "google-docs-default", labelKey: "googleDocsDefault" },
  { value: "google-docs-installable", labelKey: "googleDocsInstallable" },
  { value: "ms-word", labelKey: "msWord" }
];

export function CursiveGeneratorPage({ dictionary, locale }: CursiveGeneratorPageProps) {
  const [inputText, setInputText] = useState(defaultInputText);
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [textColor, setTextColor] = useState(defaultTextColor);
  const [transparentBackground, setTransparentBackground] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<StyleFilter>("all");
  const [selectedStyleId, setSelectedStyleId] = useState("unicode-script");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [copyLabel, setCopyLabel] = useState(dictionary.actions.copy);
  const [copiedStyleId, setCopiedStyleId] = useState<string | null>(null);
  const exportNodeRef = useRef<HTMLDivElement>(null);
  const inputTextRef = useRef(inputText);
  const copyFeedbackTimeoutRef = useRef<number | null>(null);
  inputTextRef.current = inputText;
  const deferredInputText = useDeferredValue(inputText);

  const visibleStyles = useMemo(() => filterTextStyles(selectedFilter), [selectedFilter]);

  const selectedStyle = useMemo(
    () => textStyles.find((textStyle) => textStyle.id === selectedStyleId) ?? textStyles[0],
    [selectedStyleId]
  );

  const selectedPreviewText = useMemo(
    () => getPreviewTextForInput(inputText, selectedStyle),
    [inputText, selectedStyle]
  );
  const fontGridPreviewTextByStyleId = useMemo(
    () => getPreviewTextByStyleId(visibleStyles, deferredInputText),
    [deferredInputText, visibleStyles]
  );
  const getFontGridPreviewText = useCallback(
    (textStyle: TextStyle) => {
      const previewText = fontGridPreviewTextByStyleId.get(textStyle.id);

      if (previewText === undefined) {
        throw new Error(`Missing font grid preview text for style ${textStyle.id}`);
      }

      return previewText;
    },
    [fontGridPreviewTextByStyleId]
  );
  const inputCharacterCount = Array.from(inputText).length;
  const isOverSuggestedInputCharacterCount =
    inputCharacterCount > suggestedInputCharacterCount;
  const characterCountHintClassName = getCharacterCountHintClassName(
    isOverSuggestedInputCharacterCount
  );
  const characterCountHint = `${inputCharacterCount} / ${suggestedInputCharacterCount}`;

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current) {
        window.clearTimeout(copyFeedbackTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedStyle.kind === "google-font") {
      void ensureGoogleFontForStyle(selectedStyle);
    }
  }, [selectedStyle]);

  useEffect(() => {
    loadGoogleFontsForVisibleStyles(visibleStyles);
  }, [visibleStyles]);

  const handleStyleSelect = useCallback((textStyle: TextStyle) => {
    setSelectedStyleId(textStyle.id);
  }, []);

  const showCopyFeedback = useCallback(
    (nextCopyLabel: string, nextCopiedStyleId: string | null) => {
      if (copyFeedbackTimeoutRef.current) {
        window.clearTimeout(copyFeedbackTimeoutRef.current);
      }

      setCopiedStyleId(nextCopiedStyleId);
      setCopyLabel(nextCopyLabel);

      copyFeedbackTimeoutRef.current = window.setTimeout(() => {
        setCopyLabel(dictionary.actions.copy);
        setCopiedStyleId(null);
      }, 1300);
    },
    [dictionary.actions.copy]
  );

  const copyStyleToClipboard = useCallback(
    async (textStyle: TextStyle) => {
      const copyText = getCopyText(inputTextRef.current, textStyle);
      setSelectedStyleId(textStyle.id);
      const clipboardWriteStatus = await writeClipboardText(copyText);

      if (clipboardWriteStatus === "copied") {
        showCopyFeedback(dictionary.actions.copied, textStyle.id);
        trackCopyCursiveTextEvent(textStyle, getCopyPosition(textStyle, visibleStyles));
        return;
      }

      showCopyFeedback(dictionary.actions.copyFailed, null);
    },
    [dictionary.actions.copied, dictionary.actions.copyFailed, showCopyFeedback, visibleStyles]
  );

  const previewStyle = useCallback((textStyle: TextStyle) => {
    setSelectedStyleId(textStyle.id);
    setIsPreviewOpen(true);
  }, []);

  const openPreview = useCallback(() => {
    setIsPreviewOpen(true);
  }, []);

  const handleCopy = useCallback(async () => {
    await copyStyleToClipboard(selectedStyle);
  }, [copyStyleToClipboard, selectedStyle]);

  const handleSave = useCallback(async () => {
    if (!exportNodeRef.current) {
      throw new Error("PNG export target is missing");
    }

    await ensureGoogleFontForStyle(selectedStyle);
    await saveNodeAsPng(exportNodeRef.current, `cursive-generator-${selectedStyle.id}.png`);
  }, [selectedStyle]);

  const handleClear = useCallback(() => {
    setInputText("");
  }, []);

  const handleFilterChange = useCallback((nextFilter: StyleFilter) => {
    const nextStyles = filterTextStyles(nextFilter);
    setSelectedFilter(nextFilter);

    if (!nextStyles.some((textStyle) => textStyle.id === selectedStyleId)) {
      setSelectedStyleId(nextStyles[0]?.id ?? "unicode-script");
    }
  }, [selectedStyleId]);

  return (
    <main className="min-h-screen">
      <GeneratorHeader dictionary={dictionary} locale={locale} />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-8 pt-4 md:px-8 lg:grid-cols-[minmax(0,0.95fr)_320px] lg:items-start lg:pb-10 lg:pt-8">
        <div className="grid gap-5 lg:pt-8">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-accent">
              {dictionary.hero.eyebrow}
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-ink md:text-6xl">
              {dictionary.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              {dictionary.hero.description}
            </p>
          </div>

          <div
            className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/85 p-3 shadow-sm backdrop-blur"
            data-testid="homepage-input-container"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[2rem] border border-accent/50"
              data-testid="homepage-input-decorative-border"
            />
            <label className="sr-only" htmlFor="generator-input">
              {dictionary.inputLabel}
            </label>
            <Textarea
              className="min-h-28 resize-y border-0 bg-transparent px-4 text-2xl leading-tight shadow-none focus-visible:ring-0 md:min-h-36 md:text-4xl"
              id="generator-input"
              onChange={(event) => setInputText(event.target.value)}
              style={{ fontFamily: selectedStyle.fontFamily }}
              value={inputText}
            />
            <p className={characterCountHintClassName}>{characterCountHint}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              className="relative overflow-hidden"
              onClick={handleCopy}
              type="button"
              variant="accent"
            >
              <AnimatedButtonBorder />
              <Copy className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{copyLabel}</span>
            </Button>
            <Button
              className="relative overflow-hidden"
              onClick={handleSave}
              type="button"
              variant="outline"
            >
              <AnimatedButtonBorder />
              <Download className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{dictionary.actions.save}</span>
            </Button>
            <Button
              className="relative hidden overflow-hidden sm:inline-flex"
              onClick={openPreview}
              type="button"
              variant="outline"
            >
              <AnimatedButtonBorder />
              <Eye className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{dictionary.actions.preview}</span>
            </Button>
          </div>
        </div>

        <GeneratorToolbar
          dictionary={dictionary}
          fontSize={fontSize}
          onClear={handleClear}
          onFontSizeChange={setFontSize}
          onTextColorChange={setTextColor}
          onTransparentBackgroundChange={setTransparentBackground}
          textColor={textColor}
          transparentBackground={transparentBackground}
        />
      </section>

      <StyleFilterTabs
        dictionary={dictionary}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        selectedFilter={selectedFilter}
      />

      <FontGrid
        copiedStyleId={copiedStyleId}
        dictionary={dictionary}
        onCopyStyle={copyStyleToClipboard}
        onPreviewStyle={previewStyle}
        onSelectStyle={handleStyleSelect}
        previewTextByStyleId={getFontGridPreviewText}
        selectedStyle={selectedStyle}
        styles={visibleStyles}
      />

      <FaqSection dictionary={dictionary} />

      <PreviewDialog
        dictionary={dictionary}
        fontSize={fontSize}
        onCopy={handleCopy}
        onOpenChange={setIsPreviewOpen}
        onSave={handleSave}
        open={isPreviewOpen}
        previewText={selectedPreviewText}
        selectedStyle={selectedStyle}
        textColor={textColor}
        transparentBackground={transparentBackground}
      />

      <div className="pointer-events-none fixed -left-[9999px] top-0">
        <div
          aria-hidden="true"
          data-testid="png-export-output"
          ref={exportNodeRef}
          style={{
            alignItems: "center",
            backgroundColor: transparentBackground ? "transparent" : "#ffffff",
            boxSizing: "border-box",
            color: textColor,
            display: "flex",
            fontFamily: selectedStyle.fontFamily,
            fontSize,
            justifyContent: "center",
            lineHeight: 1.18,
            maxWidth: 620,
            minHeight: 220,
            overflowWrap: "anywhere",
            padding: 36,
            textAlign: "center",
            whiteSpace: "pre-wrap",
            width: 620,
            wordBreak: "break-word"
          }}
        >
          {selectedPreviewText || "\u00a0"}
        </div>
      </div>
    </main>
  );
}

function getCharacterCountHintClassName(isOverSuggestedInputCharacterCount: boolean): string {
  if (isOverSuggestedInputCharacterCount) {
    return "mt-2 text-right text-xs font-semibold text-amber-700";
  }

  return "mt-2 text-right text-xs font-semibold text-slate-500";
}

function getPreviewTextByStyleId(
  visibleStyles: TextStyle[],
  previewInputText: string
): Map<string, string> {
  return new Map(
    visibleStyles.map((textStyle) => [
      textStyle.id,
      getPreviewTextForInput(previewInputText, textStyle)
    ])
  );
}

function getPreviewTextForInput(previewInputText: string, textStyle: TextStyle): string {
  if (textStyle.kind === "unicode") {
    return transformUnicodeText(previewInputText, textStyle);
  }

  return previewInputText;
}

function loadGoogleFontsForVisibleStyles(visibleStyles: TextStyle[]) {
  visibleStyles.forEach((textStyle) => {
    if (textStyle.kind === "google-font") {
      void ensureGoogleFontForStyle(textStyle).catch((googleFontPreloadError: unknown) => {
        reportGoogleFontPreloadFailure(textStyle, googleFontPreloadError);
      });
    }
  });
}

function reportGoogleFontPreloadFailure(
  textStyle: TextStyle,
  googleFontPreloadError: unknown
) {
  console.warn(
    `Failed to preload Google font for visible style ${textStyle.id} (${textStyle.displayName}).`,
    googleFontPreloadError
  );
}

function getCopyPosition(textStyle: TextStyle, visibleStyles: TextStyle[]): number | undefined {
  const visibleStyleIndex = visibleStyles.findIndex(
    (visibleStyle) => visibleStyle.id === textStyle.id
  );

  if (visibleStyleIndex === -1) {
    return undefined;
  }

  return visibleStyleIndex + 1;
}

function trackCopyCursiveTextEvent(textStyle: TextStyle, copyPosition: number | undefined) {
  const copyEventParameters: {
    style_name: string;
    style_category: string;
    copy_position?: number;
  } = {
    style_name: textStyle.displayName || "unknown",
    style_category: textStyle.kind || "unknown"
  };

  if (copyPosition !== undefined) {
    copyEventParameters.copy_position = copyPosition;
  }

  try {
    sendGAEvent("event", "copy_cursive_text", copyEventParameters);
  } catch (ga4EventError: unknown) {
    reportCopyCursiveTextEventFailure(ga4EventError);
  }
}

function reportCopyCursiveTextEventFailure(ga4EventError: unknown) {
  console.warn("Failed to send GA4 copy event.", ga4EventError);
}
