var exec = require("cordova/exec");

function TestModel() {};

TestModel.prototype.appshakemethod = function (success,fail,option) {
     exec(success, fail, 'ShakeActionPlugin', 'ShakeAction', option);
};

var testModel = new TestModel();
module.exports = testModel;
