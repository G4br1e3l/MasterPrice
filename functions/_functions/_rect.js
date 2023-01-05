//
export const sendReaction = async ({ client, param, answer }) => {
    
    return await client.sendMessage(
        param.details[0].messageJid, {
            react: {
                key: {
                    remoteJid: param.details[0].messageJid,
                    fromMe: false,
                    id: param.details[0].messageId,
                    participant: [`${param.details[1].sender.messageNumber}@s.whatsapp.net`]
                },
                text: answer,
            }
        }
    )
}