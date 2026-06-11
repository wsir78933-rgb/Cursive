"use client";

import { Check, Copy, Eye } from "lucide-react";

import { SourceBadgeIcons } from "./source-badge-icons";
import type { getDictionary } from "@/lib/i18n";
import { getCopyMode } from "@/lib/style-compatibility";
import type { TextStyle } from "@/lib/text-styles";
import { cn } from "@/lib/utils";

type Dictionary = ReturnType<typeof getDictionary>;

type FontCardProps = {
  textStyle: TextStyle;
  isSelected: boolean;
  isCopied: boolean;
  dictionary: Dictionary;
  previewText: string;
  onCopy: (textStyle: TextStyle) => void;
  onPreview: (textStyle: TextStyle) => void;
  onSelect: (textStyle: TextStyle) => void;
};

export function FontCard({
  textStyle,
  isSelected,
  isCopied,
  dictionary,
  previewText,
  onCopy,
  onPreview,
  onSelect
}: FontCardProps) {
  const sampleFontSize = getSampleFontSize(previewText);
  const copyMode = getCopyMode(textStyle);
  const actionLabel =
    copyMode === "copyable"
      ? `${dictionary.styleStatus.cardCopy}: ${textStyle.displayName}`
      : `${dictionary.actions.preview}: ${textStyle.displayName}`;

  return (
    <article
      className={cn(
        "group relative min-h-[138px] min-w-0 overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white/90 text-ink shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg",
        isSelected && "border-[#087565] bg-[#087565] text-white shadow-md ring-2 ring-[#087565]/20"
      )}
    >
      <button
        aria-label={textStyle.displayName}
        aria-pressed={isSelected}
        className="flex h-full w-full min-w-0 flex-col items-center justify-center px-4 pb-4 pt-9 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        onClick={() => onSelect(textStyle)}
        type="button"
      >
        <SourceBadgeIcons badges={textStyle.sourceBadges} isSelected={isSelected} />
        <div
          className={cn(
            "flex min-h-12 max-w-full items-center overflow-hidden text-ellipsis whitespace-nowrap leading-none text-ink",
            isSelected && "text-white"
          )}
          style={{ fontFamily: textStyle.fontFamily, fontSize: sampleFontSize }}
          title={previewText}
        >
          {previewText || "\u00a0"}
        </div>
        <div
          className={cn(
            "mt-4 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold leading-tight text-slate-600",
            isSelected && "text-white"
          )}
          title={textStyle.displayName}
        >
          {textStyle.displayName}
        </div>
      </button>
      <button
        aria-label={actionLabel}
        className={cn(
          "absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-ink hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          copyMode === "copyable" && isCopied && "border-accent bg-accent text-white"
        )}
        onClick={(event) => {
          event.stopPropagation();
          if (copyMode === "copyable") {
            onCopy(textStyle);
            return;
          }

          onPreview(textStyle);
        }}
        type="button"
      >
        {copyMode === "copyable" && isCopied ? (
          <Check className="h-3.5 w-3.5" />
        ) : copyMode === "copyable" ? (
          <Copy className="h-3.5 w-3.5" />
        ) : (
          <Eye className="h-3.5 w-3.5" />
        )}
      </button>
    </article>
  );
}

function getSampleFontSize(previewText: string): string {
  const characterCount = Array.from(previewText).length;

  if (characterCount > 20) {
    return "1rem";
  }

  if (characterCount > 14) {
    return "1.2rem";
  }

  if (characterCount > 9) {
    return "1.45rem";
  }

  return "2.15rem";
}
