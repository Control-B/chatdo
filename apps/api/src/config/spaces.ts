import AWS from "aws-sdk";

const spacesEndpoint = new AWS.Endpoint(
  process.env.SPACES_REGION || "nyc3.digitaloceanspaces.com"
);

export const s3Client = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
  region: process.env.SPACES_REGION || "nyc3",
});

export const BUCKET_NAME = process.env.SPACES_BUCKET || "chatdo-files";

export function generatePresignedUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    Expires: expiresIn,
  };

  return s3Client.getSignedUrlPromise("putObject", params);
}

export function getFileUrl(key: string): string {
  return `https://${BUCKET_NAME}.${
    process.env.SPACES_REGION || "nyc3"
  }.digitaloceanspaces.com/${key}`;
}
