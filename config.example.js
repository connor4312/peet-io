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

exports.blog = [
    { title: 'Write APIs You Want to Use', date: '18 Sept', link: 'https://medium.com/@ConnorPeet/write-apis-you-want-to-use-44fedb805823' },
];
