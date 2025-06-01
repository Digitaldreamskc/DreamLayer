'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, ReactNode, createContext, useContext } from 'react';

// Create a context to hold the Keystone module
const KeystoneContext = createContext<any>(null);

// This component will only load on the client side and dynamically import Keystone
const DynamicKeystoneComponent = dynamic(
  async () => {
    // Return a component that wraps any Keystone functionality
    return function KeystoneSdkComponent({ children }: { children: ReactNode }) {
      const [keystoneModule, setKeystoneModule] = useState<any>(null);
      
      useEffect(() => {
        // Just load the module and store it, without making assumptions about its API
        const loadKeystoneModule = async () => {
          try {
            const module = await import('@keystonehq/sdk');
            setKeystoneModule(module);
            console.log('Keystone SDK loaded successfully');
          } catch (error) {
            console.error("Error loading Keystone SDK:", error);
          }
        };
        
        loadKeystoneModule();
      }, []);
      
      // Context provider for Keystone module
      return (
        <KeystoneContext.Provider value={keystoneModule}>
          {children}
        </KeystoneContext.Provider>
      );
    };
  },
  { 
    ssr: false,
    loading: () => <div>Loading Keystone SDK...</div> 
  }
);

// Main component that can be imported anywhere in the app
export default function KeystoneWrapper({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Don't render anything server-side
  if (!isClient) return null;
  
  return (
    <DynamicKeystoneComponent>
      {children}
    </DynamicKeystoneComponent>
  );
}

// Export a hook to use Keystone functionality
export function useKeystoneModule() {
  const keystoneModule = useContext(KeystoneContext);
  return keystoneModule;
}

// Example of how to use the Keystone functionality in another component:
// 
// function SomeComponent() {
//   const keystoneModule = useKeystoneModule();
//   
//   useEffect(() => {
//     if (keystoneModule) {
//       // Use keystoneModule safely here
//       // You'd need to check the actual API of the module
//       console.log('Keystone module available:', keystoneModule);
//     }
//   }, [keystoneModule]);
//   
//   return <div>Your component content</div>;
// }
