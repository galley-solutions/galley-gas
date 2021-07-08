function appendToSheet(sheetName: string, data: object[], headers?: string[]) {
  headers = headers || Object.keys(data[0]);
  const sheet = getOrCreateSheet(sheetName);
  const range = sheet.getRange(
    sheet.getLastRow() + 1,
    1,
    data.length,
    headers.length
  );
  range.setValues(data.map(obj => headers.map(attr => obj[attr])));
}
