function clearSheet(sheetName: string) {
  const sheet = getOrCreateSheet(sheetName);
  sheet.clear();
}
