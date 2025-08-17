targetScope = 'resourceGroup'
@description('Environment name for resource token format (AZD env)')
param environmentName string
@description('The name of the application')
param appName string = 'chatdo'

@description('The location for all resources')
param location string = resourceGroup().location


@description('Environment name (dev, staging, prod)')
param environment string = 'prod'

@description('PostgreSQL administrator login')
param administratorLogin string = 'chatdoadmin'

@description('PostgreSQL administrator password')
@secure()
param administratorPassword string = ''

@description('JWT secret for the application')
@secure()
param jwtSecret string = ''

@description('NextAuth secret for the frontend')
@secure()
param nextAuthSecret string = ''

// Generate secure defaults when not provided
var actualAdminPassword = empty(administratorPassword) ? '${uniqueString(subscription().id, resourceGroup().id)}Admin!123' : administratorPassword
var actualJwtSecret = empty(jwtSecret) ? uniqueString(subscription().id, resourceGroup().id, 'jwt') : jwtSecret
var actualNextAuthSecret = empty(nextAuthSecret) ? uniqueString(subscription().id, resourceGroup().id, 'nextauth') : nextAuthSecret

// Generate unique names using recommended resource token format
var uniqueSuffix = uniqueString(subscription().id, resourceGroup().id, location, environmentName)
var appServicePlanName = '${appName}-asp-${environmentName}-${uniqueSuffix}'
var webAppName = '${appName}-api-${environmentName}-${uniqueSuffix}'
var webFrontendName = '${appName}-web-${environmentName}-${uniqueSuffix}'
var postgresServerName = '${appName}-postgres-${environmentName}-${uniqueSuffix}'
var redisName = '${appName}-redis-${environmentName}-${uniqueSuffix}'
// Storage account names must be 3-24 chars, lowercase letters and numbers only
var storageUnique = toLower(uniqueString(subscription().id, resourceGroup().id, environmentName))
var storageAccountName = 'chatdostg${substring(storageUnique, 0, 10)}'
// User-assigned managed identity
resource userAssignedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${appName}-identity-${environment}-${uniqueSuffix}'
  location: location
}

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlanName
  location: location
  properties: {
    reserved: true
  }
  sku: {
  name: 'S1'
  tier: 'Standard'
  }
  kind: 'linux'
}

// Azure Database for PostgreSQL
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2022-12-01' = {
  name: postgresServerName
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    administratorLogin: administratorLogin
    administratorLoginPassword: actualAdminPassword
    version: '15'
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
}

// PostgreSQL Database
resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2022-12-01' = {
  parent: postgresServer
  name: 'chatdo'
}

// PostgreSQL Firewall Rule for Azure Services
resource postgresFirewallRule 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2022-12-01' = {
  parent: postgresServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// Azure Cache for Redis
resource redisCache 'Microsoft.Cache/redis@2023-04-01' = {
  name: redisName
  location: location
  properties: {
    sku: {
      name: 'Basic'
      family: 'C'
      capacity: 0
    }
    enableNonSslPort: false
    minimumTlsVersion: '1.2'
    redisConfiguration: {
      'maxmemory-policy': 'allkeys-lru'
    }
  }
}

// Storage Account for Blob Storage
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    defaultToOAuthAuthentication: false
    allowCrossTenantReplication: false
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: true
    allowSharedKeyAccess: true
    networkAcls: {
      bypass: 'AzureServices'
      virtualNetworkRules: []
      ipRules: []
      defaultAction: 'Allow'
    }
    supportsHttpsTrafficOnly: true
    encryption: {
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
  }
}

// Blob Service
resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-01-01' = {
  parent: storageAccount
  name: 'default'
  properties: {
    cors: {
      corsRules: [
        {
          allowedOrigins: ['*']
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS']
          maxAgeInSeconds: 3600
          exposedHeaders: ['*']
          allowedHeaders: ['*']
        }
      ]
    }
    deleteRetentionPolicy: {
      enabled: true
      days: 7
    }
  }
}

// Blob Container
resource blobContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: blobService
  name: 'chatdo-files'
  properties: {
    publicAccess: 'Blob'
  }
}

// Web App for API
resource webApp 'Microsoft.Web/sites@2022-03-01' = {
  name: webAppName
  location: location
  tags: {
    'azd-service-name': 'api'
    'azd-env-name': environmentName
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
  linuxFxVersion: 'NODE|20-lts'
      alwaysOn: true
      appSettings: [
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'DATABASE_URL'
          value: 'postgresql://${administratorLogin}:${actualAdminPassword}@${postgresServer.properties.fullyQualifiedDomainName}:5432/chatdo?sslmode=require'
        }
        {
          name: 'REDIS_URL'
          value: 'redis://:${redisCache.listKeys().primaryKey}@${redisCache.properties.hostName}:6380?ssl=true'
        }
        {
          name: 'JWT_SECRET'
          value: actualJwtSecret
        }
        {
          name: 'AZURE_STORAGE_CONNECTION_STRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
        }
        {
          name: 'AZURE_STORAGE_ACCOUNT_NAME'
          value: storageAccount.name
        }
        {
          name: 'AZURE_STORAGE_CONTAINER_NAME'
          value: 'chatdo-files'
        }
        {
          name: 'CORS_ORIGIN'
          value: 'https://${webFrontendName}.azurewebsites.net'
        }
        {
          name: 'PORT'
          value: '3001'
        }
      ]
    }
    httpsOnly: true
  }
}

// Frontend Web App (Next.js SSR)
resource webFrontend 'Microsoft.Web/sites@2022-03-01' = {
  name: webFrontendName
  location: location
  tags: {
    'azd-service-name': 'web'
    'azd-env-name': environmentName
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      alwaysOn: true
      appSettings: [
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
        {
          name: 'NPM_CONFIG_PRODUCTION'
          value: 'false'
        }
        {
          name: 'NEXT_TELEMETRY_DISABLED'
          value: '1'
        }
        {
          name: 'NODE_OPTIONS'
          value: '--max-old-space-size=2048'
        }
        {
          name: 'NEXT_PUBLIC_API_URL'
          value: 'https://${webAppName}.azurewebsites.net'
        }
        {
          name: 'NEXTAUTH_URL'
          value: 'https://${webFrontendName}.azurewebsites.net'
        }
        {
          name: 'NEXTAUTH_SECRET'
          value: actualNextAuthSecret
        }
        {
          name: 'PORT'
          value: '3000'
        }
        {
          name: 'WEBSITES_PORT'
          value: '3000'
        }
      ]
    }
    httpsOnly: true
  }
}

// Outputs
output apiUrl string = 'https://${webAppName}.azurewebsites.net'
output webUrl string = 'https://${webFrontendName}.azurewebsites.net'
output postgresHost string = postgresServer.properties.fullyQualifiedDomainName
output redisHost string = redisCache.properties.hostName
output storageAccountName string = storageAccount.name
output resourceGroupName string = resourceGroup().name
output RESOURCE_GROUP_ID string = resourceGroup().id // Resource group ID required for AZD
