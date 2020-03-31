type MenuItemInputType = {
  recipeId: string;
  unit: {
    name: string; // likely always "each"
    recipeId?: string;
  };
  categoryValueNamesByCategoryName: { [categoryName: string]: string[] };
};
type MenuUploadInputType = {
  name: string;
  date: string; // YYYY-MM-DD
  locationId: string;
  menuItems: MenuItemInputType[];
  categoryValueNamesByCategoryName: { [categoryName: string]: string[] };
};
type MenuRowType = {
  date: string;
  recipeId: string;
  planType: string;
  hierarchieValue: string;
  rawRow: string[];
};
type VariablesType = {
  input: { menus: MenuUploadInputType[] };
};

const menuPlanTypeCategoryName = "plan type";
const menuItemHierarchieCategoryName = "hierarchie";
const locationId = "bG9jYXRpb246NjQy";
const sheetName = "Menu Planner";

function uploadMenus() {
  const groupedMenuRows: MenuRowType[][] = getGroupedMenuRows();
  const variables: { input: { menus: MenuUploadInputType[] } } = {
    input: {
      menus: groupedMenuRows.flatMap(menuItemRows =>
        buildMenuInputData(menuItemRows)
      )
    }
  };
  const { isValid, errors } = validateMenus(variables);

  if (!isValid) {
    throw new Error(
      "Invalid data. Errors are: " +
        errors.map(({ message }) => message).join(", ")
    );
  }

  const { menus, error } = sendUploadMenusMutation(variables);

  if (error) {
    throw new Error(error.message);
  } else {
    Browser.msgBox("Successfully uploaded " + menus.length + " menus!");
  }
}
function validateMenus(
  variables: VariablesType
): { isValid: boolean; errors: { message: string }[] } {
  const query = `
    mutation ValidateUploadMenus($input: ValidateBulkUploadMenusInput!) {
      validateBulkUploadMenus(input: $input) {
        isValid
        errors {
          message
        }
      }
    }
  `;

  return executeGalleyRequest({
    query,
    variables
  }).data.validateBulkUploadMenus;
}

function sendUploadMenusMutation(
  variables: VariablesType
): { menus: any[]; error: { message: string } } {
  const query = `
  mutation UploadMenus($input: BulkUploadMenusInput!) {
    bulkUploadMenus(input: $input) {
      menus {
        id
      }
      error {
        message
      }
    }
  }
  `;
  return executeGalleyRequest({
    query,
    variables
  }).data.bulkUploadMenus;
}

function getGroupedMenuRows() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const menuPlannerSheet = spreadsheet.getSheetByName(sheetName);
  const menuRows: MenuRowType[] = menuPlannerSheet
    .getSheetValues(
      2,
      1,
      menuPlannerSheet.getLastRow(),
      menuPlannerSheet.getLastColumn()
    )
    .map(row => {
      return {
        date: row[0],
        planType: row[2],
        hierarchieValue: row[3],
        recipeId: row[5],
        rawRow: row
      };
    })
    .filter(({ date }) => date);
  return Object.values(
    menuRows.reduce((memo, row) => {
      const name = getName(row);
      if (!memo[name]) {
        memo[name] = [];
      }
      memo[name].push(row);
      return memo;
    }, {})
  );
}

function buildMenuInputData(menuRows: MenuRowType[]): MenuUploadInputType {
  const { planType, date: dateStr } = menuRows[0];
  const name = getName(menuRows[0]);
  const [day, month] = dateStr.split(".");
  const date = new Date(Date.parse(`2020-${month}-${day}`))
    .toISOString()
    .split("T")[0];
  return {
    name,
    date,
    locationId,
    menuItems: buildMenuItems(menuRows),
    categoryValueNamesByCategoryName: {
      [menuPlanTypeCategoryName]: [planType.toLowerCase()]
    }
  };
}

function getName({ date, planType }: MenuRowType) {
  return `Menu ${planType} ${date}`;
}

function buildMenuItems(menuRows: MenuRowType[]): MenuItemInputType[] {
  return menuRows.map(({ recipeId, hierarchieValue, rawRow }) => {
    if (recipeId === "NOT FOUND") {
      throw new Error("Unknown recipe: " + rawRow[1]);
    }
    return {
      recipeId,
      unit: { name: "each" },
      categoryValueNamesByCategoryName: {
        [menuItemHierarchieCategoryName]: [hierarchieValue.toLowerCase()]
      }
    };
  });
}
