require('./color');

const { stdin, stdout } = process;

const getDesc = (desc, data) => {
  if (typeof desc === 'function') {
    return desc(data);
  }
  return `${desc}`;
};

const wait = (q, data) => {
  const title = getDesc(q.title, data);
  const description = getDesc(q.description, data);

  stdout.write(`${'?'.green} ${title.white}\n`);
  if (q.description) {
    stdout.write(`  ${description.grey}\n: `);
  }
  if (Array.isArray(q.options)) {
    q.options.forEach((op, i) => {
      stdout.write(`${`${i + 1})`.cyan} ${op.grey}\n`);
    });
    stdout.write('\n: ');
  }
};

module.exports = (questions, callback) => {
  const result = {};

  let [q] = questions;
  let i = 0;

  wait(q, result);
  stdin.resume();
  stdin.setEncoding('utf8');

  stdin.on('data', (chunk) => {
    chunk = chunk.replace(/[\s\n]/, '');

    result[q.name] = chunk || q.default;

    if (Array.isArray(q.options)) {
      result[q.name] = q.options[chunk - 1];
    }

    const { validate } = questions[i];

    if (typeof validate === 'function') {
      const val = validate(chunk);
      if (val !== true) {
        stdout.write(`✘ ${val}，请重新输入\n`.red);
        i -= 1;
      }
    }

    i += 1;
    q = questions[i];

    if (i >= questions.length) {
      stdin.pause();
      callback(result);
    } else {
      wait(q, result);
    }
  });
};
