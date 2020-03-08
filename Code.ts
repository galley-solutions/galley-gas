const galleyApiKey = "51ca98af-10ae-46cb-af3c-f9e6c4cd352c";

function fetchRecipes() {
  const query = `
  query RecipesQuery {
    viewer {
      recipes {
        id
        name
      }
    }
  }
  `;
  const payload = {
    query
  };
  const headers = {
    "x-api-key": galleyApiKey
  };
  const params = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    headers
  };
  const response = UrlFetchApp.fetch(
    "https://staging-api.galleysolutions.com/internalGraphql",
    // @ts-ignore
    params
  );
  const data = JSON.parse(response.getContentText()).data.viewer.recipes;
  writeToSheet({ data, sheetName: "recipes-export", headers: ["id", "name"] });
}
function writeToSheet({
  data,
  sheetName,
  headers
}: {
  data: { id: string; name: string }[];
  sheetName: string;
  headers: string[];
}) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const outputSheet = spreadsheet.getSheetByName(sheetName);
  if (!outputSheet) {
    throw new Error("Couldn't find sheet " + sheetName);
  }
  const range = outputSheet.getRange(1, 1, data.length + 1, 2);
  range.setValues([headers, ...data.map(({ id, name }) => [id, name])]);
}
