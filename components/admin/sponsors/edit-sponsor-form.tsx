"use client";

import { BackgroundGradientSponsored } from "@/components/ui/background-gradient-sponsored";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
  FormDescription,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { COLORS, COLORS_TEXT, TIERS } from "./sponsor-utils";

// Reuse the same schema and color constants from create-sponsor-form
const sponsorFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  url: z.string().min(1, { message: "URL is required" }),
  imageStorageId: z.string().min(1, { message: "Image is required" }),
  bannerImageStorageId: z.string().optional(),
  color: z.string().min(1, { message: "Color is required" }),
  tier: z.enum(["GOLD", "SILVER", "BRONZE"]),
  active: z.boolean(),
  featured: z.boolean(),
  order: z.number().optional(),
});

// Add the same COLORS and COLORS_TEXT constants from create-sponsor-form

interface EditSponsorFormProps {
  sponsorId: Id<"sponsors">;
  initialValues: z.infer<typeof sponsorFormSchema>;
  onClose: () => void;
}

export function EditSponsorForm({
  sponsorId,
  initialValues,
  onClose,
}: EditSponsorFormProps) {
  const [activeColor, setActiveColor] = useState("");
  const router = useRouter();
  const sponsor = useQuery(api.sponsors.getById, { id: sponsorId });
  const updateSponsor = useMutation(api.sponsors.update);

  const form = useForm<z.infer<typeof sponsorFormSchema>>({
    resolver: zodResolver(sponsorFormSchema),
    defaultValues: initialValues,
  });

  if (!sponsor) return null;

  async function onSubmit(values: z.infer<typeof sponsorFormSchema>) {
    try {
      await updateSponsor({
        id: sponsorId,
        ...values,
        imageStorageId: values.imageStorageId as Id<"_storage">,
        bannerImageStorageId: values.bannerImageStorageId as Id<"_storage">,
      });

      toast.success("Sponsor updated successfully");
      onClose();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update sponsor: " + error);
    }
  }

  async function handleColorChange(color: string) {
    setActiveColor(color);
    form.setValue("color", color);
  }

  return (
    <div className="gap-2">
      <BackgroundGradientSponsored color={activeColor}>
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Form fields same as create-sponsor-form */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormDescription>The name of the sponsor</FormDescription>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormDescription>
                        A short description of the sponsor, visible to admins.
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormDescription>
                        The URL that the sponsor images and text will link to.
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 items-center justify-center">
                  <FormField
                    control={form.control}
                    name="imageStorageId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <FormLabel>Sponsor Logo</FormLabel>
                        <FormDescription>
                          24x24. Will be displayed on the matchups footer.
                        </FormDescription>
                        <ImageUpload {...field} value={field.value || ""} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bannerImageStorageId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <FormLabel>Sponsor Banner</FormLabel>
                        <FormDescription>
                          100x100 Will be displayed on the dashboard sponsor
                          widget.
                        </FormDescription>
                        <ImageUpload {...field} value={field.value || ""} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2 items-center justify-center mt-2">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormDescription>
                          Used for the{" "}
                          <span
                            className={cn(
                              "underline",
                              COLORS_TEXT[
                                field.value as keyof typeof COLORS_TEXT
                              ]
                            )}
                          >
                            sponsor url
                          </span>{" "}
                          and border.
                        </FormDescription>
                        <FormControl>
                          <Select
                            onValueChange={handleColorChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(COLORS).map(
                                ([color, bgClass]) => (
                                  <SelectItem key={color} value={color}>
                                    <div className="flex items-center">
                                      <div
                                        className={`w-4 h-4 ${bgClass} rounded-full mr-2`}
                                      />
                                      {color.charAt(0).toUpperCase() +
                                        color.slice(1)}
                                    </div>
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full mt-4"
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </BackgroundGradientSponsored>
    </div>
  );
}
