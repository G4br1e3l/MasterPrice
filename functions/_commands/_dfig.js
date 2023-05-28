import { writeFile, readFileSync, unlinkSync } from "fs";

import { downloadContentFromMessage } from "@adiwajshing/baileys";

import { Spam } from "../_functions/_functionsMessage.js";
import { sendReaction, sendMessageQuoted, sendCaptionImageTyping } from "../_functions/_sendMessage.js";

const getRandom = (v) => {
return `${Math.floor(Math.random() * 10000)}${v}`;
};

export const GetImage = async ({
        message: typed,
        Jid: remoteJid,
        cc: client
    }) => {

    var Config = JSON.parse(readFileSync("./root/configurations.json", "utf8"));

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
