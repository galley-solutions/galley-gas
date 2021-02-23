function writeToSheet(data: object[], sheetName: string, headers: string[]) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let outputSheet = spreadsheet.getSheetByName(sheetName);
  if (!outputSheet) {
    outputSheet = spreadsheet.insertSheet();
    outputSheet.setName(sheetName);
  }
  outputSheet.clear();
  const range = outputSheet.getRange(1, 1, data.length + 1, headers.length);
  range.setValues([
    headers,
    ...data.map(obj => headers.map(attr => obj[attr]))
  ]);
}
