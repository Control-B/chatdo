import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

let blobServiceClient: BlobServiceClient;

// Initialize Azure Blob Storage client
export function initializeBlobStorage() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

  if (connectionString) {
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  } else if (accountName && accountKey) {
    const credential = new StorageSharedKeyCredential(accountName, accountKey);
    blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential
    );
  } else if (accountName) {
    // Use managed identity or Azure CLI credentials
    blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      new DefaultAzureCredential()
    );
  } else {
    throw new Error("Azure Storage configuration is missing. Please set AZURE_STORAGE_CONNECTION_STRING or AZURE_STORAGE_ACCOUNT_NAME");
  }
}

export const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || "chatdo-files";

export async function generatePresignedUrl(
  filename: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  if (!blobServiceClient) {
    initializeBlobStorage();
  }

  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const blobClient = containerClient.getBlobClient(filename);

  // Create container if it doesn't exist
  await containerClient.createIfNotExists({
    access: "blob" // Allow public read access to blobs
  });

  // For connection string authentication, generate SAS URL
  if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
    const sasOptions = {
      containerName: CONTAINER_NAME,
      blobName: filename,
      permissions: BlobSASPermissions.parse("w"), // write permission for upload
      expiresOn: new Date(Date.now() + expiresIn * 1000),
      contentType: contentType,
    };

    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      blobServiceClient.credential as StorageSharedKeyCredential
    ).toString();

    return `${blobClient.url}?${sasToken}`;
  } else {
    // For managed identity, return the blob URL directly
    // Note: In production, you might want to implement a different upload strategy
    return blobClient.url;
  }
}

export function getFileUrl(filename: string): string {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  if (!accountName) {
    throw new Error("AZURE_STORAGE_ACCOUNT_NAME is not configured");
  }
  
  return `https://${accountName}.blob.core.windows.net/${CONTAINER_NAME}/${filename}`;
}

export async function deleteFile(filename: string): Promise<boolean> {
  try {
    if (!blobServiceClient) {
      initializeBlobStorage();
    }

    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blobClient = containerClient.getBlobClient(filename);
    
    await blobClient.deleteIfExists();
    return true;
  } catch (error) {
    console.error("Error deleting file from Azure Blob Storage:", error);
    return false;
  }
}

// Initialize on module load
initializeBlobStorage();