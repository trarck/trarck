$MODULE_FACTORY_REGISTRY = typeof $MODULE_FACTORY_REGISTRY != 'undefined' ? $MODULE_FACTORY_REGISTRY : {};
$MODULE_REGISTRY = typeof $MODULE_REGISTRY != 'undefined' ? $MODULE_REGISTRY : {};
if(typeof require == 'undefined')
function require(path){if(!$MODULE_REGISTRY[path]) $MODULE_REGISTRY[path] = $MODULE_FACTORY_REGISTRY[path](); return $MODULE_REGISTRY[path]};