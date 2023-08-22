import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#12a150",
          },
        }}
      />
    </div>
  );
}
