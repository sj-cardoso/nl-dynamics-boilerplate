import { DataverseContext } from "@/contexts/dataverse-context";
import { useContext } from "react";

export const useDataverse = () => {
  const context = useContext(DataverseContext);
  if (!context) {
    throw new Error("useDataverse must be used within a DataverseProvider");
  }
  return context;
};
