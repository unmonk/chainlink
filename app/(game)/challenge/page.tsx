import { ContentLayout } from "@/components/nav/content-layout";
import QuizPage from "@/components/quiz/quiz";
import { QuizList } from "@/components/quiz/quiz-list";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <ContentLayout title="Challenge">
      <QuizPage />
      <Separator className="my-6" />
      <QuizList isAdmin={false} showDrafts={false} limit={15} />
    </ContentLayout>
  );
}
