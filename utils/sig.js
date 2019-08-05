/**
 * Created by ranwenjie on 17/3/10.
 */

var utils = require('utility');

/*校验相关*/
exports.sig = function (dict) {
    var salt = "498eab23-86b6-432f-8436-5cc96afba9b9^&*@#$";

    var str = '';
    Object.keys(dict).sort().forEach(function (key) {
        var value = dict[key];
        if (str.length > 0){
            str += '&';
        }
        str += (key + '=' + value)
    });

    var md5 = utils.md5(str + salt);
    return md5.substr(4, 20);
};
