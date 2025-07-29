import { useState, ReactNode } from "react";
import { NavigationContext } from "@/contexts/navigation-context";
import { PAGES, PageKey } from "@/pages/config/pages-config";

interface NavigationProviderProps {
  children: ReactNode;
  defaultPage?: PageKey;
}

export const NavigationProvider = ({
  children,
  defaultPage = "home" as PageKey,
}: NavigationProviderProps) => {
  const [currentPage, setCurrentPage] = useState<PageKey>(defaultPage);

  const navigateTo = (page: PageKey) => {
    if (PAGES[page]) {
      setCurrentPage(page);
    }
  };

  const getCurrentPageComponent = () => PAGES[currentPage].component;

  const getPageInfo = (page: PageKey = currentPage) => ({
    title: PAGES[page].title,
    description: PAGES[page].description,
  });

  const value = {
    currentPage,
    navigateTo,
    getCurrentPageComponent,
    getPageInfo,
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};
