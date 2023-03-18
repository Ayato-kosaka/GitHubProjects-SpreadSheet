namespace consts {
  function createObjectFromSpreadsheet(sheetName: string) {
    const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName)!;
    const lastColumn = sheet.getLastColumn();
    const object: { [key: string]: string } = {};
    for (let i = 1; i <= lastColumn; i++) {
      const key = sheet.getRange(1, i).getDisplayValue();
      const value = sheet.getRange(2, i).getDisplayValue();
      object[key] = value;
    }
    return object;
  }
  export const INPUT = createObjectFromSpreadsheet("INPUT");
  export const fieldIdList = consts.INPUT["fieldIdList"].split(",");
  export const getWORK = () => {
    const { projectId, fields } = createObjectFromSpreadsheet("WORK");

    return {
      projectId,
      fields: JSON.parse(fields) as types.Filed[],
    };
  };
}
