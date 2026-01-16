import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import stravaService, { StravaConfig } from '../services/stravaService';

interface StravaConfigContextType {
  config: StravaConfig | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const StravaConfigContext = createContext<StravaConfigContextType | undefined>(undefined);

interface StravaConfigProviderProps {
  children: ReactNode;
}

export function StravaConfigProvider({ children }: StravaConfigProviderProps) {
  const [config, setConfig] = useState<StravaConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedConfig = await stravaService.getConfig();
      setConfig(fetchedConfig);
    } catch (err) {
      const errorMessage = 'Failed to load Strava configuration. Please check your backend connection.';
      console.error('StravaConfigProvider: Error fetching config', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const value: StravaConfigContextType = {
    config,
    isLoading,
    error,
    refetch: fetchConfig,
  };

  return (
    <StravaConfigContext.Provider value={value}>
      {children}
    </StravaConfigContext.Provider>
  );
}

export function useStravaConfig(): StravaConfigContextType {
  const context = useContext(StravaConfigContext);
  if (context === undefined) {
    throw new Error('useStravaConfig must be used within a StravaConfigProvider');
  }
  return context;
}
