import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  ArrowLeft,
  Copy,
  Check,
  FileText,
  Navigation,
  Database,
  Puzzle,
  Plus,
  Trash2,
  Edit3,
  Play,
  Lightbulb,
  Code2,
  BookOpen,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigation } from "@/hooks/useNavigation";

interface CodeBlockProps {
  code: string;
  title?: string;
  onCopy: (code: string, id: string) => void;
  isCopied: boolean;
  id: string;
}

const CodeBlock = ({ code, title, onCopy, isCopied, id }: CodeBlockProps) => (
  <div className="relative group">
    <div className="bg-muted/30 rounded-lg border">
      {title && (
        <div className="px-4 pt-3 pb-2 border-b">
          <span className="text-sm font-medium">{title}</span>
        </div>
      )}
      <div className="p-4 font-mono text-sm overflow-x-auto">
        <pre className="whitespace-pre-wrap">{code}</pre>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
        onClick={() => onCopy(code, id)}
      >
        {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  </div>
);

interface StepCardProps {
  number: React.ReactNode;
  title: React.ReactNode;
  children: React.ReactNode;
}

const StepCard = ({ number, title, children }: StepCardProps) => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
          {number}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export const DocumentationPage: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState("");
  const { navigateTo } = useNavigation();

  const copyCode = (code: string, id: React.SetStateAction<string>) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  return (
    <div className="min-h-screen px-6 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigateTo("home")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Documentation</h1>
              <p className="text-muted-foreground">Learn how to build with this boilerplate</p>
            </div>
          </div>
        </div>
        <Button onClick={() => navigateTo("demo")} className="gap-2">
          <Play className="w-4 h-4" />
          Try Demo
        </Button>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pages" className="gap-2">
            <FileText className="w-4 h-4" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="navigation" className="gap-2">
            <Navigation className="w-4 h-4" />
            Navigation
          </TabsTrigger>
          <TabsTrigger value="dataverse" className="gap-2">
            <Database className="w-4 h-4" />
            Dataverse
          </TabsTrigger>
          <TabsTrigger value="components" className="gap-2">
            <Puzzle className="w-4 h-4" />
            Components
          </TabsTrigger>
        </TabsList>

        {/* Pages Management */}
        <TabsContent value="pages" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-600" />
                Creating New Pages
              </CardTitle>
              <CardDescription>
                Add new pages to your application with three simple steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <StepCard number="1" title="Create the Page Component">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Create a new file in <code className="bg-muted px-1 rounded">src/pages/</code>
                    </p>
                    <CodeBlock
                      id="new-page"
                      title="src/pages/contacts.tsx"
                      code={`import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";

export const ContactsPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen px-6 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => navigateTo("home")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-muted-foreground">Manage your contacts</p>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your contacts content goes here...</p>
        </CardContent>
      </Card>
    </div>
  );
};`}
                      onCopy={copyCode}
                      isCopied={copiedCode === "new-page"}
                    />
                  </div>
                </StepCard>

                <StepCard number="2" title="Export from Index File">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Add your new page to the exports in{" "}
                      <code className="bg-muted px-1 rounded">src/pages/index.ts</code>
                    </p>
                    <CodeBlock
                      id="export-page"
                      title="src/pages/index.ts"
                      code={`// Export all page components
export { HomePage } from "./home";
export { DocumentationPage } from "./documentation";
export { DemoPage } from "./demo";
export { ContactsPage } from "./contacts"; // Add this line`}
                      onCopy={copyCode}
                      isCopied={copiedCode === "export-page"}
                    />
                  </div>
                </StepCard>

                <StepCard number="3" title="Register in Pages Config">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Add your page to the configuration file
                    </p>
                    <CodeBlock
                      id="config-page"
                      title="src/pages/config/pages-config.ts"
                      code={`import { HomePage, DemoPage, DocumentationPage, ContactsPage } from "@/pages";

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
  contacts: {  // Add your new page here
    title: "Contacts",
    description: "Manage contact records",
    component: ContactsPage,
  },
} as const;`}
                      onCopy={copyCode}
                      isCopied={copiedCode === "config-page"}
                    />
                  </div>
                </StepCard>
              </div>

              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>That's it!</AlertTitle>
                <AlertDescription>
                  Your new page is now available. Navigate to it using{" "}
                  <code className="bg-muted px-1 rounded">navigateTo("contacts")</code>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  Updating Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">To update an existing page:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Edit the component file directly
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Update title/description in pages-config.ts
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Changes are reflected immediately
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  Removing Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">To remove a page:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full" />
                      Delete the component file
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full" />
                      Remove from index.ts exports
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full" />
                      Remove from pages-config.ts
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Navigation System */}
        <TabsContent value="navigation" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Hook Usage</CardTitle>
              <CardDescription>
                Use the navigation hook to move between pages and get page information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Basic Navigation</h4>
                <CodeBlock
                  id="nav-basic"
                  code={`import { useNavigation } from "@/hooks/useNavigation";

const MyComponent = () => {
  const { navigateTo, currentPage } = useNavigation();

  return (
    <div>
      <p>Current page: {currentPage}</p>
      <Button onClick={() => navigateTo("demo")}>
        Go to Demo
      </Button>
    </div>
  );
};`}
                  onCopy={copyCode}
                  isCopied={copiedCode === "nav-basic"}
                />
              </div>

              <div className="my-8 border-t"></div>

              <div className="space-y-4">
                <h4 className="font-semibold">Get Page Information</h4>
                <CodeBlock
                  id="nav-info"
                  code={`const { getPageInfo } = useNavigation();

// Get current page info
const currentPageInfo = getPageInfo();
console.log(currentPageInfo.title); // "Home"
console.log(currentPageInfo.description); // "novalogica Dynamics 365 Boilerplate"

// Get specific page info
const demoPageInfo = getPageInfo("demo");
console.log(demoPageInfo.title); // "Dataverse Example"`}
                  onCopy={copyCode}
                  isCopied={copiedCode === "nav-info"}
                />
              </div>

              <div className="my-8 border-t"></div>

              <div className="space-y-4">
                <h4 className="font-semibold">Complete Hook API</h4>
                <CodeBlock
                  id="nav-complete"
                  code={`const {
  currentPage,              // Current active page key
  navigateTo,              // Function to navigate to any page
  getCurrentPageComponent, // Get the current page component
  getPageInfo             // Get page title and description
} = useNavigation();

// Available methods:
navigateTo("home");        // Navigate to homepage
navigateTo("demo");        // Navigate to demo page
navigateTo("documentation"); // Navigate to docs
navigateTo("contacts");    // Navigate to your custom page`}
                  onCopy={copyCode}
                  isCopied={copiedCode === "nav-complete"}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Navigation Provider</CardTitle>
              <CardDescription>
                The navigation system is already set up in your App.tsx
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                id="nav-provider"
                title="src/App.tsx"
                code={`import { NavigationProvider } from "@/providers/navigation-provider";
import { PageRenderer } from "@/pages/config/page-renderer";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavigationProvider defaultPage="home">
        <PageRenderer />
      </NavigationProvider>
    </div>
  );
}`}
                onCopy={copyCode}
                isCopied={copiedCode === "nav-provider"}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dataverse API */}
        <TabsContent value="dataverse" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Using the Dataverse Hook</CardTitle>
              <CardDescription>
                Connect to Dataverse and perform operations with the useDataverse hook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Basic Connection</h4>
                <CodeBlock
                  id="dataverse-basic"
                  code={`import { useDataverse } from "@/hooks/useDataverse";

const MyComponent = () => {
  const { api, isReady, error } = useDataverse();

  if (!isReady) return <div>Connecting to Dataverse...</div>;
  if (error) return <div>Error: {error}</div>;

  // Now you can safely use the API
  return <div>Connected to Dataverse!</div>;
};`}
                  onCopy={copyCode}
                  isCopied={copiedCode === "dataverse-basic"}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">CRUD Operations</h4>
                <div className="grid gap-4">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      READ
                    </Badge>
                    <CodeBlock
                      id="dataverse-read"
                      code={`// Get multiple records
const accounts = await api.retrieveMultiple({
  collection: "accounts",
  select: ["accountid", "name", "emailaddress1"],
  filter: "statecode eq 0",
  orderBy: ["name asc"],
  maxPageSize: 10
});

// Get single record
const account = await api.retrieve({
  collection: "accounts",
  key: "account-id-here",
  select: ["accountid", "name", "emailaddress1"]
});`}
                      onCopy={copyCode}
                      isCopied={copiedCode === "dataverse-read"}
                    />
                  </div>

                  <div>
                    <Badge variant="outline" className="mb-2">
                      CREATE
                    </Badge>
                    <CodeBlock
                      id="dataverse-create"
                      code={`// Create new record
const newAccountId = await api.create({
  collection: "accounts",
  data: {
    name: "New Account",
    emailaddress1: "contact@example.com",
    telephone1: "123-456-7890"
  }
});`}
                      onCopy={copyCode}
                      isCopied={copiedCode === "dataverse-create"}
                    />
                  </div>

                  <div>
                    <Badge variant="outline" className="mb-2">
                      UPDATE
                    </Badge>
                    <CodeBlock
                      id="dataverse-update"
                      code={`// Update existing record
await api.update({
  collection: "accounts",
  key: "account-id-here",
  data: {
    name: "Updated Account Name",
    emailaddress1: "newemail@example.com"
  }
});`}
                      onCopy={copyCode}
                      isCopied={copiedCode === "dataverse-update"}
                    />
                  </div>

                  <div>
                    <Badge variant="outline" className="mb-2">
                      DELETE
                    </Badge>
                    <CodeBlock
                      id="dataverse-delete"
                      code={`// Delete record
await api.deleteRecord({
  collection: "accounts",
  key: "account-id-here"
});`}
                      onCopy={copyCode}
                      isCopied={copiedCode === "dataverse-delete"}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Creating Entity Hooks</CardTitle>
              <CardDescription>
                Build reusable hooks for specific entities following the useAccounts pattern
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock
                id="entity-hook"
                title="hooks/useContacts.ts"
                code={`import { useState, useCallback } from "react";
import { useDataverse } from "@/hooks/useDataverse";

export interface Contact {
  contactid?: string;
  fullname?: string;
  emailaddress1?: string;
  jobtitle?: string;
}

export const useContacts = () => {
  const { api, isReady } = useDataverse();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    if (!api || !isReady) return;
    
    setLoading(true);
    try {
      const response = await api.retrieveMultiple({
        collection: "contacts",
        select: ["contactid", "fullname", "emailaddress1", "jobtitle"],
        filter: "statecode eq 0"
      });
      setContacts(response?.value || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api, isReady]);

  const createContact = useCallback(async (data: Partial<Contact>) => {
    if (!api || !isReady) return null;
    
    try {
      const id = await api.create({
        collection: "contacts",
        data
      });
      await fetchContacts(); // Refresh list
      return id;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [api, isReady, fetchContacts]);

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    createContact,
    // Add update, delete methods as needed
  };
};`}
                onCopy={copyCode}
                isCopied={copiedCode === "entity-hook"}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* UI Components */}
        <TabsContent value="components" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Components</CardTitle>
              <CardDescription>
                Ready-to-use shadcn/ui components included in this boilerplate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  "Button",
                  "Card",
                  "Input",
                  "Label",
                  "Badge",
                  "Alert",
                  "Dialog",
                  "Tabs",
                  "Select",
                  "Tooltip",
                  "Toggle",
                  "Dropdown Menu",
                  "Alert Dialog",
                  "Calendar",
                ].map((component) => (
                  <Badge key={component} variant="secondary" className="justify-center py-2">
                    {component}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Adding More Components
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This boilerplate uses shadcn/ui components. Add any component from their library:
                </p>
                <CodeBlock
                  id="add-component"
                  code={`# Add specific components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add form
npx shadcn-ui@latest add data-table

# Add multiple components at once
npx shadcn-ui@latest add button form data-table`}
                  onCopy={copyCode}
                  isCopied={copiedCode === "add-component"}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://ui.shadcn.com/docs/components", "_blank")}
                  className="gap-2"
                >
                  <Code2 className="w-4 h-4" />
                  Browse Components
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-green-600" />
                  DynamicsWebApi Library
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This boilerplate uses DynamicsWebApi for all Dataverse operations. It's a powerful
                  library with extensive features.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Key Features:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      TypeScript support
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Advanced querying (OData)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Batch operations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      File operations
                    </li>
                  </ul>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open("https://github.com/AleksandrRogov/DynamicsWebApi", "_blank")
                  }
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  View Documentation
                </Button>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>Pro Tips</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>• Use TypeScript interfaces for your entity types to get better IntelliSense</p>
              <p>• Check the demo page for real working examples of CRUD operations</p>
              <p>• All components are already configured with proper styling and themes</p>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};
