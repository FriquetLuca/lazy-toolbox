import os from 'os';
const interfaces = os.networkInterfaces();
/**
 * A lazy way to access some network interfaces.
 */
export class LazyNetList {
    /**
     * Get all internal IP v4.
     * @returns {string[]} An array of all internal IP v4.
     */
    public static internalIPv4(): string[] {
        const result = [];
        for (const k in interfaces) {
            for (const k2 in interfaces[k]) {
                const intr = interfaces[k];
                if(intr) {
                    const address: os.NetworkInterfaceInfo = intr[Number(k2)];
                    if(address && (address.family === 'IPv4' && address.internal)) {
                        result.push(address.address);
                    }
                }
                
            }
        }
        return result;
    }
    /**
     * Get all external IP v4.
     * @returns {string[]} An array of all external IP v4.
     */
    public static externalIPv4(): string[] {
        const result = [];
        for (const k in interfaces) {
            for (const k2 in interfaces[k]) {
                const intr = interfaces[k];
                if(intr) {
                    const address: os.NetworkInterfaceInfo = intr[Number(k2)];
                    if(address && (address.family === 'IPv4' && !address.internal)) {
                        result.push(address.address);
                    }
                }
                
            }
        }
        return result;
    }
    /**
     * Get all IP v4.
     * @returns {string[]} An array of all IP v4.
     */
    public static IPv4(): string[] {
        const result = [];
        for (const k in interfaces) {
            for (const k2 in interfaces[k]) {
                const intr = interfaces[k];
                if(intr) {
                    const address: os.NetworkInterfaceInfo = intr[Number(k2)];
                    if(address && (address.family === 'IPv4')) {
                        result.push(address.address);
                    }
                }
                
            }
        }
        return result;
    }
}