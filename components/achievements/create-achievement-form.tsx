"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Id } from "@/convex/_generated/dataModel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import { achievementTypes } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(achievementTypes),
  weight: z.coerce.number().min(0, "Weight must be a positive number"),
  threshold: z.coerce.number().min(0, "Threshold must be a positive number"),
  coins: z.coerce.number().min(0, "Reward must be a positive number"),
});

export function CreateAchievementForm() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createAchievement = useMutation(api.achievements.createAchievement);
  const generateUploadUrl = useMutation(api.achievements.generateUploadUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "OTHER",
      weight: 0,
      threshold: 0,
      coins: 0,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    let imageUrl = "";
    let storageId = "";

    if (image) {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": image.type },
        body: image,
      });
      const { storageId: newStorageId } = await result.json();
      storageId = newStorageId;
      imageUrl = `/api/files/${storageId}`;
    }

    await createAchievement({
      ...values,
      image: imageUrl,
      imageStorageId: storageId as Id<"_storage">,
    });

    form.reset();
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.push("/admin/achievements");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="m-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Create Achievement</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormDescription>
                  This is the name of the achievement that will be displayed
                </FormDescription>
                <FormControl>
                  <Input placeholder="Achievement Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormDescription>
                  Use OTHER for manually assigned achievements.
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select achievement type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {achievementTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  This is the description of the achievement that will be
                  displayed
                </FormDescription>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormDescription>
                  This is the weight of the achievement that will be used to
                  determine the order of the achievements on the profile.
                </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="threshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Threshold</FormLabel>
                <FormDescription>
                  The threshold is the number required to be met to award the
                  achievement for the given type.
                </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coins"
            render={({ field }) => (
              <FormItem>
                <FormLabel>🔗Reward</FormLabel>
                <FormDescription>
                  This amount will be rewarded on achievement completion.
                </FormDescription>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Image</FormLabel>
            {image && (
              <Image
                src={image ? URL.createObjectURL(image) : ""}
                alt="Achievement Image"
                width={100}
                height={100}
              />
            )}

            <FormDescription>
              This achivement image will be displayed on the profile.
            </FormDescription>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
            </FormControl>
          </FormItem>
          <div className="flex justify-end gap-2">
            <Button type="submit">Create Achievement</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
