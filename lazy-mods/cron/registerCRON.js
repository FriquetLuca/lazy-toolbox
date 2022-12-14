const { platform } = require('node:process');
const { spawn } = require('child_process');
const os = require('os');
// const registerCRONTask_WINDOWS = (taskName) => {
//     return [
//         "$action = New-ScheduledTaskAction -Execute 'cmd.exe'",
//         `$trigger = New-ScheduledTaskTrigger -Daily -At 1pm`,
//         `Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "${taskName}"`
//     ];
// };
// const unregisterCRONTask_WINDOWS = (taskName) => {
//     return `Unregister-ScheduledTask -TaskName ${taskName} -Confirm:$false`;
// };

// class TaskCRON {
//     static daily(taskName, hour, mins, cmd) {
//         if(platform === "win32") {
//             const hours = Number(hour ?? 0);
//             const cronCMDs = [
//                 `$action = New-ScheduledTaskAction -Execute '${cmd}'`,
//                 `$trigger = New-ScheduledTaskTrigger -Daily -At ${hours % 12}${hours > 12 ? "pm":"am"}${mins ?? ''}`,
//                 `Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "${taskName}"`
//             ];
//             const newShell = spawn('powershell');
//         } else {
//             console.error("Other OS aren't supported yet.");
//         }
//     }
// }
module.exports = (program, config) => {
    program
        .command('cron')
        .description('Make CRON making easier.')
        .argument('<taskName>', 'The name of the task to execute on the OS CRON.')
        .argument('<command>', 'The command to execute on the OS CRON.')
        .option('-d, --daily <dailys...>', 'Create a daily CRON command with the time specified as: <dailys...> := <hour> [min]')
        .action((taskName, command, options) => {
            if(options.daily) {
                let h, m, s;
                if(options.daily) {
                    switch(options.daily.length) {
                        case 1:
                            h = options.daily[0];
                            m = 0;
                            s = 0;
                            break;
                        case 2:
                            h = options.daily[0];
                            m = options.daily[1];
                            s = 0;
                            break;
                        case 3:
                            h = options.daily[0];
                            m = options.daily[1];
                            s = options.daily[2];
                            break;
                        default:
                            h = 0;
                            m = 0;
                            s = 0;
                            break;
                    }
                }
                const hours = h % 24;
                const min = m % 60;
                const sec = s % 60;
                const time = `${hours < 10 ? `0${hours}` : hours}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;

                if (os.platform() === 'win32') {
                    // Schedule a task to run every day at 7pm using schtasks on Windows
                    const newShell = spawn('powershell', ['/create', '/tn', taskName, '/tr', command, '/sc', 'DAILY', '/st', '19:00:00']);
                    newShell.on('exit', () => console.log(`The CRON ${taskName} has been set to ${time}.`));
                } else {
                    // Open the crontab editor in read-only mode, so the user cannot edit it
                    const crontabEditor = spawn('crontab', ['-l'], { stdio: 'inherit' });
                    crontabEditor.on('exit', () => {
                        console.log(`The CRON ${taskName} has been set to ${time}.`)
                    });
                    // Inject the new line with the schedule information and the command to run
                    // ts-node app.ts every day at 7pm
                    crontabEditor.stdin.write('0 19 * * * ts-node app.ts\n');
                    // Close the crontab editor
                    crontabEditor.stdin.end();
                }
                
                console.log(commands);
                //TaskCRON.daily();
            }
        });
};