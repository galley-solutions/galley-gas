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
