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
    if (!field) {
      utils.error("cannot get field");
      return undefined;
    }
    const fieldType = field.dataType;
    if (fieldType === "NUMBER") {
      return { number: parseInt(value) };
    }
    if (fieldType === "SINGLE_SELECT") {
      return {
        singleSelectOptionId: field?.options?.find((o) => o.name === value)?.id,
      };
    }
    if (fieldType === "ITERATION") {
      const { configuration } = field;
      return {
        iterationId: configuration?.iterations
          .concat(configuration.completedIterations)
          .find((i) => i.title === value)?.id,
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
    utils.logger("updateProjectV2Item.Request", {
      projectId,
      itemId,
      fieldId,
      value,
    });
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
    const projectV2FieldValue = convertToProjectV2FieldValue({
      fieldId,
      value,
    });
    if (projectV2FieldValue === undefined) return;
    const variables = {
      projectId,
      itemId,
      fieldId,
      value: projectV2FieldValue,
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
