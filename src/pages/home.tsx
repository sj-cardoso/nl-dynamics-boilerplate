import React from "react";
import { Button } from "@/components/ui/button";
import { Book, Database, Rocket } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import { Badge } from "@/components/ui/badge";

export const HomePage= () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <div className="text-center space-y-12 max-w-2xl">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge variant="outline">
              <Rocket className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Dynamics 365 Boilerplate</span>
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">novalogica</h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Production-ready React boilerplate for Dynamics 365 development
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="h-14 px-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => navigateTo("demo")}
          >
            <Database className="w-6 h-6 mr-3" />
            Try Demo
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-14 px-12 text-lg font-semibold hover:bg-secondary transition-all duration-300"
            onClick={() => navigateTo("documentation")}
          >
            <Book className="w-6 h-6 mr-3" />
            View Docs
          </Button>
        </div>

        {/* Tech Stack */}
        <div className="text-center space-y-6">
          <h3 className="text-xl font-semibold text-muted-foreground">
            Built With Modern Technologies
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline">React 19</Badge>
            <Badge variant="outline">TypeScript</Badge>
            <Badge variant="outline">Tailwind CSS</Badge>
            <Badge variant="outline">shadcn/ui</Badge>
            <Badge variant="outline">Dataverse API</Badge>
            <Badge variant="outline">OAuth 2.0</Badge>
          </div>
          <div className="pt-8 text-sm text-muted-foreground">
            <p>© 2025 novalogica. Empowering developers to build amazing D365 applications.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
