import {LazySchedule} from './lazySchedule';
/**
 * A lazy socket client to setup a websocket communication.
 * @method send Send a packet with datas to the server.
 * @method sender Register a sender function to execute when the connection to the server is established.
 * @method senders Register an array of sender functions to execute when the connection to the server is established.
 * @method hook Add an event to a specific packet.
 * @method hooks Add events to specifics packets.
 * @method hookObject Add events to specifics packets represented in an object.
 * @method start Start listening to the server.
 * @method disconnect Disconnect this client.
 */
export class LazyClient {
    private socketURL: string;
    private timer: LazySchedule = new LazySchedule(() => {
        this.disconnect();
        this.connect();
    }, this.reconnectAfterMs, -1);
    private ws: WebSocket;
    private fns: { (f:(packet: string, obj: any) => any): void }[] = [];
    private fnr: {[packet:string]: {(obj: any, websocket: WebSocket): void}[]} = {};
    /**
     * Setup a simple websocket connection.
     * @param {string} host The host to connect to.
     * @param {number} port The port used by the server.
     */
    constructor(host: string, port: number) {
        this.socketURL = `ws://${host}:${port}`;
        this.ws = new WebSocket(this.socketURL);
    }
    /**
     * Send a packet with datas to the server.
     * @param {string} packet The name of the packet to send.
     * @param {any} obj The object to send.
     */
    public send(packet: string, obj: any): void {
        obj['_packet'] = packet;
        this.ws.send(JSON.stringify(obj));
    }
    /**
     *  Register a sender function to execute when the connection to the server is established.
     * @param {{ (f:(packet: string, obj: any) => any): void }} f A function taking as argument a sender function that has two parameters: the packet name and the object to send.
     */
    public sender(f: { (f:(packet: string, obj: any) => any): void }): void {
        this.fns.push(f);
    }
    /**
     * Register an array of sender functions to execute when the connection to the server is established.
     * @param {{ (f:(packet: string, obj: any) => any): void }[]} fns An array of function taking as argument a sender function that has two parameters: the packet name and the object to send.
     */
    public senders(...fns: { (f:(packet: string, obj: any) => any): void }[]): void {
        this.fns.push(...fns);
    }
    /**
     * Add an event to a specific packet.
     * @param {string} packet The packet's name.
     * @param {(obj: any, websocket: WebSocket) => void} fn The function to execute when the packet is triggered.
     */
    public hook(packet: string, fn: (obj: any, websocket: WebSocket) => void): void {
        if(this.fnr[packet]) { // Check if the packet is defined.
            this.fnr[packet].push(fn);
        } else {
            this.fnr[packet] = [ fn ];
        }
    }
    /**
     * Add events to specifics packets.
     * @param {{packet: string, fn: (obj: any, websocket: WebSocket) => void}[]} hooking An array of object containing the packet's name and a function to execute when the packet is triggered.
     */
    public hooks(...hooking: {packet: string, fn: (obj: any, websocket: WebSocket) => void}[]): void {
        for(let hook of hooking) {
            this.hook(hook.packet, hook.fn);
        }
    }
    /**
     * Add events to specifics packets represented in an object.
     * @param {{[packet:string]: (obj: any, websocket: WebSocket) => void}} fns An object containing all the packet's name with it's own associated function.
     */
    public hookObject(fns: {[packet:string]: (obj: any, websocket: WebSocket) => void}): void {
        for(let fn in fns) {
            this.hook(fn, fns[fn]);
        }
    }
    /**
     * Start listening to the server.
     */
    public start(): void {
        this.open();
        this.receive();
        this.onError();
        this.close();
    }
    /**
     * Disconnect this client.
     */
    public disconnect(): void {
        this.ws.onopen = function(){};
        this.ws.onmessage = function(){};
        this.ws.onclose = function(){};
        this.ws.close();
    }
    protected reconnectAfterMs(tries: number): number {
        return [500, 1000, 2000, 5000][tries - 1] || 10000;
    }
    /**
     * Parse and filter the datas receive and give back the packet and the parsed data.
     * @param {string} data The data to parse and filter.
     * @returns {{packet:string, datas:any}} An object containing both the packet and the datas.
     */
    protected static filterPacket(data: string): {packet:string, datas:any} {
        const jsonFile = JSON.parse(data);
        const packet = jsonFile._packet;
        delete jsonFile._packet;
        return {
            packet: packet,
            datas: jsonFile
        };
    }
    protected connect() {
        this.ws = new WebSocket(this.socketURL);
        this.start();
    }
    protected open() {
        this.ws.onopen = () => {
            for(const fn of this.fns) {
                fn((packet: string, obj: any) => {
                    this.send(packet, obj);
                });
            }
        };
    }
    protected receive() {
        this.ws.onmessage = async e => {
            const msg = LazyClient.filterPacket(e.data.toString());
            for(let fn of this.fnr[msg.packet]) {
                fn(msg.datas, this.ws);
            }
        };
    }
    protected onError() {
        this.ws.onerror = async e => {
            console.error((<ErrorEvent>e).message);
        };
    }
    protected close() {
        this.ws.onclose = async e => {
            if(e.code === 1006) { // Connection's lost
                this.timer.start();
            }
        };
    }
}