
//
export const sendMessageQuoted = async ({ client, param, answer }) => {

    return await client.sendMessage(
        param.details[0].messageJid, {
            text: answer,
            fromMe: false,
            contextInfo: {
                mentionedJid: [param.details[0].messageJid]
            }
        },
        {
            quoted: param.details[0].messageQuoted
        }
    )
}
 