import { delay, fdelay } from './_dlay.js'
export const sendMessageTypingQuoted = async ({client, param, answer}) => {
    var quoted = param?.messages[0]?.quoted? param.messages[0].quoted : param.messages[0]
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
                            {
                                quoted: quoted
                            }
                        )
                    })
                })
            })
        })
    })
}