#!/bin/bash

# Check if .env file exists
if [ -f ".env" ]; then
    echo ".env file already exists. Please remove it first if you want to create a new one."
    exit 1
fi

# Copy .env.example to .env
cp .env.example .env

echo "Created .env file from .env.example"
echo "Please edit .env file with your actual values"

# Create PostgreSQL database if it doesn't exist
if command -v psql &> /dev/null; then
    if ! psql -lqt | cut -d \| -f 1 | grep -qw yuubnet; then
        echo "Creating PostgreSQL database 'yuubnet'..."
        createdb yuubnet
        echo "Database created successfully"
    else
        echo "Database 'yuubnet' already exists"
    fi
else
    echo "PostgreSQL not found. Please install PostgreSQL and create the database manually"
fi

# Generate Prisma client
if [ -f "package.json" ]; then
    echo "Generating Prisma client..."
    npx prisma generate
    echo "Running initial migration..."
    npx prisma db push
else
    echo "package.json not found. Please run this script from the project root"
fi
