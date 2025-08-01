import { createContext } from "react";
import { PageKey } from "@/pages/config/pages-config";

export interface NavigationContextProps {
  currentPage: PageKey;
  navigateTo: (page: PageKey) => void;
  getCurrentPageComponent: () => React.ComponentType;
  getPageInfo: (page?: PageKey) => { title: string; description: string };
}

export const NavigationContext = createContext<NavigationContextProps | undefined>(undefined);