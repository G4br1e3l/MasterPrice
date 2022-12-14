const react = async ({client, param, answer}) => {
        
    let number_user = param.messages[0].key.participant === undefined? param.messages[0].key.remoteJid : param.messages[0].key.participant
    let nbr1 = number_user.includes("@")? number_user.split("@")[0] : number_user
    let user2 = nbr1.includes(":")? nbr1.split(":")[0] : nbr1

    return await client.sendMessage(
        param.messages[0].key.remoteJid, {
            react: {
                key: {
                    remoteJid: param.messages[0].key.remoteJid,
                    fromMe: false,
                    id: param.messages[0].key.id,
                    participant: `${user2}@s.whatsapp.net`
                },
                text: answer,
                senderTimestampMs: { low: -12487820, high: 388, unsigned: false }
            }
        }
    )
}

module.exports = { react }