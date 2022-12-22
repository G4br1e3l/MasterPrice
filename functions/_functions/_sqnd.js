//
import { readFileSync } from "fs"
import { Key } from './_dlay.js'

//
export const sendCaptionImage = async ({ client, param, answer, path_image }) => {

    const Message = Key(param.messages[0])

    return await client.sendMessage(
        Message.remoteJid, {
            image: readFileSync(path_image),
            caption: answer,
            contextInfo: {
                mentionedJid: [Message.remoteJid]
            }
        },
    )
}
