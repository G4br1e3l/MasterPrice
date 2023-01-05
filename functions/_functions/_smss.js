//
export const sendMessage = async ({ client, param, answer }) => {

    return await client.sendMessage(
        param.details[0].messageJid, {
            text: answer,
            contextInfo: {
                mentionedJid: [param.details[0].messageJid]
            }
        },
    )
}
