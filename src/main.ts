// async function updateItem(
//   projectId: string,
//   items: {
//     itemId: string;
//     fields: {
//       fieldId: string;
//       value: string;
//     }[];
//   }[]
// ) {
//   const value = () => {};
//   const mutation = gql`
//     mutation ($projectId: ID!, $itemId: ID!, $fieldId: ID!) {
//       updateProjectV2ItemFieldValue(
//         input: {
//           projectId: $projectId
//           itemId: $itemId
//           fieldId: $fieldId
//           value: { text: "Updated text testGitHubProjects-SpreadSheet 2" }
//         }
//       ) {
//         projectV2Item {
//           id
//         }
//       }
//     }
//   `;
//   const variables = { projectId, itemId, fieldId };
//   type ResType = {
//     updateProjectV2ItemFieldValue: {
//       projectV2Item: {
//         id: string;
//       };
//     };
//   };
//   const data = await request<ResType, typeof variables>(
//     baseUrl,
//     mutation,
//     variables,
//     headers
//   );
//   utils.logger(data);
// }

const spread = SpreadsheetApp.getActive();

// --- main ---
function main() {
  const projectId = getProjectId.doExecute();
  utils.writeWORK("projectId", projectId);
  const fields = getFields.doExecute(projectId);
  utils.writeWORK("fields", fields);
  const items = getItems.doExecute(projectId);
  const sheet = spread.getSheetByName(consts.INPUT["readSheetName"])!;
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
    ]);
  sheet
    .getRange(2, 1, items.length, consts.fieldIdList.length + 1)
    .setValues(
      items.map((item) => [
        item.id,
        ...consts.fieldIdList.map(
          (fieldId) => item.fields.find((field) => field.id === fieldId)?.value
        ),
      ])
    );
}
