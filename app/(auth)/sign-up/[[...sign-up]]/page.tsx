import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <SignUp />
      </div>
    </section>
  );
}
