// src/app/api/folders/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/lib/gcs";

export async function POST(req: NextRequest) {
  const { folderName, prefix } = await req.json(); // e.g., folderName: "new-folder", prefix: "current-path/"

  if (
    !folderName ||
    typeof folderName !== "string" ||
    folderName.includes("/")
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid folder name. Make sure the folder name does not contain / character.",
      },
      { status: 400 }
    );
  }

  const fullFolderPath = `${prefix}${folderName.trim()}/`; // Ensure trailing slash

  try {
    const file = bucket.file(fullFolderPath);
    await file.save(""); // Save an empty object to represent the folder
    return NextResponse.json({
      message: `Folder '${folderName}' created successfully.`,
      path: fullFolderPath,
    });
  } catch (error: any) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to create folder.",
      },
      { status: 500 }
    );
  }
}
