//
import { Key } from './_dlay.js'

//
export const sendMessage = async ({ client, param, answer }) => {

    const Message = Key(param.messages[0])

    return await client.sendMessage(
        Message.remoteJid, {
            text: answer,
            contextInfo: {
                mentionedJid: [Message.remoteJid]
            }
        },
    )
}
