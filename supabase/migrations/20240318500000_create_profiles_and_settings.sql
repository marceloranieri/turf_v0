-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  avatar_url text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc', now())
);

-- 2. Trigger function to auto-create profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url', 'user');
  insert into public.user_settings (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- 3. Trigger on auth.users
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- 4. Create user_settings table
create table if not exists public.user_settings (
  id uuid primary key references auth.users(id) on delete cascade,
  theme text default 'light',
  notifications_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc', now())
);

-- 5. RLS for profiles
alter table profiles enable row level security;

create policy "Users can view all profiles"
on profiles for select
using (true);

create policy "Users can update their own profile"
on profiles for update
using (auth.uid() = id);

-- 6. RLS for user_settings
alter table user_settings enable row level security;

create policy "Users can view their own settings"
on user_settings for select
using (auth.uid() = id);

create policy "Users can update their own settings"
on user_settings for update
using (auth.uid() = id);
