var path       = require('path');
var virtualize = require('./virtualize');
var marked     = require('marked');
var jade       = require('jade')

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
	jade : jade
};

var virtusFileFn = require(path.resolve(process.cwd(), 'virtusfile'));

virtusFileFn(vConf);
virtualize(vConf);
