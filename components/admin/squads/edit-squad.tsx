import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BoltIcon, MedalIcon, Users2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

const squadFormSchema = z.object({
  name: z.string().min(2, {
    message: "Squad name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  active: z.boolean(),
  featured: z.boolean(),
  open: z.boolean(),
  image: z.string(),
  slug: z.string(),
  imageStorageId: z.string().nullable(),
});

type SquadFormValues = z.infer<typeof squadFormSchema>;

export default function AdminEditSquad({ squadId }: { squadId: Id<"squads"> }) {
  const squad = useQuery(api.squads.getSquad, {
    squadId,
  });
  const updateSquad = useMutation(api.squads.updateSquad);
  const deleteSquadImage = useMutation(api.squads.deleteSquadImage);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    values: {
      name: squad?.name ?? "",
      description: squad?.description ?? "",
      active: squad?.active ?? true,
      featured: squad?.featured ?? false,
      open: squad?.open ?? true,
      image: squad?.image ?? "",
      slug: squad?.slug ?? "",
      imageStorageId: squad?.imageStorageId ?? null,
    },
  });

  async function onSubmit(data: SquadFormValues) {
    try {
      await updateSquad({
        _id: squadId,
        active: data.active,
        featured: data.featured,
        open: data.open,
        name: data.name,
        description: data.description,
        image: data.image,
        slug: data.slug,
      });
      toast.success("Squad updated successfully");
      router.push("/admin/squads");
    } catch (error) {
      toast.error("Failed to update squad");
    }
  }

  async function handleDeleteImage() {
    try {
      setLoading(true);
      await deleteSquadImage({
        squadId,
        storageId: squad?.imageStorageId,
      });
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Squad</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={squad?.image} alt={squad?.name} />
            <AvatarFallback>{squad?.name}</AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            onClick={handleDeleteImage}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Image"}
          </Button>
          <Separator />
          <div className="flex flex-row gap-1">
            <Badge variant="outline">
              <MedalIcon className="h-4 w-4" /> {squad?.rank}
            </Badge>
            <Badge variant="outline">
              <Users2Icon className="h-4 w-4" /> {squad?.members.length}
            </Badge>
            <Badge variant="outline">
              <BoltIcon className="h-4 w-4" /> {squad?.score}
            </Badge>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => onNameChange(e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    The display name of the squad.
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
                    <Textarea {...field} defaultValue={field.value} />
                  </FormControl>
                  <FormDescription>
                    Describe the purpose or focus of this squad.
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
                  <FormDescription>
                    The slug is used as the url of the squad.
                  </FormDescription>
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
                      Determine if this squad is active and visible.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      defaultChecked={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured</FormLabel>
                    <FormDescription>
                      Feature this squad on the platform.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      defaultChecked={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="open"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Open</FormLabel>
                    <FormDescription>
                      Allow new members to join this squad.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      defaultChecked={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
