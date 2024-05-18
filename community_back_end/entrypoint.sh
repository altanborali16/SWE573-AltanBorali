#!/bin/bash

# Apply database migrations
echo "Applying database migrations"
python manage.py migrate

# Load initial data
echo "Loading initial data"
python manage.py loaddata initial_data.json

# Collect static files (if needed)
# echo "Collecting static files"
# python manage.py collectstatic --noinput

# Start the Django server
echo "Starting server"
exec "$@"