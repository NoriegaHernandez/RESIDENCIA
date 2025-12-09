/*
  # Add hostname, username, and IP fields to computers table

  1. Changes
    - Add `hostname` column (text)
    - Add `username` column (text) 
    - Add `ip` column (text)

  2. Notes
    - Uses safe column addition with existence checks
    - All new fields are optional (nullable)
    - Default values are empty strings for consistency
*/

DO $$
BEGIN
  -- Add hostname column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'computers' AND column_name = 'hostname'
  ) THEN
    ALTER TABLE computers ADD COLUMN hostname text DEFAULT '';
  END IF;

  -- Add username column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'computers' AND column_name = 'username'
  ) THEN
    ALTER TABLE computers ADD COLUMN username text DEFAULT '';
  END IF;

  -- Add ip column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'computers' AND column_name = 'ip'
  ) THEN
    ALTER TABLE computers ADD COLUMN ip text DEFAULT '';
  END IF;
END $$;