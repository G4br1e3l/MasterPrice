import {
    downloadContentFromMessage,
    sendReaction,
    sendMessageQuoted,
    sendCaptionImage,
    Spam,
    unlinkSync,
    Config,
    getRandom,
    writeFile
} from '../../exports.js'

const mensagens = [
    "Não foi possível extrair essa figurinha, por favor, tente novamente. @emoji",
    "Tente novamente, não consegui extrair esta figurinha. @emoji",
    "Desculpe, não consegui pegar essa figurinha, tente mais uma vez. @emoji",
    "A extração da figurinha falhou, por favor, tente novamente. @emoji",
    "Esta figurinha está difícil de pegar, tente outra vez. @emoji",
    "Não consegui extrair a figurinha, por favor, tente novamente. @emoji",
    "Tente novamente, a extração da figurinha falhou. @emoji",
    "Desculpe, não foi possível pegar esta figurinha, tente mais uma vez. @emoji",
    "A figurinha não pôde ser extraída, por favor, tente novamente. @emoji",
    "Esta figurinha está teimosa, tente outra vez. @emoji",
    "Não consegui pegar essa figurinha, tente novamente. @emoji",
    "Tente novamente, não consegui extrair esta figurinha. @emoji",
    "Desculpe, não consegui pegar essa figurinha, tente mais uma vez. @emoji",
    "A extração da figurinha falhou, por favor, tente novamente. @emoji",
    "Esta figurinha está difícil de pegar, tente outra vez. @emoji",
    "Não consegui extrair a figurinha, por favor, tente novamente. @emoji",
    "Tente novamente, a extração da figurinha falhou. @emoji",
    "Desculpe, não foi possível pegar esta figurinha, tente mais uma vez. @emoji",
    "A figurinha não pôde ser extraída, por favor, tente novamente. @emoji",
    "Esta figurinha está teimosa, tente outra vez. @emoji",
    "Não consegui pegar essa figurinha, tente novamente. @emoji",
    "Tente novamente, não consegui extrair esta figurinha. @emoji",
    "Desculpe, não consegui pegar essa figurinha, tente mais uma vez. @emoji",
    "A extração da figurinha falhou, por favor, tente novamente. @emoji",
    "Esta figurinha está difícil de pegar, tente outra vez. @emoji",
    "Não consegui extrair a figurinha, por favor, tente novamente. @emoji",
    "Tente novamente, a extração da figurinha falhou. @emoji",
    "Desculpe, não foi possível pegar esta figurinha, tente mais uma vez. @emoji",
    "A figurinha não pôde ser extraída, por favor, tente novamente. @emoji",
    "Esta figurinha está teimosa, tente outra vez. @emoji",
];

const emojis = [
    "😕",
    "🔄",
    "🤖",
    "❌",
    "🙁",
    "👾",
    "🚫",
    "😞",
    "👀",
    "🔴",
];

const frasesDeSucesso = [
    "Operação concluída com êxito! @emoji",
    "Tarefa realizada com sucesso! @emoji",
    "Feito! Imagem extraída com sucesso! @emoji",
    "Missão cumprida! Imagem extraída com sucesso! @emoji",
    "Excelente trabalho! Imagem extraída! @emoji",
    "Conquista desbloqueada: Imagem extraída! @emoji",
    "Sucesso total! A imagem foi extraída! @emoji",
    "Você conseguiu! Imagem extraída com êxito! @emoji",
    "Mais uma vitória! Imagem extraída! @emoji",
    "Estamos no caminho certo! Imagem extraída! @emoji",
    "Nada nos para! Imagem extraída! @emoji",
    "Bravo! Imagem extraída com sucesso! @emoji",
    "Objetivo alcançado! Imagem extraída! @emoji",
    "Incrível! Imagem extraída com êxito! @emoji",
    "Feito e feito! Imagem extraída! @emoji",
    "Resultado positivo: Imagem extraída! @emoji",
    "Estamos indo bem! Imagem extraída! @emoji",
    "Boa jogada! Imagem extraída com sucesso! @emoji",
    "Belo trabalho! Imagem extraída! @emoji",
    "Vitória merecida! Imagem extraída! @emoji",
    "Estamos no topo! Imagem extraída! @emoji",
    "Missão realizada! Imagem extraída! @emoji",
    "Sucesso absoluto! Imagem extraída! @emoji",
    "Você é incrível! Imagem extraída! @emoji",
    "Tudo certo! Imagem extraída com sucesso! @emoji",
    "Conquista desbloqueada: Imagem extraída! @emoji",
    "Realização impressionante! Imagem extraída! @emoji",
    "Felicitações! Imagem extraída com êxito! @emoji",
    "Realização impecável: Imagem extraída! @emoji",
    "Concluído! Imagem extraída com sucesso! @emoji"
];

const emojisDeSucesso = [
    "🎉",
    "👍",
    "✨",
    "🏆",
    "😊",
    "🚀",
    "🌟",
    "💪",
    "🏅",
    "🌈",
    "🎊",
    "🌠",
    "🌆",
    "🎯",
    "🙌",
    "🌄",
    "☀️",
    "📸",
    "🃏",
    "🌻",
    "🏰",
    "🌴",
    "🌊",
    "💖",
    "💫",
    "🎈",
    "🍾",
    "🎁",
    "🎶", 
    "🥳",
];

const figs = [
    "Marque uma figurinha!",
    "Gostaria de ver uma figurinha, por favor marque-a.",
    "Vamos dar uma olhada na figurinha, marque-a.",
    "Por favor, mostre-me a figurinha. Marque-a!",
    "Quero ver a figurinha, por favor marque-a.",
    "Marque a figurinha para que eu possa vê-la.",
    "Estou ansioso para ver a figurinha, por favor marque-a.",
    "Vamos dar uma olhada na figurinha, marque-a para mim.",
    "Por favor, marque a figurinha que você quer compartilhar.",
    "Marque a figurinha para que eu possa apreciá-la.",
    "Quero ver a figurinha, por favor marque-a para mim.",
    "Gostaria de dar uma olhada na figurinha. Marque-a, por favor.",
    "Marque a figurinha que você deseja compartilhar.",
    "Marque a figurinha para que eu possa visualizá-la.",
    "Estou curioso para ver a figurinha, por favor marque-a.",
    "Por favor, marque a figurinha que você gostaria de mostrar.",
    "Vamos lá, marque a figurinha!",
    "Quero ver a figurinha, por favor marque-a para mim.",
    "Por favor, marque a figurinha que deseja compartilhar.",
    "Marque a figurinha para que eu possa apreciá-la.",
    "Marque a figurinha e mostre-me.",
    "Gostaria de ver a figurinha, por favor marque-a.",
    "Marque a figurinha para que eu possa apreciá-la.",
    "Por favor, marque a figurinha que você quer compartilhar.",
    "Estou ansioso para ver a figurinha, por favor marque-a.",
    "Vamos dar uma olhada na figurinha, marque-a para mim.",
    "Marque a figurinha que deseja mostrar.",
    "Por favor, marque a figurinha que você gostaria de compartilhar.",
    "Quero ver a figurinha, por favor marque-a para mim.",
    "Marque a figurinha para que eu possa visualizá-la.",
    "Gostaria de dar uma olhada na figurinha. Marque-a, por favor.",
];

const GetImage = async ({ client, mStick, qStick, mJid, mAll }) => {

    try {

        const isSticker = (Object.keys(mStick).length) === 0? qStick : mStick
        if (!isSticker) return await sendMessageQuoted({ Cliente: client, ClienteJid: mJid, ClienteTopo: mAll, ClienteResposta: (figs[Math.floor(Math.random() * figs.length)]) });

        const INimage = getRandom(".webp");
        var buffer = Buffer.from([]);
        for await (const chunk of await downloadContentFromMessage(isSticker, 'sticker')) { buffer = Buffer.concat([buffer, chunk]); }

        writeFile(INimage, buffer, async function (err) {
            if (err) {
                await sendMessageQuoted({ Cliente: client, ClienteJid: mJid, ClienteTopo: mAll, ClienteResposta: (mensagens[Math.floor(Math.random() * mensagens.length)]).replaceAll("@emoji", emojis[Math.floor(Math.random() * emojis.length)]) });
                Spam(mJid);
                unlinkSync(INimage);
                return;
            }
            await sendCaptionImage({ Cliente: client, ClienteJid: mJid, ClienteResposta: (frasesDeSucesso[Math.floor(Math.random() * frasesDeSucesso.length)]).replaceAll("@emoji", emojisDeSucesso[Math.floor(Math.random() * emojisDeSucesso.length)]), CaminhoImagem: INimage})
            Spam(mJid);
            unlinkSync(INimage);
            return
        });

    } catch {
        await sendMessageQuoted({ Cliente: client, ClienteJid: mJid, ClienteTopo: mAll, ClienteResposta: (mensagens[Math.floor(Math.random() * mensagens.length)]).replaceAll("@emoji", emojis[Math.floor(Math.random() * emojis.length)]) });
        Spam(mJid);
        unlinkSync(INimage);
        return;
    }
};

export {
    GetImage
};
  