import { CreateBracketForm } from "@/components/admin/brackets/create-bracket-form";

export default function NewBracketPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Tournament Bracket</h1>
      <CreateBracketForm />
    </div>
  );
}
