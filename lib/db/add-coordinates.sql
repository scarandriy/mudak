-- Add latitude and longitude columns to exhibitions table
ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
