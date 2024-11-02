"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import * as z from "zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  minWager: z.number().min(0, "Minimum wager must be positive"),
  maxWager: z.number().min(0, "Maximum wager must be positive"),
  expiresAt: z.string().transform((str) => new Date(str).getTime()),
  options: z
    .array(
      z.object({
        text: z.string().min(1, "Option text is required"),
      })
    )
    .min(2, "At least two options are required")
    .max(6, "Maximum 6 options allowed"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateQuizForm() {
  const createQuiz = useMutation(api.quiz.createQuiz);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      minWager: 0,
      maxWager: 100,
      options: [{ text: "" }, { text: "" }],
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createQuiz({
        ...data,
        options: data.options.map((option, index) => ({
          optionId: `option-${index + 1}`,
          optionText: option.text,
        })),
      });

      toast.success("Challenge created successfully");
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Error creating challenge", {
        description: "Please try again later",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Global Challenge</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="minWager"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Minimum Wager</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
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
                name="maxWager"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Maximum Wager</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expires At</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Options</FormLabel>
              {form.watch("options").map((_, index) => (
                <div key={index} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`options.${index}.text`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={`Option ${index + 1}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {index > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        const currentOptions = form.getValues("options");
                        form.setValue(
                          "options",
                          currentOptions.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              {form.watch("options").length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const currentOptions = form.getValues("options");
                    form.setValue("options", [...currentOptions, { text: "" }]);
                  }}
                >
                  Add Option
                </Button>
              )}
            </div>

            <Button type="submit">Create Quiz</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
