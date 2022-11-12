/**
 * Create a message with the time display up to the ms.
 * 
 * It will be showned as `[HH:MM:SS.DCM] MY_MESSAGE`.
 * @param {any} msg The message to display.
 * @returns {string} The string with the time displayed.
 */
export function dateLogMS(msg: any): string {
    let actualTime = new Date(Date.now());
    let hours = `${actualTime.getHours()}`;
    hours = hours.length == 1 ? `0${hours}` : hours;
    let min = `${actualTime.getMinutes()}`;
    min = min.length == 1 ? `0${min}` : min;
    let sec = `${actualTime.getSeconds()}`;
    sec = sec.length == 1 ? `0${sec}` : sec;
    let milSec = `${actualTime.getMilliseconds()}`;
    milSec = milSec.length == 1 ? `00${milSec}` : milSec.length == 2 ? `0${milSec}` : milSec;
    return `[${hours}:${min}:${sec}.${milSec}] ${msg.toString()}`;
};
/**
 * Create a message with the time display up to the s.
 * 
 * It will be showned as `[HH:MM:SS] MY_MESSAGE`.
 * @param {any} msg The message to display.
 * @returns {string} The string with the time displayed.
 */
export function dateLog(msg: any): string {
    let actualTime = new Date(Date.now());
    let hours = `${actualTime.getHours()}`;
    hours = hours.length == 1 ? `0${hours}` : hours;
    let min = `${actualTime.getMinutes()}`;
    min = min.length == 1 ? `0${min}` : min;
    let sec = `${actualTime.getSeconds()}`;
    sec = sec.length == 1 ? `0${sec}` : sec;
    return `[${hours}:${min}:${sec}] ${msg.toString()}`;
}