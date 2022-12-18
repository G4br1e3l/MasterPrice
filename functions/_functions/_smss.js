export const sendMessage = async ({client, param, answer}) => {
    return await client.sendMessage(
        param.messages[0].key.remoteJid, {
            text: answer,
            contextInfo: {
                mentionedJid: [param.messages[0].key.remoteJid]
            }
        },
    )
}
