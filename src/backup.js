const path = require('path')
const {globSync} = require('glob')
const mysqldump = require('mysqldump')
const log = require('./utils/log');

const backup = async ({name}) => {
    name = name || '*'
    const configDir = path.resolve(__dirname, '../config')
    const files = globSync(`${name}.js`, {
        cwd: configDir,
        absolute: true
    })
    if (!files.length) {
        log.warn('无备份配置文件')
        return
    }

    log.start('开始备份')

    for (let file of files) {
        log.info('正在备份 ' + file.split(path.sep).at(-1).replace('.js', ''))
        const config = require(file)
        try {
            await backupByConfig(file.split(path.sep).at(-1).replace('.js', ''), config)
        } catch (e) {
            log.error('配置文件 ' + file.split(path.sep).at(-1) + ' 备份失败 ' + e)
        }
    }
    log.success('全部备份完成')
}


const backupByConfig = async (name, config) => {
    if (!config.connection) {
        throw new Error('缺少数据库配置 connection')
    }
    if (!config.storage) {
        throw new Error('缺少存储配置 storage')
    }

    const sql = await dumpDatabaseToSql(config.connection)

    await saveToStorage(config.storage, name, sql)

    log.success('备份成功 ' + name)
}

const dumpDatabaseToSql = async (connection) => {
    switch (connection.type) {
        case 'mysql':
            const dump = await mysqldump({
                host: connection.host,
                port: connection.port,
                user: connection.user,
                password: connection.password,
                database: connection.database,
            })
            return dump.dump.schema
        default:
            throw new Error('暂时不支持 ' + connection.type + ' 类型的数据库')
    }
}

const saveToStorage = async (storage, name, sql) => {
    const date = new Date()
    const filename = name + '_' + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + '.sql'

    switch (storage.type) {
        case 'oss':
            const OSS = require('ali-oss')
            const client = new OSS({
                region: storage.region,
                accessKeyId: storage.accessKeyId,
                accessKeySecret: storage.accessKeySecret,
                bucket: storage.bucket,
            })
            await client.put(storage.prefix.replace(/\/$/, '') + '/' + filename, Buffer.from(sql))
            break
        default:
            throw new Error('暂时不支持 ' + storage.type + ' 类型的存储')
    }
}

module.exports = backup