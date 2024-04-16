import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center">
        <SignIn
          path="/sign-in"
          signUpUrl="/sign-up"
          redirectUrl={"/dashboard"}
          appearance={{
            variables: {
              colorPrimary: "#12a150",
            },
          }}
        />
      </div>
    </main>
  );
}
