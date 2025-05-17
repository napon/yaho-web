import { GoogleAuth } from "google-auth-library";
import { NextResponse } from "next/server";

const projectID = process.env.SEARCH_PROJECT_ID;
const appID = process.env.SEARCH_APP_ID;
const gcpServiceAccount = process.env.GCP_SERVICE_ACCOUNT;
const serviceAccountJson = Buffer.from(gcpServiceAccount!, "base64").toString(
  "utf8"
);
const credentials = JSON.parse(serviceAccountJson);
// const apiUrL = `https://discoveryengine.clients6.google.com/v1alpha/projects/513631775428/locations/global/collections/default_collection/engines/yaho-structured-search_1746192745211/servingConfigs/default_search:search?key=AIzaSyCI-zsRP85UVOi0DjtiCwWBwQ1djDy741g`
const apiUrl = `https://discoveryengine.googleapis.com/v1alpha/projects/${projectID}/locations/global/collections/default_collection/engines/${appID}/servingConfigs/default_search:search`;

const buildQuery = (query: string) => ({
  query,
  pageSize: 10,
  queryExpansionSpec: {
    condition: "auto",
  },
  spellCorrectionSpec: {
    mode: "auto",
  },
  useLatestData: true,
  languageCode: "en-US",
  userInfo: {
    timeZone: "Asia/Taipei",
  },
});

async function getAuthToken() {
  const auth = new GoogleAuth({
    credentials: {
      private_key: credentials.private_key,
      client_email: credentials.client_email,
    },
    scopes: "https://www.googleapis.com/auth/cloud-platform",
  });

  return auth.getAccessToken();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const token = await getAuthToken();

    // Forward the search params
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(buildQuery(query)),
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
    // console.log(JSON.stringify(results, null, 2));
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Error proxying request" },
      { status: 500 }
    );
  }
}
