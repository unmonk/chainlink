"use client"
import { UserSearchInput } from "@/components/users/user-search-input"

export default function TestPage() {
  const onUserChange = (user_id: string) => {
    console.log(user_id)
  }

  return (
    <div>
      <h1>Test Page</h1>

      <UserSearchInput />
    </div>
  )
}
