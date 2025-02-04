"use client";

import { HexColorPicker } from "react-colorful";
import { Card } from "@/components/ui/card";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <Card className="p-4 flex flex-col items-center justify-center">
      <HexColorPicker color={color} onChange={onChange} />
    </Card>
  );
}
