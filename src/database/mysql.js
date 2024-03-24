const mysqldump = require("mysqldump");
const dump = async ({config}) => {
    const dump = await mysqldump({
        connection: {
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database,
        }
    })

    return dump.dump.schema
}

module.exports = {
    dump
}