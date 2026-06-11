"use client";

import { Copy, Download, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { getDictionary } from "@/lib/i18n";
import { getCopyMode, getPlatformRecommendation } from "@/lib/style-compatibility";
import type { TextStyle } from "@/lib/text-styles";

import { getCopyModeLabel, getPlatformLabel } from "./style-labels";

type Dictionary = ReturnType<typeof getDictionary>;

type StylePreviewPanelProps = {
  dictionary: Dictionary;
  selectedStyle: TextStyle;
  previewText: string;
  fontSize: number;
  textColor: string;
  transparentBackground: boolean;
  copyLabel: string;
  onCopy: () => void;
  onSave: () => void;
  onPreview: () => void;
};

type StatusPillTone = "copyable" | "preview-only" | "platform";

export function StylePreviewPanel({
  dictionary,
  selectedStyle,
  previewText,
  fontSize,
  textColor,
  transparentBackground,
  copyLabel,
  onCopy,
  onSave,
  onPreview
}: StylePreviewPanelProps) {
  const copyMode = getCopyMode(selectedStyle);
  const platformRecommendation = getPlatformRecommendation(selectedStyle);
  const statusHint =
    copyMode === "copyable"
      ? dictionary.workbench.copyableHint
      : dictionary.workbench.previewOnlyHint;

  return (
    <section className="flex min-h-[420px] flex-col rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_80px_rgba(28,36,48,0.08)] backdrop-blur md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
            {dictionary.workbench.selectedStyleTitle}
          </p>
          <h2 className="mt-2 truncate text-2xl font-semibold text-ink">
            {selectedStyle.displayName}
          </h2>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusPill label={getCopyModeLabel(copyMode, dictionary)} tone={copyMode} />
          <StatusPill
            label={getPlatformLabel(platformRecommendation, dictionary)}
            tone="platform"
          />
        </div>
      </div>

      <div
        className="my-7 grid flex-1 place-items-center rounded-[1.5rem] border border-slate-100 px-5 py-10 text-center"
        data-testid="main-style-preview-output"
        style={{
          backgroundColor: transparentBackground ? "transparent" : "#ffffff",
          color: textColor,
          fontFamily: selectedStyle.fontFamily,
          fontSize
        }}
      >
        <span className="block max-w-full whitespace-pre-wrap break-words text-center leading-tight [overflow-wrap:anywhere] [word-break:break-word]">
          {previewText || " "}
        </span>
      </div>

      <p className="mb-5 text-sm leading-6 text-slate-600">{statusHint}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Button onClick={onCopy} type="button" variant="accent">
          <Copy className="h-4 w-4" />
          {copyLabel}
        </Button>
        <Button onClick={onSave} type="button" variant="outline">
          <Download className="h-4 w-4" />
          {dictionary.actions.save}
        </Button>
        <Button onClick={onPreview} type="button" variant="outline">
          <Eye className="h-4 w-4" />
          {dictionary.actions.preview}
        </Button>
      </div>
    </section>
  );
}

function StatusPill({ label, tone }: { label: string; tone: StatusPillTone }) {
  const toneClassName = getStatusPillToneClassName(tone);

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${toneClassName}`}>
      {label}
    </span>
  );
}

function getStatusPillToneClassName(tone: StatusPillTone): string {
  if (tone === "copyable") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  if (tone === "preview-only") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}
