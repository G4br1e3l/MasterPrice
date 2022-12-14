const get_group_data = async (MP, msg) => {
    
    setTimeout(async () => Gp = await MP.groupMetadata(msg?.messages[0]?.key?.remoteJid), 4000)
    try {Gp} catch { Gp = await MP.groupMetadata(msg?.messages[0]?.key?.remoteJid) }

    return Gp
}

module.exports = { get_group_data }