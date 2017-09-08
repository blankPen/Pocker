'use strict'

require('./color.js');
const serveStatic = require('serve-static');
const serveIndex = require('serve-index');
const express = require('express');
const bodyParser = require('body-parser');
const livereload = require('connect-livereload');
const lrserver = require('livereload');
const path = require('path');
const { argv } = require('optimist');

const API = require('./API.js');

const doSuccess = (res, data = true) => {
  res.writeHead(200, { 'Content-Type': 'application/json;charset=UTF-8' });
  res.end(JSON.stringify({
    data,
  }));
}
const do404 = res => {
  res.writeHead(404, { 'Content-Type': 'application/json;charset=UTF-8' });
  res.end();
}


function createServer(filePath = '.', port = 3000, livereloadPort = 35729) {
  let cwd = path.resolve(filePath)
  let app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/api/setting/post/list', (req, res) => {
    res.send({
      data: API.getList(),
    });
  });
  app.post('/api/setting/post/add', (req, res) => {
    let err = API.add(req.body.name);
    res.send({
      err,
    });
  });
  app.post('/api/setting/post/delete', (req, res) => {
    let err = API.delete(req.body.name);
    res.send({
      err,
    });
  });

  app.use(livereload())
  app.use(serveStatic(cwd))
  app.use(serveIndex(cwd, { icons: true }));
  app.listen(port)
  lrserver.createServer({
    exts: ['md'],
    exclusions: ['node_modules/'],
    port: livereloadPort
  }).watch(cwd)



  console.log(`\nListening at `.green + `http://localhost:${port}`.yellow + '\n');
}
createServer('.', argv.p, 35729);