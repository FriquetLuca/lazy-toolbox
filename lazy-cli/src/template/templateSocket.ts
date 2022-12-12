export const templateSocket = (socketType: string) => {
    if(socketType === 'connect' || socketType === 'disconnect') {
        return `import { LazyClientSocket, LazySocket } from "lazy-toolbox";
module.exports = (server: LazySocket, client: LazyClientSocket, db: any) => {
    
};`;
    } else if(socketType === 'message') {
        return `import { LazyClientSocket, LazySocket } from "lazy-toolbox";
module.exports = (server: LazySocket, socket: LazyClientSocket, data: any, db: any) => {

};`;
    } else {
        return undefined;
    }
};