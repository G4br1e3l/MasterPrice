//
import { Key } from './_dlay.js'

//
export const sendMessageQuoted = async ({ client, param, answer }) => {

    const a = param.messages[0]
    
    const Message = Key(a)

    return await client.sendMessage(
        Message.remoteJid, {
            text: answer,
            contextInfo: {
                mentionedJid: [Message.remoteJid]
            }
        },
        {
            quoted: a.quoted ?? a ?? null
        }
    )
}
 