import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main>
      <SignUp
        path="/sign-up"
        signInUrl="/sign-in"
        appearance={{
          variables: {
            colorPrimary: "#12a150",
          },
        }}
      />
    </main>
  );
}
