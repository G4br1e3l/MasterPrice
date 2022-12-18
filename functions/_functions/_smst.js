import { delay, fdelay } from './_dlay.js'
export const sendMessageTyping = async ({client, param, answer}) => {
    await client.presenceSubscribe(param.messages[0].key.remoteJid).then( async () => {
        await fdelay().then( async () =>{
            await client.sendPresenceUpdate('composing', param.messages[0].key.remoteJid).then( async () => {
                await delay().then( async ()=> {
                    await client.sendPresenceUpdate('paused', param.messages[0].key.remoteJid).then( async () => {
                        return await client.sendMessage(
                            param.messages[0].key.remoteJid, {
                                text: answer,
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