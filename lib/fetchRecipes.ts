type RecipeType = {
  id: string;
  name: string;
  allIngredientsWithUsages: {
    ingredient: {
      name: string;
      categoryValues: { name: string; category: { name: string } }[];
    };
  }[];
  categoryValues: { name: string; category: { name: string } }[];
};

function fetchRecipes() {
  const query = `
  query RecipesQuery {
    viewer {
      recipes {
        id
        name
        categoryValues {
          name
          category {
            name
          }
        }
        allIngredientsWithUsages {
          ingredient {
            id
            name
            categoryValues {
              name
              category {
                name
              }
            }
          }
        }
      }
    }
  }
  `;
  const data = executeGalleyRequest({ query }).data.viewer
    .recipes as RecipeType[];
  writeToSheet({
    data,
    sheetName: "recipes-export",
    headers: ["id", "name", "exclusions", "plan type"],
    rowFormatter: row => [
      row.id,
      row.name,
      buildExclusionsList(row),
      getPlanType(row)
    ]
  });
}

const buildExclusionsList = (row: RecipeType): string => {
  const exclusionNamesToIngredients = row.allIngredientsWithUsages.reduce(
    (memo, { ingredient }) => {
      const exclusionNames = ingredient.categoryValues
        .filter(({ category }) => category.name === "exclusion")
        .map(({ name }) => name);
      exclusionNames.map(exclusionName => {
        if (!memo[exclusionName]) {
          memo[exclusionName] = [];
        }
        memo[exclusionName].push(ingredient.name);
      });

      return memo;
    },
    {}
  );
  return Object.keys(exclusionNamesToIngredients)
    .map(
      exclusionName =>
        `${exclusionName} [${exclusionNamesToIngredients[exclusionName].join(
          ", "
        )}]`
    )
    .join("\n");
};

const getPlanType = (row: RecipeType) => {
  return row.categoryValues
    .filter(({ category }) => category.name === "meal plan")
    .map(({ name }) => name)
    .join(", ");
};
