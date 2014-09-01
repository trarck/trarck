/** This file is used to profile the performance of require() operations. Replace the existing code in header.js to enable. */
$MODULE_FACTORY_REGISTRY = typeof $MODULE_FACTORY_REGISTRY != 'undefined' ? $MODULE_FACTORY_REGISTRY : {};
$MODULE_REGISTRY = typeof $MODULE_REGISTRY != 'undefined' ? $MODULE_REGISTRY : {};
$__reqTree = null;
$__reqBranchTime = 0;
if(typeof console == 'undefined') {
	console = { log: __underscore_SysLog || function(str) {} };
}
if(typeof require == 'undefined') {
	console.log("~~~ PROFILING REQUIRE TIMES");
	function require_trace(name, subrequires, indent) {
		console.log(indent + name);
		if (subrequires) for (var n in subrequires) {
			require_trace(n, subrequires[n], indent + '   ');
		};
	}
	function require(path)
	{
		if (!$MODULE_FACTORY_REGISTRY[path]) {
    		var e = new Error("RequireError: Module Missing or not yet Loaded [" + JSON.stringify(path) + "]");
    		e.relatedFile = path;
    		throw e;
		} else if(!$MODULE_REGISTRY[path]) {
			var minTime = 0;
			var $parentRTree = $__reqTree;
			var trunkTime = $__reqBranchTime;
			$__reqBranchTime = 0;
			$__reqTree = {};

			var start = new Date().getTime();
			// Evaluate the module
			$MODULE_REGISTRY[path] = $MODULE_FACTORY_REGISTRY[path]();
			var elapsed = new Date().getTime() - start;
		
			if (elapsed >= minTime) {
				var selfTime = elapsed - $__reqBranchTime;
				var printKey = selfTime + "ms / " + $__reqBranchTime + "ms: " + path;
				if (!$parentRTree) {
					require_trace(printKey, $__reqTree, '~~~ ');
				} else {
					$parentRTree[printKey] = $__reqTree;
				}
			}
		
			$__reqTree = $parentRTree;
			$__reqBranchTime = trunkTime + elapsed;
			
		}
		
		return $MODULE_REGISTRY[path];
	};
}
if (typeof NGJSPath === 'undefined'){function NGJSPath(path){return path;}}
