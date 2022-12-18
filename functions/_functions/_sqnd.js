import { readFileSync } from "fs"

export const sendCaptionImage = async ({client, param, answer, path_image}) => {
    return await client.sendMessage(
        param.messages[0].key.remoteJid, {
            image: readFileSync(path_image),
            caption: answer,
            contextInfo: {
                mentionedJid: [param.messages[0].key.remoteJid]
            }
        },
    )
}
