/*
 * requires nodeunit
 *   https://github.com/caolan/nodeunit
 */
var Combiner = require('../combiner');

exports.testGenerateLegacyWithInvalidBuildDepth = function(test) {
    Combiner.generateLegacy({buildDepth:0}, function(err) {
        if (err)
            test.done();
        else
            test.fail();
    });
};

exports.testGenerateLegacy = function(test) {
    // depth=2 means ../../
    Combiner.generateLegacy({buildDepth:2}, function(err) {
        if (err)
            test.fail();
        else
            test.done();
    });
};

exports.testCombineNormalCase = function(test) {
    var manifest = {
        code: [
            './NGCore/Client/Legacy.js',
            './Code/Main.js'
        ]
    };
    var options = {
        buildDepth:2,
        compress:true
    };
    var app = 'HelloWorld';
    Combiner.combine(manifest, '/tmp/' + app, '../../Samples/' + app, options, function(err) {
        if (err) {
            console.error(err);
            test.fail();
        } else {
            test.done();
        }
    });
};

exports.testToRelativePath = function(test) {
    test.equal(Combiner.toRelativePath('./'), '');
    test.equal(Combiner.toRelativePath('../'), '../');
    test.equal(Combiner.toRelativePath('ab/cd'), 'ab/cd');
    test.equal(Combiner.toRelativePath('ab/cd', 'ab'), 'cd');
    test.equal(Combiner.toRelativePath('ab/cd', 'ab/'), 'cd');
    test.equal(Combiner.toRelativePath('ab/cd/', 'ab/'), 'cd/');
    test.equal(Combiner.toRelativePath('./ab/cd/', 'ab'), 'cd/');
    test.done();
};