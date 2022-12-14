const fs = require("fs")

const send = async ({client, param, answer, path_image}) => {
    var quoted = param?.messages[0]?.quoted? param.messages[0].quoted : param.messages[0]
    
    return await client.sendMessage(
        param.messages[0].key.remoteJid, {
            image: fs.readFileSync(path_image),
            caption: answer
        },
        {
            quoted: quoted
        }
    )
}

module.exports = { send }