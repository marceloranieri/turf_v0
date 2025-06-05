import { useRouter } from "next/navigation"
import UserSearch from "@/components/shared/UserSearch"

export default function SearchUser() {
  const router = useRouter()

  const handleSelect = (user: { id: string }) => {
    router.push(`/profile/${user.id}`)
  }

  const handleFollow = (user: { id: string }) => {
    // TODO: Implement follow functionality
    console.log("Follow user:", user.id)
  }

  return (
    <UserSearch
      placeholder="Search users..."
      onSelect={handleSelect}
      showFollowButton
      onFollow={handleFollow}
    />
  )
} 