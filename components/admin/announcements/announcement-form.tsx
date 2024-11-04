"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import * as z from "zod";
import { ImageUpload } from "@/components/ui/image-upload";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

export const announcementFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["NEWS", "MAINTENANCE", "FEATURE", "PROMOTION", "ALERT"], {
    required_error: "Please select an announcement type",
  }),
  priority: z.number().min(0).max(100),
  active: z.boolean().default(true),
  expiresAt: z.date({
    required_error: "Expiration date is required",
  }),
  link: z.string().url().optional().nullable(),
  image: z.string().optional().nullable(),
});

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

const announcementTypes = [
  { label: "News", value: "NEWS" },
  { label: "Maintenance", value: "MAINTENANCE" },
  { label: "Feature", value: "FEATURE" },
  { label: "Promotion", value: "PROMOTION" },
  { label: "Alert", value: "ALERT" },
];

interface AnnouncementFormProps {
  initialData?: AnnouncementFormValues & { _id: Id<"announcements"> };
  isEditing?: boolean;
}

export function AnnouncementForm({
  initialData,
  isEditing = false,
}: AnnouncementFormProps) {
  const create = useMutation(api.announcements.createAnnouncement);
  const update = useMutation(api.announcements.updateAnnouncement);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      ...initialData,
    },
  });

  async function onSubmit(data: AnnouncementFormValues) {
    setIsLoading(true);
    try {
      if (isEditing && initialData?._id) {
        await update({
          id: initialData._id,
          announcement: {
            ...data,
            expiresAt: data.expiresAt.getTime(),
            link: data.link || undefined,
            image: data.image || undefined,
          },
        });
        toast.success("Announcement updated successfully");
      } else {
        await create({
          announcement: {
            title: data.title,
            content: data.content,
            type: data.type,
            priority: data.priority,
            active: data.active,
            expiresAt: data.expiresAt.getTime(),
            link: data.link || undefined,
            image: data.image || undefined,
          },
        });
        toast.success("Announcement created successfully");
        form.reset();
      }

      router.push("/admin/announcements");
    } catch (error) {
      toast.error("Failed to create announcement");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Announcement title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Announcement content"
                  className="min-h-[100px]"
                  {...field}
                />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select announcement type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {announcementTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority (1-5)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiresAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiration Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active</FormLabel>
                <FormDescription>
                  Make this announcement visible to users. (You can change this
                  later)
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

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <>
              <FormLabel>Image (Optional)</FormLabel>
              <ImageUpload
                onChange={field.onChange}
                value={field.value || ""}
              />
            </>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isEditing ? "Update" : "Create"} Announcement
        </Button>
      </form>
    </Form>
  );
}
