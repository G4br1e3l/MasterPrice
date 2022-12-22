//
import { Delay, Key } from './_dlay.js'

//
export const sendMessageTyping = async ({ client, param, answer }) => {

    const Message = Key(param.messages[0])

    await client.presenceSubscribe(Message.remoteJid).then( async () => {
        await Delay(2000).then( async () =>{
            await client.sendPresenceUpdate('composing', Message.remoteJid).then( async () => {
                await Delay(500).then( async ()=> {
                    await client.sendPresenceUpdate('paused', Message.remoteJid).then( async () => {
                        return await client.sendMessage(
                            Message.remoteJid, {
                                text: answer,
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