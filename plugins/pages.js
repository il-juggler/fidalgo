
module.exports = PagesPlugin;

var fs     = require('fs');
var path   = require('path');
var utils  = require('../utils');

var MD     = '.md';
var json   = '.json';

var filenameRegexp = /^([0-9]{4}\-[0-9]{2}\-[0-9]{2})(\-)?([\w\-]+)$/;


function PagesPlugin () {

    function initialize (site) {
        site.pages      = [];
        site.categories = [];
    }

    function loadPages (site) {
        loadPageFolder(site,'', {});
    }

    function loadPageFolder(site,subPath, nestedData) {
        var fullSubPath = path.join(site.srcPath(),'pages',subPath);

        fs.readdirSync(fullSubPath).forEach(function (fileInSubPath) {
            var filePath = path.join(fullSubPath,fileInSubPath);
            var fileInfo = fs.statSync(filePath);

            if(fileInfo.isDirectory()) {
                loadPageFolder(
                    site, 
                    path.join(subPath, fileInSubPath), 
                    utils.extend({}, nestedData)
                );
                return;
            }

            if(path.extname(fileInSubPath) == MD) {
                loadPage(site, subPath, fileInSubPath, nestedData);
            }
        });
    }

    function loadPage(site, subPath, file, nestedData) {
        var pageFilePath = path.join(site.srcPath(),'pages',subPath,file);  

        var fileRawName  = path.basename(file, MD);
        var fileContents = fs.readFileSync(pageFilePath).toString();
        var content      = utils.md(fileContents); 

        var page = getPageData(subPath,fileRawName,content, fileContents ,nestedData);

        var pageData = {
            page     : page,
            settings : {
                uri   : page.uri,
                file  : path.join(page.uri.substring(1) , 'index.html')
            }
        };

        site.pages.push(pageData);
    }


    function getPageData (subPath, fileRawName, content, originalContent, nestedData) {
        var lFilenameData = getFilenameData(fileRawName)
        var lContentData  = getContentData(content, originalContent);
        var lFidalgoData  = JSON.parse(lContentData.fidalgoData);


        var uri = path.join(subPath, lFilenameData.slug);
        uri = (subPath == '' && lFilenameData.slug == 'index') ? '' : '/'.concat(uri);

        return utils.extend(
            {},
            nestedData,
            lFilenameData,
            lContentData,
            lFidalgoData,
            {
                $filenameData : lFilenameData,
                $contentData  : lContentData,
                $fidalgoData  : lFidalgoData,
                uri           : uri,
                content       : content,
                slug          : lFilenameData.slug
            }
        );
    }


    function getFilenameData (fileRawName) {
        var slug =  fileRawName;
        var fecha = '0000-00-00';
        var match = fileRawName.match(filenameRegexp);

        if(match) {
            slug  = match[3];
            fecha = match[1];
        }

        return {
            slug : slug,
            title: slug,
            fecha: fecha
        }
    }


    function getContentData(content, originalContent) {
        var $ = utils.cheerio.load(originalContent);
        var fData =  $('fidalgo-data').text();

        if(!fData.trim()) {
            fData = '{}';
        }

        return {
            fidalgoData : fData
        }
    }



    function generatePages (site) {
        site.pages.forEach(function(p, idx) {
            //No sé por qué se necesita esto
            setTimeout(function () {
                var locals  = utils.extend({site : site}, p);
                var layout  = getLayout(site,p);
                writePage(site, p.settings.file, layout(locals));
            },0);
        });
    }


    /* --- Auxiliar Functions --- */

    function getLayout (site, p) {
        var ly = (p.page.layout) ? p.page.layout : site.defaultLayout;
        return site.layouts[ly];
    }

    function writePage (site,file,data) {
        var fullPagePath = path.join(site.outPath() ,file);
        var relPath = '';

        //Ensure folder exists
        
        path.dirname(file).split(path.sep).forEach(function(sub) {
            relPath = path.join(relPath, sub);

            var folderPath = path.resolve(site.cwd,site.out,relPath);
            utils.mkDirIfNotExists(folderPath);
        });


        fs.writeFileSync(fullPagePath, data);
    }

    return {
        name       : 'pages',
        initialize : initialize,
        prepare    : loadPages, 
        execute    : generatePages
    }
}