function selectSheet(sheetName: string) {
  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)
  );
}
