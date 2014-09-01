/** This file is used to profile the performance of require() operations. Replace the existing code in header.js to enable. */
$MODULE_FACTORY_REGISTRY = typeof $MODULE_FACTORY_REGISTRY != 'undefined' ? $MODULE_FACTORY_REGISTRY : {};
$MODULE_REGISTRY = typeof $MODULE_REGISTRY != 'undefined' ? $MODULE_REGISTRY : {};
$__reqTree = null;
$__reqBranchTime = 0;
if(typeof require == 'undefined') {
	function require_trace(name, subrequires, indent) {
		console.log(indent + name);
		for (var n in subrequires) {
			require_trace(n, subrequires[n], indent + '   ');
		};
	}
	function require(path)
	{
		var $parentRTree = $__reqTree;
		var trunkTime = $__reqBranchTime;
		$__reqBranchTime = 0;
		$__reqTree = {};

		var start = new Date().getTime();
		if(!$MODULE_REGISTRY[path]) $MODULE_REGISTRY[path] = $MODULE_FACTORY_REGISTRY[path]();
		var elapsed = new Date().getTime() - start;
		var selfTime = elapsed - $__reqBranchTime;
		
		var printKey = selfTime + "ms / " + $__reqBranchTime + "ms: " + path;
		if (elapsed >= 30) {
			if ($parentRTree === null) {
				require_trace(printKey, $__reqTree, '');
			} else {
				$parentRTree[printKey] = $__reqTree;
			}
		}
		
		$__reqTree = $parentRTree;
		$__reqBranchTime = trunkTime + elapsed;
		
		return $MODULE_REGISTRY[path];
	};
}