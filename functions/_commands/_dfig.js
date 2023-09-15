import {
    downloadContentFromMessage,
    sendReaction,
    sendMessageQuoted,
    sendCaptionImageTyping,
    Spam,
    unlinkSync,
    Config,
    writeFile
} from '../../exports.js'

const getRandom = (v) => {
return `${Math.floor(Math.random() * 10000)}${v}`;
};

export const GetImage = async ({
        message: typed,
        Jid: remoteJid,
        cc: client
    }) => {

    const {
        details: [
        {
            messageContent: { stickerMessage: sticker },
            messageQuoted = {}
        } = {}
        ] = []
    } = typed || {};

    const { quotedMessage: { stickerMessage: qsticker } = {} } = messageQuoted || {};

    let isSticker = sticker || qsticker;

    if (!isSticker)
    return await sendMessageQuoted({
        client: client,
        param: typed,
        answer: "Cade a figurinha?"
    });

    const INimage = getRandom(".webp");

    var buffer = Buffer.from([]);
    for await (const chunk of await downloadContentFromMessage(isSticker, 'sticker')) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    writeFile(INimage, buffer, async function (err) {
        if (err) {
            await sendMessageQuoted({
                client: client,
                param: typed,
                answer: "Erro ao extrair a imagem da figurinha."
            });
            await sendReaction({
                client: client,
                param: typed,
                answer: Config.parameters.commands[0].execution[0].onerror
            }).then(() => Spam(remoteJid));
                
            unlinkSync(INimage);

            return;
        }
        
        await sendCaptionImageTyping({
            client: client,
            param: typed,
            answer: 'Imagem extraida!',
            path_image: INimage
        })
        await sendReaction({
            client: client,
            param: typed,
            answer: Config.parameters.commands[0].execution[0].onsucess
        }).then(() => Spam(remoteJid));
    
        unlinkSync(INimage);

        return
    });
};
