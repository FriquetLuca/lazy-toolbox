import WebSocket from 'ws';
import {LazyModLoader} from '../lazyModLoader';
import { dateLogMS } from '@lazy-toolbox/portable';

/**
 * The relative path of all three folders that will contain the modules needed for the socket logic to implement. 
 */
interface FolderMods {
    /**
     * The relative path of all modules functions that will be called when a client connect on the server.
     */
    onConnect: string;
    /**
     * The relative path of all modules functions that will be called when a client send a message on the server.
     */
    onMessages: string;
    /**
     * The relative path of all modules functions that will be called when a client disconnect on the server.
     */
    onDisconnect: string;
}
/**
 * A lazy client implementation.
 */
interface LazyClient {
    /**
     * The client's id.
     */
    id: number;
}
/**
 * A lazy socket implementation to handle websocket.
 * @method connect Handle all the logic for client's connection.
 * @method sendToAll Send a message to every socket connected to the server.
 * @method sendToAllExceptSender Send a message to every socket connected to the server except a specific socket.
 * @method clientCount Get the number of client connected to the server.
 * @method getClient Get the client's datas.
 * @method getServer Get the WebSocket server.
 * @function sendToClient Send a message to a specific socket.
 * @function closeClient Close a specific socket's connection.
 */
export class LazySocket {
    protected datas: {[label: string]: any} = {};
    protected serverSocket: WebSocket.Server<WebSocket.WebSocket>;
    protected id: number;
    protected clients: any;
    protected log: (m:string) => void;
    protected errLog: (m:string) => void;
    protected onConnect: {[filePath: string]: any};
    protected onMessages: {[filePath: string]: any};
    protected onDisconnect: {[filePath: string]: any};
    protected db: any;
    /**
     * Create the socket server.
     * @param {number} port The port to listen to.
     * @param {boolean} root The root directory where the project is.
     * @param {FolderMods} paths The relative path of the folders that will contain the modules for the server.
     * @param {boolean} logInfo Show the socket's log.
     * @param {boolean} showDates Show the time in the socket's log.
     */
    constructor(port: number, root: string, paths: FolderMods = { onConnect:'./onConnect', onMessages: './onMessages', onDisconnect: './onDisconnect' }, logInfo: boolean = true, showDates: boolean = true, db: any = undefined) {
        if(showDates) {
            this.log = logInfo ? (m) => console.log(dateLogMS(m)) : () => {};
            this.errLog = logInfo ? (m) => console.error(dateLogMS(m)) : () => {};
        } else {
            this.log = logInfo ? (m) => console.log(m) : () => {};
            this.errLog = logInfo ? (m) => console.error(m) : () => {};
        }
        this.id = 1;
        this.clients = {};
        this.serverSocket = new WebSocket.Server({ port: port });
        this.onConnect = new LazyModLoader(root, paths.onConnect).load();
        this.onMessages = new LazyModLoader(root, paths.onMessages).load();
        this.onDisconnect = new LazyModLoader(root, paths.onDisconnect).load();
        this.db = db;
    }
    /**
     * Remove error handling on sockets.
     */
    public noError(): void {
        this.errLog = () => {};
    }
    /**
     * Set a database to use/
     * @param {any} db The database to use.
     */
    public setDB(db: any): void {
        this.db = db;
    }
    /**
     * Handle all the logic for the client's connection.
     */
    public connect(): void {
        this.serverSocket.on('connection', ws => {
            const _ID = this.id++;
            this.log(`Client ${_ID} is now connected.`);
            for(let connected in this.onConnect) {
                this.onConnect[connected](this, ws, this.db, _ID);
            }
            ws.on('message', jsonData => {
                const data = JSON.parse(jsonData.toString());
                const _packet = data._packet;
                delete data._packet;
                this.log(`Client has sent us: ${JSON.stringify(data)}`);
                if(this.onMessages[_packet]) {
                    if(LazyModLoader.isClass(this.onMessages[_packet])) {
                        this.errLog(`Packet ${_packet} failed. Class aren't supported for messages by SocketServer.`);
                    } else if(LazyModLoader.isFunction(this.onMessages[_packet])) {
                        this.onMessages[_packet](this, ws, data, this.db, _ID);
                    } else {
                        this.errLog(`Packet ${_packet} failed. Unknown message type.`);
                    }
                } else {
                    this.errLog(`Packet ${_packet} doesn't exist.`);
                }
            });
            ws.on('close', () => {
                this.log(`Client ${_ID} has been disconnected. Still connected: ${this.clientCount()} clients.`);
                for(let closed in this.onDisconnect) {
                    this.onDisconnect[closed](this, _ID, this.db);
                }
            });
        });
    }
    /**
     * Send a message to every socket connected to the server.
     * @param {string} packet The message's packet name.
     * @param {any} data The data to send.
     */
    public sendToAll(packet: string, data: any): void {
        const toTxt = LazySocket.filter(packet, data);
        this.serverSocket.clients.forEach(client => {
            client.send(toTxt);
        });
    };
    /**
     * Send a message to every socket connected to the server except a specific socket.
     * @param {string} packet The message's packet name.
     * @param {WebSocket.WebSocket} socket The socket to ignore.
     * @param {any} data The data to send.
     */
    public sendToAllExceptSender(packet: string, socket: WebSocket.WebSocket, data: any): void {
        const toTxt = LazySocket.filter(packet, data);
        this.serverSocket.clients.forEach(client => {
            if(socket !== client) {
                client.send(toTxt);
            }
        });
    };
    /**
     * Get the number of client connected to the server.
     * @returns {number} The number of client connected to the server.
     */
    public clientCount(): number {
        return this.serverSocket.clients.size;
    }
    /**
     * Get the client's datas.
     * @param {WebSocket.WebSocket} socket The socket of a client.
     * @returns {LazyClient} The client's data.
     */
    public getClient(socket: WebSocket.WebSocket): LazyClient {
        const val: any = socket;
        return this.clients[val];
    }
    /**
     * Get the WebSocket server.
     * @returns {WebSocket.Server<WebSocket.WebSocket>} The WebSocket server.
     */
    public getServer(): WebSocket.Server<WebSocket.WebSocket> {
        return this.serverSocket;
    }
    /**
     * Get a data shared across the socket communication.
     * @param {string} label The data name.
     * @returns {any} The desired data.
     */
    public getData(label: string): any {
        return this.datas[label];
    }
    /**
     * Set a data shared across the socket communication.
     * @param {string} label The data name.
     * @param {any} data The data to set.
     */
    public setData(label: string, data: any): void {
        this.datas[label] = data;
    }
    /**
     * Delete a data shared across the socket communication.
     * @param {string} label The data name.
     */
    public deleteData(label: string): void {
        delete this.datas[label];
    }
    /**
     * Inject a property in data named `_packet` with the value of any message in `packet`, then stringify the JSON value.
     * @param {string} packet The message's packet name.
     * @param {any} data The data to send.
     * @returns {string} The stringify'ed JSON value of the data.
     */
    protected static filter(packet: string, data: any): string {
        data['_packet'] = packet;
        return JSON.stringify(data);
    }
    /**
     * Send a message to a specific socket.
     * @param {string} packet The message's packet name.
     * @param {WebSocket.WebSocket} socket The socket of a client.
     * @param {any} data The data to send.
     */
    public static sendToClient(packet: string, socket: WebSocket.WebSocket, data: any): void {
        socket.send(LazySocket.filter(packet, data));
    }
    /**
     * Close a specific socket's connection.
     * @param {WebSocket.WebSocket} socket The socket of a client.
     */
    public static closeClient(socket: WebSocket.WebSocket): void {
        socket.close();
    }
}