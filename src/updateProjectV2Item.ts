namespace updateProjectV2Item {
  const convertToProjectV2FieldValue = ({
    fieldId,
    value,
  }: {
    fieldId: string;
    value: string;
  }) => {
    // on developing
    const field = consts.getWORK().fields.find((field) => field.id === fieldId);
    const fieldType = field?.dataType;
    if (fieldType === "NUMBER") {
      return { number: parseInt(value) };
    }
    if (fieldType === "SINGLE_SELECT") {
      return {
        singleSelectOptionId: field?.options?.find((o) => o.name === value)?.id,
      };
    }
    if (fieldType === "ITERATION") {
      return {
        iterationId: field?.configuration?.iterations.find(
          (i) => i.title === value
        )?.id,
      };
    }
    utils.error("No fieldType: " + fieldType);
    return undefined;
  };

  export function doExecute({
    projectId,
    itemId,
    fieldId,
    value,
  }: {
    projectId: string;
    itemId: string;
    fieldId: string;
    value: string;
  }) {
    const query = value
      ? `
    mutation (
        $projectId: ID!
        $itemId: ID!
        $fieldId: ID!
        $value: ProjectV2FieldValue!
      ) {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: $projectId
            itemId: $itemId
            fieldId: $fieldId
            value: $value
          }
        ) {
          projectV2Item {
            id
          }
        }
      }
    `
      : `
    mutation (
        $projectId: ID!
        $itemId: ID!
        $fieldId: ID!
      ) {
        clearProjectV2ItemFieldValue(
          input: {
            projectId: $projectId
            itemId: $itemId
            fieldId: $fieldId
          }
        ) {
          projectV2Item {
            id
          }
        }
      }
    `;
    const variables = {
      projectId,
      itemId,
      fieldId,
      value: convertToProjectV2FieldValue({
        fieldId,
        value,
      }),
    };
    type ResType = {
      updateProjectV2ItemFieldValue: {
        projectV2Item: {
          id: string;
        };
      };
    };
    utils.hadndleGraphql<{ data: ResType }>({
      query,
      variables,
    });
  }
}
