module.exports = {
    connection: {
        type: 'mysql',
        host: '[数据库地址]',
        port: 3306,
        user: '[数据库用户名]',
        password: '[数据库密码]',
        database: '[数据库名]'
    },
    storage: {
        type: 'oss',
        region: 'your region',
        accessKeyId: 'your accessKeyId',
        accessKeySecret: 'your accessKeySecret',
        bucket: 'your bucket',
        prefix: 'database-backup'
    }
}