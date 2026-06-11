"use client";

import type { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import type { getDictionary } from "@/lib/i18n";

type Dictionary = ReturnType<typeof getDictionary>;

type GeneratorToolbarProps = {
  dictionary: Dictionary;
  textColor: string;
  fontSize: number;
  transparentBackground: boolean;
  onTextColorChange: (value: string) => void;
  onFontSizeChange: (value: number) => void;
  onTransparentBackgroundChange: (value: boolean) => void;
  onClear: () => void;
};

const presetColors = ["#1c2430", "#0a8f7c", "#3b6f98", "#c86a76"];

export function GeneratorToolbar({
  dictionary,
  textColor,
  fontSize,
  transparentBackground,
  onTextColorChange,
  onFontSizeChange,
  onTransparentBackgroundChange,
  onClear
}: GeneratorToolbarProps) {
  function handleColorInputChange(event: ChangeEvent<HTMLInputElement>) {
    onTextColorChange(event.target.value);
  }

  function handleTransparentBackgroundInputChange(event: ChangeEvent<HTMLInputElement>) {
    onTransparentBackgroundChange(event.currentTarget.checked);
  }

  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-[0_18px_50px_rgba(28,36,48,0.07)] backdrop-blur md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-ink">{dictionary.workbench.settingsTitle}</h2>
        <Button onClick={onClear} size="sm" type="button" variant="ghost">
          {dictionary.actions.clear}
        </Button>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-700">
              {dictionary.controls.size}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {fontSize}px
            </span>
          </div>
          <Slider
            aria-label={dictionary.controls.size}
            max={96}
            min={16}
            onValueChange={([value]) => onFontSizeChange(value)}
            step={1}
            value={[fontSize]}
          />
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">
            {dictionary.controls.color}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {presetColors.map((color) => (
              <button
                aria-label={`${dictionary.controls.color} ${color}`}
                className="h-8 w-8 rounded-full border border-white shadow-[0_0_0_1px_rgba(15,23,42,0.12),0_6px_16px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                key={color}
                onClick={() => onTextColorChange(color)}
                style={{ backgroundColor: color }}
                type="button"
              />
            ))}
            <input
              aria-label={dictionary.controls.customColor}
              className="h-9 w-12 cursor-pointer rounded-full border border-slate-200 bg-white p-1 shadow-sm"
              onChange={handleColorInputChange}
              type="color"
              value={textColor}
            />
          </div>
        </div>

        <label
          className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
          htmlFor="transparent-background-checkbox"
        >
          <span>{dictionary.controls.transparent}</span>
          <Checkbox
            checked={transparentBackground}
            id="transparent-background-checkbox"
            onChange={handleTransparentBackgroundInputChange}
          />
        </label>
      </div>
    </aside>
  );
}
