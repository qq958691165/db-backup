const OSS = require("ali-oss");
const save = async ({config, filename, data}) => {
    const OSS = require('ali-oss')
    const client = new OSS({
        region: config.region,
        accessKeyId: config.accessKeyId,
        accessKeySecret: config.accessKeySecret,
        bucket: config.bucket,
    })
    await client.put(config.prefix.replace(/\/$/, '') + '/' + filename, Buffer.from(data))
}

module.exports = {
    save
}