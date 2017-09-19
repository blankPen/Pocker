require('./color');
const logError = msg => { throw new Error(msg.red) };
const log = msg => console.log(msg.green);
const execSync = require('child_process').execSync;

execSync('git fetch -p');

exports.validateMessage = function validateMessage(raw) {
  var messageWithBody = (raw || '').split('\n').filter(function (str) {
    return str.indexOf('#') !== 0;
  }).join('\n');
  logError(messageWithBody);
  var message = messageWithBody.split('\n').shift();
  log(message);
};