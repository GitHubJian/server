const format = (date, format = 'yyyy-MM-dd HH:mm:ss') => {
    const dt = new Date(+date);
    const pad = s => `0${s}`.slice(-2);

    const parse = {
        MM: dt.getMonth() + 1,
        dd: dt.getDate(),
        HH: dt.getHours(),
        mm: dt.getMinutes(),
        ss: dt.getSeconds()
    };

    Object.keys(parse).forEach(v => (parse[v] = pad(parse[v])));
    parse.yyyy = dt.getFullYear();

    return Object.entries(parse).reduce((prev, [k, v]) => {
        prev = prev.replace(k, v);
        return prev;
    }, format);
};

module.exports = {
    format
};
