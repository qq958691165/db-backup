const fs = require('fs');
const path = require('path');
const log = require('./utils/log');

const genConfig = async ({name}) => {
    if (!name) {
        log.error('缺少配置名称 [name]')
        return
    }

    fs.copyFileSync(path.resolve(__dirname, '../config-templete.js'), path.resolve(__dirname, `../config/${name}.js`))
}

module.exports = genConfig