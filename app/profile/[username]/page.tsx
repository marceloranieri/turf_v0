import { createClient } from "@/lib/supabase/server";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ProfileAbout } from "@/components/profile/profile-about";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = createClient();
  const session = await auth();

  // Fetch profile data
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      `
      id,
      username,
      full_name,
      bio,
      location,
      website,
      avatar_url,
      banner_url,
      created_at,
      (
        select count(*) from topics where creator_id = profiles.id
      ) as topics_count,
      (
        select count(*) from comments where user_id = profiles.id
      ) as comments_count,
      (
        select count(*) from followers where following_id = profiles.id
      ) as followers_count,
      (
        select count(*) from followers where follower_id = profiles.id
      ) as following_count,
      (
        select coalesce(sum(likes_count), 0) from topics where creator_id = profiles.id
      ) as total_likes,
      (
        select count(*)::float / nullif(
          (
            select count(*) from topics
            where created_at > now() - interval '30 days'
          ),
          0
        ) as participation_rate
        from participations
        where user_id = profiles.id
        and created_at > now() - interval '30 days'
      ) as participation_rate
    `
    )
    .eq("username", params.username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  const isOwnProfile = session?.user?.id === profile.id;

  const stats = {
    topics_count: profile.topics_count || 0,
    comments_count: profile.comments_count || 0,
    followers_count: profile.followers_count || 0,
    following_count: profile.following_count || 0,
    total_likes: profile.total_likes || 0,
    participation_rate: profile.participation_rate || 0,
  };

  // Fetch user's topics
  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .eq("creator_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch user's participations
  const { data: participations } = await supabase
    .from("participations")
    .select(
      `
      *,
      topic:topics(*)
    `
    )
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const tabs = [
    {
      label: "About",
      content: (
        <ProfileAbout
          username={profile.username}
          fullName={profile.full_name}
          bio={profile.bio}
          createdAt={profile.created_at}
          location={profile.location}
          website={profile.website}
        />
      ),
    },
    {
      label: "Topics",
      content: (
        <div className="space-y-4">
          {topics?.map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-lg border bg-card text-card-foreground"
            >
              <h3 className="font-semibold">{topic.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {topic.description}
              </p>
            </div>
          ))}
          {topics?.length === 0 && (
            <p className="text-center text-muted-foreground">
              No topics created yet
            </p>
          )}
        </div>
      ),
    },
    {
      label: "Participations",
      content: (
        <div className="space-y-4">
          {participations?.map((participation) => (
            <div
              key={participation.id}
              className="p-4 rounded-lg border bg-card text-card-foreground"
            >
              <h3 className="font-semibold">{participation.topic.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {participation.topic.description}
              </p>
            </div>
          ))}
          {participations?.length === 0 && (
            <p className="text-center text-muted-foreground">
              No participations yet
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
      <ProfileStats stats={stats} />
      <ProfileTabs
        profile={profile}
        isOwnProfile={isOwnProfile}
        tabs={tabs}
        defaultTab="About"
      />
    </div>
  );
} 