
var sa = require('superagent');
var device = require('../utils/device');
var sig = require('../utils/sig');
var userDao  = require('../lib/dao');

exports.start =  function() {
    var page = 8527;
    _start(page);
}

function _start(page) {
    console.log('start page : ' + page);
    getUsers(0, 0, page, function (err) {
        if(err) return;
        page ++;
        _start(page);
    })
}

//城市, 角色
//city: 0 全部
function getUsers(city, role, page, callback) {

    var host = 'http://service.ycpai.com';
    var path = '/project/find_project_partner';

    var dict = {
        'city_id':0,
        'industry':'0',
        'version':'634',
        'page':page,
        'platform':'1',
        'role_type':role,
        'sort':'1',
        'state_id':city,
        'user_id':'427553',
        'login_code':'7da5bd571ecd8d3ae4fc012a5d765ed7'
        };
    dict['sign'] = sig.sig(dict);;

    sa.get(host + path)
        .query(dict)
        .set('Accept-Encoding',device.acceptEncoding())
        .set('platform',1)
        .set('User-Agent', '')
        .end(function (err, res) {
            if (err){
                console.log(err);
                callback(err);
                return;
            }
            var errno = res.body.status;
            if (errno !== 1){
                console.log('api failed: errmsg=' + res.body.msg);
                callback(null);
                return;
            }

            var data = res.body.data;
            _saveUsers(data);

            if(data.length !== 10){
                console.log('no more data!!!');
                return;
            }

            if(callback){
                var sec = device.getRandomInt(0,60);
                setTimeout(callback(null), sec);
            }
        });
}

function _saveUsers(data) {
    if (!data || typeof data !== 'object') return;
    console.log("insert users to db");
    userDao.addUsers(data);
}



