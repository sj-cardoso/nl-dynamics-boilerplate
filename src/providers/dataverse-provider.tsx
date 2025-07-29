import { useState, useEffect, ReactNode } from "react";
import { DynamicsWebApi } from "dynamics-web-api";
import { DataverseContext } from "@/contexts/dataverse-context";

interface DataverseProviderProps {
  children: ReactNode;
}

const isInD365 = (): boolean => {
  try {
    return typeof window.parent?.Xrm?.WebApi !== "undefined";
  } catch {
    return false;
  }
};

const onTokenRefresh = async (): Promise<string | null> => {
  const token = process.env.REACT_APP_D365_TOKEN;

  if (!token) {
    console.error("No authentication token available");
    return null; 
  }
  
  return token;
};

export const DataverseProvider = ({ children }: DataverseProviderProps) => {
  const [api, setApi] = useState<DynamicsWebApi | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = () => {
      try {
        // Base configuration
        const baseConfig = {
          dataApi: { version: process.env.REACT_APP_D365_API_VERSION || "9.2" },
        };

        // Add external configuration if not in D365
        const config = isInD365()
          ? baseConfig
          : {
              ...baseConfig,
              serverUrl: process.env.REACT_APP_D365_API_URL,
              onTokenRefresh,
            };

        const apiInstance = new DynamicsWebApi(config);

        setApi(apiInstance);
        setIsReady(true);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to initialize Dataverse connection";
        setError(errorMessage);
        setApi(null);
        setIsReady(false);
      }
    };

    initialize();
  }, []);

  return (
    <DataverseContext.Provider value={{ api, isReady, error }}>
      {children}
    </DataverseContext.Provider>
  );
};
