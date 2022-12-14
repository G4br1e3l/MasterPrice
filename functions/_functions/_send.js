import { readFileSync } from "fs"

export const send = async ({client, param, answer, path_image}) => {
    var quoted = param?.messages[0]?.quoted? param.messages[0].quoted : param.messages[0]

    return await client.sendMessage(
        param.messages[0].key.remoteJid, {
            image: readFileSync(path_image),
            caption: answer
        },
        {
            quoted: quoted
        }
    )
}
