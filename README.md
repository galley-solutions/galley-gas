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
# API
The library provides 3 types of functions: 
1. [Galley-specific](#galley-specific) functions like linkGenerators and [Galley Graphql API](https://api.galleysolutions.com/graphql) client to execute queries and mutations.
2. [Google Sheets utility functions](#google-sheets-utility-functions)
3. [Other utility functions](#other-utilities)

## Galley-specific
### `galleyApiClient(apiKey: string, environment: "staging" | "production") => GalleyGraphQLClient`
Use this function to get an instance of `GalleyGraphQLClient` which provides a single public method of `executeRequest`.

#### `GalleyGraphQLClient.executeRequest(query: string, variables?: object) => object`
The main function used to send a `query` to the Galley GraphQLApi, optionally passing `variables` for the `query`

The function will return the result or throw a `GalleyRequestError`, which provides the [`HTTPResponse`](https://developers.google.com/apps-script/reference/url-fetch/http-response) in the `response` attributes.

The function will retry the request 3 times with a 1 second delay between attempts as there are sometimes rate limit that get triggered.

### `linkGenerators`
The following utility functions create links to the Galley web app for convenient deep-linking.

`recipeLink(recipeId: string, locationId?: string) => string`
`ingredientLink(ingredientId: string) => string`
`vendorItemLink(vendorId: string, vendorItemId: string) => string`

### Example
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
  const client = new GalleyDataFetch.galleyApiClient("THE-API-KEY", "staging");
  const result = client.executeRequest(query, variables).data.viewer.recipe;
  GalleyDataFetch.writeToSheet([result], "recipes-export", ["id", "name"], ["Recipe ID", "Recipe Name"])
}
```
## Google Sheets utility functions
### `appendToSheet(sheetName: string, data: object[], headers?: string[]) => void`
Adds rows to the sheet by the provided name. If the sheet doesn't exist, it is created.

### `clearSheet(sheetName: string) => void`
Clears the sheet with the provided name. If the sheet doesn't exist, it is created.

### `getOrCreateSheet(sheetName: string) => void`
Finds or creates the sheet by the provided name.

### `selectSheet(sheetName: string) => void`
Selects the sheet with the provided name.

### `sheetToObjects(sheetName: string) => object[]`
Parses the data in the provided sheet into an array of objects. The function assumes the sheet has a header row in row 1 followed by data rows for the rest of the sheet.

This function is the inverse of [`writeToSheet`](#writeToSheet)

### `writeToSheet<TObject extends object>(data: TObject[], sheetName: string, headers?: Array<keyof TObject>, renamedHeaders?: string[]) => void`
Replaces the content of the sheet with the provided name with the data provided. 

The first row gets set as a header row with the provided `headers`. 

If `headers` is not provided, all attributes of the first object in the provided `data` array are used as the headers. You can optionally rename the `headers` using `renamedHeaders`. 

`headers` should be an array of attributes that are present in the objects in `data`.

`renamedHeaders` can be any strings, but should match the length of `headers`.

### Examples
```javascript
const data = [{ fName: "John", lName: "Doe", age: 45, height: 6.1 }]
GalleyDataFetch.writeToSheet(data, "people");
const result = GalleyDataFetch.sheetToObject("people")
// data will have same content as result
```

## Other utilities

### `stringDifference(string1: string, string2: string) => number`
This function returns the [levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) between 2 strings. This can be helpful for a rough implementation of fuzzy string equality.
# Development

1. Clone the repo
2. Make code changes
3. `yarn init` to log in to Google before pushing
4. `yarn push` to push the latest version to the Google Scripts Project