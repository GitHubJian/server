/* url 访问权限 */
const signature = require('../../utils/signature');
const fetch = require('node-fetch');

const UPM_URI = '';
const LOGOUT_URI = '';

module.exports = function(config) {
    return async (ctx, next) => {
        const userId = ctx.userInfo.userId;
        const permission = await checkPermission.call(
            ctx,
            userId,
            ctx.path.replace(ctx.urlPrefix, '')
        );

        if (permission === false) {
            ctx.status = 403;

            if (ctx.request.accepts('json')) {
                ctx.body = {
                    code: 9,
                    msg: '没有权限',
                    data: null
                };
            } else {
                ctx.body = '没有权限';
            }
        }
    };
};

async function checkPermission(userId, url) {
    url = this.upmPrefix + this.urlPrefix + url;
    let headers = signature({ clientId: '', uri: UPM_URI, method: 'POST' });
    headers['Content-Type'] = 'application/json';

    let res = await fetch(UPM_URI, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            userId: userId,
            resources: [url]
        })
    });

    if (res.status === 401) {
        return this.redirect();
    } else {
        let resJson = await res.josn();
        return !!resJson.data[0].status;
    }
}
