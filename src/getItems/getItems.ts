interface GraphItem {
  id: string;
  fieldValues: FieldValues;
}

interface FieldValues {
  nodes: Node[];
}

interface Node {
  __typename: string;
  value?: string;
  field?: Field;
}

interface Field {
  id: string;
  field: string;
}

type Item = {
  id: string;
  fields: {
    id: string;
    field: string;
    value?: string;
  }[];
};

type Response = Item[];

type ResType = {
  node: {
    items: {
      nodes: GraphItem[];
      pageInfo: {
        endCursor: string | null;
        hasNextPage: boolean;
      };
    };
  };
};
namespace getItems {
  const converter = (item: GraphItem) => {
    const res = {} as Item;
    res.id = item.id;
    res.fields = item.fieldValues.nodes
      .filter((node) => node.field)
      .map((node) => ({
        id: node.field!.id,
        field: node.field!.field,
        value: node.value,
      }));
    return res;
  };

  const query = `
query ($projectId: ID!, $after: String) {
  node(id: $projectId) {
    ... on ProjectV2 {
      items(first: 100, after: $after) {
        nodes {
          id
          fieldValues(first: 100) {
            nodes {
              __typename
              ... on ProjectV2ItemFieldTextValue {
                value: text
                field {
                  ... on ProjectV2FieldCommon {
                    id
                    field: name
                  }
                }
              }
              ... on ProjectV2ItemFieldNumberValue {
                value: number
                field {
                  ... on ProjectV2FieldCommon {
                    id
                    field: name
                  }
                }
              }
              ... on ProjectV2ItemFieldDateValue {
                value: date
                field {
                  ... on ProjectV2FieldCommon {
                    id
                    field: name
                  }
                }
              }
              ... on ProjectV2ItemFieldSingleSelectValue {
                value: name
                field {
                  ... on ProjectV2FieldCommon {
                    id
                    field: name
                  }
                }
              }
              ... on ProjectV2ItemFieldIterationValue {
                value: title
                field {
                  ... on ProjectV2FieldCommon {
                    id
                    field: name
                  }
                }
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
}
`;

  export function doExecute(projectId: string): Item[] {
    const items: GraphItem[] = [];

    let after: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const variables: { projectId: string; after: string | null } = {
        projectId,
        after,
      };
      const { data } = utils.hadndleGraphql<{ data: ResType }>({
        query,
        variables,
      });

      if (data.node == null) {
        throw new Error(`Project with ID ${projectId} not found`);
      }

      const itemConnection = data.node.items;
      items.push(...itemConnection.nodes);
      after = itemConnection.pageInfo.endCursor;
      hasNextPage = itemConnection.pageInfo.hasNextPage;
    }
    return items.map(converter);
  }
}
