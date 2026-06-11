"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import type { getDictionary } from "@/lib/i18n";
import type { TextStyle } from "@/lib/text-styles";

type Dictionary = ReturnType<typeof getDictionary>;

type PreviewDialogProps = {
  dictionary: Dictionary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStyle: TextStyle;
  previewText: string;
  fontSize: number;
  textColor: string;
  transparentBackground: boolean;
  onCopy: () => void;
  onSave: () => void;
};

export function PreviewDialog({
  dictionary,
  open,
  onOpenChange,
  selectedStyle,
  previewText,
  fontSize,
  textColor,
  transparentBackground,
  onCopy,
  onSave
}: PreviewDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dictionary.preview.title}</DialogTitle>
          <DialogDescription>{dictionary.preview.description}</DialogDescription>
        </DialogHeader>
        <div
          className="grid min-h-52 place-items-center rounded-[1.5rem] border border-slate-200 p-8 shadow-sm"
          data-testid="style-preview-output"
          style={{
            backgroundColor: transparentBackground ? "transparent" : "#ffffff",
            color: textColor,
            fontFamily: selectedStyle.fontFamily,
            fontSize
          }}
        >
          <span className="block max-w-full whitespace-pre-wrap break-words text-center leading-tight [overflow-wrap:anywhere] [word-break:break-word]">
            {previewText || "\u00a0"}
          </span>
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <Button onClick={onCopy} type="button" variant="outline">
            {dictionary.actions.copy}
          </Button>
          <Button onClick={onSave} type="button">
            {dictionary.actions.save}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
