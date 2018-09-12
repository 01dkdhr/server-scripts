const electron = require('electron')
const chalk = require('chalk')
const { spawn } = require('child_process')

function electronLog (data, color) {
    let log = ''
    data = data.toString().split(/\r?\n/)
    data.forEach(line => {
      log += `  ${line}\n`
    })
    if (/[0-9A-z]+/.test(log)) {
      console.log(
        chalk[color].bold('┏ Electron -------------------') +
        '\n\n' +
        log +
        chalk[color].bold('┗ ----------------------------') +
        '\n'
      )
    }
  }

function run() {
    const electronProcess = spawn(electron, ['.'])

    electronProcess.stdout.on('data', data => {
        electronLog(data, 'blue')
    })
    electronProcess.stderr.on('data', data => {
        electronLog(data, 'red')
    })

    electronProcess.on('close', () => {
        process.exit()
    })
}

run();