/**
 * This file is output by the build process to permit dynamic code addition via Proc.load
 */

/**
 * These are exact matches to lines in manifest.loadable
 * Their index corresponds to their index in $APP_DEPENDENCYTABLE and $APP_REQUIREPATHS
 */
$APP_VALIDENTRYPOINTS = [
//ValidEntryPointsTemplateReplaceKey
];

/**
 * This contains arrays of indices into $APP_REQUIREPATHS
 */
$APP_DEPENDENCYTABLE = [
//DependencyTableTemplateReplaceKey
];

/**
 * These are name-mangled actual diskpaths relative to the sandbox. May be not-human-friendly
 * Their index corresponds to $APP_DEPENDENCYTABLE and $APP_VALIDENTRYPOINTS
 * At runtime, these get deleted when their module gets loaded.
 */
$APP_REQUIREPATHS = [
//RequirePathsTemplateReplaceKey
];

/**
 * This contains the mapping from humanreadable absolute path to physical disk path
 */
$APP_REQUIREPATHMAP = {
//RequirePathMapTemplateReplaceKey
};

(function(){
return;
var boot_indexes = [
//BootSetupTemplateReplaceKey
];

var markDependenciesClean = function(arr){
	if(!arr || !arr.length){return;}
	for(var i = 0; i < arr.length; i++){
		var index = arr[i];
		
		if ($APP_REQUIREPATHS[index]){
			delete $APP_REQUIREPATHS[index];
			var tmp = $APP_DEPENDENCYTABLE[index];
			delete $APP_DEPENDENCYTABLE[index];
			markDependenciesClean(tmp);
		}
	}
};
markDependenciesClean(boot_indexes);
})();

function exception_demangle_require(reqPath){
	var p = "" +reqPath;
	p = p.substr(0,p.indexOf("?")); //Get rid of ?hashcode from exception paths
	p = p.substr(1 + p.lastIndexOf("/")); // Presume flat JS hierarchy in compiled output.
	p = p.replace(/\.js/,'');
	
	for(var k in $APP_REQUIREPATHMAP){
		if($APP_REQUIREPATHMAP[k] == p){
			return k;
		}
	}
	return p;
};