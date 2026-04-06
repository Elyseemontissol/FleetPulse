#!/bin/bash
set -e

echo "========================================="
echo "  FleetPulse - Project Setup"
echo "========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

echo "This script will help you configure FleetPulse."
echo ""
echo "STEP 1: Create a Supabase Project"
echo "-----------------------------------"
echo "1. Go to https://supabase.com and sign in (or create account)"
echo "2. Click 'New Project'"
echo "3. Name: FleetPulse"
echo "4. Database Password: choose a strong password (save it!)"
echo "5. Region: US East (closest to Brookhaven)"
echo "6. Click 'Create new project'"
echo ""
echo "STEP 2: Get your API keys"
echo "-----------------------------------"
echo "1. In your Supabase dashboard, go to Settings > API"
echo "2. Copy the 'Project URL' and 'anon/public' key"
echo "3. Also copy the 'service_role' key (keep this secret!)"
echo ""

read -p "Enter your Supabase Project URL: " SUPABASE_URL
read -p "Enter your Supabase anon key: " SUPABASE_ANON_KEY
read -p "Enter your Supabase service_role key: " SUPABASE_SERVICE_ROLE_KEY

# Update .env file
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s|SUPABASE_URL=.*|SUPABASE_URL=${SUPABASE_URL}|" .env
  sed -i '' "s|SUPABASE_ANON_KEY=.*|SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}|" .env
  sed -i '' "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}|" .env
  sed -i '' "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}|" .env
  sed -i '' "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}|" .env
else
  sed -i "s|SUPABASE_URL=.*|SUPABASE_URL=${SUPABASE_URL}|" .env
  sed -i "s|SUPABASE_ANON_KEY=.*|SUPABASE_ANON_KEY=${SUPABASE_SERVICE_ROLE_KEY}|" .env
  sed -i "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}|" .env
  sed -i "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}|" .env
  sed -i "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}|" .env
fi

echo ""
echo "✓ .env file updated!"
echo ""
echo "STEP 3: Run Database Migrations"
echo "-----------------------------------"
echo "1. In your Supabase dashboard, go to SQL Editor"
echo "2. Run the following migration files IN ORDER:"
echo "   - supabase/migrations/001_initial_schema.sql"
echo "   - supabase/migrations/002_rls_policies.sql"
echo "   - supabase/migrations/003_seed_data.sql"
echo ""
echo "Or use the Supabase CLI:"
echo "   supabase login"
echo "   supabase link --project-ref YOUR_PROJECT_REF"
echo "   supabase db push"
echo ""
echo "STEP 4: Create your first user"
echo "-----------------------------------"
echo "1. In Supabase dashboard, go to Authentication > Users"
echo "2. Click 'Add user' > 'Create new user'"
echo "3. Enter email + password"
echo "4. Then run this SQL in the SQL Editor to create their profile:"
echo ""
echo "   INSERT INTO public.profiles (id, org_id, full_name, email, role)"
echo "   VALUES ("
echo "     'USER_AUTH_ID_HERE',"
echo "     '00000000-0000-0000-0000-000000000001',"
echo "     'Your Name',"
echo "     'your@email.com',"
echo "     'admin'"
echo "   );"
echo ""
echo "STEP 5: Start the app!"
echo "-----------------------------------"
echo "   pnpm dev"
echo ""
echo "========================================="
echo "  Setup complete!"
echo "========================================="
