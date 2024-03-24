const {program} = require('commander');
const genConfig = require('./src/utils/genConfig');
const backup = require('./src/backup');

program
    .command('gen-config')
    .argument('[name]', '配置名称')
    .description('生成配置文件')
    .option('-n, --name <string>', '配置名称')
    .action(async (name, options) => {
        name = options.name || name
        await genConfig({
            name,
        })
    })

program
    .command('backup')
    .description('备份运行')
    .argument('[name]', '配置名称')
    .action(async (name) => {
        await backup({
            name
        })
    })

program.parse()