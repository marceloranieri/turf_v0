import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { UserAnalytics } from "@/components/topics/user-analytics";
import { ProfileTopics } from "@/components/profile/profile-topics";
import { ProfileComments } from "@/components/profile/profile-comments";
import { ProfileAbout } from "@/components/profile/profile-about";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = params;
  const supabase = createClient();
  
  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("username", username)
    .single();
  
  if (!profile) {
    return {
      title: "User Not Found",
    };
  }
  
  return {
    title: `${profile.full_name || username} | Turf`,
    description: `View ${profile.full_name || username}'s profile and activity on Turf`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params;
  const supabase = createClient();
  
  // Fetch user profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      full_name,
      bio,
      avatar_url,
      banner_url,
      website,
      location,
      created_at,
      topics_count:topics(count),
      followers_count:followers(count),
      following_count:following(count)
    `)
    .eq("username", username)
    .single();
  
  if (error || !profile) {
    notFound();
  }
  
  // Check if current user is viewing their own profile
  const { data: { user } } = await supabase.auth.getUser();
  const isOwnProfile = user?.id === profile.id;
  
  return (
    <div className="container max-w-6xl py-6">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
      
      <ProfileTabs
        profile={profile}
        isOwnProfile={isOwnProfile}
        defaultTab={isOwnProfile ? "analytics" : "topics"}
        tabs={[
          {
            id: "topics",
            label: "Topics",
            content: <ProfileTopics userId={profile.id} />
          },
          {
            id: "comments",
            label: "Comments",
            content: <ProfileComments userId={profile.id} />
          },
          ...(isOwnProfile ? [
            {
              id: "analytics",
              label: "Analytics",
              content: <UserAnalytics userId={profile.id} />
            }
          ] : []),
          {
            id: "about",
            label: "About",
            content: <ProfileAbout profile={profile} />
          }
        ]}
      />
    </div>
  );
}
