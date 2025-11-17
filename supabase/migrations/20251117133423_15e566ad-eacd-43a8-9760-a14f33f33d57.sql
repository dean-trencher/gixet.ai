-- Allow anyone to insert crypto config (since there's only one record)
DROP POLICY IF EXISTS "Anyone can insert crypto config" ON crypto_config;
CREATE POLICY "Anyone can insert crypto config" 
ON crypto_config 
FOR INSERT 
TO public
WITH CHECK (true);