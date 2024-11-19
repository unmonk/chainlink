"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SponsoredMatchupFormProps {
  onChange: (sponsoredData: {
    url: string;
    description: string;
    name: string;
    image: string;
    color: string;
  }) => void;
  initialData?: {
    url: string;
    description: string;
    name: string;
    image: string;
    color: string;
  };
}

export function SponsoredMatchupForm({
  onChange,
  initialData,
}: SponsoredMatchupFormProps) {
  const [sponsoredData, setSponsoredData] = useState({
    url: initialData?.url || "",
    description: initialData?.description || "",
    name: initialData?.name || "",
    image: initialData?.image || "",
    color: initialData?.color || "blue",
  });

  const handleChange = (field: string, value: string) => {
    const newData = {
      ...sponsoredData,
      [field]: value,
    };
    setSponsoredData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-4 p-4 bg-accent/20 rounded-lg">
      <h3 className="text-lg font-semibold">Sponsored Matchup Details</h3>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Sponsor Name</Label>
          <Input
            id="name"
            value={sponsoredData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter sponsor name"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="url">Sponsor URL</Label>
          <Input
            id="url"
            type="url"
            value={sponsoredData.url}
            onChange={(e) => handleChange("url", e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={sponsoredData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter sponsor description"
          />
        </div>

        <div className="grid gap-2">
          <Label>Sponsor Logo</Label>
          <ImageUpload
            value={sponsoredData.image || ""}
            onChange={(value) => handleChange("image", value || "")}
          />
          <Label htmlFor="color">Brand Color</Label>
          <Select
            value={sponsoredData.color}
            onValueChange={(value) => handleChange("color", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blue">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2" />
                  Blue
                </div>
              </SelectItem>
              <SelectItem value="red">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2" />
                  Red
                </div>
              </SelectItem>
              <SelectItem value="green">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2" />
                  Green
                </div>
              </SelectItem>
              <SelectItem value="yellow">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2" />
                  Yellow
                </div>
              </SelectItem>
              <SelectItem value="purple">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-2" />
                  Purple
                </div>
              </SelectItem>
              <SelectItem value="cyan">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-cyan-500 rounded-full mr-2" />
                  Cyan
                </div>
              </SelectItem>
              <SelectItem value="orange">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-2" />
                  Orange
                </div>
              </SelectItem>
              <SelectItem value="pink">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-pink-500 rounded-full mr-2" />
                  Pink
                </div>
              </SelectItem>
              <SelectItem value="teal">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-teal-500 rounded-full mr-2" />
                  Teal
                </div>
              </SelectItem>
              <SelectItem value="indigo">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-indigo-500 rounded-full mr-2" />
                  Indigo
                </div>
              </SelectItem>
              <SelectItem value="violet">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-violet-500 rounded-full mr-2" />
                  Violet
                </div>
              </SelectItem>
              <SelectItem value="fuchsia">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-fuchsia-500 rounded-full mr-2" />
                  Fuchsia
                </div>
              </SelectItem>
              <SelectItem value="rose">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-rose-500 rounded-full mr-2" />
                  Rose
                </div>
              </SelectItem>
              <SelectItem value="emerald">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-2" />
                  Emerald
                </div>
              </SelectItem>
              <SelectItem value="sky">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-sky-500 rounded-full mr-2" />
                  Sky
                </div>
              </SelectItem>
              <SelectItem value="amber">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-amber-500 rounded-full mr-2" />
                  Amber
                </div>
              </SelectItem>
              <SelectItem value="lime">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-lime-500 rounded-full mr-2" />
                  Lime
                </div>
              </SelectItem>
              <SelectItem value="slate">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-slate-500 rounded-full mr-2" />
                  Slate
                </div>
              </SelectItem>
              <SelectItem value="zinc">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-zinc-500 rounded-full mr-2" />
                  Zinc
                </div>
              </SelectItem>
              <SelectItem value="neutral">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-neutral-500 rounded-full mr-2" />
                  Neutral
                </div>
              </SelectItem>
              <SelectItem value="stone">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-stone-500 rounded-full mr-2" />
                  Stone
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
