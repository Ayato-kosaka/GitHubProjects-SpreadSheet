namespace getProjectId {
  export function doExecute() {
    const query = `
      query GetProjectId($login: String!, $projectNumber: Int!) {
        user(login: $login) {
          projectV2(number: $projectNumber) {
            id
          }
        }
      }
    `;
    const variables = {
      login: consts.INPUT.owner,
      projectNumber: parseInt(consts.INPUT.projectNumber),
    };
    type ResType = {
      data: {
        user: {
          projectV2: {
            id: string;
          };
        };
      };
    };
    const res = utils.hadndleGraphql<ResType>({ query, variables }).data.user
      .projectV2.id;
    utils.logger("getProjectId", res);
    return res;
  }
}
