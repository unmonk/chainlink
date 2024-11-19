"use client";

import { useCallback, useState, forwardRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export const ImageUpload = forwardRef<HTMLDivElement, ImageUploadProps>(
  ({ value, onChange, disabled, className }, ref) => {
    const [isUploading, setIsUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState("");
    const generateUploadUrl = useMutation(api.squads.generateUploadUrl);

    const onRemove = useCallback(() => {
      onChange(undefined);
    }, [onChange]);

    const handleUpload = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        try {
          setIsUploading(true);
          const file = e.target.files[0];
          setImagePreview(URL.createObjectURL(file));

          // Get upload URL
          const postUrl = await generateUploadUrl();

          // Upload file to storage
          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });
          const { storageId } = await result.json();

          console.log(storageId);
          onChange(storageId);
        } catch (error) {
          console.error("Failed to upload image:", error);
        } finally {
          setIsUploading(false);
        }
      },
      [generateUploadUrl, onChange]
    );

    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="relative w-[200px] h-[200px] rounded-md border border-dashed flex items-center justify-center">
          <div className="absolute top-0 right-0">
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {value ? (
            <Image
              fill
              src={imagePreview}
              alt="Upload"
              className="rounded-md object-cover"
            />
          ) : (
            <Button
              type="button"
              variant="secondary"
              disabled={disabled || isUploading}
              className="h-full w-full"
            >
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleUpload}
                disabled={disabled || isUploading}
              />
              <ImageIcon className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    );
  }
);

ImageUpload.displayName = "ImageUpload";
