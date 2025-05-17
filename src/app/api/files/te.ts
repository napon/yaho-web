import { Storage, FileMetadata } from '@google-cloud/storage';
import { NextResponse } from "next/server";

const gcpServiceAccount = process.env.GCP_SERVICE_ACCOUNT;
const serviceAccountJson = Buffer.from(gcpServiceAccount!, 'base64').toString('utf8');
const credentials = JSON.parse(serviceAccountJson);
const bucketName = process.env.GCP_BUCKET_NAME;

if (!bucketName) {
  throw new Error('GCP_BUCKET_NAME is not set');
}

const gc = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key
  }
})

// const DEFAULT_SETTINGS = {
//   defaultPublicFiles: true,
//   privateUrlExpiration: 7,
//   cdnAdmins: ''
// }

// async function getAuthToken() {
//   const auth = new JWT({
//     email: credentials.client_email,
//     key: credentials.private_key,
//     scopes: 'https://www.googleapis.com/auth/cloud-platform',
//   });
//   const token = (await auth.authorize());
//   return token.access_token;
// }

const bucket = gc.bucket(bucketName)

// get all files
export async function GET() {
  try {
    const [files] = await bucket.getFiles();
    const filesResponse = files.map((file: { metadata: FileMetadata }) => ({
      cacheControl: file.metadata.cacheControl || '',
      contentEncoding: file.metadata.contentEncoding || '',
      contentType: file.metadata.contentType || '',
      version: file.metadata.generation,
      id: file.metadata.id,
      downloadLink: file.metadata.mediaLink,
      path: file.metadata.name,
      size: file.metadata.size,
      updated: file.metadata.updated,
    }));
    return NextResponse.json({ bucket: bucket.name, files: filesResponse })
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Error fetching files' }, { status: 500 });
  }
}

// delete file
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    await bucket.file(body.filepath).delete();
    return NextResponse.json({ deleted: true })
  } catch(error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Error deleting file' }, { status: 500 });
  }
}

// upload new file
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newFile = bucket.file(body.filepath)
    // Allow 60 minutes for upload
    const expDate = Date.now() + 60 * 60 * 1000
    const options = {
      expires: expDate,
      conditions: [
        ['eq', '$Content-Type', body.fileContentType],
        ['content-length-range', 0, body.fileSize + 1024],
      ],
      fields: {
        'success_action_status': '201',
        'Content-Type': body.fileContentType
      }
    }
    const data = await newFile.generateSignedPostPolicyV4(options)
    const response = data[0]
    return NextResponse.json({ url: response.url, fields: response.fields })
  } catch (error) {
    console.error('Error generating signed upload link:', error);
    return NextResponse.json({ error: 'Error generating signed upload link' }, { status: 500 });
  }
}

// move file
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if ((await bucket.file(body.destination).exists())[0]) {
      return NextResponse.json({ alreadyExists: true, success: false }, { status: 409 })
    }
    await bucket.file(body.filepath).move(body.destination)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Error moving file' }, { status: 500 });
  }
}

// add new folder
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const newFolder = bucket.file(body.folderpath + '/')
    const folderExists = await newFolder.exists()
    if (folderExists[0]) {
      return NextResponse.json({ error: 'file-exists'}, { status: 409 }) // 409 conflict
    }
    await newFolder.save('')
    return NextResponse.json({ saved: true })
  } catch (err) {
    return NextResponse.json({ error: 'Error adding new folder' }, { status: 500 });
  }
}
