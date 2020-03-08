function fetchRecipes() {
  const query = `
  query RecipesQuery {
    viewer {
      recipes {
        id
        name
      }
    }
  }
  `;
  const data = executeGalleyRequest({ query }).data.viewer.recipes;
  writeToSheet({ data, sheetName: "recipes-export", headers: ["id", "name"] });
}
