import { readFileSync } from "fs"
import { delay, fdelay } from './_dlay.js'
export const sendCaptionImageTyping = async ({client, param, answer, path_image}) => {
    await client.presenceSubscribe(param.messages[0].key.remoteJid).then( async () => {
        await fdelay().then( async () =>{
            await client.sendPresenceUpdate('composing', param.messages[0].key.remoteJid).then( async () => {
                await delay().then( async ()=> {
                    await client.sendPresenceUpdate('paused', param.messages[0].key.remoteJid).then( async () => {
                        return await client.sendMessage(
                            param.messages[0].key.remoteJid, {
                                image: readFileSync(path_image),
                                caption: answer,
                                contextInfo: {
                                    mentionedJid: [param.messages[0].key.remoteJid]
                                }
                            },
                        )
                    })
                })
            })
        })
    })
    
}
 