import { clerkClient, currentUser } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { PushSubscription } from "web-push"

export const revalidate = 0

export async function POST(request: Request) {
  try {
    const newSubscription: PushSubscription | undefined = await request.json()
    if (!newSubscription) {
      throw Error("Push subscription not found")
    }

    const user = await currentUser()
    if (!user) {
      throw Error("Unauthorized")
    }

    const userSubscriptions = user.privateMetadata?.pushSubscriptions || []
    const updatedSubscriptions = userSubscriptions.filter(
      (subscription) => subscription.endpoint !== newSubscription.endpoint
    )
    updatedSubscriptions.push(newSubscription)

    await clerkClient.users.updateUser(user.id, {
      privateMetadata: {
        pushSubscriptions: updatedSubscriptions,
      },
    })

    return NextResponse.json(
      {
        message: "Push subscription saved",
      },
      { status: 200 }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      {
        error: "Invalid push subscription",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const subscription: PushSubscription | undefined = await request.json()
    if (!subscription) {
      throw Error("Push subscription not found")
    }

    const user = await currentUser()
    if (!user) {
      throw Error("Unauthorized")
    }

    const userSubscriptions = user.privateMetadata?.pushSubscriptions || []
    const updatedSubscriptions = userSubscriptions.filter(
      (s) => s.endpoint !== subscription.endpoint
    )
    await clerkClient.users.updateUser(user.id, {
      privateMetadata: {
        pushSubscriptions: updatedSubscriptions,
      },
    })

    return NextResponse.json(
      {
        message: "Push subscription deleted",
      },
      { status: 200 }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      {
        error: "Invalid push subscription",
      },
      { status: 500 }
    )
  }
}
