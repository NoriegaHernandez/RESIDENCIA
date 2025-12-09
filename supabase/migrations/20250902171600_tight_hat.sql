/*
  # Create inventory table for technological devices

  1. New Tables
    - `inventory`
      - `id` (uuid, primary key)
      - `tag` (text, unique device identifier)
      - `employee_number` (text, employee ID)
      - `user` (text, user name)
      - `hostname` (text, device hostname)
      - `type` (text, device type)
      - `brand` (text, device brand)
      - `model` (text, device model)
      - `os_series` (text, operating system)
      - `cpu` (text, processor information)
      - `ram` (text, memory information)
      - `hdd` (text, storage information)
      - `req_no` (text, requisition number)
      - `supplier` (text, supplier name)
      - `plant_use` (text, plant usage)
      - `business_unit` (text, business unit)
      - `department` (text, department)
      - `area` (text, area location)
      - `status` (text, device status)
      - `comments` (text, additional comments)
      - `registration_date` (date, registration date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `inventory` table
    - Add policy for public access to manage inventory
*/

CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text UNIQUE NOT NULL,
  employee_number text DEFAULT '',
  user_name text DEFAULT '',
  hostname text DEFAULT '',
  type text DEFAULT 'Computer',
  brand text DEFAULT '',
  model text DEFAULT '',
  os_series text DEFAULT '',
  cpu text DEFAULT '',
  ram text DEFAULT '',
  hdd text DEFAULT '',
  req_no text DEFAULT '',
  supplier text DEFAULT '',
  plant_use text DEFAULT '',
  business_unit text DEFAULT '',
  department text DEFAULT '',
  area text DEFAULT '',
  status text DEFAULT 'Active',
  comments text DEFAULT '',
  registration_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage inventory"
  ON inventory
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_inventory_updated_at'
  ) THEN
    CREATE TRIGGER update_inventory_updated_at
      BEFORE UPDATE ON inventory
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;