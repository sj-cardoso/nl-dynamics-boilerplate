import { DataverseProvider } from "@/providers/dataverse-provider";
import { NavigationProvider } from "@/providers/navigation-provider";
import { PageRenderer } from "@/pages/config/page-renderer";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DataverseProvider>
        <NavigationProvider>
          <PageRenderer />
        </NavigationProvider>
      </DataverseProvider>
    </div>
  );
}

export default App;
