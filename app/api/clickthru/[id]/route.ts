import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { redirect } from "next/navigation";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sponsorId = params.id as Id<"sponsors">;
    const url = await client.mutation(api.sponsors.recordClick, {
      sponsorId,
    });

    return Response.redirect(url);
  } catch (error) {
    console.error("Error processing sponsor click:", error);
    return new Response("Sponsor not found", { status: 404 });
  }
}
