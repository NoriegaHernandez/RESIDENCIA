/*
  # Create TVs table

  1. New Tables
    - `tvs`
      - `id` (uuid, primary key)
      - `floor_plan_id` (uuid, foreign key to floor_plans)
      - `name` (text, default 'New TV')
      - `model` (text, default empty string)
      - `size` (text, default '55"')
      - `type` (text, default 'LED')
      - `status` (text, default 'Online')
      - `x_position` (numeric, required)
      - `y_position` (numeric, required)
      - `created_at` (timestamp with timezone, default now())
      - `updated_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `tvs` table
    - Add policy for public access to manage TVs

  3. Triggers
    - Add trigger to automatically update `updated_at` column
*/

CREATE TABLE IF NOT EXISTS tvs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_plan_id uuid NOT NULL REFERENCES floor_plans(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'New TV',
  model text DEFAULT '',
  size text DEFAULT '55"',
  type text DEFAULT 'LED',
  status text DEFAULT 'Online',
  x_position numeric NOT NULL,
  y_position numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage tvs"
  ON tvs
  FOR ALL
  TO public
  USING (true);

CREATE TRIGGER update_tvs_updated_at
  BEFORE UPDATE ON tvs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();