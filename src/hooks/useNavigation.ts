import { NavigationContext } from "@/contexts/navigation-context";
import { useContext } from "react";

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
