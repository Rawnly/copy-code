#!/bin/sh

set -e

echo "Starting..."
git remote add dokku ${GIT_USER}@${HOST}:${APP_NAME}
git push dokku master
