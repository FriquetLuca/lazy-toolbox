import fs from "fs";
import {LazyFS} from "./lazyFS";
/**
 * The data from an event happening to a file.
 * @interface FileEvent
 * @member {string} file The path of the file.
 * @member {string} eventType The type of event that happened. It can be either: `created`, `modified` or `deleted`.
 */
export interface FileEvent {
    /**
     * The path of the file.
     */
    file: string;
    /**
     * The type of event that happened. It can be either: `created`, `modified` or `deleted`.
     */
    eventType: string;
}
/**
 * A lazy watcher that will watch files by not relying on `fs.watch` instability but instead on a timeout approach.
 * @method checkFileChanges Get the last event that happened to all files since the last time we checked with this function.
 * @method watchFiles A watching function to check the changes in the files. It takes as argument a function to execute
 */
export class LazyWatcher {
    private isRunning: boolean;
    private isActive: boolean;
    private tOut: number;
    private tOutID: NodeJS.Timer | undefined;
    private modified: {[name: string]: any};    
    private root : string;
    private oldFiles: string[];
    private newFiles: string[];
    private excludePaths: string[];
    private excludeEventTypes: string[];
    /**
     * @param {string} root The path of the root directory to watch.
     * @param {number} timeout The timeout before checking all changes in files if there was no changes before.
     */
    constructor(root: string, timeout: number = 200, excludePaths: string[] = [], excludeEventTypes: string[] = []) {
        this.isActive = false;
        this.root = root;
        this.tOut = timeout;
        this.isRunning = false;
        this.oldFiles = LazyFS.getAllFilesInDir(this.root);
        this.modified = {};
        this.oldFiles.forEach((file: string) => {
            this.modified[file] = fs.statSync(file).mtime;
        });
        this.excludePaths = excludePaths;
        this.excludeEventTypes = excludeEventTypes;
        this.newFiles = [];
    }
    /**
     * Get the last event that happened to all files since the last time we checked with this function.
     * 
     * **Example:**
     * If a file was `modified` and then `deleted` in that time, only the deleted event will be triggered since it's the last event that happened.
     * @returns {FileEvent[]} An array containing all the events that happened to the files.
     */
    public checkFileChanges(): FileEvent[] {
        this.newFiles = LazyFS.getAllFilesInDir(this.root);
        let newFiles = [...this.newFiles];
        const result: FileEvent[] = [];
        for(const old of this.oldFiles) {
            if(newFiles.includes(old)) { // Nothing changed on file existence
                const newTime = fs.statSync(old).mtime;
                let isModified = newTime.getTime() !== this.modified[old].getTime();
                if(isModified) {
                    result.push({
                        file: old,
                        eventType: 'modified'
                    });
                    this.modified[old] = newTime;
                }
                newFiles = newFiles.filter(item => item !== old);
            } else { // The old file doesn't exist anymore
                result.push({
                    file: old,
                    eventType: 'deleted'
                });
                delete this.modified[old];
            }
        }
        if(newFiles.length > 0) {
            newFiles.forEach(f => {
                this.modified[f] = fs.statSync(f).mtime;
                result.push({
                    file: f,
                    eventType: 'created'
                });
                this.oldFiles.push(f);
            });
        }
        return result;
    }
    private static isExcluded(path: string, pathsExcluded: string[]) {
        for(const item of pathsExcluded)
        {
            if(path.length >= item.length)
            {
                let slice = path.substring(0, item.length);
                if(slice == item)
                {
                    return true;
                }
            }
        }
        return false;
    }
    private isExcludedPath(src: string): boolean {
        return LazyWatcher.isExcluded(src, this.excludePaths);
    }
    private isExcludedType(src: string): boolean {
        return LazyWatcher.isExcluded(src, this.excludeEventTypes);
    }
    /**
     * Skip the new changes.
     */
    public skipChanges(): void {
        this.oldFiles = LazyFS.getAllFilesInDir(this.root);
        this.modified = {};
        this.oldFiles.forEach((file: string) => {
            this.modified[file] = fs.statSync(file).mtime;
        });
    }
    /**
     * Stop the execution of the watcher.
     */
    public stop(): void {
        this.isActive = false;
        if(this.tOutID) {
            clearInterval(this.tOutID);
        }
    }
    /**
     * A watching function to check the changes in the files. It takes as argument a function to execute.
     * @param {(events: FileEvent[]) => Promise<void>} fn The function to execute after there was in fact a changes in a file. The argument will be an array of all FileEvent that happened.
     */
    public async watchFiles(fn: (events: FileEvent[]) => Promise<void>): Promise<void> {
        this.isActive = true;
        this.tOutID = setInterval(() => {
            this.subWatchFiles(fn);
        }, this.tOut);
    }
    /**
     * A watching function to check the changes in the files. It takes as argument a function to execute. It's activated by watchFiles.
     * @param {(events: FileEvent[]) => Promise<void>} fn The function to execute after there was in fact a changes in a file. The argument will be an array of all FileEvent that happened.
     */
    private async subWatchFiles(fn: (events: FileEvent[]) => Promise<void>): Promise<void> {
        if(this.isActive && !this.isRunning) {
            const changes = this.checkFileChanges();
            if(changes.length > 0) {
                this.isRunning = true;
                const fetchChanges: FileEvent[] = [];
                for(const event of changes) {
                    if(!this.isExcludedPath(event.file) && !this.isExcludedType(event.eventType)) {
                        fetchChanges.push(event);
                    }
                }
                await fn(fetchChanges);
                this.isRunning = false;
            }
        }
    }
}