import { JWT } from "google-auth-library";
import { NextResponse } from "next/server";

const projectID = process.env.SEARCH_PROJECT_ID;
const appID = process.env.SEARCH_APP_ID;
const gcpServiceAccount = process.env.GCP_SERVICE_ACCOUNT;
const serviceAccountJson = Buffer.from(gcpServiceAccount!, 'base64').toString('utf8');
const credentials = JSON.parse(serviceAccountJson);

const apiUrl = `https://discoveryengine.googleapis.com/v1/projects/${projectID}/locations/global/collections/default_collection/engines/${appID}/servingConfigs/default_search:search`;

const buildQuery = (query: string) => ({
  query,
  pageSize: 10,
  queryExpansionSpec: {
    condition: 'auto'
  },
  spellCorrectionSpec: {
    mode: 'auto'
  },
  languageCode: 'en-US',
  userInfo: {
    timeZone: "Asia/Taipei"
  }
});

export async function getAuthToken() {
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
  });
  const token = (await auth.authorize());
  return token.access_token;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const token = await getAuthToken();

    // Forward the search params
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(buildQuery(query)),
    });
    const data = await response.json();
    return NextResponse.json(data.results, { status: response.status });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Error proxying request' }, { status: 500 });
  }
}