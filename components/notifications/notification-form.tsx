"use client";

import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Bell,
  Smartphone,
  Wifi,
  Battery,
  MoreVertical,
  Image as ImageIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Body is required"),
  icon: z.string().optional(),
  showImage: z.boolean(),
  imageUrl: z.string().optional(),
  imageStorageId: z.string().optional(),
  showCta: z.boolean(),
  cta: z.string().optional(),
  badge: z.string().optional(),
  tag: z.string().optional(),
  clickActionUrl: z.string().optional(),
});

export default function NotificationForm() {
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.achievements.generateUploadUrl);

  const createMassNotification = useAction(
    api.notifications.createMassNotification
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Notification Title",
      message:
        "This is the body of the notification. Add additional details here.",
      icon: "/icons/icon-512x512.png",
      showImage: false,
      imageUrl: "/icons/favicon-16x16.png",
      imageStorageId: "",
      showCta: false,
      badge: "/icons/favicon-16x16.png",
      cta: "Click here",
      tag: "mass-notification",
      clickActionUrl: "/play",
    },
  });

  const { watch } = form;
  const showImage = watch("showImage");
  const showCta = watch("showCta");

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Submitting form", values);
    setIsLoading(true);
    let imageUrl = "";
    let storageId: Id<"_storage"> | null = null;

    if (image) {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": image.type },
        body: image,
      });
      const { storageId: newStorageId } = await result.json();
      storageId = newStorageId;
    }

    await createMassNotification({
      payload: {
        notification: {
          title: values.title,
          message: values.message,
          icon: imageUrl,
          badge: imageUrl,
          storageId: storageId ?? undefined,
          actions: [{ action: "pick", title: "Pick Now" }],
          data: {
            clickActionUrl: "/play",
            tag: values.tag,
          },
          clickActionUrl: values.clickActionUrl,
          tag: values.tag,
        },
      },
    });

    // Reset form and image state after submission
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card className="md:col-span-2 lg:col-span-1 row-span-2">
          <CardHeader>
            <CardTitle>Create Push Notification</CardTitle>
            <CardDescription>
              Enter the details for your push notification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                  console.log("Errors", errors);
                })}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter notification title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter notification body"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showImage"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show Image</FormLabel>
                        <FormDescription>
                          Display an image in the notification
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
                {showImage && (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    {image && (
                      <Image
                        src={
                          image
                            ? URL.createObjectURL(image)
                            : "/icons/favicon-16x16.png"
                        }
                        alt="Notification Image"
                        width={100}
                        height={100}
                      />
                    )}
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                <FormField
                  control={form.control}
                  name="showCta"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show CTA</FormLabel>
                        <FormDescription>
                          Display a call to action button
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
                {showCta && (
                  <FormField
                    control={form.control}
                    name="cta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Call to Action</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter CTA text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Notification"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Web Preview</CardTitle>
            <CardDescription>
              How your notification will appear on web.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 p-4 rounded-lg shadow-inner">
              <div className="flex items-center space-x-2 mb-2">
                <Image
                  src="/icons/icon-192x192.png"
                  width={192}
                  height={192}
                  className="h-5 w-5 text-black"
                  alt="Notification icon"
                />
                <span className="font-semibold text-sm text-slate-600">
                  ChainLink
                </span>
              </div>
              <div className="flex">
                {showImage && (
                  <div className="mr-3">
                    <Image
                      src={
                        image
                          ? URL.createObjectURL(image)
                          : "/icons/favicon-16x16.png"
                      }
                      alt="Notification image"
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-bold mb-1 text-black">
                    {form.watch("title") || "Notification Title"}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {form.watch("message") ||
                      "Notification body will appear here."}
                  </p>
                  {showCta && (
                    <Button
                      variant="link"
                      className="p-0 h-auto mt-2 text-blue-500"
                    >
                      {form.watch("cta") || "Click here"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Android Preview</CardTitle>
            <CardDescription>
              How your notification will appear on Android.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 p-4 rounded-lg shadow-inner">
              <div className="flex justify-between items-center mb-2 text-xs text-slate-600">
                <span>12:00</span>
                <div className="flex items-center space-x-1">
                  <Wifi className="h-4 w-4" />
                  <Battery className="h-4 w-4" />
                </div>
              </div>
              <div className="bg-white rounded-md shadow-sm p-3">
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-3">
                    <Image
                      src="/icons/icon-192x192.png"
                      width={192}
                      height={192}
                      className="h-4 w-4 text-black"
                      alt="Notification icon"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-sm text-black">
                        ChainLink
                      </span>
                      <span className="text-xs text-slate-500">now</span>
                    </div>
                    <h4 className="font-bold text-sm mt-1 text-black">
                      {form.watch("title") || "Notification Title"}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {form.watch("message") ||
                        "Notification body will appear here."}
                    </p>
                    {showImage && (
                      <div className="mt-2">
                        <Image
                          src={
                            image
                              ? URL.createObjectURL(image)
                              : "/icons/favicon-16x16.png"
                          }
                          alt="Notification image"
                          className="w-full h-32 object-cover rounded"
                          width={128}
                          height={128}
                        />
                      </div>
                    )}
                    {showCta && (
                      <Button
                        variant="link"
                        className="p-0 h-auto mt-2 text-blue-500 text-xs"
                      >
                        {form.watch("cta") || "Click here"}
                      </Button>
                    )}
                  </div>
                  <MoreVertical className="h-4 w-4 text-slate-400 ml-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
