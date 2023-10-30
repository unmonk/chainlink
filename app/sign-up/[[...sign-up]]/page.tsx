import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#12a150",
          },
        }}
      />
    </div>
  );
}
