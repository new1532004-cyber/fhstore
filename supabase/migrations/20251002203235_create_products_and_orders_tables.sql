/*
  # Create Products and Orders Tables

  ## Tables Created
  
  1. **products**
     - `id` (uuid, primary key) - Unique product identifier
     - `name` (text) - Product name
     - `description` (text) - Product description
     - `price` (integer) - Product price in DA
     - `original_price` (integer) - Original price before discount
     - `image` (text) - Product image URL or storage path
     - `category` (text) - Product category
     - `in_stock` (boolean) - Stock availability
     - `created_at` (timestamptz) - Creation timestamp
     - `updated_at` (timestamptz) - Last update timestamp
  
  2. **orders**
     - `id` (uuid, primary key) - Unique order identifier
     - `customer_first_name` (text) - Customer first name
     - `customer_last_name` (text) - Customer last name
     - `customer_phone` (text) - Customer phone number
     - `customer_wilaya` (text) - Customer wilaya/province
     - `items` (jsonb) - Array of ordered items with details
     - `total` (integer) - Total order amount in DA
     - `status` (text) - Order status (pending, completed, cancelled)
     - `created_at` (timestamptz) - Order creation timestamp
  
  3. **delivery_prices**
     - `id` (uuid, primary key) - Unique identifier
     - `wilaya_name` (text, unique) - Wilaya name
     - `home_delivery` (integer) - Home delivery price in DA
     - `desk_delivery` (integer) - Desk delivery price in DA
     - `updated_at` (timestamptz) - Last update timestamp
  
  ## Security
  
  - Enable Row Level Security (RLS) on all tables
  - Products table: Public read access, authenticated admin write access
  - Orders table: Authenticated admin access only
  - Delivery prices table: Public read access, authenticated admin write access
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price integer NOT NULL DEFAULT 0,
  original_price integer DEFAULT 0,
  image text NOT NULL,
  category text NOT NULL DEFAULT 'accessories',
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_first_name text NOT NULL,
  customer_last_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_wilaya text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total integer NOT NULL DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create delivery_prices table
CREATE TABLE IF NOT EXISTS delivery_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wilaya_name text UNIQUE NOT NULL,
  home_delivery integer NOT NULL DEFAULT 0,
  desk_delivery integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_prices ENABLE ROW LEVEL SECURITY;

-- Products policies (public can read, authenticated can write)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Orders policies (authenticated admin access only)
CREATE POLICY "Authenticated users can view orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);

-- Delivery prices policies (public can read, authenticated can write)
CREATE POLICY "Anyone can view delivery prices"
  ON delivery_prices FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert delivery prices"
  ON delivery_prices FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update delivery prices"
  ON delivery_prices FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_prices_updated_at
  BEFORE UPDATE ON delivery_prices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();