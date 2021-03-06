module.exports = Site;

var steps = ['initialize','prepare','execute','finalize'];
var path = require('path');

var staticPlugin  = require('./plugins/static');
var layoutsPlugin = require('./plugins/layouts');
var pagesPlugin   = require('./plugins/pages');
var stylesPlugin  = require('./plugins/styles');

var SiteProto = Site.prototype;

function Site () {
    if(!(this instanceof Site)) return new Site;

    this.$plugins      = [];
    this.defaultLayout = 'layout';
    this.out           = 'site';
    this.src           = 'src';

    this.call( require('./extenders/default') )
        .addPlugin( staticPlugin()  )
        .addPlugin( layoutsPlugin() )
        .addPlugin( pagesPlugin()   )
        .addPlugin( stylesPlugin()  )
        ;
}

/* ---- ---- ---- ---- ---- ---- ---- */

SiteProto.generate = function () {
    var site = this;

    steps.forEach(function(step) {
        console.log(step);

        site.$plugins.forEach(function (plugin) {
            var fn;
            if((fn = plugin[step])) {
                console.log('-----' + plugin.name );
                fn(site);
            }
        });
    });
}

SiteProto.CWD = function (i) {
    if(! arguments.length ) {
        return this.cwd;
    }
    this.cwd = i;
    return this;
}

SiteProto.addPlugin = function(plugin) {
    this.$plugins.push(plugin);
    if(plugin.register) {
        plugin.register(this);
    }
    return this;
}


SiteProto.loadConfig = function () {
    var cfgPath = path.resolve(this.cwd,'fidalgo.config.js');
    require(cfgPath)(this);
    console.log('loadingConfig', cfgPath);
    return this;
}


SiteProto.srcPath = function () {
    return path.resolve(this.cwd, this.src);
}

SiteProto.outPath = function () {
    return path.resolve(this.cwd, this.out);
}


SiteProto.call = function (fn) {
    fn(this);
    return this;
}