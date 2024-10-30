"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardTitle, CardHeader } from "../ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(5).max(50),
  description: z.string().min(10).max(500),
  storageId: z.string(),
  open: z.boolean(),
  slug: z.string().min(5).max(50),
});

type FormValues = z.infer<typeof formSchema>;

export function NewSquadForm() {
  const router = useRouter();
  const createSquad = useMutation(api.squads.createSquad);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      storageId: "",
      open: true,
      slug: "",
    },
  });

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

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);

      await createSquad({
        name: values.name,
        description: values.description,
        storageId: values.storageId as Id<"_storage">,
        image: "",
        slug: values.slug,
        open: true,
      });

      toast.success("Squad created successfully!");
      setDialogOpen(false);
      router.push(`/squads/${values.slug}`);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">Create New Squad</Button>
      </DialogTrigger>
      <DialogContent className="w-[95%] max-w-[600px] p-0 h-[95vh] sm:h-auto">
        <DialogHeader className="p-4 sm:p-6 border-b">
          <DialogTitle className="text-xl sm:text-2xl">
            Create Squad
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(95vh-130px)] sm:max-h-none">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-8 p-4 sm:p-6"
            >
              <FormField
                control={form.control}
                name="storageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Squad Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
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
                        placeholder="Enter squad name"
                        {...field}
                        disabled={isLoading}
                        onChange={(e) => onNameChange(e.target.value)}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be your squad&apos;s display name
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
                    <FormLabel>Squad Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="my-awesome-squad"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormDescription>
                      This will be your squad&apos;s unique identifier
                      <br />
                      <span className="text-xs text-gray-500">
                        chainlink.st/squads/{field.value}
                      </span>
                    </FormDescription>
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
                      <Textarea
                        placeholder="Tell us about your squad"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe what makes your squad unique
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="open"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 sm:p-4">
                    <div className="space-y-1 mb-2 sm:mb-0">
                      <FormLabel>Open Squad</FormLabel>
                      <FormDescription className="text-sm">
                        If your squad is open, anyone can join. If it&apos;s
                        closed, you can invite people.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        {...field}
                        checked={field.value}
                        value={field.value.toString()}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <div className="border-t p-4 sm:p-6 mt-auto">
          <div className="flex flex-col-reverse sm:flex-row items-center gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto mb-2 sm:mb-0"
              onClick={form.handleSubmit(onSubmit)}
            >
              {isLoading ? "Creating..." : "Create Squad"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
