import { NextResponse } from "next/server";

//ON USER CREATION FROM CLERK
//CREATE THEIR FIRST STREAK
export async function POST(req: Request) {
  const body = await req.json();
  const userId = body.data.id;

  if (!userId) {
    return new NextResponse(null, { status: 400 });
  }

  //get current campaign
  const campaign = await getActiveCampaign();
  if (!campaign) {
    return new NextResponse(null, { status: 400 });
  }

  const streak = await prisma.streak.create({
    data: {
      campaignId: campaign.id,
      userId: userId,
      active: true,
      streakType: "WIN",
    },
  });
  if (!streak) {
    return new NextResponse(null, { status: 400 });
  }

  console.log(streak);

  return new NextResponse(null, { status: 200 });
}
