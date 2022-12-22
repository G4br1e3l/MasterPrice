//
import { Key } from './_dlay.js'

//
export const sendReaction = async ({ client, param, answer }) => {

    const Message = Key(param.messages[0])

    const number_user = Message.participant ?? Message.remoteJid ?? ''

    return await client.sendMessage(
        Message.remoteJid, {
            react: {
                key: {
                    remoteJid: Message.remoteJid,
                    fromMe: false,
                    id: Message.id,
                    participant: number_user
                },
                text: answer,
            }
        }
    )
}