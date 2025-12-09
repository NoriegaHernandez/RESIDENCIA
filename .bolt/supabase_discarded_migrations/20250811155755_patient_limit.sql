/*
  # Update printer fields

  1. Changes
    - Remove `type` and `connection` columns from printers table
    - Add `toner` column to printers table

  2. Security
    - Maintain existing RLS policies
*/

-- Remove type and connection columns
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'printers' AND column_name = 'type'
  ) THEN
    ALTER TABLE printers DROP COLUMN type;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'printers' AND column_name = 'connection'
  ) THEN
    ALTER TABLE printers DROP COLUMN connection;
  END IF;
END $$;

-- Add toner column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'printers' AND column_name = 'toner'
  ) THEN
    ALTER TABLE printers ADD COLUMN toner text DEFAULT 'Full';
  END IF;
END $$;