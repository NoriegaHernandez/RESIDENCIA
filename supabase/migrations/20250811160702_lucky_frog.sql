/*
  # Add toner column to printers table

  1. Changes
    - Add `toner` column to `printers` table
    - Set default value to 'Full'
    - Column type is text to store toner level strings

  2. Security
    - No changes to existing RLS policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'printers' AND column_name = 'toner'
  ) THEN
    ALTER TABLE printers ADD COLUMN toner text DEFAULT 'Full';
  END IF;
END $$;