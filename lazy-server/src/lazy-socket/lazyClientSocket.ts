import WebSocket from 'ws';
/**
 * A lazy client representation for the server to handle client datas.
 * @property IsReconnected Check if the client is reconnected.
 * @property ID Check if the client is reconnected.
 * @property IP Get the client's IP.
 * @property Socket Get the client's socket.
 * @method setNewSocket Set the new socket of the client.
 * @method setData Set some datas for the client.
 * @method getData Get some datas of the client.
 * @method removeData Remove some client's data.
 */
export class LazyClientSocket {
    private id: number;
    private ip: string;
    private sockets: WebSocket.WebSocket[];
    private datas: {[label: string]: any};
    private reconnect: boolean;
    /**
     * Create a new client data handler.
     * @param {WebSocket.WebSocket} socket The client's socket.
     * @param {number} id The client's id.
     * @param {string} ip The IP adress of the client.
     * @param {boolean} reconnect For client's reconnection.
     */
    constructor(socket: WebSocket.WebSocket, id: number, ip: string, reconnect: boolean) {
        this.id = id;
        this.ip = ip;
        this.datas = {};
        this.sockets = [socket];
        this.reconnect = reconnect;
    }
    /**
     * Check if the client is reconnected.
     */
    public get IsReconnected(): boolean {
        return this.reconnect;
    }
    /**
     * Get the client's ID.
     */
    public get ID(): number {
        return this.id;
    }
    /**
     * Get the client's IP.
     */
    public get IP(): string {
        return this.ip;
    }
    /**
     * Get the client's socket.
     */
    public get Sockets(): WebSocket.WebSocket[] {
        return this.sockets;
    }
    /**
     * Set the new socket of the client.
     * @param {WebSocket.WebSocket} socket The new socket to assign.
     */
    public setNewSocket(socket: WebSocket.WebSocket): void {
        this.sockets.push(socket);
        socket.addListener('close', () => {
            this.sockets = this.sockets.filter((e) => {
                e !== socket
            });
        });
    }
    /**
     * Set some datas for the client.
     * @param {string} label The data's name.
     * @param {any} data The data.
     */
    public setData(label: string, data: any): void {
        this.datas[label] = data;
    }
    /**
     * Get some datas of the client.
     * @param {string} label The data's name.
     * @returns {any} The data.
     */
    public getData(label: string): any {
        return this.datas[label];
    }
    /**
     * Remove some client's data.
     * @param {string} label The data's name.
     */
    public removeData(label: string): void {
        delete this.datas[label];
    }
    /**
     * Do not use anywhere.
     * @param {boolean} process At all.
     */
    public _connectionProcess(process: boolean): void {
        this.reconnect = process;
    }
}