module.exports = ~process.argv.indexOf('dev')
    ? require('./dev')
    : require('./main');
