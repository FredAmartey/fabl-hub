#!/bin/bash

echo "==================================="
echo "Starting ONLY the Fabl Studio app"
echo "==================================="
echo ""
echo "Making sure no other Next.js apps are running..."
pkill -f "next dev" || true
sleep 2

echo ""
echo "Starting Studio on http://localhost:3001"
echo ""
cd apps/studio
npm run dev