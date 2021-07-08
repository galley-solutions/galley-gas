function getOrCreateSheet(sheetName: string) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let outputSheet = spreadsheet.getSheetByName(sheetName);
  if (!outputSheet) {
    outputSheet = spreadsheet.insertSheet();
    outputSheet.setName(sheetName);
  }
  return outputSheet;
}
