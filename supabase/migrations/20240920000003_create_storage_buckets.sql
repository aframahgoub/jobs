-- Create storage buckets if they don't exist
BEGIN;
  -- Create resume_photos bucket
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('resume_photos', 'resume_photos', true, 5242880, '{image/*}')
  ON CONFLICT (id) DO NOTHING;

  -- Create resume_cvs bucket
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('resume_cvs', 'resume_cvs', true, 10485760, '{application/pdf}')
  ON CONFLICT (id) DO NOTHING;

  -- Set up storage policies for resume_photos
  INSERT INTO storage.policies (name, bucket_id, definition)
  VALUES ('Public Read', 'resume_photos', '{"name":"Public Read","statement":"SELECT","effect":"ALLOW","roles":["anon"],"permission":"READ"}')
  ON CONFLICT (name, bucket_id) DO NOTHING;

  INSERT INTO storage.policies (name, bucket_id, definition)
  VALUES ('Auth Insert', 'resume_photos', '{"name":"Auth Insert","statement":"INSERT","effect":"ALLOW","roles":["authenticated"],"permission":"INSERT"}')
  ON CONFLICT (name, bucket_id) DO NOTHING;

  -- Set up storage policies for resume_cvs
  INSERT INTO storage.policies (name, bucket_id, definition)
  VALUES ('Public Read', 'resume_cvs', '{"name":"Public Read","statement":"SELECT","effect":"ALLOW","roles":["anon"],"permission":"READ"}')
  ON CONFLICT (name, bucket_id) DO NOTHING;

  INSERT INTO storage.policies (name, bucket_id, definition)
  VALUES ('Auth Insert', 'resume_cvs', '{"name":"Auth Insert","statement":"INSERT","effect":"ALLOW","roles":["authenticated"],"permission":"INSERT"}')
  ON CONFLICT (name, bucket_id) DO NOTHING;
COMMIT;