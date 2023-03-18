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
              }
              ... on ProjectV2IterationField {
                id
                name
                configuration {
                  iterations {
                    startDate
                    id
                  }
                }
              }
              ... on ProjectV2SingleSelectField {
                id
                name
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
            nodes: {
              id: string;
              name: string;
              options?: {
                id: string;
                name: string;
              }[];
              configuration?: {
                iterations: {
                  // 'YYY-MM-DD'
                  startDate: string;
                  id: string;
                }[];
              };
            }[];
          };
        };
      };
    };
    const { data } = utils.hadndleGraphql<ResType>({ query, variables });
    const nodes = data.node.fields.nodes;
    return nodes;
  }
}
