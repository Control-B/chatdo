#!/bin/bash

echo "🚀 Deploying ChatDO to DigitalOcean App Platform..."

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ doctl is not installed. Please install it first:"
    echo "   https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Check if authenticated
if ! doctl auth list &> /dev/null; then
    echo "❌ Not authenticated with DigitalOcean. Please run:"
    echo "   doctl auth init"
    exit 1
fi

# Check if app.yaml exists
if [ ! -f ".do/app.yaml" ]; then
    echo "❌ .do/app.yaml not found!"
    exit 1
fi

echo "📦 Creating/updating DigitalOcean app..."

# Create or update the app
if doctl apps list | grep -q "chatdo"; then
    echo "🔄 Updating existing app..."
    APP_ID=$(doctl apps list --format ID,Name --no-header | grep chatdo | awk '{print $1}')
    doctl apps update $APP_ID --spec .do/app.yaml
else
    echo "🆕 Creating new app..."
    doctl apps create --spec .do/app.yaml
fi

echo "✅ Deployment initiated!"
echo "🌐 Check your app status with: doctl apps list"
echo "📊 Monitor deployment with: doctl apps logs <app-id>"
