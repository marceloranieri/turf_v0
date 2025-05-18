"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/supabase-provider';
import { Profile, getProfileByUsername, updateProfile, uploadProfileImage, getOptimizedImageUrl } from '@/lib/profile-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Camera, Link as LinkIcon, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const profile = await getProfileByUsername(params.username);
        
        if (!profile) {
          router.push('/404');
          return;
        }
        
        setProfile(profile);
        setIsCurrentUser(session?.user.id === profile.id);
        setFormData(profile);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [params.username, supabase, router]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setLoading(true);
    try {
      const updatedProfile = await updateProfile(formData);
      if (updatedProfile) {
        setProfile(updatedProfile);
        setIsEditing(false);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    
    setLoading(true);
    try {
      const updatedProfile = await uploadProfileImage(file, type);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!profile) {
    return null;
  }
  
  return (
    <div className="container max-w-4xl py-8">
      {/* Banner */}
      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
        <img
          src={getOptimizedImageUrl(profile.banner_url, 1200, 400)}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        {isCurrentUser && (
          <label className="absolute bottom-4 right-4 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, 'banner')}
            />
            <Button variant="secondary" size="icon">
              <Camera className="h-4 w-4" />
            </Button>
          </label>
        )}
      </div>
      
      {/* Profile Info */}
      <div className="relative -mt-16 px-4">
        <div className="flex items-end gap-4">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={getOptimizedImageUrl(profile.avatar_url, 256, 256)} />
              <AvatarFallback>
                {profile.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isCurrentUser && (
              <label className="absolute bottom-0 right-0 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'avatar')}
                />
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Camera className="h-4 w-4" />
                </Button>
              </label>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.full_name || profile.username}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>
          </div>
          
          {isCurrentUser && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
          <div>
            <span className="font-semibold">{profile.followers?.count || 0}</span> followers
          </div>
          <div>
            <span className="font-semibold">{profile.following?.count || 0}</span> following
          </div>
          <div>
            <span className="font-semibold">{profile.posts?.count || 0}</span> posts
          </div>
        </div>
        
        {/* Bio and Info */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                name="location"
                value={formData.location || ''}
                onChange={handleInputChange}
                placeholder="Add your location"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Website</label>
              <Input
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                placeholder="Add your website"
                className="mt-1"
              />
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        ) : (
          <div className="mt-4 space-y-2">
            {profile.bio && <p>{profile.bio}</p>}
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </div>
              )}
              
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  <LinkIcon className="h-4 w-4" />
                  {profile.website}
                </a>
              )}
              
              <div>
                Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
