"use client";

import { AlertDialogAction, AlertDialogCancel } from "../ui/alert-dialog";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Loader } from "@/components/ui/loader";
import { Achievement, achievements } from "@/drizzle/schema";
import { editAchievement } from "@/lib/actions/achievements";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { Edit2Icon } from "lucide-react";
import { revalidatePath } from "next/cache";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = createInsertSchema(achievements).merge(
  z.object({
    value: z.coerce.number().int().positive(),
    id: z.number(),
    type: z.enum(achievements.type.enumValues),
    created_at: z.date().or(z.null()),
  }),
);

export const AdminEditAchievementModal = ({
  disabled,
  achievement,
}: {
  disabled: boolean;
  achievement: Achievement;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      type: achievement.type,
      value: achievement.value,
      image: achievement.image,
      created_at: achievement.created_at,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await editAchievement(values);
    setIsOpen(false);
    form.reset();
  };

  if (!isMounted) {
    return null;
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} size={"icon"} disabled={disabled}>
          <Edit2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background max-h-screen overflow-y-scroll rounded-lg p-0">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Edit Achievement
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            Change the selected achievement.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achievement Name</FormLabel>
                    <FormControl>
                      <Input placeholder="5 Win Chain" {...field} />
                    </FormControl>
                    <FormDescription>
                      The public name of the achievement.
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
                    <FormLabel>Achievement Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Awarded for reaching a 5 win chain."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The public description of the achievement.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achievement Type</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Achievement Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(achievements.type.enumValues).map(
                            ([key, value]) => (
                              <SelectItem key={key} value={value}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      The type of achievement. This will determine how it is
                      awarded. OTHER should be used for all non-sequential
                      achievements.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achievement Weight</FormLabel>
                    <FormControl>
                      <Input placeholder="0" type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      The higher weight for the same type will be displayed on
                      the profile. Ex: 5 weight for 5 win chain, 10 weight for
                      10 win chain, only 10 will show on profile if both are
                      awarded. 0 weight is for non-sequential achievements.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        endpoint="achievementImage"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-accent gap-2 px-6 py-4">
              <DialogClose asChild>
                <Button variant={"secondary"}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="h-5 w-5" /> : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
