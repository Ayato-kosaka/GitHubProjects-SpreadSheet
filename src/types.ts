namespace types {
  export type ProjectV2FieldType =
    | "ASSIGNEES"
    | "DATE"
    | "ITERATION"
    | "LABELS"
    | "LINKED_PULL_REQUESTS"
    | "MILESTONE"
    | "NUMBER"
    | "REPOSITORY"
    | "REVIEWERS"
    | "SINGLE_SELECT"
    | "TEXT"
    | "TITLE"
    | "TRACKED_BY"
    | "TRACKS";
  export interface Filed {
    id: string;
    name: string;
    dataType: ProjectV2FieldType;
    options?: {
      id: string;
      name: string;
    }[];
    configuration?: {
      iterations: {
        id: string;
        title: string;
        // 'YYY-MM-DD'
        startDate: string;
      }[];
    };
  }
}
