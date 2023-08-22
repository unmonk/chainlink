import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center">
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
