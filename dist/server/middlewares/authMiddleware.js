const fetch = require('node-fetch');
const signature = require('../../utils/signature');

const ssoApiHost = '';
const login_redirect_uri = '';
const logout_redirect_uri = '';
const COOKIE_TO_TOKEN = '';
const USER_TOKEN_STR = 'useid';

module.exports = function(config) {
    const { urlPrefix } = config;

    return async (ctx, next) => {
        let checkUrl = ctx.path;
        // 子系统中 Url Prefix
        if (checkUrl.indexOf(urlPrefix) === 0) {
            checkUrl = checkUrl.replace(urlPrefix, '');
        }
        // 登陆
        if (ctx.token) {
            return await next();
        }

        if (checkUrl === 'login') {
            return await login.call(ctx);
        }

        if (checkUrl === 'logout') {
            return await logout.call(ctx);
        }

        // 静态资源
        if (checkUrl.startsWith('/static/')) {
            return await next();
        }
        // 数据
        const token = getToken.call(ctx);
        let userData;
        if (token) {
            userData = await getUserInfo.call(ctx, token);
        }
        // token 不存在
        if (!token) {
            return setLoginMsg.call(ctx, '登录已退出，请重新登录');
        }
        // token 过期
        if (!userData) {
            setAuthInfo.call(ctx);
            return setLoginMsg.call(ctx, '登录过期，请重新登录');
        }

        // token 与 登录信息不一致
        if (ctx.cookies.get(USER_TOKEN_STR) !== userData.login) {
            setUserInfo.call(ctx, userData);
            return setLoginMsg.call(ctx, '登录信息有误，请刷新页面');
        }

        ctx.auth = userData || {};
        await next();
    };
};
// 登陆
function login() {
    return this.redirect(login_redirect_uri);
}
// 退出
function logout() {
    setAuthInfo.call(this, {
        access_token: '',
        expires: 0,
        refresh_expires: 0,
        refresh_token: ''
    });

    this.redirect(logout_redirect_uri);
}
// 获取token
function getToken() {
    return this.cookies.get(COOKIE_TO_TOKEN);
}
// 重新设置登录信息
function setLoginMsg(msg) {
    if (!this.accepts('html')) {
        this.status = 401;
        return (this.body = {
            code: 5,
            data: null,
            msg: msg
        });
    } else {
        return login.call(this);
    }
}
// 设置权限信息
function setAuthInfo({
    access_token = '',
    expires = 0,
    refresh_expires = 0,
    refresh_token = ''
} = {}) {
    this.cookies.set(COOKIE_TO_TOKEN, access_token, {
        maxAge: expires ? null : 0
    });
}
// 设置用户信息
function setUserInfo(userInfo) {
    this.cookies.set(USER_TOKEN_STR, userInfo.id, { httpOnly: false });
}

// 获取用户信息
async function getUserInfo(token) {
    let headers = signature({
        clientId: ''
    });
    let url = `${ssoApiHost}/auth/useinfo?token=${token}`;
    let res = await fetch(url, {
        headers: headers
    });
    let userJson = await res.json();

    if (userJson.code === 200) {
        return userJson.data;
    } else {
        this.status = 401;
    }
}
