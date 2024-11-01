import { ContentLayout } from "@/components/nav/content-layout";
import QuizPage from "@/components/quiz/quiz";

export default function Page() {
  return (
    <ContentLayout title="Challenge">
      <QuizPage />
    </ContentLayout>
  );
}
