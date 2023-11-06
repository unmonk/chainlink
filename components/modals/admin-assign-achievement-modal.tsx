"use client"

import { AlertDialogAction, AlertDialogCancel } from "../ui/alert-dialog"
import { ScrollArea } from "../ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import {
  Achievement,
  achievements,
  profileAchievements,
} from "@/drizzle/schema"
import { editAchievement } from "@/lib/actions/achievements"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInsertSchema } from "drizzle-zod"
import { BadgePlusIcon, Edit2Icon, UserPlus } from "lucide-react"
import { revalidatePath } from "next/cache"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = createInsertSchema(profileAchievements).merge(
  z.object({
    profile_id: z.string().min(10),
    achievement_id: z.coerce.number().int().positive(),
  })
)

export const AdminAssignAchievementModal = ({
  disabled = false,
  achievements,
}: {
  disabled?: boolean
  achievements: Achievement[]
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      achievement_id: achievements[0].id,
      profile_id: "",
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  if (!isMounted) {
    return null
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="flex flex-row gap-2">
          <UserPlus className="h-4 w-4" /> Award
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background max-h-screen overflow-y-scroll rounded-lg p-0">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Award Achievement
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            Award the selected achievement to the selected user. If an automated
            achievement is selected, any requirements will be bypassed.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="achievement_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achievement</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Achievement" />
                        </SelectTrigger>
                        <SelectContent>
                          {achievements.map((achievement) => (
                            <SelectItem
                              key={achievement.id}
                              value={achievement.id.toString()}
                            >
                              {achievement.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      The achievement to be awarded to the user.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profile_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
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
            </div>
            <DialogFooter className="bg-accent gap-2 px-6 py-4">
              <DialogClose asChild>
                <Button variant={"secondary"}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="h-5 w-5" /> : "Award"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
