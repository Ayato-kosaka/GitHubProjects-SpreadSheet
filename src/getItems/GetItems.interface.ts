export interface GraphItem {
  id: string;
  fieldValues: FieldValues;
}

export interface FieldValues {
  nodes: Node[];
}

export interface Node {
  __typename: string;
  value?: string;
  field?: Field;
}

export interface Field {
  id: string;
  field: string;
}

export type Item = {
  id: string;
  fields: {
    id: string;
    field: string;
    value?: string;
  }[];
};

export type Response = Item[];
