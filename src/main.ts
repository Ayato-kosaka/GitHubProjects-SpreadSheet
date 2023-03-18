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

function handleUpdateSheet() {
  const targetSheet = spread.getActiveSheet(); //シートを取得
  const targetCell: GoogleAppsScript.Spreadsheet.Range = spread.getActiveCell(); //アクティブセルを取得
  const targetColumn: number = targetCell.getColumn(); // 何列目
  const targetRow: number = targetCell.getRow(); // 何行目
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
      `no emit: ${targetSheet.getName()}!${targetColumn}${targetRow}`
    );
    return;
  }

  updateProjectV2Item.doExecute(
    converter.callUpdate({
      projectId: consts.getWORK().projectId,
      itemId: targetSheet.getRange(targetRow, 1).getDisplayValue(),
      targetColumn,
      value: targetCell.getDisplayValue(),
    })
  );
}
