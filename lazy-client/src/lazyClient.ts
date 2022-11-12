/**
 * A lazy socket client to setup a websocket communication.
 * @method registerJSONSender Register an array of all sender functions.
 * @method registerJSONReciever Register an object containing all receiver functions.
 * @method sendJSON Send JSON datas to the server.
 */
export class LazyClient {
    private ws: WebSocket;
    /**
     * Setup a simple websocket connection.
     * @param {string} host The host to connect to.
     * @param {number} port The port used by the server.
     */
    constructor(host: string, port: number) {
        this.ws = new WebSocket(`ws://${host}:${port}`);
    }
    /**
     * Register an array of all sender functions.
     * @param {{ (f:(packet: string, obj: any) => any): void }[]} fns An array of function taking as argument a sender function that has two parameters: the packet name and the object to send.
     */
    public registerJSONSender(fns: { (f:(packet: string, obj: any) => any): void }[]): void {
        this.ws.addEventListener('open', () => {
            for(const fn of fns) {
                fn((packet: string, obj: any) => {
                    this.sendJSON(packet, obj);
                });
            }
        });
    }
    /**
     * Register an object containing all receiver functions.
     * @param {{[packet:string]: (obj: any, websocket: WebSocket) => void}} fns The object representing the receiving end. The packet is what will trigger a function that takes two parameters: the object it receive and a websocket.
     */
    public registerJSONReciever(fns: {[packet:string]: (obj: any, websocket: WebSocket) => void}): void {
        this.ws.addEventListener('message', async e => {
            const msg = LazyClient.filterJSONPacket(e.data.toString());
            fns[msg.packet](msg.datas, this.ws);
        });
    }
    /**
     * Send JSON datas to the server.
     * @param {string} packet The name of the packet to send.
     * @param {any} obj The object to send.
     */
    public sendJSON(packet: string, obj: any): void {
        obj['_packet'] = packet;
        this.ws.send(JSON.stringify(obj));
    }
    /**
     * Parse and filter the datas receive and give back the packet and the parsed data.
     * @param {string} data The data to parse and filter.
     * @returns {{packet:string, datas:any}} An object containing both the packet and the datas.
     */
    protected static filterJSONPacket(data: string): {packet:string, datas:any} {
        const jsonFile = JSON.parse(data);
        const packet = jsonFile._packet;
        delete jsonFile._packet;
        return {
            packet: packet,
            datas: jsonFile
        };
    }
}