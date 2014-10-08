module.exports = ExtendersDefault;


function ExtendersDefault (site) {

	site.ultimasPublicaciones = function (a) {
		a || (a = 10);
		var publicaciones = site.filterPages({tipo:'publicacion'});
		return publicaciones.slice(0,a);
	}


	site.filterPages = function (query) {
		site.pages = site.pages.sort(comparePageDate);
		return site.pages.filter(createFilter(query));
	}


	function comparePageDate (p1, p2) {
		if(p1.page.fecha != p2.page.fecha) {
			if (p1.page.fecha < p2.page.fecha) return 1;
			else return -1;
		}
		return 0;
	}


	function createFilter (query) {
		var keys = Object.keys(query);
		var i, key;

		return function (p) {
			for(i in keys) {
				key = keys[i];
				if(false === (p.page[key] == query[key])) return false;
			}
			return true;
		}
	}
}