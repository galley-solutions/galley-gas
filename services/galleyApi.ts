function executeGalleyRequest(
  apiKey: string,
  env: "staging" | "production",
  query: string,
  variables?: object
) {
  const payload = {
    query,
    variables
  };
  const headers = {
    "x-api-key": apiKey
  };
  const params = {
    method: "post" as const,
    contentType: "application/json",
    payload: JSON.stringify(payload),
    headers
  };
  const response = UrlFetchApp.fetch(
    env === "staging" ? GALLEY_STAGING_API_URL : GALLEY_API_URL,
    params
  );
  return JSON.parse(response.getContentText());
}
