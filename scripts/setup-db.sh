#!/bin/bash

# Fabl Database Setup Script
echo "🗄️  Setting up Fabl database..."

# Add PostgreSQL to PATH
export PATH="/usr/local/opt/postgresql@15/bin:/opt/homebrew/opt/postgresql@15/bin:$PATH"

# Check if PostgreSQL is running
if ! pg_isready > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    echo "   On macOS with Homebrew: brew services start postgresql"
    echo "   On Ubuntu: sudo systemctl start postgresql"
    exit 1
fi

# Database configuration
DB_NAME="fabl_dev"
DB_USER="fabl_user"
DB_PASSWORD="fabl_password"

echo "📊 Creating database and user..."

# Create database and user
psql -d postgres << EOF
-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

# Set environment variables
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"

echo "✅ Database setup complete!"
echo "📝 Your DATABASE_URL is:"
echo "   $DATABASE_URL"
echo ""
echo "💡 Next steps:"
echo "   1. Copy this DATABASE_URL to your .env files"
echo "   2. Run: npm run db:migrate (from packages/db or root)"
echo "   3. Run: npm run dev:all"
echo ""