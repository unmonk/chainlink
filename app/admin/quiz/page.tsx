import { ContentLayout } from "@/components/nav/content-layout";
import { CreateQuizForm } from "@/components/quiz/create-quiz";
import { QuizList } from "@/components/quiz/quiz-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <ContentLayout title="Admin Challenge">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">Challenge List</TabsTrigger>
              <TabsTrigger value="create">Create New Challenge</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <QuizList isAdmin={true} showDrafts={true} limit={15} />
            </TabsContent>
            <TabsContent value="create">
              <CreateQuizForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ContentLayout>
  );
}
