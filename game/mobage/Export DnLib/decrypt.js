var util = require ('util');
var fs = require('fs');
var path = require('path');

function decryptJS(fname,encoding) {
    var code = fs.readFileSync(fname);
    var encryptedCode = decryptCode(code);
    var ext=path.extname(fname);
    var source=path.dirname(fname)+"/"+path.basename(fname,ext)+"_src"+ext;
    fs.writeFileSync(source, encryptedCode,encoding);
    return encryptedCode.toString(encoding);
}
function decryptCode(code) {
    var encrypted = new Buffer(code.length);
    for (var i = 0; i < code.length; i++) {
        var ch = code[i];
        if (ch >= 0x100) {
            throw new Error("input code should be a byte array (not unicode)");
        }
        encrypted[i] = ch ^ 0x55;
    }
    return encrypted;
}
exports.decryptJS=decryptJS;
exports.decryptCode=decryptCode;