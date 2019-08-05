/**
 * Created by ranwenjie on 17/3/10.
 */

var sig = require('../utils/sig');

function testSig() {
    var dict = {
        'platform':'1',
        'version':'634',
        'user_id':'427553',
        'login_code':'7da5bd571ecd8d3ae4fc012a5d765ed7'
    };

    console.log('sig: ' + sig.sig(dict));
}

testSig();