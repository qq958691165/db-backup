const path = require('path')
const {globSync} = require('glob')
const databaseMap = require('./database')
const storageMap = require('./storage')
const log = require('./utils/log');
const dayjs = require("dayjs");

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
    log.success('全部运行完成')
}


const backupByConfig = async (name, config) => {
    if (!config.connection) {
        throw new Error('缺少数据库配置 connection')
    }
    if (!config.storage) {
        throw new Error('缺少存储配置 storage')
    }

    const sql = await dumpDatabaseToSql({
        config: config.connection
    })
    await saveToStorage({
        config: config.storage,
        name,
        data: sql,
    })
    log.success('备份成功 ' + name)
}

const dumpDatabaseToSql = async ({config}) => {
    if (!databaseMap[config.type]) {
        throw new Error('暂时不支持 ' + config.type + ' 类型的数据库')
    }
    return await databaseMap[config.type].dump({config})
}

const saveToStorage = async ({config, name, data}) => {
    const filename = name + '_' + dayjs().format('YYYYMMDDHHmmss') + '.sql'

    if (!storageMap[config.type]) {
        throw new Error('暂时不支持 ' + config.type + ' 类型的存储')
    }

    await storageMap[config.type].save({
        config,
        filename,
        data
    })
}

module.exports = backup