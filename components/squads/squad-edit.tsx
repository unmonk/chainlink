"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Loading from "../ui/loading";
import { ImageUpload } from "../ui/image-upload";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

const squadFormSchema = z.object({
  name: z.string().min(2, {
    message: "Squad name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  imageStorageId: z.string().optional(),
  image: z.string(),
  slug: z.string(),
});

type SquadFormValues = z.infer<typeof squadFormSchema>;

export function SquadEditForm({ squadSlug }: { squadSlug: string }) {
  //check if user is owner of squad
  const squad = useQuery(api.squads.getSquadBySlug, { slug: squadSlug });
  const user = useQuery(api.users.currentUser);
  const updateSquad = useMutation(api.squads.updateSquad);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const generateUploadUrl = useMutation(api.squads.generateUploadUrl);
  const router = useRouter();

  const handleUpload = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      onChange: (storageId: string) => void
    ) => {
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

        onChange(storageId);
      } catch (error) {
        console.error("Failed to upload image:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [generateUploadUrl]
  );

  const isOwner = squad?.ownerId === user?._id;

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }

  async function onNameChange(name: string) {
    const slug = slugify(name);
    form.setValue("slug", slug);
    form.setValue("name", name);
    form.trigger("slug");
    form.trigger("name");
  }

  const form = useForm<SquadFormValues>({
    resolver: zodResolver(squadFormSchema),
    values: squad
      ? {
          name: squad.name,
          description: squad.description,
          image: squad.image,
          imageStorageId: squad.imageStorageId,
          slug: squad.slug,
        }
      : undefined,
  });

  async function onSubmit(data: SquadFormValues) {
    if (!squad) return;
    try {
      await updateSquad({
        _id: squad?._id,
        ...data,
        imageStorageId: data.imageStorageId || undefined,
        // Preserve existing values for admin-only fields
        active: squad!.active,
        featured: squad!.featured,
        open: squad!.open,
      });
      toast.success("Squad updated successfully");
      //redirect to squad page
      router.push(`/squads/${data.slug}`);
    } catch (error) {
      toast.error("Failed to update squad");
    }
  }

  if (!squad) return <Loading />;
  if (!isOwner) return <div>You are not the owner of this squad</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Squad Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={imagePreview ? imagePreview : squad.image}
              alt={squad.name}
            />
            <AvatarFallback>{squad.name}</AvatarFallback>
          </Avatar>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="imageStorageId"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Squad Image</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                      onChange={(e) => handleUpload(e, onChange)}
                      disabled={isUploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Squad Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => onNameChange(e.target.value)}
                    />
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
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Tell others what your squad is about
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isUploading}>
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
