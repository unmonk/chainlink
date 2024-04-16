import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center">
        <SignUp
          path="/sign-up"
          signInUrl="/sign-in"
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
