-- Add currency preference to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD';

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.currency IS 'User preferred currency code (USD, EUR, GBP, ZMW, ZAR, NGN, KES, CAD)';

