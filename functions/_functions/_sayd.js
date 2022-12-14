const say = async ({client, param, answer}) => {
    var quoted = param?.messages[0]?.quoted? param.messages[0].quoted : param.messages[0]
    return await client.sendMessage(
        param.messages[0].key.remoteJid, {
            text: answer,
            contextInfo: {
                mentionedJid: [param.messages[0].key.remoteJid]
            }
        },
        {
            quoted: quoted
        }
    )
}

module.exports = { say }