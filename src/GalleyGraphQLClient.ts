class GalleyRequestError extends Error {
  public response: ReturnType<typeof UrlFetchApp.fetch>;

  constructor(response: ReturnType<typeof UrlFetchApp.fetch>) {
    super("Unexpected response: " + response.getContentText());
    this.response = response;
  }
}

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
    let retryCount = 0;
    while (true) {
      const response = UrlFetchApp.fetch(this.url, params);
      try {
        return JSON.parse(response.getContentText());
      } catch (e) {
        if (response.getResponseCode() === 403 && retryCount < 4) {
          console.log("Received 403 response, waiting 1 sec before retrying");
          Utilities.sleep(1000);
          retryCount += 1;
        }
        throw new GalleyRequestError(response);
      }
    }
  }
}

function galleyApiClient(apiKey: string, env: "staging" | "production") {
  return new GraphQLClient(apiKey, env);
}
