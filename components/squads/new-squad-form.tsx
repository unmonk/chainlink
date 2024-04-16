"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import {
  UploadButton,
  UploadDropzone,
  UploadFileResponse,
  useUploadFiles,
} from "@xixixao/uploadstuff/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Logo } from "../ui/logo";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import Slugify from "slugify";
import { Switch } from "../ui/switch";

export function NewSquadForm() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"outline"}>
            <PlusCircle size={16} className="mr-0.5" />
            Create Squad
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Squad</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when youre done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={"outline"}>
          <PlusCircle size={16} className="mr-0.5" />
          Create Squad
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create Squad</DrawerTitle>
          <DrawerDescription>
            Create a squad by providing a name, description, and a picture.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
  const generateUploadUrl = useMutation(api.squads.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [slug, setSlug] = React.useState<string>("");

  const [formState, setFormState] = React.useState({
    name: "",
    description: "",
    open: true,
    slug: "my-awesome-squad",
    imageId: "",
  });

  const onFileUpload = async (event: any) => {
    const files = Array.from(event.target.files) as File[];
    if (files.length === 0) {
      return;
    }
    setImagePreview(URL.createObjectURL(files[0]));
    const uploaded: UploadFileResponse[] = await startUpload(files);
    const storageId = uploaded[0].response as string;

    setFormState({
      ...formState,
      imageId: storageId,
    });

    console.log(uploaded);
  };

  const onFormInputChange = (event: any) => {
    if (!event) {
      return;
    }
    const { name, value } = event.target;
    if (name === "name") {
      const slug = Slugify(value);
      console.log(slug);
      setFormState({
        ...formState,
        slug: slug,
        name: value,
      });
    }
    if (name === "open") {
      setFormState({
        ...formState,
        open: !formState.open,
      });
    } else {
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  };

  return (
    <form className={cn("grid items-start gap-4", className)}>
      {imagePreview && (
        <div className="flex items-center justify-center">
          <Avatar className="h-12 w-12">
            <AvatarImage src={imagePreview} />
            <AvatarFallback>Squad Picture</AvatarFallback>
          </Avatar>
        </div>
      )}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input id="picture" type="file" onChange={onFileUpload} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="My Awesome Squad"
          onChange={onFormInputChange}
        />
        <span className="text-xs leading-snug text-muted-foreground">
          chainlink.st/squads/{formState.slug}
        </span>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="name">Description</Label>
        <Input
          id="description"
          placeholder="For people from my city..."
          onChange={onFormInputChange}
        />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="open" className="flex flex-col space-y-1">
          <span>Open Membership</span>
          <span className="font-normal leading-snug text-muted-foreground">
            The squad will be open for anyone to join. Disable if you want to
            invite members only.
          </span>
        </Label>
        <Switch id="open" defaultChecked />
      </div>

      <Button type="submit">Create</Button>
    </form>
  );
}
