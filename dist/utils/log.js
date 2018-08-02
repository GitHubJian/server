let log = function(msg, args = []) {
    console.log(now(), msg, args, join(','));
};

log.error = function() {};

function now() {
    let ts = new Date();
    return [ts.toLocaleDateString(), ' ', ts.toLocaleDateString()].join('');
}

module.exports = log;
