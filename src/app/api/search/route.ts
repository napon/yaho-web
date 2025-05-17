import { GoogleAuth } from "google-auth-library";
import { NextResponse } from "next/server";

const projectID = process.env.SEARCH_PROJECT_ID;
const appID = process.env.SEARCH_APP_ID;
const gcpServiceAccount = process.env.GCP_SERVICE_ACCOUNT;
const serviceAccountJson = Buffer.from(gcpServiceAccount!, "base64").toString(
  "utf8"
);
const credentials = JSON.parse(serviceAccountJson);
const newSession = `projects/${projectID}/locations/global/collections/default_collection/engines/${appID}/sessions/-`;
const searchUrl = `https://discoveryengine.googleapis.com/v1alpha/projects/${projectID}/locations/global/collections/default_collection/engines/${appID}/servingConfigs/default_search:search`;
const answerUrl = `https://discoveryengine.googleapis.com/v1alpha/projects/${projectID}/locations/global/collections/default_collection/engines/${appID}/servingConfigs/default_answer:answer`;

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
  session: newSession,
});

const buildAnswerQuery = (
  queryId: string,
  query: string,
  sessionName: string
) => ({
  query: {
    text: query,
    queryId: queryId,
  },
  session: sessionName,
  answerGenerationSpec: {
    ignoreAdversarialQuery: false,
    ignoreNonAnswerSeekingQuery: true,
    ignoreLowRelevantContent: true,
    multimodalSpec: {
      imageSource: "ALL_AVAILABLE_SOURCES",
    },
    includeCitations: true,
    promptSpec: {
      preamble:
        "Given the conversation between an office furniture product sales agent and a helpful assistant responding with some office furniture product recommendations, create a final answer in the same language as the initial query from the user. The answer should use all relevant information from the search results, not introduce any additional information, and use exactly the same words as the search results when possible. The summarized answer should be brief, no more than 1 or 2 sentences.",
    },
    modelSpec: {
      modelVersion: "gemini-2.0-flash-001/answer_gen/v1",
    },
  },
  queryUnderstandingSpec: {
    queryClassificationSpec: {
      types: ["NON_ANSWER_SEEKING_QUERY", "NON_ANSWER_SEEKING_QUERY_V2"],
    },
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
    const response = await fetch(searchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(buildQuery(query)),
    });

    const data = await response.json();
    const sessionInfo = data.sessionInfo;
    let summaryAnswer = undefined;
    if (sessionInfo) {
      const { name, queryId } = sessionInfo;
      const answerResponse = await fetch(answerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildAnswerQuery(queryId, query, name)),
      });
      const { answer } = await answerResponse.json();

      if (
        answer.answerText &&
        answer.answerText.length !==
          "No results could be found. Try rephrasing the search query."
      ) {
        summaryAnswer = answer.answerText;
      }
    }
    return NextResponse.json(
      { ...data, summaryAnswer },
      { status: response.status }
    );
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Error proxying request" },
      { status: 500 }
    );
  }
}
