#!/bin/bash
echo "Setting up Turf database..."
curl -X POST https://v0-recreate-ui-from-screenshot-turfapp.vercel.app/api/setup
echo -e "\n\nSeeding initial data..."
curl -X POST https://v0-recreate-ui-from-screenshot-turfapp.vercel.app/api/seed
echo -e "\n\nSetup complete!"
