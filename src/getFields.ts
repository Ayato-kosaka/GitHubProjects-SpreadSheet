namespace getFields {
  export function doExecute(projectId: string) {
    const query = `
    query GetFields($projectId: ID!) {
      node(id: $projectId) {
        ... on ProjectV2 {
          fields(first: 20) {
            nodes {
              ... on ProjectV2Field {
                id
                name
                dataType
              }
              ... on ProjectV2IterationField {
                id
                name
                dataType
                configuration {
                  iterations {
                    id
                    title
                    startDate
                  }
                }
              }
              ... on ProjectV2SingleSelectField {
                id
                name
                dataType
                options {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  `;
    const variables = { projectId };
    type ResType = {
      data: {
        node: {
          fields: {
            nodes: types.Filed[];
          };
        };
      };
    };
    const { data } = utils.hadndleGraphql<ResType>({ query, variables });
    const nodes = data.node.fields.nodes;
    return nodes;
  }
}
