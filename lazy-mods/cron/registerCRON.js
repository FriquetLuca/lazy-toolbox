const { platform } = require('node:process');
const { spawn } = require('child_process');
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
                let h, m;
                if(options.daily) {
                    if(options.daily.length > 1) {
                        h = options.daily[0];
                        m = options.daily[1];
                    } else {
                        h = options.daily[0];
                        m = 0;
                    }
                }
                const hours = h % 24;
                const min = m % 60;
                const commands = [
                    `schtasks /create /tn "${taskName}" /tr "${command}" /sc daily /st ${hours < 10 ? `0${hours}` : hours}:${min < 10 ? `0${min}` : min}`
                ];

                const newShell = spawn('powershell', ['-command', ...commands]);
                console.log(commands);
                //TaskCRON.daily();
            }
        });
};