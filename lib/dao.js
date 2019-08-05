
var mysql = require('mysql');
var conf = require('./mysql-conf');

var pool = mysql.createPool(conf.mysql);

exports.addUsers = function (users , callback) {
    if( !users || typeof users !== 'object') return;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log('getConnection err:'+ err );
            return;
        }
        connection.beginTransaction(function (err) {
            if(err) return;
            var length = users.length;
            for (var index = 0; index < length; index++){
                var user = users[index];
                if (typeof user !== 'object') continue;
                //如果用户已经存在,更新用户数据
                var sql = 'replace into user(user_id, name, role, role_name, avatar,city,tags, lastLogin, preAchieve) ' +
                    'values (?,?,?,?,?,?,?,?,?) ';
                var params = [
                    user.id,
                    user.name,
                    _roleType(user.role_type),
                    user.role_type,
                    user.imagepath,
                    user.local_name,
                    JSON.stringify(user.tags),
                    user.last_login,
                    user.pre_achieve
                    ];
                sql = mysql.format(sql, params);
                connection.query(sql, function (err, result, fields) {
                    if (err){
                        console.log('insert user err:'+ err );
                    }
                });
            }

            connection.commit(function (err) {
                if(err){
                    console.log('add users failed:' + err);
                }

                connection.release();
            })
        });

    })
}

function _roleType(name) {
    var dict = {
        '创始人': 1,
        '技术合伙人': 2,
        '营销合伙人': 3,
        '运营合伙人': 4,
        '设计合伙人': 5,
        '产品合伙人': 6,
        '其它合伙人': 7,
        '投资人': 10
    };

    return dict[name];
}
