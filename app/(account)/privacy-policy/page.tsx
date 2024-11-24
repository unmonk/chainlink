import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrivacyPolicyText from "@/components/landing/privacy-policy";

export default function PrivacyPolicy() {
  return (
    <main className="container py-12">
      <div className="flex justify-start mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
      <PrivacyPolicyText />
    </main>
  );
}
