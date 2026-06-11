"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { FaqSection } from "./faq-section";
import { FontGrid } from "./font-grid";
import { GeneratorHeader } from "./generator-header";
import { GeneratorToolbar } from "./generator-toolbar";
import { PreviewDialog } from "./preview-dialog";
import { StyleFilterTabs } from "./style-filter-tabs";
import { StylePreviewPanel } from "./style-preview-panel";
import { Textarea } from "@/components/ui/textarea";
import { writeClipboardText } from "@/lib/clipboard-writer";
import { saveNodeAsPng } from "@/lib/export-image";
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
  const copyFeedbackTimeoutRef = useRef<number | null>(null);

  const visibleStyles = useMemo(() => filterTextStyles(selectedFilter), [selectedFilter]);

  const selectedStyle =
    textStyles.find((textStyle) => textStyle.id === selectedStyleId) ?? textStyles[0];

  const selectedPreviewText = getPreviewText(selectedStyle);
  const inputCharacterCount = Array.from(inputText).length;
  const isOverSuggestedInputCharacterCount =
    inputCharacterCount > suggestedInputCharacterCount;
  const characterCountHintClassName = getCharacterCountHintClassName(
    isOverSuggestedInputCharacterCount
  );
  const characterCountHint = `${inputCharacterCount} / ${dictionary.inputCharacterCount.suggestedPrefix} ${suggestedInputCharacterCount} ${dictionary.inputCharacterCount.suggestedSuffix}`;

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current) {
        window.clearTimeout(copyFeedbackTimeoutRef.current);
      }
    };
  }, []);

  function getPreviewText(textStyle: TextStyle): string {
    if (textStyle.kind === "unicode") {
      return transformUnicodeText(inputText, textStyle);
    }

    return inputText;
  }

  function handleStyleSelect(textStyle: TextStyle) {
    setSelectedStyleId(textStyle.id);
  }

  async function copyStyleToClipboard(textStyle: TextStyle) {
    const copyText = getCopyText(inputText, textStyle);
    setSelectedStyleId(textStyle.id);
    const clipboardWriteStatus = await writeClipboardText(copyText);

    if (clipboardWriteStatus === "copied") {
      showCopyFeedback(dictionary.actions.copied, textStyle.id);
      return;
    }

    showCopyFeedback(dictionary.actions.copyFailed, null);
  }

  function previewStyle(textStyle: TextStyle) {
    setSelectedStyleId(textStyle.id);
    setIsPreviewOpen(true);
  }

  function showCopyFeedback(nextCopyLabel: string, nextCopiedStyleId: string | null) {
    if (copyFeedbackTimeoutRef.current) {
      window.clearTimeout(copyFeedbackTimeoutRef.current);
    }

    setCopiedStyleId(nextCopiedStyleId);
    setCopyLabel(nextCopyLabel);

    copyFeedbackTimeoutRef.current = window.setTimeout(() => {
      setCopyLabel(dictionary.actions.copy);
      setCopiedStyleId(null);
    }, 1300);
  }

  async function handleCopy() {
    await copyStyleToClipboard(selectedStyle);
  }

  async function handleSave() {
    if (!exportNodeRef.current) {
      throw new Error("PNG export target is missing");
    }

    await saveNodeAsPng(exportNodeRef.current, `cursive-generator-${selectedStyle.id}.png`);
  }

  function handleClear() {
    setInputText("");
  }

  function handleFilterChange(nextFilter: StyleFilter) {
    const nextStyles = filterTextStyles(nextFilter);
    setSelectedFilter(nextFilter);

    if (!nextStyles.some((textStyle) => textStyle.id === selectedStyleId)) {
      setSelectedStyleId(nextStyles[0]?.id ?? "unicode-script");
    }
  }

  return (
    <main className="min-h-screen">
      <GeneratorHeader dictionary={dictionary} locale={locale} />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-8 pt-4 md:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:items-start lg:pb-10 lg:pt-8">
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

          <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-3 shadow-sm backdrop-blur">
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
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <StylePreviewPanel
            copyLabel={copyLabel}
            dictionary={dictionary}
            fontSize={fontSize}
            onCopy={handleCopy}
            onPreview={() => setIsPreviewOpen(true)}
            onSave={handleSave}
            previewText={selectedPreviewText}
            selectedStyle={selectedStyle}
            textColor={textColor}
            transparentBackground={transparentBackground}
          />

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
        </div>
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
        previewTextByStyleId={getPreviewText}
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
