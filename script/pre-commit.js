require('./color');
const logError = msg => { throw new Error(msg.red) };
const logr = msg => console.log(msg.green);
const execSync = require('child_process').execSync;

execSync('git fetch -p');

// logError('HAHAHAHA');

exports.validateMessage = function validateMessage(raw) {
  var messageWithBody = (raw || '').split('\n').filter(function (str) {
    return str.indexOf('#') !== 0;
  }).join('\n');

  var message = messageWithBody.split('\n').shift();
  console.log(message);
};