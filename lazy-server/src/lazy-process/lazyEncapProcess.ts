import { dateLogMS } from '@friquet-luca/lazy-shared';
const { spawn } = require('node:child_process');
/**
 * A lazy way to encapsulate a node process.
 */
export class LazyEncapProcess {
    private root: string;
    private processPath: string;
    private isRunning: boolean;
    private reset: boolean;
    private node: any;
    protected log: (m:string) => void;
    /**
     * Create a new node process that can be executed in the background.
     * @param {string} root The root of the project.
     * @param {string} processPath The relative path to the process.
     * @param {boolean} logInfo Show the socket's log.
     * @param {boolean} showDates Show the time in the socket's log.
     */
    constructor(root: string, processPath: string, logInfo: boolean = true, showDates: boolean = true) {
        if(showDates) {
            this.log = logInfo ? (m) => console.log(dateLogMS(m)) : () => {};
        } else {
            this.log = logInfo ? (m) => console.log(m) : () => {};
        }
        this.root = root;
        this.processPath = processPath;
        this.isRunning = false;
        this.reset = false;
        this.node = null;
    }
    /**
     * Stop the node process if it exist or it's still executed.
     */
    public async stop(): Promise<void> {
        if(this.node && !this.reset) {
            this.log(`Stopping node ${this.node.pid}...`);
            this.node.kill('SIGINT');
            this.reset = true;
        }
    }
    /**
     * Start the node process.
     */
    public async start(): Promise<void> {
        if(this.isRunning) {
            setTimeout(() => {
                this.start();
            }, 100);
        } else {
            const newNode = spawn('node', [this.processPath], {
                cwd: this.root,
                stdio: ['ipc'],
            });
            newNode.stdout.on('data', (data: any) => {
                const stringData = `${data}`;
                this.log(`Node output: ${stringData.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')}`);
            });
            newNode.stderr.on('data', (data: any) => {
                this.log(`Node error: ${data}`);
                this.stop();
            });
            newNode.on('close', (code: any, signal: any) => {
                this.log(`Node ${newNode.pid} stopped.`);
                this.isRunning = false;
            });
            this.log(`Starting node ${newNode.pid}...`);
            this.node = newNode;
            this.reset = false;
            this.isRunning = true;
        }
    }
}