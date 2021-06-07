<h1 align="center">
  <br>
  Galley Google App Scripts
  <br>
</h1>

# Overview

This is a library for Google App Scripts aimed at providing easy access to the Galley GraphQL API along with other helpful Google Sheets utility functions.

It uses [clasp](https://github.com/google/clasp) for local development.

# Usage

1. In a Google Sheet, go to `Tools > Script Editor`. This will open a bound script for the Sheet.
2. Click the `+` for `Library` to add a new library
3. Enter `1oeoJ_ZE-AeyMX0tBauzzViDlkHsjnY0SzHWszs_FkyRMjFiCSaHlzFeV` as the `Script ID`
4. Click `Lookup`. This should find the `GalleyDataFetch` library and add it to the project.
5. (Optional) You might also want to include Lodash `1SQ0PlSMwndIuOAgtVJdjxsuXueECtY9OGejVDS37ckSVbMll73EXf2PW`
   
You can now use the `GalleyDataFetch` library in your script. Here is an example of how to fetch data and write it to a sheet.

```javascript
function myFunction() {
  const query = `
    query GASRecipe($id: String) {
      viewer {
        recipe(id: $id) {
          id
          name
        }
      }
    }
  `;
  const variables = {
    id: "ABC123"
  };
  const client = new GalleyDataFetch.GalleyGraphQLClient("THE-API-KEY", "staging");
  const result = client.executeRequest(query, variables).data.viewer.recipe;
  GalleyDataFetch.writeToSheet([result], "recipes-export", ["id", "name"])
}
```
# Development

1. Clone the repo
2. Make code changes
3. `yarn init` to log in to Google before pushing
4. `yarn push` to push the latest version to the Google Scripts Project