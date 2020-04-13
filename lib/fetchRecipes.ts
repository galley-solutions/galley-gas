type RecipeType = {
  id: string;
  name: string;
  allIngredientsWithUsages: {
    ingredient: {
      name: string;
      categoryValues: { name: string; category: { name: string } }[];
    };
  }[];
  dietaryFlagsWithUsages: { dietaryFlag: { name: string } }[];
  categoryValues: { name: string; category: { name: string } }[];
};

function fetchRecipes() {
  const query = `
  query RecipesQuery($filters: RecipeConnectionFilter, $pagination: PaginationOptions) {
    viewer {
      recipeConnection(filters: $filters, paginationOptions: $pagination) {
        pageInfo {
          hasNextPage
          endIndex
        }
        edges {
          node {
            id
            name
            dietaryFlagsWithUsages {
              dietaryFlag {
                name
              }
            }
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
    }
  }
  `;
  const variables = {
    filters: { isDish: true },
    pagination: { first: 10, startIndex: 0 },
  };
  let data: RecipeType[] = [];

  let currentPage = executeGalleyRequest({
    query,
    variables,
  }).data.viewer.recipeConnection;
  data = data.concat(currentPage.edges.map(({ node }) => node) as RecipeType[]);
  while (currentPage.pageInfo.hasNextPage) {
    variables.pagination.startIndex = currentPage.pageInfo.endIndex;
    currentPage = executeGalleyRequest({
      query,
      variables,
    }).data.viewer.recipeConnection;
    data = data.concat(
      currentPage.edges.map(({ node }) => node) as RecipeType[]
    );
  }
  writeToSheet({
    data,
    sheetName: "recipes-export",
    headers: ["id", "name", "exclusions", "allergens", "plan type"],
    rowFormatter: (row) => [
      row.id,
      row.name,
      buildExclusionsList(row),
      buildAllergenList(row),
      getPlanType(row),
    ],
  });
}

const buildExclusionsList = (row: RecipeType): string => {
  const exclusionNamesToIngredients = row.allIngredientsWithUsages.reduce(
    (memo, { ingredient }) => {
      const exclusionNames = ingredient.categoryValues
        .filter(({ category }) => category.name === "exclusion")
        .map(({ name }) => name);
      exclusionNames.map((exclusionName) => {
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
      (exclusionName) =>
        `${exclusionName} [${exclusionNamesToIngredients[exclusionName].join(
          ", "
        )}]`
    )
    .join("\n");
};
const buildAllergenList = (row: RecipeType): string => {
  return row.dietaryFlagsWithUsages
    .map(({ dietaryFlag }) => dietaryFlag.name)
    .join("\n");
};

const getPlanType = (row: RecipeType) => {
  return row.categoryValues
    .filter(({ category }) => category.name === "meal plan")
    .map(({ name }) => name)
    .join(", ");
};
