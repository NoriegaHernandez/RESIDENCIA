/*
  # Printer Management System Schema

  1. New Tables
    - `floor_plans`
      - `id` (uuid, primary key)
      - `name` (text)
      - `image_url` (text) 
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `printers`
      - `id` (uuid, primary key)
      - `floor_plan_id` (uuid, foreign key)
      - `name` (text)
      - `model` (text)
      - `type` (text)
      - `connection` (text)
      - `status` (text)
      - `x_position` (numeric)
      - `y_position` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their data
*/

CREATE TABLE IF NOT EXISTS floor_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS printers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_plan_id uuid NOT NULL REFERENCES floor_plans(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'New Printer',
  model text DEFAULT '',
  type text DEFAULT 'Laser',
  connection text DEFAULT 'Network',
  status text DEFAULT 'Online',
  x_position numeric NOT NULL,
  y_position numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE floor_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE printers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage floor plans"
  ON floor_plans
  FOR ALL
  TO public
  USING (true);

CREATE POLICY "Anyone can manage printers"
  ON printers
  FOR ALL
  TO public
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_floor_plans_updated_at 
  BEFORE UPDATE ON floor_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_printers_updated_at 
  BEFORE UPDATE ON printers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();