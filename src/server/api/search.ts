import type { NextApiRequest, NextApiResponse } from 'next';

const apiKey = process.env.SEARCH_API_KEY;
const projectID = process.env.SEARCH_PROJECT_ID;
const appID = process.env.SEARCH_APP_ID;

const apiUrl = `https://discoveryengine.googleapis.com/v1/projects/${projectID}/locations/global/collections/${appID}/engines/default_search:searchLite?key${apiKey}`;

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // Forward any other necessary headers
        // You might need to include your API key differently
      },
      body: req.method !== 'GET' ? JSON.stringify(buildQuery(req.query.query as string)) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (_) {
    res.status(500).json({ error: 'Error proxying request' });
  }
}