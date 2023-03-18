const spread = SpreadsheetApp.getActive();

function refreshData() {
  const projectId = getProjectId.doExecute();
  utils.writeWORK("projectId", projectId);
  const fields = getFields.doExecute(projectId);
  utils.writeWORK("fields", fields);
  const items = getItems.doExecute(projectId);
  const sheet = spread.getSheetByName(consts.INPUT["mainSheetName"])!;
  sheet.clear();
  sheet
    .getRange(1, 1, 1, consts.fieldIdList.length + 1)
    .setValues([
      [
        "ID",
        ...consts.fieldIdList.map(
          (fieldId) => fields.find((field) => field.id === fieldId)?.name
        ),
      ],
    ])
    .setBorder(true, true, true, true, true, true)
    .setBackground("blue")
    .setFontColor("white")
    .setFontWeight("bold");
  sheet
    .getRange(2, 1, items.length, consts.fieldIdList.length + 1)
    .setValues(
      items.map((item) => [
        item.id,
        ...consts.fieldIdList.map(
          (fieldId) => item.fields.find((field) => field.id === fieldId)?.value
        ),
      ])
    )
    .setBorder(true, true, true, true, true, true);
}

function handleUpdateSheet(e: GoogleAppsScript.Events.SheetsOnEdit) {
  // const targetRange = spread.getSheetByName(consts.INPUT["mainSheetName"])?.getRange(1,1,1,1);
  const targetRange = e.range;
  const targetSheet = targetRange.getSheet();
  utils.logger("handleUpdateSheet", {
    "targetSheet.getName()": targetSheet.getName(),
    getRow: targetRange.getRow(),
    getColumn: targetRange.getColumn(),
    getNumRows: targetRange.getNumRows(),
    getNumColumns: targetRange.getNumColumns(),
  });
  for (let i = 0; i < targetRange.getNumRows(); i++) {
    for (let j = 0; j < targetRange.getNumColumns(); j++) {
      const targetRow: number = targetRange.getRow() + i; // 何行目
      const targetColumn: number = targetRange.getColumn() + j; // 何列目
      if (
        !(
          targetSheet.getRange(1, 1).getDisplayValue() !== "" && // クリアされていないことを確認する
          targetSheet.getName() === consts.INPUT["mainSheetName"] &&
          targetRow > 1 &&
          targetColumn > 1 &&
          targetColumn <= consts.fieldIdList.length + 1
        )
      ) {
        utils.logger(
          "handleUpdateSheet",
          `no emit: ${targetSheet.getName()}!${targetRow}:${targetColumn}`
        );
        continue;
      }
      const itemIdRange = targetSheet.getRange(targetRow, 1);
      const itemId = itemIdRange.getDisplayValue();
      const value = targetSheet
        .getRange(targetRow, targetColumn)
        .getDisplayValue();
      utils.logger(
        "handleUpdateSheet",
        `emit: ${targetSheet.getName()}!${targetRow}:${targetColumn} => ${value}`
      );
      if (itemId) {
        updateProjectV2Item.doExecute(
          converter.callUpdate({
            projectId: consts.getWORK().projectId,
            itemId,
            targetColumn,
            value,
          })
        );
      } else {
        if (value) {
          // addProjectV2Item
        }
      }
    }
  }
}
