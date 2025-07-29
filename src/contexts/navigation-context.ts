import { createContext } from "react";
import { PageKey } from "@/pages/config/pages-config";

export interface NavigationContextType {
  currentPage: PageKey;
  navigateTo: (page: PageKey) => void;
  getCurrentPageComponent: () => React.ComponentType;
  getPageInfo: (page?: PageKey) => { title: string; description: string };
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);