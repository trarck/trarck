$MODULE_FACTORY_REGISTRY = typeof $MODULE_FACTORY_REGISTRY !== 'undefined' ? $MODULE_FACTORY_REGISTRY : {};
$MODULE_REGISTRY = typeof $MODULE_REGISTRY !== 'undefined' ? $MODULE_REGISTRY : {};
if (typeof require === 'undefined'){function require(path){if(!$MODULE_FACTORY_REGISTRY[path]){var e = new Error("RequireError: Module Missing or not yet Loaded ["+JSON.stringify(path)+"]"); e.relatedFile = path; throw e;}else if(!$MODULE_REGISTRY[path]){$MODULE_REGISTRY[path] = $MODULE_FACTORY_REGISTRY[path]();}return $MODULE_REGISTRY[path];}}
if (typeof NGJSPath === 'undefined'){function NGJSPath(path){return path;}}
if (typeof(console) === 'undefined'){console = { log: (typeof __underscore_SysLog == 'function') ? __underscore_SysLog: function(str) {} };}