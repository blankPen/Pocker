/**
 * 创建一篇文章
 */
require('./color');
const repl = require('./prompt');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { argv } = require('optimist');

const postPath = path.resolve(process.cwd(), 'docs');
const sidePath = path.resolve(process.cwd(), 'docs/sidebar.md');
let sbContent = fs.readFileSync(sidePath).toString('utf8');
let postList = sbContent.split('\n').map(str => {
  var n = str.match(/\[.+\]/)[0];
  var p = str.match(/\(.+\)/)[0];
  return {
    name: n.substring(1, n.length - 1),
    filename: p.substring(1, p.length - 1),
  };
});
postList.shift();
let fileNames = postList.map(({ filename }) => filename);



const now = moment();

const getFileName = name => `${now.format('YYYY-MM-DD')}_${name}.md`;
const postTemp = name => `
  # ${name}
  ------
  > Created on ${now.format('YYYY-MM-DD hh:mm')};
`;

function rewriteSidebar(name) {
  let newSb = '- [首页](/)';
  postList.forEach(item => {
    newSb += `\n- [${item.name}](${item.filename})`
  });
  fs.writeFileSync(sidePath, newSb);
}

function createPost(name) {

  try {
    fs.writeFile(path.resolve(postPath, getFileName(name)), postTemp(name), () => {
      console.log('创建成功'.green);
      postList.push({
        name: name,
        filename: getFileName(name)
      });
      rewriteSidebar();
    });
  } catch (error) {
    console.error(error);
  }
}
function deletePost(filename) {
  const index = fileNames.indexOf(filename);
  fs.unlinkSync(path.resolve(postPath, filename));
  postList = [
    ...postList.slice(0, index),
    ...postList.slice(index + 1, postList.length),
  ];
  rewriteSidebar();
}

const createPrompt = [
  {
    name: 'name',
    title: '请输入文章名称',
    default: '',
    validate: (value) => {
      if (!value) {
        return '文章名不能为空';
      }
      filename = getFileName(value);
      if (fileNames.indexOf(filename) !== -1) {
        return `文章 ${filename} 已存在`;
      }
      return true;
    },
  },
  {
    name: 'confirm',
    title: (data) => {
      return `创建文章 ${data.name} [Y/n]`;
    },
    default: 'y',
  },
];

const deletePrompt = [
  {
    name: 'name',
    title: '请选择要删除的文章',
    options: fileNames,
  }, {
    name: 'confirm',
    title: (data) => {
      return `删除文章 ${data.name} [Y/n]`;
    },
    default: 'y',
  },
];

const type = argv.type;
if (type === 'c' || type === 'create') {
  repl(createPrompt, (data) => {
    if (/y/i.test(data.confirm)) {
      createPost(data.name);
    }
  });
} else if (type === 'd' || type === 'delete') {
  if(!fileNames.length){
    return console.log('没有可删除的文章\n'.red)
  }
  repl(deletePrompt, (data) => {
    if (/y/i.test(data.confirm)) {
      deletePost(data.name);
    }
  });
}