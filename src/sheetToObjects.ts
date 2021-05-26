function sheetToObjects(sheetName: string) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error("Cannot find sheet with name: " + sheetName);
  }
  const data = sheet.getDataRange().getValues();
  const attrs = data.shift();
  return data.map(row =>
    attrs.reduce((memo, attr, idx) => {
      memo[attr] = row[idx];
      return memo;
    }, {})
  );
}
