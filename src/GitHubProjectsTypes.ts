export interface Option {
  id: string;
  name: string;
}

export interface Iteration {
  startDate: string;
  id: string;
}

export interface Configuration {
  iterations: Iteration[];
}

export interface Field {
  id: string;
  name: string;
  options?: Option[];
  configuration?: Configuration;
}
