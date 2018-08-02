'use strict';

let crypto = require('crypto');

module.exports = function(authInfo) {
    let dateStr =
        (authInfo.date && authInfo.date.toGMTString()) ||
        new Date().toGMTString();
    let string2Sign = authInfo.method + ' ' + authInfo.uri + '\n' + dateStr;
    let signature = crypto
        .createHmac('sha1', authInfo.clientSecret)
        .update(string2Sign)
        .digest('base64');
    let authorization = `TS ${authInfo.id}:${signature}`;

    return {
        Date: dateStr,
        Authorization: authorization
    };
};
