interface ManifoldConnect {
    init: (config: {
        appName: string;
        clientId: string;
        elementId: string;
    }) => void;
    on: (event: 'connect' | 'disconnect', callback: (data?: { address: string }) => void) => void;
    off: (event: 'connect' | 'disconnect', callback: (data?: { address: string }) => void) => void;
}

declare global {
    interface Window {
        manifold?: ManifoldConnect;
    }
} 