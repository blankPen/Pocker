/**
 * 创建一篇文章
 */
require('./color');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const postPath = path.resolve(process.cwd(), 'post');
const sidePath = path.resolve(process.cwd(), 'post/_sidebar.md');
const getFileName = (name, now) => `${now.format('YYYY-MM-DD')}_${name}.md`;
const postTemp = (name, now) => `
# ${name}
------
> Created on ${now.format('YYYY-MM-DD hh:mm')};
`;

function rewriteSidebar(postList) {
  let sbContent = fs.readFileSync(sidePath).toString('utf8');
  let newSb = '- [首页](/)';
  postList.forEach(item => {
    newSb += `\n- [${item.name}](${item.filename})`
  });
  fs.writeFileSync(sidePath, newSb);
}

function createPost(name) {
  const now = moment();
  let postList = getList();
  let fileNames = postList.map(({ filename }) => filename);
  let filename = getFileName(name, now);
  if (fileNames.indexOf(filename) !== -1) {
    return `文章 ${filename} 已存在`;
  }

  try {
    fs.writeFileSync(path.resolve(postPath, filename), postTemp(name, now));
    postList.push({
      name: name,
      filename: filename
    });
    rewriteSidebar(postList);
    console.log('创建成功'.green);
  } catch (error) {
    return error.message;
  }
}

function deletePost(filename) {
  let postList = getList();
  let fileNames = postList.map(({ filename }) => filename);
  const index = fileNames.indexOf(filename);
  fs.unlinkSync(path.resolve(postPath, filename));
  postList = [
    ...postList.slice(0, index),
    ...postList.slice(index + 1, postList.length),
  ];
  rewriteSidebar(postList);
  console.log('删除成功'.green);
}

function getList() {
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
  return postList;
}

module.exports = {
  add: createPost,
  delete: deletePost,
  getList: getList,
}