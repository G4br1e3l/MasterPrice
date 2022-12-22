//
import { readFileSync } from "fs"
import { Key } from './_dlay.js'

//
export const sendCaptionImageQuoted = async ({ client, param, answer, path_image }) => {

    const a = param.messages[0]

    const Message = Key(a)

    return await client.sendMessage(
        Message.remoteJid, {
            image: readFileSync(path_image),
            caption: answer,
            contextInfo: {
                mentionedJid: [Message.remoteJid]
            }
        },
        {
            quoted: a.quoted ?? a ?? null
        }
    )
}
