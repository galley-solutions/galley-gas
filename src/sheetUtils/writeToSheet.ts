function writeToSheet<TObject extends object>(
  data: TObject[],
  sheetName: string,
  headers?: Array<keyof TObject>,
  renamedHeaders?: string[]
) {
  if (!headers) {
    headers = Object.keys(data[0]);
  }
  const outputSheet = getOrCreateSheet(sheetName);
  outputSheet.clear();
  const range = outputSheet.getRange(1, 1, data.length + 1, headers.length);
  range.setValues([
    renamedHeaders || headers,
    ...data.map(obj => headers.map(attr => obj[attr]))
  ]);
}
