import * as React from "react";
import { cn } from "@/lib/utils";

export interface ColorPickerProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <div className="flex items-center space-x-2">
          <input
            type="color"
            className={cn(
              "h-10 w-16 rounded-md border border-input bg-background cursor-pointer",
              className
            )}
            ref={ref}
            {...props}
          />
          <input
            type="text"
            value={props.value || "#000000"}
            onChange={(e) => {
              if (props.onChange) {
                const event = {
                  ...e,
                  target: { ...e.target, value: e.target.value },
                } as React.ChangeEvent<HTMLInputElement>;
                props.onChange(event);
              }
            }}
            className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="#000000"
          />
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
