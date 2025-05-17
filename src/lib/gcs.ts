import { Storage } from "@google-cloud/storage";

const gcpServiceAccount = process.env.GCP_SERVICE_ACCOUNT;
const serviceAccountJson = Buffer.from(gcpServiceAccount!, "base64").toString(
  "utf8"
);
const credentials = JSON.parse(serviceAccountJson);
const clientEmail = credentials.client_email;
const privateKey = credentials.private_key;

if (
  !process.env.GCP_PROJECT_ID ||
  !clientEmail ||
  !privateKey ||
  !process.env.GCP_BUCKET_NAME
) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "Google Cloud Storage environment variables are not fully set. GCS features will be disabled."
    );
  } else {
    throw new Error(
      "Google Cloud Storage environment variables are not fully set."
    );
  }
}

export const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
});

export const bucketName = process.env.GCP_BUCKET_NAME!;
export const bucket = storage.bucket(bucketName);

export const indexBucketName = process.env.GCP_INDEX_BUCKET_NAME!;
export const indexBucket = storage.bucket(indexBucketName);
