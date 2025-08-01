import { DynamicsWebApi } from "dynamics-web-api";
import { createContext } from "react";

export interface DataverseContextProps {
  api: DynamicsWebApi | null;
  isReady: boolean;
  error: string | null;
}

export const DataverseContext = createContext<DataverseContextProps | undefined>(undefined);
