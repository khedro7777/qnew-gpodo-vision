
export interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  supabaseUrl: string;
  supabaseAnonKey: string;
  enableAnalytics: boolean;
  enableDevTools: boolean;
  apiTimeout: number;
  maxRetries: number;
  cacheTTL: number;
}

export const getDeploymentConfig = (): DeploymentConfig => {
  const environment = (typeof window !== 'undefined' 
    ? window.location.hostname 
    : 'localhost'
  ).includes('localhost') ? 'development' : 'production';

  return {
    environment,
    supabaseUrl: "https://dzlhzajmxprhyrmrqxir.supabase.co",
    supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6bGh6YWpteHByaHlybXJxeGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTI4MzYsImV4cCI6MjA2OTk4ODgzNn0.s5lHWMEToMdHnL5twcttQCQJRVR2rEwhPKoRu9P9hTY",
    enableAnalytics: environment === 'production',
    enableDevTools: environment === 'development',
    apiTimeout: environment === 'production' ? 10000 : 30000,
    maxRetries: environment === 'production' ? 3 : 1,
    cacheTTL: environment === 'production' ? 5 * 60 * 1000 : 30 * 1000,
  };
};

export const deploymentUtils = {
  isProduction: () => getDeploymentConfig().environment === 'production',
  isDevelopment: () => getDeploymentConfig().environment === 'development',
  
  log: (message: string, ...args: any[]) => {
    const config = getDeploymentConfig();
    if (config.enableDevTools || config.environment === 'development') {
      console.log(`[${config.environment.toUpperCase()}]`, message, ...args);
    }
  },
  
  error: (message: string, error?: any) => {
    const config = getDeploymentConfig();
    console.error(`[${config.environment.toUpperCase()}] ERROR:`, message, error);
    
    // In production, you might want to send errors to a monitoring service
    if (config.environment === 'production' && error) {
      // Example: Send to monitoring service
      // monitoringService.captureException(error, { message });
    }
  }
};
