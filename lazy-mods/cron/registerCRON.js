const { spawn, exec } = require('child_process');
const os = require('os');
const getTime = (timeVar) => {
    let h, m, s;
    if(timeVar) {
        const tvar = timeVar.split(':');
        switch(tvar.length) {
            case 1:
                h = tvar[0];
                m = 0;
                s = 0;
                break;
            case 2:
                h = tvar[0];
                m = tvar[1];
                s = 0;
                break;
            case 3:
                h = tvar[0];
                m = tvar[1];
                s = tvar[2];
                break;
            default:
                h = 0;
                m = 0;
                s = 0;
                break;
        }
    } else {
        h = 0;
        m = 0;
        s = 0;
    }
    return {
        hours: Number(h) % 24,
        mins: Number(m) % 60,
        secs: Number(s) % 60
    };
}; 
module.exports = (program, config) => {
    program
        .command('cron')
        .description('Make CRON making easier.')
        .argument('<taskName>', 'The name of the task to execute on the OS CRON.')
        .option('-c, --cmd <command>', 'The command to execute on the OS CRON.')
        //.option('-i, --interval [time]', 'Create an interval CRON command executed every [H:M:S] specified as H, H:M or H:M:S.')
        //.option('-w, --weekly [time]', 'Create a weekly CRON command executed every [H:M:S] specified as H, H:M or H:M:S.')
        .option('-d, --daily [time]', 'Create a daily CRON command executed every [H:M:S] specified as H, H:M or H:M:S.')
        .option('-r, --remove', 'Remove a specific CRON task.')
        .action((taskName, options) => {
            if(options.daily) {
                const t = getTime(options.daily);
                
                const _h = t.hours;
                const _m = t.mins;
                const _s = t.secs;
                const time = `${_h < 10 ? `0${_h}` : _h}:${_m < 10 ? `0${_m}` : _m}:${_s < 10 ? `0${_s}` : _s}`;

                if (os.platform() === 'win32') {
                    exec(`schtasks /query /tn "${taskName}"`, (error, stdout, stderr) => {
                        if (error) {
                            // Task is not registered, create it
                            const newShell = spawn('schtasks', ['/create', '/tn', taskName, '/tr', options.cmd, '/sc', 'DAILY', '/st', time]);
                            newShell.on('exit', () => console.log(`The CRON ${taskName} has been set to ${time}.`));
                        } else {
                            // Task is already registered, do not create it
                            console.log(`The CRON ${taskName} already exists.`);
                        }
                    });
                } else {
                    const crontabEditor = spawn('crontab', ['-l'], { stdio: 'inherit' });
                    crontabEditor.on('message', (msg) => {
                        console.log(msg);
                    });
                    crontabEditor.on('exit', () => {
                        console.log(`The CRON ${taskName} has been set to ${time}.`)
                    });
                    crontabEditor.stdin.write(`# @${taskName}\n${_m} ${_h} * * * ${options.cmd} SECONDS=${_s}\n`);
                    crontabEditor.stdin.end();
                }
            }
            if(options.remove) {
                if (os.platform() === 'win32') {
                    const deleteShell = spawn('schtasks', ['/delete', '/f',  '/tn', taskName]);
                    deleteShell.on('exit', (code) => {
                        console.log(code === 0 ? `The CRON ${taskName} has been removed.` : `Error removing the CRON ${taskName}.`);
                    });
                } else {

                }
            }
        });
};