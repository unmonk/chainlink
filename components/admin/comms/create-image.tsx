"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ColorPicker } from "@/components/ui/color-picker";
import html2canvas from "html2canvas";
import { Logo } from "../../ui/logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import MatchupCard from "../../matchups/matchup-card";
import { MatchupSelector } from "./matchup-selector";
import { MatchupWithPickCounts } from "@/convex/matchups";
import { Id } from "@/convex/_generated/dataModel";
import Draggable from "react-draggable";
import { Slider } from "@/components/ui/slider";
import { DisplayCard } from "@/components/matchups/matchup-card/display-card";

interface ImageDimensions {
  facebook: { width: number; height: number };
  twitter: { width: number; height: number };
  instagram: { width: number; height: number };
}

const DIMENSIONS: ImageDimensions = {
  facebook: { width: 1200, height: 630 },
  twitter: { width: 1200, height: 675 },
  instagram: { width: 1080, height: 1080 },
};

export function CreateImage() {
  const [backgroundColor, setBackgroundColor] = useState("#0EA5E9");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("facebook");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [matchup, setMatchup] = useState<MatchupWithPickCounts | null>(null);
  const [matchupPosition, setMatchupPosition] = useState({ x: 0, y: 0 });
  const [matchupScale, setMatchupScale] = useState(1.0);

  async function handleDownload() {
    if (!previewRef.current) return;

    const canvas = await html2canvas(previewRef.current, {
      scale: 2, // Higher quality
      backgroundColor: null,
    });

    const link = document.createElement("a");
    link.download = `social-image-${activeTab}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  const getMatchupTransform = () => ({
    position: "absolute",
    touchAction: "none",
  });

  const handleDrag = (_e: any, data: { x: number; y: number }) => {
    setMatchupPosition({
      x: data.x,
      y: data.y,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="facebook">Facebook</TabsTrigger>
          <TabsTrigger value="twitter">Twitter</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>

            <div className="space-y-4">
              <MatchupSelector onMatchupSelect={setMatchup} />
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>

              <ColorPicker
                color={backgroundColor}
                onChange={setBackgroundColor}
              />
            </div>
            <div className="space-y-2">
              <Label>Background Image</Label>
              <Select onValueChange={(value) => setBackgroundImage(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select image" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">None</SelectItem>
                  <SelectItem value="/images/creator/daily1.png">
                    IG Daily 1
                  </SelectItem>
                  <SelectItem value="/images/creator/daily2.png">
                    IG Daily 2
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {matchup && (
              <>
                <div className="space-y-2">
                  <Label>Matchup Size</Label>
                  <Slider
                    defaultValue={[1.0]}
                    value={[matchupScale]}
                    onValueChange={(values) => setMatchupScale(values[0])}
                    min={0.2}
                    max={2.5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    Scale: {matchupScale.toFixed(1)}x
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Drag the matchup card in the preview to position it
                </p>
              </>
            )}

            <Button onClick={handleDownload} className="w-full">
              Download Image
            </Button>
          </Card>

          {/* Preview */}
          <div className="relative">
            <div
              ref={previewRef}
              style={{
                width: DIMENSIONS[activeTab as keyof ImageDimensions].width,
                height: DIMENSIONS[activeTab as keyof ImageDimensions].height,
                ...(backgroundImage
                  ? {
                      backgroundImage: `url(${backgroundImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : { backgroundColor }),
                transform: "scale(0.3)", // Scale down for preview
                transformOrigin: "top left",
              }}
              className="absolute top-0 left-0 p-12 flex flex-col items-center justify-center text-white"
            >
              <h1 className="text-6xl font-bold text-center mb-6">{title}</h1>
              <p className="text-3xl text-center">{subtitle}</p>

              {matchup && (
                <Draggable
                  position={matchupPosition}
                  onDrag={handleDrag}
                  bounds="parent"
                  scale={0.3}
                >
                  <div
                    style={{
                      ...getMatchupTransform(),
                      cursor: "move",
                      position: "absolute",
                      touchAction: "none",
                    }}
                  >
                    <div
                      style={{
                        transform: `scale(${matchupScale})`,
                        transformOrigin: "center center",
                      }}
                    >
                      <DisplayCard matchup={matchup} />
                    </div>
                  </div>
                </Draggable>
              )}

              {/* Optional: Add your logo */}
              <div className="absolute bottom-12 right-12">
                {/* <Logo className="w-24 h-24" /> */}
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
