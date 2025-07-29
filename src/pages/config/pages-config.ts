import { HomePage, DemoPage, DocumentationPage } from "@/pages";

export const PAGES = {
  home: {
    title: "Home",
    description: "novalogica Dynamics 365 Boilerplate",
    component: HomePage,
  },
  documentation: {
    title: "Documentation",
    description: "Learn how to use the boilerplate",
    component: DocumentationPage,
  },
  demo: {
    title: "Dataverse Example",
    description: "CRUD operations with Dataverse Web API",
    component: DemoPage,
  },
  // Adding a new page is now super simple:
  // contacts: {
  //   title: 'Contacts',
  //   description: 'Manage contact records',
  //   component: ContactsPage,
  // },
} as const;

export type PageKey = keyof typeof PAGES;
export type PageConfig = (typeof PAGES)[PageKey];
