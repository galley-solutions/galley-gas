class GraphQLClient {
  private apiKey: string;
  private url: string;

  constructor(apiKey: string, env: "staging" | "production") {
    this.apiKey = apiKey;
    this.url = env === "staging" ? GALLEY_STAGING_API_URL : GALLEY_API_URL;
  }

  executeRequest(query: string, variables?: object) {
    const payload = JSON.stringify({
      query,
      variables
    });
    const headers = {
      "x-api-key": this.apiKey
    };
    console.log(`Executing request: payload=${payload}`);
    const params = {
      method: "post" as const,
      contentType: "application/json",
      payload,
      headers,
      muteHttpExceptions: true
    };
    const response = UrlFetchApp.fetch(this.url, params);
    return JSON.parse(response.getContentText());
  }
}

function galleyApiClient(apiKey: string, env: "staging" | "production") {
  return new GraphQLClient(apiKey, env);
}
