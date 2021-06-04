const GALLEY_WEB_APP_URL = "https://app.galleysolutions.com";

function recipeLink(recipeId: string, locationId?: string) {
  let link = `${GALLEY_WEB_APP_URL}/recipes/${recipeId}`;
  if (locationId) link += `?locationId=${locationId}`;
  return link;
}

function vendorItemLink(vendorId: string, vendorItemId: string) {
  return `${GALLEY_WEB_APP_URL}/vendors/${vendorId}/vendorItems/${vendorItemId}`;
}
