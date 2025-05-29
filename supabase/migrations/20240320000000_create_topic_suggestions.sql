create table if not exists public.topic_suggestions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  suggestion text not null,
  category text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.topic_suggestions enable row level security;

-- Create policies
create policy "Users can insert their own suggestions"
  on public.topic_suggestions for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own suggestions"
  on public.topic_suggestions for select
  using (auth.uid() = user_id);

-- Create function to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger
create trigger handle_updated_at
  before update on public.topic_suggestions
  for each row
  execute function public.handle_updated_at(); 