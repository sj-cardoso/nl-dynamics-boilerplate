import { DynamicsWebApi } from "dynamics-web-api";
import { createContext } from "react";

export interface DataverseContextValue {
  api: DynamicsWebApi | null;
  isReady: boolean;
  error: string | null;
}

export const DataverseContext = createContext<DataverseContextValue | undefined>(undefined);
