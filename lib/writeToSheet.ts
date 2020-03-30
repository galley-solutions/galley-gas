function writeToSheet<TData extends object>({
  data,
  sheetName,
  headers,
  rowFormatter
}: {
  data: TData[];
  sheetName: string;
  headers: string[];
  rowFormatter?: (row: TData) => any[];
}) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const outputSheet = spreadsheet.getSheetByName(sheetName);
  if (!outputSheet) {
    throw new Error("Couldn't find sheet " + sheetName);
  }
  const range = outputSheet.getRange(1, 1, data.length + 1, headers.length);
  rowFormatter = rowFormatter || (row => headers.map(attr => row[attr]));
  range.setValues([headers, ...data.map(rowFormatter)]);
}
