"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import Image from "next/image";
import * as z from "zod";
import router from "next/router";
import { Id } from "@/convex/_generated/dataModel";

// Prize schema for individual prizes
const prizeSchema = z.object({
  place: z.number().min(1, "Place must be at least 1"),
  coins: z.number().min(0, "Coins must be 0 or greater"),
  description: z.string().min(1, "Description is required"),
  merch: z.string().optional(),
  merchStorageId: z.custom<Id<"_storage">>().optional(),
});

// Sponsor schema
const sponsorSchema = z.object({
  name: z.string().min(1, "Sponsor name is required"),
  logo: z.string().optional(),
  logoStorageId: z.custom<Id<"_storage">>().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
});

const pickemCampaignSchema = z
  .object({
    name: z.string().min(3, "Campaign name must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    league: z.string().min(1, "Please select a league"),
    type: z.enum(["TRADITIONAL", "WEEKLY", "SURVIVOR"], {
      required_error: "Please select a campaign type",
    }),
    scoringType: z.enum(["STANDARD", "SPREAD", "CONFIDENCE"], {
      required_error: "Please select a scoring type",
    }),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    entryFee: z.number().min(0, "Entry fee must be 0 or greater"),
    allowTies: z.boolean().default(true),
    dropLowestWeeks: z.number().min(0).max(16).optional(),
    includePlayoffs: z.boolean().default(false),
    includePreseason: z.boolean().default(false),
    hasSponsor: z.boolean().default(false),
    sponsorInfo: sponsorSchema.optional(),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate > startDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (data.hasSponsor) {
        return data.sponsorInfo && data.sponsorInfo.name;
      }
      return true;
    },
    {
      message: "Sponsor information is required when sponsor is enabled",
      path: ["sponsorInfo"],
    }
  );

type PickemCampaignFormValues = z.infer<typeof pickemCampaignSchema>;
type PrizeFormValues = z.infer<typeof prizeSchema>;
type SponsorFormValues = z.infer<typeof sponsorSchema>;

export const CreatePickemCampaign = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [prizes, setPrizes] = useState<PrizeFormValues[]>([]);
  const [newPrize, setNewPrize] = useState<PrizeFormValues>({
    place: 1,
    coins: 0,
    description: "",
    merch: "",
    merchStorageId: undefined,
  });
  const [newPrizeImage, setNewPrizeImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sponsorLogo, setSponsorLogo] = useState<File | null>(null);
  const [isUploadingSponsorLogo, setIsUploadingSponsorLogo] = useState(false);
  const newPrizeFileInputRef = useRef<HTMLInputElement>(null);
  const sponsorLogoFileInputRef = useRef<HTMLInputElement>(null);

  const createCampaign = useMutation(api.pickem.createPickemCampaign);
  const generateUploadUrl = useMutation(api.achievements.generateUploadUrl);

  const form = useForm<PickemCampaignFormValues>({
    resolver: zodResolver(pickemCampaignSchema),
    defaultValues: {
      name: "",
      description: "",
      league: "",
      type: "TRADITIONAL",
      scoringType: "STANDARD",
      startDate: "",
      endDate: "",
      entryFee: 0,
      allowTies: true,
      dropLowestWeeks: 0,
      includePlayoffs: false,
      includePreseason: false,
      hasSponsor: false,
      sponsorInfo: {
        name: "",
        logo: "",
        logoStorageId: undefined,
        website: "",
        description: "",
      },
    },
  });

  const handleImageUpload = async (file: File): Promise<string> => {
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();
    return storageId;
  };

  const addPrize = async () => {
    try {
      let merchStorageId: Id<"_storage"> | undefined = undefined;
      let merchUrl = "";

      if (newPrizeImage) {
        setIsUploading(true);
        const storageId = await handleImageUpload(newPrizeImage);
        merchStorageId = storageId as Id<"_storage">;
        merchUrl = `/api/files/${merchStorageId}`;
      }

      const validatedPrize = prizeSchema.parse({
        ...newPrize,
        merch: merchUrl,
        merchStorageId,
      });

      setPrizes([...prizes, validatedPrize]);
      setNewPrize({
        place: prizes.length + 2,
        coins: 0,
        description: "",
        merch: "",
        merchStorageId: undefined,
      });
      setNewPrizeImage(null);
      if (newPrizeFileInputRef.current) {
        newPrizeFileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Invalid prize data:", error);
      toast.error("Invalid prize data");
    } finally {
      setIsUploading(false);
    }
  };

  const removePrize = (index: number) => {
    setPrizes(prizes.filter((_, i) => i !== index));
    // Update place numbers for remaining prizes
    setPrizes((prev) => prev.map((prize, i) => ({ ...prize, place: i + 1 })));
  };

  const handleNewPrizeImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setNewPrizeImage(e.target.files[0]);
    }
  };

  const handleSponsorLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSponsorLogo(e.target.files[0]);
    }
  };

  const onSubmit = async (values: PickemCampaignFormValues) => {
    try {
      setIsLoading(true);

      // Handle sponsor logo upload
      let sponsorLogoStorageId: Id<"_storage"> | undefined = undefined;
      let sponsorLogoUrl = "";

      if (sponsorLogo && values.hasSponsor) {
        setIsUploadingSponsorLogo(true);
        const storageId = await handleImageUpload(sponsorLogo);
        sponsorLogoStorageId = storageId as Id<"_storage">;
        sponsorLogoUrl = `/api/files/${sponsorLogoStorageId}`;
      }

      // Determine confidence points and point spreads based on scoring type
      const confidencePoints = values.scoringType === "CONFIDENCE";
      const pointSpreads = values.scoringType === "SPREAD";

      const campaignData: any = {
        name: values.name,
        description: values.description,
        league: values.league,
        type: values.type,
        scoringType: values.scoringType,
        startDate: new Date(values.startDate).getTime(),
        endDate: new Date(values.endDate).getTime(),
        entryFee: values.entryFee,
        settings: {
          allowTies: values.allowTies,
          dropLowestWeeks: values.dropLowestWeeks || undefined,
          confidencePoints,
          pointSpreads,
          includePlayoffs: values.includePlayoffs,
          includePreseason: values.includePreseason,
        },
        prizes: prizes.length > 0 ? prizes : undefined,
      };

      // Add sponsor info if enabled
      if (values.hasSponsor && values.sponsorInfo) {
        campaignData.sponsorInfo = {
          name: values.sponsorInfo.name,
          logo: sponsorLogoUrl || values.sponsorInfo.logo,
          logoStorageId: sponsorLogoStorageId,
          website: values.sponsorInfo.website || undefined,
          description: values.sponsorInfo.description || undefined,
        };
      }

      const campaignId = await createCampaign(campaignData);

      toast.success("Pickem campaign created successfully!");
      form.reset();
      setPrizes([]);
      setNewPrize({
        place: 1,
        coins: 0,
        description: "",
        merch: "",
        merchStorageId: undefined,
      });
      setSponsorLogo(null);
      if (sponsorLogoFileInputRef.current) {
        sponsorLogoFileInputRef.current.value = "";
      }
      router.push(`/admin/pickem/campaigns/${campaignId}`);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
      setIsUploadingSponsorLogo(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Pickem Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name</FormLabel>
                    <FormControl>
                      <Input placeholder="NFL Season 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="league"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>League</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select League" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NFL">NFL</SelectItem>
                        <SelectItem value="NBA" disabled>
                          NBA
                        </SelectItem>
                        <SelectItem value="MLB" disabled>
                          MLB
                        </SelectItem>
                        <SelectItem value="NHL" disabled>
                          NHL
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your pickem campaign..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TRADITIONAL">Traditional</SelectItem>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="SURVIVOR">Survivor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Traditional: Pick all games each week
                      <br />
                      Weekly: Separate weekly contests
                      <br />
                      Survivor: Pick one team per week, can&apros;t repeat
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scoringType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scoring Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="STANDARD">Standard</SelectItem>
                        <SelectItem value="SPREAD">Point Spread</SelectItem>
                        <SelectItem value="CONFIDENCE">
                          Confidence Points
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Standard: Each win = 1 point
                      <br />
                      Spread: Pick against point spread
                      <br />
                      Confidence: Rank picks by confidence level
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entryFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Fee (🔗Links)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Coins required to join the campaign
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Add Sponsor Section before the Prizes Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sponsor Information</h3>

              <FormField
                control={form.control}
                name="hasSponsor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Has Sponsor</FormLabel>
                      <FormDescription>
                        Enable if this campaign is sponsored by a company or
                        organization
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("hasSponsor") && (
                <Card>
                  <CardHeader>
                    <CardTitle>Sponsor Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sponsorInfo.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sponsor Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Sponsor Company Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sponsorInfo.website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="sponsorInfo.description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sponsor Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief description of the sponsor..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-medium">
                        Sponsor Logo
                      </label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleSponsorLogoChange}
                          ref={sponsorLogoFileInputRef}
                          className="flex-1"
                        />
                        {sponsorLogo && (
                          <Image
                            src={URL.createObjectURL(sponsorLogo)}
                            alt="Sponsor logo preview"
                            width={40}
                            height={40}
                            className="rounded"
                          />
                        )}
                      </div>
                      <FormDescription>
                        Upload a logo for the sponsor (optional)
                      </FormDescription>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Prizes Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Campaign Prizes</h3>

              {/* Add New Prize Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Add New Prize</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPrize}
                      disabled={!newPrize.description || isUploading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {isUploading ? "Uploading..." : "Add Prize"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Place</label>
                      <Input
                        type="number"
                        min="1"
                        value={newPrize.place}
                        onChange={(e) =>
                          setNewPrize({
                            ...newPrize,
                            place: parseInt(e.target.value) || 1,
                          })
                        }
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">🔗Links</label>
                      <Input
                        type="number"
                        min="0"
                        value={newPrize.coins}
                        onChange={(e) =>
                          setNewPrize({
                            ...newPrize,
                            coins: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Prize Image</label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleNewPrizeImageChange}
                          ref={newPrizeFileInputRef}
                          className="flex-1"
                        />
                        {newPrizeImage && (
                          <Image
                            src={URL.createObjectURL(newPrizeImage)}
                            alt="Prize preview"
                            width={40}
                            height={40}
                            className="rounded"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newPrize.description}
                      onChange={(e) =>
                        setNewPrize({
                          ...newPrize,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter prize description"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Current Prizes */}
              {prizes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Current Prizes ({prizes.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {prizes.map((prize, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">
                                #{prize.place}
                              </span>
                              {prize.merch && (
                                <Image
                                  src={prize.merch}
                                  alt="Prize"
                                  width={40}
                                  height={40}
                                  className="rounded"
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{prize.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {prize.coins} 🔗Links
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePrize(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Campaign"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
