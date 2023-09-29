"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "squadImage" | "achievementImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative w-20 h-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="absolute top-0 right-0 p-1 text-white bg-rose-500 rounded-full shadow-sm"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 bg-background/10 rounded-md">
        <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className="absolute -top-2 -right-2 p-1 text-white bg-rose-500 rounded-full shadow-sm"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
      appearance={{
        label: {
          color: "#12a150",
        },
        button: {
          backgroundColor: "#12a150",
        },
        container: {
          backgroundColor: "#292524",
        },
      }}
    />
  );
};
