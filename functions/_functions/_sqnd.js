//
import { readFileSync } from "fs"

//
export const sendCaptionImage = async ({ client, param, answer, path_image }) => {

    return await client.sendMessage(
        param.details[0].messageJid, {
            image: readFileSync(path_image),
            caption: answer,
            contextInfo: {
                mentionedJid: [param.details[0].messageJid]
            }
        },
    )
}
