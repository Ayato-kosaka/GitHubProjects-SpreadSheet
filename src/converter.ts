namespace converter {
  export function callUpdate({
    projectId,
    itemId,
    targetColumn,
    value,
  }: {
    projectId: string;
    itemId: string;
    targetColumn: number;
    value: string;
  }) {
    return {
      projectId,
      itemId,
      fieldId: consts.fieldIdList[targetColumn - 2],
      value,
    };
  }
}
