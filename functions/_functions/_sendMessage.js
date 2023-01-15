
//
export const sendCaptionImageQuoted = async ({ client, param, answer, path_image }) => {
    return await client.sendMessage(
        param.details[0].messageJid, {
            image: readFileSync(path_image),
            caption: answer,
            contextInfo: {
                mentionedJid: [param.details[0].messageJid]
            }
        },
        {
            quoted: param.details[0].messageQuoted
        }
    )
}

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

//
export const sendCaptionImageTypingQuoted = async ({ client, param, answer, path_image }) => {
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
                            {
                                quoted: param.details[0].messageQuoted
                            }
                        )
                    })
                })
            })
        })
    })
}

//
export const sendMessageQuoted = async ({ client, param, answer }) => {
    return await client.sendMessage(
        param.details[0].messageJid, {
            text: answer,
            fromMe: false,
            contextInfo: {
                mentionedJid: [param.details[0].messageJid]
            }
        },
        {
            quoted: param.details[0].messageQuoted
        }
    )
}

//
export const sendMessage = async ({ client, param, answer }) => {
    return await client.sendMessage(
        param.details[0].messageJid, {
            text: answer,
            contextInfo: {
                mentionedJid: [param.details[0].messageJid]
            }
        },
    )
}

//
export const sendMessageTyping = async ({ client, param, answer }) => {
    await client.presenceSubscribe(param.details[0].messageJid).then( async () => {
        await Delay(2000).then( async () =>{
            await client.sendPresenceUpdate('composing', param.details[0].messageJid).then( async () => {
                await Delay(500).then( async ()=> {
                    await client.sendPresenceUpdate('paused', param.details[0].messageJid).then( async () => {
                        return await client.sendMessage(
                            param.details[0].messageJid, {
                                text: answer,
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

//
export const sendMessageTypingQuoted = async ({ client, param, answer }) => {
    await client.presenceSubscribe(param.details[0].messageJid).then( async () => {
        await Delay(2000).then( async () =>{
            await client.sendPresenceUpdate('composing', param.details[0].messageJid).then( async () => {
                await Delay(500).then( async ()=> {
                    await client.sendPresenceUpdate('paused', param.details[0].messageJid).then( async () => {
                        return await client.sendMessage(
                            param.details[0].messageJid, {
                                text: answer,
                                contextInfo: {
                                    mentionedJid: [param.details[0].messageJid]
                                }
                            },
                            {
                                quoted: param.details[0].messageQuoted
                            }
                        )
                    })
                })
            })
        })
    })
}

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

//
export const sendReaction = async ({ client, param, answer }) => {
    return await client.sendMessage(
        param.details[0].messageJid, {
            react: {
                key: {
                    remoteJid: param.details[0].messageJid,
                    fromMe: false,
                    id: param.details[0].messageId,
                    participant: [`${param.details[1].sender.messageNumber}@s.whatsapp.net`]
                },
                text: answer,
            }
        }
    )
}