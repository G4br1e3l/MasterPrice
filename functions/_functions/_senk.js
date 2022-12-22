//
import { readFileSync } from "fs"
import { Delay, Key } from './_dlay.js'

//
export const sendCaptionImageTyping = async ({ client, param, answer, path_image }) => {

    const Message = Key(param.messages[0])

    await client.presenceSubscribe(Message.remoteJid).then( async () => {
        await Delay(2000).then( async () =>{
            await client.sendPresenceUpdate('composing', Message.remoteJid).then( async () => {
                await Delay(500).then( async ()=> {
                    await client.sendPresenceUpdate('paused', Message.remoteJid).then( async () => {
                        return await client.sendMessage(
                            Message.remoteJid, {
                                image: readFileSync(path_image),
                                caption: answer,
                                contextInfo: {
                                    mentionedJid: [Message.remoteJid]
                                }
                            },
                        )
                    })
                })
            })
        })
    })
    
}
 