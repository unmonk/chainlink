"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useRef } from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit, ImageIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";

const editCampaignSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  active: z.boolean(),
  featured: z.boolean(),
  type: z.string(),
  ownedBy: z.string().optional(),
  winnerId: z.string().optional(),
  chainWinnerId: z.string().optional(),
  squadWinnerId: z.string().optional(),
  startDate: z.number(),
  endDate: z.number(),
  prizes: z.optional(
    z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        image: z.string().optional(),
        imageStorageId: z.string().optional(),
        coins: z.number(),
      })
    )
  ),
});

const prizeSchema = z.object({
  name: z.string().min(1, "Prize name is required"),
  description: z.string().min(1, "Prize description is required"),
  image: z.string().optional(),
  imageStorageId: z.string().optional(),
  coins: z.number().min(0, "Links must be 0 or greater"),
});

export interface EditCampaignFormProps {
  row: z.infer<typeof editCampaignSchema> & { _id: string };
}

export default function AdminCampaigns({ row }: EditCampaignFormProps) {
  const [prizes, setPrizes] = useState<z.infer<typeof prizeSchema>[]>(
    row.prizes || []
  );
  const [editingPrizeIndex, setEditingPrizeIndex] = useState<number | null>(
    null
  );
  const [newPrize, setNewPrize] = useState<z.infer<typeof prizeSchema>>({
    name: "",
    description: "",
    image: "",
    imageStorageId: "",
    coins: 0,
  });
  const [newPrizeImage, setNewPrizeImage] = useState<File | null>(null);
  const [editingPrizeImage, setEditingPrizeImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const newPrizeFileInputRef = useRef<HTMLInputElement>(null);
  const editingPrizeFileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.achievements.generateUploadUrl);

  const methods = useForm<z.infer<typeof editCampaignSchema>>({
    resolver: zodResolver(editCampaignSchema),
    defaultValues: {
      _id: row._id,
      name: row.name,
      description: row.description,
      active: row.active,
      featured: row.featured,
      type: row.type,
      ownedBy: row.ownedBy || "",
      winnerId: row.winnerId || "",
      chainWinnerId: row.chainWinnerId || "",
      squadWinnerId: row.squadWinnerId || "",
      startDate: row.startDate,
      endDate: row.endDate,
      prizes: row.prizes,
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
      let imageStorageId = "";
      let imageUrl = "";

      if (newPrizeImage) {
        setIsUploading(true);
        imageStorageId = await handleImageUpload(newPrizeImage);
        imageUrl = `/api/files/${imageStorageId}`;
      }

      const validatedPrize = prizeSchema.parse({
        ...newPrize,
        image: imageUrl,
        imageStorageId: imageStorageId,
      });

      setPrizes([...prizes, validatedPrize]);
      setNewPrize({
        name: "",
        description: "",
        image: "",
        imageStorageId: "",
        coins: 0,
      });
      setNewPrizeImage(null);
      if (newPrizeFileInputRef.current) {
        newPrizeFileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Invalid prize data:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const updatePrize = async (
    index: number,
    updatedPrize: z.infer<typeof prizeSchema>
  ) => {
    try {
      let imageStorageId = updatedPrize.imageStorageId || "";
      let imageUrl = updatedPrize.image || "";

      if (editingPrizeImage) {
        setIsUploading(true);
        imageStorageId = await handleImageUpload(editingPrizeImage);
        imageUrl = `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/files/${imageStorageId}`;
      }

      const validatedPrize = prizeSchema.parse({
        ...updatedPrize,
        image: imageUrl,
        imageStorageId: imageStorageId,
      });

      const updatedPrizes = [...prizes];
      updatedPrizes[index] = validatedPrize;
      setPrizes(updatedPrizes);
      setEditingPrizeIndex(null);
      if (editingPrizeFileInputRef.current) {
        editingPrizeFileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Invalid prize data:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removePrize = (index: number) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  const startEditingPrize = (index: number) => {
    setEditingPrizeIndex(index);
  };

  const cancelEditingPrize = () => {
    setEditingPrizeIndex(null);
    setEditingPrizeImage(null);
    if (editingPrizeFileInputRef.current) {
      editingPrizeFileInputRef.current.value = "";
    }
  };

  const handleNewPrizeImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setNewPrizeImage(e.target.files[0]);
    }
  };

  const handleEditingPrizeImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setEditingPrizeImage(e.target.files[0]);
    }
  };

  function onSubmit(values: z.infer<typeof editCampaignSchema>) {
    const updatedValues = {
      ...values,
      prizes: prizes,
    };
    console.log(updatedValues);
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl font-bold">Current Campaign</h2>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={methods.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={true} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={methods.control}
            name="type"
            disabled={true}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <FormField
              control={methods.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      disabled={true}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Active</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      disabled={true}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Featured</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={true}
                      value={new Date(field.value).toLocaleString()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={true}
                      value={new Date(field.value).toLocaleString()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Prizes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Campaign Prizes</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPrize}
                  disabled={
                    !newPrize.name || !newPrize.description || isUploading
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Add Prize"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Prize Form */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Add New Prize</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Prize Name</label>
                    <Input
                      value={newPrize.name}
                      onChange={(e) =>
                        setNewPrize({ ...newPrize, name: e.target.value })
                      }
                      placeholder="Enter prize name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Links</label>
                    <Input
                      type="number"
                      value={newPrize.coins}
                      onChange={(e) =>
                        setNewPrize({
                          ...newPrize,
                          coins: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newPrize.description}
                    onChange={(e) =>
                      setNewPrize({ ...newPrize, description: e.target.value })
                    }
                    placeholder="Enter prize description"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Prize Image</label>
                  <div className="flex items-center gap-4">
                    {(newPrizeImage || newPrize.image) && (
                      <div className="relative w-20 h-20 rounded-md border overflow-hidden">
                        <Image
                          src={
                            newPrizeImage
                              ? URL.createObjectURL(newPrizeImage)
                              : newPrize.image!
                          }
                          alt="Prize preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleNewPrizeImageChange}
                        ref={newPrizeFileInputRef}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Existing Prizes List */}
              <div className="space-y-3">
                <h4 className="font-medium">
                  Current Prizes ({prizes.length})
                </h4>
                {prizes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No prizes added yet.
                  </p>
                ) : (
                  prizes.map((prize, index) => (
                    <Card key={index} className="p-4">
                      {editingPrizeIndex === index ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">
                                Prize Name
                              </label>
                              <Input
                                value={prize.name}
                                onChange={(e) =>
                                  updatePrize(index, {
                                    ...prize,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Links
                              </label>
                              <Input
                                type="number"
                                value={prize.coins}
                                onChange={(e) =>
                                  updatePrize(index, {
                                    ...prize,
                                    coins: parseInt(e.target.value) || 0,
                                  })
                                }
                                min="0"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Description
                            </label>
                            <Textarea
                              value={prize.description}
                              onChange={(e) =>
                                updatePrize(index, {
                                  ...prize,
                                  description: e.target.value,
                                })
                              }
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Prize Image
                            </label>
                            <div className="flex items-center gap-4">
                              {(editingPrizeImage || prize.image) && (
                                <div className="relative w-20 h-20 rounded-md border overflow-hidden">
                                  <Image
                                    src={
                                      editingPrizeImage
                                        ? URL.createObjectURL(editingPrizeImage)
                                        : prize.image!
                                    }
                                    alt="Prize preview"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleEditingPrizeImageChange}
                                  ref={editingPrizeFileInputRef}
                                  className="cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => cancelEditingPrize()}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => removePrize(index)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {prize.image && (
                                <div className="relative w-12 h-12 rounded-md border overflow-hidden">
                                  <Image
                                    src={prize.image}
                                    alt={prize.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <h5 className="font-medium">{prize.name}</h5>
                                <p className="text-sm text-muted-foreground">
                                  {prize.description}
                                </p>
                                <p className="text-sm font-medium text-green-600">
                                  {prize.coins} Links
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => startEditingPrize(index)}
                                disabled={
                                  prize.name === "Longest Chain" ||
                                  prize.name === "Most Wins"
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => removePrize(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            Update Campaign
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
