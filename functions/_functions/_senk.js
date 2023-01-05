//
import { readFileSync } from "fs"
import { Delay } from './_dlay.js'

//
export const sendCaptionImageTyping = async ({ client, param, answer, path_image }) => {

    await client.presenceSubscribe(param.details[0].messageJid).then( async () => {
        await Delay(2000).then( async () =>{
            await client.sendPresenceUpdate('composing', param.details[0].messageJid).then( async () => {
                await Delay(500).then( async ()=> {
                    await client.sendPresenceUpdate('paused', param.details[0].messageJid).then( async () => {
                        return await client.sendMessage(
                            param.details[0].messageJid, {
                                image: readFileSync(path_image),
                                caption: answer,
                                contextInfo: {
                                    mentionedJid: [param.details[0].messageJid]
                                }
                            },
                        )
                    })
                })
            })
        })
    })
    
}
 