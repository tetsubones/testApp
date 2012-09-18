/**
 * Created with JetBrains PhpStorm.
 * User: SCI01388
 * Date: 12/09/18
 * Time: 16:21
 * To change this template use File | Settings | File Templates.
 */
$(function(){
var setScopes = 'email,user_likes,read_friendlists,publish_stream';
var checkScopes = 'read_friendlists,publish_stream';

//ログイン有無・アプリ認証の有無の確認
function checkLoginStatus(opt) {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            console.log('ログイン済み認証あり：'+response.status);

            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;

            //ログイン＋認証あり　ならパーミッションの有無確認
            FB.api('/me/permissions', function(perms_response) {
                var hasPerm = true;
                var scopeList = checkScopes.split(',');
                var permData = perms_response['data'] ? perms_response['data'][0] : null;

                //必要なパーミッションを確認
                if(permData === null){
                    hasPerm = false;
                } else {
                    $.map(scopeList,function(j){
                        if(!permData[j]) {
                            hasPerm = false;
                            console.log('パーミッションがありません：' + j);
                        }
                    });
                };

                if(hasPerm) {
                    postWall();
                } else {
                    opt.callback();
                }
            })
        }
        //FBログイン済み、アプリ認証なし
        else if (response.status === 'not_authorized') {
            console.log('ログイン済み認証なし：' + response.status);
            opt.callback();
        }
        //FBログインなし
        else {
            console.log('ログインしてない：' + response.status);
            opt.callback();
        }
    })
}


function login() {
    FB.login(function(){
          checkLoginStatus({ callback : doNothing });
    }, { scope : setScopes })
}

function postWall() {
    console.log('ウォールに投稿');
}
function doNothing() {
    console.log('なにもしない');
}
function logout(){
    FB.logout(function(){
        console.log('logout');
    })
}
//初期化
function init() {

    //とりあいずの画面遷移
    $('#view').html($('#start').html());
    $('#logoutButton button').click(function(){
        logout();
    });

    $(window).bind('keypress',function(e){
        if(e.keyCode === 49) {
            checkLoginStatus({ callback : login });
        } else if(e.keyCode === 50){
            $('#view').html($('#cb').html())
        }
    });
}
init();

})
