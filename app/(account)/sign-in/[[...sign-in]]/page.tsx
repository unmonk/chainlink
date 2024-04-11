import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      path="/sign-in"
      signUpUrl="/sign-up"
      appearance={{
        variables: {
          colorPrimary: "#12a150",
        },
      }}
    />
  );
}
