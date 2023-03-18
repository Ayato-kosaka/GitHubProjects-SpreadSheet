namespace utils {
  export function logger(key: string, data: any) {
    console.log(key, JSON.stringify(data, null, "\t"));
  }

  export function writeWORK(key: string, value: any) {
    const valueString = JSON.stringify(value, null, "\t");
    const sheet = SpreadsheetApp.getActive().getSheetByName("WORK")!;
    const lastColumn = sheet.getLastColumn();
    for (let i = 1; i <= lastColumn; i++) {
      const key_ = sheet.getRange(1, i).getDisplayValue();
      if (key_ === key) {
        sheet.getRange(2, i).setValues([[valueString]]);
        return;
      }
    }
    sheet.getRange(1, lastColumn + 1, 2).setValues([[key], [valueString]]);
    logger("writeWORK", { [key]: valueString });
  }

  export function hadndleGraphql<T>({
    query,
    variables,
  }: {
    query: string;
    variables: { [key: string]: any };
  }) {
    const url = config.baseUrl;
    const response = UrlFetchApp.fetch(url, {
      method: "post",
      headers: {
        Authorization: `Bearer ${config.githubToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      payload: JSON.stringify({ query, variables }),
    });
    const res = JSON.parse(response.getContentText());
    logger("hadndleGraphql", {
      query,
      variables,
      res,
    });
    return res as T;
  }
}
