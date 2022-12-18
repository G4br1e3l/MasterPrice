import { readFileSync } from "fs"

export const sendCaptionImageQuoted = async ({client, param, answer, path_image}) => {
    var quoted = param?.messages[0]?.quoted? param.messages[0].quoted : param.messages[0]

    return await client.sendMessage(
        param.messages[0].key.remoteJid, {
            image: readFileSync(path_image),
            caption: answer,
            contextInfo: {
                mentionedJid: [param.messages[0].key.remoteJid]
            }
        },
        {
            quoted: quoted
        }
    )
}
