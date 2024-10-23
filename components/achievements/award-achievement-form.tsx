"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Doc, Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  achievementId: z.string(),
  userId: z.string(),
});

export function AwardAchievementForm() {
  const [userOpen, setUserOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      achievementId: "",
      userId: "",
    },
  });

  const users = useQuery(api.users.getAllUsers) || [];
  const achievements = useQuery(api.achievements.listAchievements) || [];
  const awardAchievement = useMutation(api.achievements.awardAchievementToUser);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await awardAchievement({
      achievementId: values.achievementId as Id<"achievements">,
      userId: values.userId as Id<"users">,
    });
    form.reset();
    router.push("/admin/achievements");
  };

  console.log(achievements);

  return (
    <div className="m-4 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
          <FormField
            control={form.control}
            name="achievementId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Achievement</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an achievement" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {achievements.map((achievement) => (
                      <SelectItem key={achievement._id} value={achievement._id}>
                        <div className="flex items-center gap-2">
                          <Image
                            src={achievement.image ?? ""}
                            alt={achievement.name}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                          {achievement.name}
                        </div>
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
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User</FormLabel>
                <Popover open={userOpen} onOpenChange={setUserOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {userId ? (
                          <div className="flex items-center gap-2">
                            <Image
                              src={
                                users.find((u) => u._id === userId)?.image ?? ""
                              }
                              alt={
                                users.find((u) => u._id === userId)?.name ?? ""
                              }
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                            {users.find((u) => u._id === userId)?.name}
                          </div>
                        ) : (
                          "Select user..."
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search user..." />
                      <CommandList>
                        <CommandEmpty>No user found.</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              key={user._id}
                              value={user._id}
                              onSelect={() => {
                                setUserId(user._id);
                                form.setValue("userId", user._id);
                                field.onChange(user._id);

                                setUserOpen(false);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <Image
                                  src={user.image ?? ""}
                                  alt={user.name}
                                  width={20}
                                  height={20}
                                  className="rounded-full"
                                />
                                {user.name}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button type="submit">Award Achievement</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
