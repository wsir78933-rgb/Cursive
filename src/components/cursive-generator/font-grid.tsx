"use client";

import { FontCard } from "./font-card";
import type { getDictionary } from "@/lib/i18n";
import type { TextStyle } from "@/lib/text-styles";

type Dictionary = ReturnType<typeof getDictionary>;

type FontGridProps = {
  styles: TextStyle[];
  selectedStyle: TextStyle;
  copiedStyleId: string | null;
  dictionary: Dictionary;
  previewTextByStyleId: (textStyle: TextStyle) => string;
  onCopyStyle: (textStyle: TextStyle) => void;
  onPreviewStyle: (textStyle: TextStyle) => void;
  onSelectStyle: (textStyle: TextStyle) => void;
};

export function FontGrid({
  styles,
  selectedStyle,
  copiedStyleId,
  dictionary,
  previewTextByStyleId,
  onCopyStyle,
  onPreviewStyle,
  onSelectStyle
}: FontGridProps) {
  return (
    <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 px-4 pb-12 sm:grid-cols-2 md:px-8 lg:grid-cols-3 xl:grid-cols-4">
      {styles.map((textStyle) => (
        <FontCard
          dictionary={dictionary}
          isCopied={textStyle.id === copiedStyleId}
          isSelected={textStyle.id === selectedStyle.id}
          key={textStyle.id}
          onCopy={onCopyStyle}
          onPreview={onPreviewStyle}
          onSelect={onSelectStyle}
          previewText={previewTextByStyleId(textStyle)}
          textStyle={textStyle}
        />
      ))}
    </section>
  );
}
