-- Create the resumes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  firstname TEXT,
  lastname TEXT,
  fullname TEXT,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  specialistprofile TEXT,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  skills TEXT[] DEFAULT '{}',
  education JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]',
  socialmedia JSONB DEFAULT '{}',
  attachments JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  photo TEXT,
  cv_url TEXT,
  nationality TEXT,
  age TEXT,
  yearsofexperience TEXT,
  educationlevel TEXT DEFAULT 'High school',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  views INTEGER DEFAULT 0,
  contacts INTEGER DEFAULT 0,
  slug TEXT,
  portfolio_images TEXT[] DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS resumes_created_at_idx ON public.resumes(created_at DESC);
CREATE INDEX IF NOT EXISTS resumes_slug_idx ON public.resumes(slug);

-- Make resumes table public (disable RLS)
ALTER TABLE public.resumes DISABLE ROW LEVEL SECURITY;

-- Enable realtime for resumes table
alter publication supabase_realtime add table resumes;