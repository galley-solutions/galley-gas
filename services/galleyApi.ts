function executeGalleyRequest({
  query,
  variables
}: {
  query: string;
  variables?: object;
}) {
  const payload = {
    query,
    variables
  };
  const headers = {
    "x-api-key": GALLEY_API_KEY
  };
  const params = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    headers
  };
  // @ts-ignore
  const response = UrlFetchApp.fetch(GALLEY_API_URL, params);
  return JSON.parse(response.getContentText());
}
