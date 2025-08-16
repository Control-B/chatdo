# Azure Deployment Guide for ChatDO

This guide walks you through deploying the ChatDO real-time chat application to Azure with full infrastructure setup.

## Prerequisites

- Azure CLI installed and configured
- Azure subscription with sufficient permissions
- GitHub repository with the code
- Node.js 18+ for local development

## Architecture Overview

The deployment includes:
- **Azure Web App**: Node.js API backend
- **Azure Static Web Apps**: Next.js frontend
- **Azure Database for PostgreSQL**: Main database
- **Azure Cache for Redis**: Real-time scaling and session management
- **Azure Blob Storage**: File uploads and storage

## Step 1: Infrastructure Deployment

### Using the Deployment Script (Recommended)

1. Clone the repository:
```bash
git clone <your-repo-url>
cd chatdo
```

2. Login to Azure:
```bash
az login
```

3. Run the deployment script:
```bash
./azure/deploy.sh
```

The script will prompt you for:
- PostgreSQL administrator login and password
- JWT secret for authentication
- NextAuth secret for session management

### Manual Deployment

Alternatively, deploy using Azure CLI directly:

```bash
# Create resource group
az group create --name chatdo-rg --location "East US"

# Deploy infrastructure
az deployment group create \
  --resource-group chatdo-rg \
  --template-file azure/main.bicep \
  --parameters \
    appName=chatdo \
    environment=prod \
    administratorLogin=<your-admin-login> \
    administratorPassword=<your-admin-password> \
    jwtSecret=<your-jwt-secret> \
    nextAuthSecret=<your-nextauth-secret>
```

## Step 2: Configure CI/CD with GitHub Actions

### Set up GitHub Secrets

In your GitHub repository, go to Settings > Secrets and add:

1. **AZURE_CREDENTIALS**: Service Principal credentials for API deployment
   ```bash
   az ad sp create-for-rbac --name "chatdo-github-actions" \
     --role contributor \
     --scopes /subscriptions/{subscription-id}/resourceGroups/chatdo-rg \
     --sdk-auth
   ```

2. **AZURE_STATIC_WEB_APPS_API_TOKEN**: Get from Azure Portal > Static Web Apps > Manage deployment token

3. **NEXT_PUBLIC_API_URL**: Your API URL (e.g., `https://chatdo-api-prod-xxx.azurewebsites.net`)

### Workflow Files

The repository includes two GitHub Actions workflows:
- `.github/workflows/deploy-api.yml`: Deploys the API to Azure Web App
- `.github/workflows/deploy-web.yml`: Deploys the frontend to Azure Static Web Apps

## Step 3: Environment Configuration

### API Environment Variables

The following environment variables are automatically configured by the Bicep template:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-jwt-secret
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
AZURE_STORAGE_ACCOUNT_NAME=your-storage-account
AZURE_STORAGE_CONTAINER_NAME=chatdo-files
CORS_ORIGIN=https://your-static-web-app.azurestaticapps.net
PORT=3001
```

### Frontend Environment Variables

Configured in Azure Static Web Apps:

```bash
NEXT_PUBLIC_API_URL=https://your-api.azurewebsites.net
NEXTAUTH_URL=https://your-app.azurestaticapps.net
NEXTAUTH_SECRET=your-nextauth-secret
```

## Step 4: Database Setup

Database migrations run automatically when the API is deployed. The startup command in the Web App includes:
```bash
npx prisma migrate deploy && node dist/index.js
```

To run migrations manually:
```bash
# Connect to your Web App
az webapp ssh --name <your-api-app-name> --resource-group chatdo-rg

# Run migrations
npx prisma migrate deploy
```

## Step 5: Storage Configuration

Azure Blob Storage is configured automatically with:
- Public read access for uploaded files
- CORS enabled for cross-origin uploads
- Container named `chatdo-files`

## Step 6: Verification

After deployment, verify:

1. **API Health Check**: Visit `https://your-api.azurewebsites.net/healthz`
2. **Frontend**: Visit your Static Web App URL
3. **Database**: Check Azure portal for PostgreSQL connection
4. **Redis**: Verify Redis cache is running
5. **Storage**: Upload a file to test blob storage

## Monitoring and Maintenance

### Application Insights

Enable Application Insights for monitoring:
```bash
az monitor app-insights component create \
  --app chatdo-insights \
  --location "East US" \
  --resource-group chatdo-rg
```

### Scaling

- **API**: Scale the App Service Plan up/out as needed
- **Database**: Increase PostgreSQL compute/storage
- **Redis**: Upgrade Redis tier for more memory
- **Frontend**: Azure Static Web Apps scales automatically

### Backups

- **Database**: Automated backups enabled (7-day retention)
- **Storage**: Enable soft delete for blob storage
- **Code**: GitHub repository serves as source backup

## Cost Optimization

For development/testing environments:
- Use Basic tiers for App Service Plan and PostgreSQL
- Use Standard_LRS storage replication
- Consider Azure Free tier for Static Web Apps

For production:
- Monitor costs with Azure Cost Management
- Use reserved instances for predictable workloads
- Implement auto-scaling policies

## Security Considerations

### Network Security
- All services use HTTPS/TLS
- PostgreSQL requires SSL connections
- Redis uses TLS by default

### Access Control
- Managed identities for service-to-service communication
- Key Vault for sensitive configuration (recommended for production)
- Role-based access control (RBAC) for Azure resources

### Data Protection
- Database encryption at rest and in transit
- Blob storage encryption enabled
- Regular security updates via CI/CD

## Troubleshooting

### Common Issues

1. **Build Failures**: Check Node.js version compatibility (use 18.x)
2. **Database Connection**: Verify firewall rules allow Azure services
3. **CORS Errors**: Update CORS_ORIGIN environment variable
4. **File Upload Issues**: Check blob storage permissions and CORS settings

### Logs and Diagnostics

- **API Logs**: Azure Web App > Log stream
- **Build Logs**: GitHub Actions workflow runs
- **Database Logs**: PostgreSQL flexible server logs
- **Application Logs**: Application Insights (if enabled)

## Support

For issues specific to this deployment:
1. Check GitHub Actions logs for deployment issues
2. Review Azure Activity Log for infrastructure problems
3. Monitor Application Insights for runtime errors
4. Check individual service health in Azure Portal

---

## Quick Commands Reference

```bash
# Check deployment status
az deployment group show --name <deployment-name> --resource-group chatdo-rg

# View app logs
az webapp log tail --name <api-app-name> --resource-group chatdo-rg

# Scale app service
az appservice plan update --name <plan-name> --resource-group chatdo-rg --sku P1V2

# Update app settings
az webapp config appsettings set --name <api-app-name> --resource-group chatdo-rg --settings KEY=VALUE
```