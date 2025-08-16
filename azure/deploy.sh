#!/bin/bash

# Azure deployment script for ChatDO
# This script deploys the infrastructure and applications to Azure

set -e

echo "🚀 Deploying ChatDO to Azure..."

# Configuration
RESOURCE_GROUP_NAME="${RESOURCE_GROUP_NAME:-chatdo-rg}"
LOCATION="${LOCATION:-East US}"
ENVIRONMENT="${ENVIRONMENT:-prod}"
APP_NAME="${APP_NAME:-chatdo}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first:"
    echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure. Please run:"
    echo "   az login"
    exit 1
fi

# Get required parameters
read -p "Enter PostgreSQL administrator login: " ADMIN_LOGIN
read -s -p "Enter PostgreSQL administrator password: " ADMIN_PASSWORD
echo
read -s -p "Enter JWT secret: " JWT_SECRET
echo
read -s -p "Enter NextAuth secret: " NEXTAUTH_SECRET
echo

echo "📦 Creating resource group..."
az group create \
    --name $RESOURCE_GROUP_NAME \
    --location "$LOCATION" \
    --tags environment=$ENVIRONMENT project=chatdo

echo "🏗️  Deploying infrastructure..."
DEPLOYMENT_OUTPUT=$(az deployment group create \
    --resource-group $RESOURCE_GROUP_NAME \
    --template-file azure/main.bicep \
    --parameters \
        appName=$APP_NAME \
        environment=$ENVIRONMENT \
        location="$LOCATION" \
        administratorLogin=$ADMIN_LOGIN \
        administratorPassword=$ADMIN_PASSWORD \
        jwtSecret=$JWT_SECRET \
        nextAuthSecret=$NEXTAUTH_SECRET \
    --query 'properties.outputs' \
    --output json)

if [ $? -ne 0 ]; then
    echo "❌ Infrastructure deployment failed!"
    exit 1
fi

# Extract outputs
API_URL=$(echo $DEPLOYMENT_OUTPUT | jq -r '.apiUrl.value')
WEB_URL=$(echo $DEPLOYMENT_OUTPUT | jq -r '.webUrl.value')
POSTGRES_HOST=$(echo $DEPLOYMENT_OUTPUT | jq -r '.postgresHost.value')
REDIS_HOST=$(echo $DEPLOYMENT_OUTPUT | jq -r '.redisHost.value')
STORAGE_ACCOUNT=$(echo $DEPLOYMENT_OUTPUT | jq -r '.storageAccountName.value')

echo "✅ Infrastructure deployment completed!"
echo "🌐 API URL: $API_URL"
echo "🌐 Web URL: $WEB_URL"
echo "🗄️  PostgreSQL Host: $POSTGRES_HOST"
echo "🔄 Redis Host: $REDIS_HOST"
echo "💾 Storage Account: $STORAGE_ACCOUNT"

echo "📝 Next steps:"
echo "1. Set up GitHub repository secrets for CI/CD:"
echo "   - AZURE_CREDENTIALS (Service Principal credentials)"
echo "   - AZURE_STATIC_WEB_APPS_API_TOKEN (from Static Web App)"
echo "   - NEXT_PUBLIC_API_URL=$API_URL"
echo ""
echo "2. Run database migrations:"
echo "   - Deploy the API first to run migrations automatically"
echo ""
echo "3. Configure custom domains (optional):"
echo "   - API: Configure custom domain in Azure Web App"
echo "   - Web: Configure custom domain in Static Web App"
echo ""
echo "🎉 Deployment script completed!"