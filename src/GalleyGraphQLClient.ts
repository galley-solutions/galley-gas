class GraphQLClient {
  private apiKey: string;
  private url: string;

  constructor(apiKey: string, env: "staging" | "prop") {
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
    const params = {
      method: "post" as const,
      contentType: "application/json",
      payload,
      headers
    };
    const response = UrlFetchApp.fetch(this.url, params);
    return JSON.parse(response.getContentText());
  }
}

function galleyApiClient(apiKey: string, env: "staging" | "prop") {
  return new GraphQLClient(apiKey, env);
}
