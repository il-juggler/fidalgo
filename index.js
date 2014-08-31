var path       = require('path');
var marked     = require('marked');
var jade       = require('jade');
var stylus = require('stylus');

var generator = require('./generator');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

var vConf = {
	md  : marked,
	cwd : process.cwd(),
	jade : jade, 
	defaultLayout : 'layout',
  stylus : stylus
};


var virtusFileFn = require(path.resolve(process.cwd(), 'fidalgo.config.js'));
virtusFileFn(vConf);

module.exports = generator(vConf);
