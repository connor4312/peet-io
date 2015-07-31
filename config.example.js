exports.server = { host: '127.0.0.1', port: 3000 };

exports.mysql = {
    connectionLimit: 5,
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'blog'
};

exports.smtp = {
    host: '127.0.0.1',
    port: 2555,
    to: 'connor@peet.io'
};
