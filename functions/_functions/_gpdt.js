export const get_group_data = async (MP, msg) => {
    let Gp = ``
    setTimeout(async () => Gp = await MP.groupMetadata(msg?.messages[0]?.key?.remoteJid), 6000)
    if(Gp === ``) Gp = await MP.groupMetadata(msg?.messages[0]?.key?.remoteJid ?? 'undefined')
    setInterval(() => { Gp = `` }, 10_000)
    return Gp
}
