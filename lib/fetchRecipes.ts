function fetchRecipes({
  apiKey,
  env
}: {
  apiKey: string;
  env: "staging" | "production";
}) {
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
  const data = executeGalleyRequest(apiKey, env, query).data.viewer.recipes;
  writeToSheet(data, "recipes-export", ["id", "name"]);
}
