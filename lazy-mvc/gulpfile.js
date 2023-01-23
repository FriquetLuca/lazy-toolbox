const dotenv = require('dotenv');
const { spawn, exec } = require('child_process');
const gulp = require('gulp');

const simpleTasks = [
  {
    name: "typescript",
    command: "npm run tsc",
    watch: "src/server/**/*.{ts,tsx,js}"
  },
  {
    name: "sass",
    command: "npm run sass",
    watch: "src/server/views/**/*.{sass,scss,css}"
  }
];

// This task will run `npm run sass` on any .sass, .scss, or .css file that is changed inside the Server/Views/Pages directory
// gulp.task('sass', (cb) => {
//   exec('npm run sass', callbackLog(cb));
//   return gulp.watch('Server/Views/Pages/**/*.{sass,scss,css}', gulp.series('sass'));
// });
// gulp.task('sassBundle', (cb) => {
//   exec('npm run sassBundle', callbackLog(cb));
//   return gulp.watch('Server/Views/Templates/Stylesheets/**/*.{sass,scss,css}', gulp.series('sassBundle'));
// });

const callbackLog = (cb) => {
  return async (err, stdout, stderr) => {
    console.log(`${stdout}`);
    if(err) {
      console.error(`${stderr}`);
    }
    cb(err);
  }
};
const serverCb = (cb) => {
  const currentProcess = spawn('npm', ['run', 'start'], {
    cwd: __dirname,
    stdio: ['ipc'],
  });
  currentProcess.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  currentProcess.stderr.on('data', (data) => {
    console.log(`${data}`);
  });
  currentProcess.on('close', (code) => {
    if (code !== 0) {
      cb(new Error(`Process exited with code ${code}`));
    } else {
      cb();
    }
  });
};
const webpackCb = (cb) => {
  const webpackProcess = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'webpack'], {
    cwd: __dirname,
    stdio: ['ipc'],
  });
  webpackProcess.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  webpackProcess.stderr.on('data', (data) => {
    console.log(`${data}`);
  });
  webpackProcess.on('close', (code) => {
    if (code !== 0) {
      cb(new Error(`webpack exited with code ${code}`));
    } else {
      cb();
    }
  });
};

dotenv.config();

gulp.task('server', serverCb);

for(const task of simpleTasks) {
  gulp.task(task.name, (cb) => {
    exec(task.command, callbackLog(cb));
    return gulp.watch(task.watch, gulp.series(task.name));
  });
}

// This task will run `webpack` on any .ts, .tsx, or .js file that is changed inside the Client directory
gulp.task('webpack', webpackCb);

// This is the default task that will run all of the above tasks
gulp.task('default', gulp.parallel(simpleTasks.map((task) => {
  return task.name;
})));

