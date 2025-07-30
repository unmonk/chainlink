"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "@/components/ui/color-picker";
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
import { Plus, Trash2, ImageIcon, ArrowLeft } from "lucide-react";
import Image from "next/image";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";

// Prize schema for individual prizes
const prizeSchema = z.object({
  place: z.number().min(1, "Place must be at least 1"),
  coins: z.number().min(0, "Links must be 0 or greater"),
  description: z.string().optional(),
  merch: z.string().optional(),
  merchStorageId: z.custom<Id<"_storage">>().optional(),
  prizeType: z.enum(["WEEKLY", "SEASON"], {
    required_error: "Please select a prize type",
  }),
});

// Sponsor schema
const sponsorSchema = z.object({
  name: z.string().optional(),
  logo: z.string().optional(),
  logoStorageId: z.custom<Id<"_storage">>().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
  borderColor: z.string().optional(),
});

const editPickemCampaignSchema = z
  .object({
    name: z.string().min(3, "Campaign name must be at least 3 characters"),
    description: z.string().optional(),
    league: z.string().min(1, "Please select a league"),
    type: z.enum(["TRADITIONAL", "SURVIVOR"], {
      required_error: "Please select a campaign type",
    }),
    scoringType: z.enum(["STANDARD", "CONFIDENCE"], {
      required_error: "Please select a scoring type",
    }),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    entryFee: z.number().optional(),
    hasSponsor: z.boolean().default(false),
    sponsorInfo: z.optional(
      z.object({
        name: z.string().optional(),
        logo: z.string().optional(),
        logoStorageId: z.custom<Id<"_storage">>().optional(),
        website: z
          .string()
          .url("Must be a valid URL")
          .optional()
          .or(z.literal("")),
        description: z.string().optional(),
        borderColor: z.string().optional(),
      })
    ),
    isPrivate: z.boolean().default(false),
    privateCode: z.string().optional(),
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
      // Only validate sponsor info if hasSponsor is true
      if (data.hasSponsor) {
        return (
          data.sponsorInfo &&
          data.sponsorInfo.name &&
          data.sponsorInfo.name.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Sponsor information is required when sponsor is enabled",
      path: ["sponsorInfo"],
    }
  );

type EditPickemCampaignFormValues = z.infer<typeof editPickemCampaignSchema>;
type PrizeFormValues = z.infer<typeof prizeSchema>;
type SponsorFormValues = z.infer<typeof sponsorSchema>;

interface EditPickemCampaignProps {
  campaignId: Id<"pickemCampaigns">;
}

export const EditPickemCampaign = ({ campaignId }: EditPickemCampaignProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [prizes, setPrizes] = useState<PrizeFormValues[]>([]);
  const [newPrize, setNewPrize] = useState<PrizeFormValues>({
    place: 1,
    coins: 0,
    description: "",
    merch: "",
    merchStorageId: undefined,
    prizeType: "WEEKLY",
  });
  const [newPrizeImage, setNewPrizeImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sponsorLogo, setSponsorLogo] = useState<File | null>(null);
  const [isUploadingSponsorLogo, setIsUploadingSponsorLogo] = useState(false);
  const newPrizeFileInputRef = useRef<HTMLInputElement>(null);
  const sponsorLogoFileInputRef = useRef<HTMLInputElement>(null);

  const campaign = useQuery(api.pickem.getPickemCampaign, { campaignId });
  const updateCampaign = useMutation(api.pickem.updatePickemCampaign);
  const generateUploadUrl = useMutation(api.achievements.generateUploadUrl);

  const form = useForm<EditPickemCampaignFormValues>({
    resolver: zodResolver(editPickemCampaignSchema),
    defaultValues: {
      name: "",
      description: "",
      league: "",
      type: "TRADITIONAL",
      scoringType: "STANDARD",
      startDate: "",
      endDate: "",
      entryFee: 0,
      hasSponsor: false,
      isPrivate: false,
      privateCode: "",
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(onSubmit)();
  };

  // Update form when campaign data loads
  useEffect(() => {
    if (campaign) {
      form.reset({
        name: campaign.name,
        description: campaign.description,
        league: campaign.league,
        type: campaign.type,
        scoringType: campaign.scoringType,
        startDate: new Date(campaign.startDate).toISOString().split("T")[0],
        endDate: new Date(campaign.endDate).toISOString().split("T")[0],
        entryFee: campaign.entryFee,
        isPrivate: campaign.isPrivate ?? false,
        privateCode: campaign.privateCode ?? "",
        hasSponsor: !!campaign.sponsorInfo,
        sponsorInfo: campaign.sponsorInfo
          ? {
              name: campaign.sponsorInfo.name,
              logo: campaign.sponsorInfo.logo || "",
              logoStorageId: campaign.sponsorInfo.logoStorageId,
              website: campaign.sponsorInfo.website || "",
              description: campaign.sponsorInfo.description || "",
              borderColor: campaign.sponsorInfo.borderColor || "#3B82F6",
            }
          : {
              name: "",
              logo: "",
              logoStorageId: undefined,
              website: "",
              description: "",
              borderColor: "#3B82F6",
            },
      });

      // Set prizes
      if (campaign.prizes) {
        setPrizes(campaign.prizes);
        setNewPrize({
          place: campaign.prizes.length + 1,
          coins: 0,
          description: "",
          merch: "",
          merchStorageId: undefined,
          prizeType: "WEEKLY",
        });
      }
    }
  }, [campaign, form]);

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
        prizeType: "WEEKLY",
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

  const handleSponsorLogoChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSponsorLogo(file);

      try {
        setIsUploadingSponsorLogo(true);
        const storageId = await handleImageUpload(file);
        // Set the storage ID in the form
        form.setValue("sponsorInfo.logoStorageId", storageId as Id<"_storage">);
      } catch (error) {
        console.error("Failed to upload sponsor logo:", error);
        toast.error("Failed to upload sponsor logo");
        setSponsorLogo(null);
        if (sponsorLogoFileInputRef.current) {
          sponsorLogoFileInputRef.current.value = "";
        }
      } finally {
        setIsUploadingSponsorLogo(false);
      }
    }
  };

  const onSubmit = async (values: EditPickemCampaignFormValues) => {
    console.log("onSubmit called with values:", values);
    console.log("Form errors:", form.formState.errors);

    try {
      setIsLoading(true);
      console.log("Loading state set to true");

      const campaignData: any = {
        campaignId,
        name: values.name,
        description: values.description,
        league: values.league,
        type: values.type,
        scoringType: values.scoringType,
        startDate: new Date(values.startDate).getTime(),
        endDate: new Date(values.endDate).getTime(),
        entryFee: values.entryFee,
        isPrivate: values.isPrivate ?? false,
        privateCode: values.privateCode ?? undefined,
        settings: {},
        prizes: prizes.length > 0 ? prizes : undefined,
      };

      // Add sponsor info if enabled
      if (values.hasSponsor && values.sponsorInfo) {
        campaignData.sponsorInfo = {
          name: values.sponsorInfo.name,
          logo: undefined, // Let Convex query generate the URL
          logoStorageId: values.sponsorInfo.logoStorageId,
          website: values.sponsorInfo.website || undefined,
          description: values.sponsorInfo.description || undefined,
          borderColor: values.sponsorInfo.borderColor || "#3B82F6",
        };
      }

      await updateCampaign(campaignData);

      toast.success("Pickem campaign updated successfully!");
      router.push(`/admin/pickem/campaigns/${campaignId}`);
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("Failed to update campaign", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Pickem Campaign</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-6">
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
                          <SelectItem value="TRADITIONAL">
                            Traditional
                          </SelectItem>
                          <SelectItem value="SURVIVOR">Survivor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Traditional: Pick all games each week
                        <br />
                        Survivor: Pick one team per week, can&apos;t repeat
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
                          <SelectItem value="CONFIDENCE">
                            Confidence Points
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Standard: Each win = 1 point
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
                      <FormLabel>Entry Fee (Links)</FormLabel>
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
                        Links required to join the campaign
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

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        Private Campaign
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("isPrivate") && (
                  <FormField
                    control={form.control}
                    name="privateCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Private Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter private code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Sponsor Section */}
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
                            disabled={isUploadingSponsorLogo}
                          />
                          {isUploadingSponsorLogo && (
                            <div className="text-sm text-muted-foreground">
                              Uploading...
                            </div>
                          )}
                          {(sponsorLogo || form.watch("sponsorInfo.logo")) &&
                            !isUploadingSponsorLogo && (
                              <Image
                                src={
                                  sponsorLogo
                                    ? URL.createObjectURL(sponsorLogo)
                                    : form.watch("sponsorInfo.logo") || ""
                                }
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

                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name="sponsorInfo.borderColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sponsor Border Color</FormLabel>
                              <FormControl>
                                <ColorPicker
                                  value={field.value || "#3B82F6"}
                                  onChange={field.onChange}
                                  description="This color will be used as the border for the campaign card"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                        disabled={isUploading}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {isUploading ? "Uploading..." : "Add Prize"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium">
                          Winning Place
                        </label>
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
                        <label className="text-sm font-medium">
                          Prize Type
                        </label>
                        <Select
                          value={newPrize.prizeType}
                          onValueChange={(value: "WEEKLY" | "SEASON") =>
                            setNewPrize({
                              ...newPrize,
                              prizeType: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="SEASON">Season</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Prize Image
                        </label>
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
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">
                                #{prize.place}
                              </span>
                              <span>🔗{prize.coins}</span>
                              <span>{prize.description}</span>
                              <Badge variant="outline">{prize.prizeType}</Badge>
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
                {isLoading ? "Updating..." : "Update Campaign"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
