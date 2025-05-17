// src/app/api/files/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
const gcpServiceAccount = process.env.GCP_SERVICE_ACCOUNT;
const serviceAccountJson = Buffer.from(gcpServiceAccount!, "base64").toString(
  "utf8"
);
const credentials = JSON.parse(serviceAccountJson);
const clientEmail = credentials.client_email;
const privateKey = credentials.private_key;

// node SDK for GCP bucket is broken.. the delimiter doens't work as expected. Using API instead.
const buildAPI = (prefix: string) =>
  `https://www.googleapis.com/storage/v1/b/${
    process.env.GCP_BUCKET_NAME
  }/o?delimiter=/&prefix=${prefix || ""}`;
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prefix = searchParams.get("prefix") || ""; // e.g., 'my-folder/'

  try {
    const auth = new GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: "https://www.googleapis.com/auth/devstorage.read_only",
    });

    const client = await auth.getClient();
    const accessToken = (await client.getAccessToken()).token;
    const res = await fetch(buildAPI(prefix), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "GCS API error", details: text },
        { status: res.status }
      );
    }
    const data = await res.json();

    const files = (data.items || [])
      .filter((obj: { size: number }) => obj.size > 0)
      .map((obj: { name: string; size: number; updated: string }) => ({
        name: obj.name.substring(prefix.length), // Get relative name
        fullPath: obj.name,
        size: obj.size,
        updated: obj.updated,
        type: "file",
      }));

    const subdirectories =
      (data.prefixes || []).map((subdir: string) => ({
        name: subdir.substring(prefix.length).replace(/\/$/, ""),
        fullPath: subdir,
        type: "folder",
      })) || [];
    return NextResponse.json({ files, subdirectories });
  } catch (error: any) {
    console.error("Error listing files:", error);
    return NextResponse.json(
      { error: error.message || "Failed to list files." },
      { status: 500 }
    );
  }
}
