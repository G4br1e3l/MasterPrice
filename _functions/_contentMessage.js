// Importa a função readFileSync do módulo fs
import { readFileSync } from "fs"

// Importa o módulo baileys do pacote @adiwajshing
import pkg from '@adiwajshing/baileys'
// Extrai a função getContentType do módulo baileys
const { getContentType } = pkg

// Importa o módulo linkifyjs
import pkg1 from 'linkifyjs'
// Extrai a função find do módulo linkifyjs
const { find } = pkg1

// Importa algumas funções de um arquivo chamado _functionsMessage.js
import {
    getGroupData,
    createdData,
    Audition,
    getMessageText,
    detectMessageStatus
} from './_functionsMessage.js'

// Importa o módulo node-emoji
import pkg2 from 'node-emoji'
// Extrai as funções unemojify e hasEmoji do módulo node-emoji
const { unemojify, hasEmoji } = pkg2

// Exporta uma função chamada Typed
export const Typed = async ({ events, client }) => {

    // Lê um arquivo JSON chamado configurations.json e o analisa para criar um objeto chamado Config
    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    // Extrai o objeto metadata do objeto Config
    const metadata = Config.parameters.metadata.store[0]
    // Extrai a propriedade remoteJid do objeto metadata
    const { remoteJid } = metadata

    // Extrai informações de um objeto events
    const Body = events['messages.upsert']?.messages[0] ?? ''
    const Events = Body?.messageStubType ?? ''
    const Key = Body?.key ?? ''
    const MessageType = getContentType(Body?.message?.viewOnceMessage?.message) ?? getContentType(Body?.message?.viewOnceMessageV2?.message) ?? getContentType(Body?.message) ?? ''
    const Message = Body?.message?.viewOnceMessage?.message ?? Body?.message?.viewOnceMessageV2?.message ?? Body?.message ?? ''

    // Verifica se a mensagem é inválida e retorna uma string se for
    if(detectMessageStatus({ Message: Message, MessageType: MessageType }) !== null) return 'Aiin calica!!'

    // Extrai o texto da mensagem com base no tipo de mensagem
    const Text = getMessageText({ MessageType: MessageType, Message: Message })

    // Cria um array com todos os contatos de grupo
    const _argas = [...new Set(Object.keys(remoteJid)?.flatMap(key => Object.keys(remoteJid[key])?.[0]))]
    // Verifica se a mensagem é de um grupo
    const isGroup = Key?.remoteJid?.endsWith('@g.us')

    // Define a variável usesMeta como falsa
    let usesMeta = false

    // Se a mensagem é de um grupo
    if (isGroup){
        // Encontra o índice do remoteJid no array _argas
        const argaIndex = _argas.indexOf(Key.remoteJid)
        // Se o índice for maior ou igual a 0, define a variável arga como o valor correspondente no objeto metadata
        const arga = argaIndex >= 0 ? metadata.remoteJid[argaIndex] : await createdData(Key, client)
        // Verifica se a expressão regular Key.remoteJid corresponde a algum valor em _argas, se sim, define usesMeta como arga, caso contrário, define usesMeta como false
        usesMeta = new RegExp(Key.remoteJid).test(_argas) ? arga : false
    }

    // Object Typed com uma propriedade msg que contém várias sub-propriedades:
    const Typed = {
        // A sub-propriedade key contém várias sub-propriedades boolean, parameters, etc.:
        msg: {
            key: {
                boolean:{
                    isBot: !!Key.fromMe ?? false,
                    isCommand: !!Text?.startsWith('!') ??  false,
                    isGroup: usesMeta? true : false,
                    isAdmin: usesMeta? !!getGroupData({ Type: 'isAdmin', groupMetadata: usesMeta, message: Key}) : false,
                    isBotAdmin: usesMeta? !!getGroupData({ Type: 'isBotAdmin', groupMetadata: usesMeta, message: Key}) : false,
                    isOwner: !!Config.parameters.bot[0].owners.includes((Key.participant ?? Key.remoteJid).split('@')[0]),
                    isQuoted: !!Message[MessageType]?.contextInfo?.quotedMessage ?? false,
                    message: [{
                        isPollMessage: Audition({ from: 'pollCreationMessage', where: MessageType }) || Audition({ from: 'pollUpdateMessage', where: MessageType }),
                        isListMessage: Audition({ from: 'listCreationMessage', where: MessageType }) || Audition({ from: 'listResponseMessage', where: MessageType }),
                        isDocMessage: Audition({ from: 'documentMessage', where: MessageType }) || Audition({ from: 'documentWithCaptionMessage', where: MessageType }),
                        isButtonMessage: Audition({ from: 'buttonsCreationMessage', where: MessageType }) || Audition({ from: 'buttonsResponseMessage', where: MessageType }),
                        isAudioMessage: Audition({ from: 'audioMessage', where: MessageType }),
                        isProductMessage: Audition({ from: 'productMessage', where: MessageType }),
                        isViewOnceMessage: !!(Body?.message?.viewOnceMessage ?? Body?.message?.viewOnceMessageV2?.message),
                        isVideoMessage: Audition({ from: 'videoMessage', where: MessageType }),
                        isContactMessage: Audition({ from: 'contactMessage', where: MessageType }),
                        isImageMessage: Audition({ from: 'imageMessage', where: MessageType }),
                        isStickerMessage: Audition({ from: 'stickerMessage', where: MessageType }),
                        isLocationMessage: Audition({ from: 'locationMessage', where: MessageType }),
                        isLiveLocationMessage: Audition({ from: 'liveLocationMessage', where: MessageType }),
                        isrequestPaymentMessage: Audition({ from: 'requestPaymentMessage', where: MessageType }) || Audition({ from: 'declinePaymentRequestMessage', where: MessageType }),
                        isReactionMessage: Audition({ from: 'reactionMessage', where: MessageType }),
                        isSymbolsMessage: hasEmoji([unemojify(Text)].join(' ')) || Audition({ from: Array.from(`☠️`).join('|'), where: Text }) || (/[^A-Za-z 0-9]/g).test(Text),
                        isQuotedMessage: !!Message[MessageType]?.contextInfo?.quotedMessage ?? false,
                        isLinkMessage: !!find(Text)[0] ?? false,
                        isForeignerMessage: Audition({ from: (Key.participant ?? Key.remoteJid).split('@')[0].substring(0,2), where: '55' }),
                        isTextMessage: Audition({ from: Array.from('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZàèìòùâãáéíóúÀÈÌÙÀÁÉÍÓÚÃÂäëïöüÄËÏÖÜ').join('|'), where: Text }),
                        isNumberMessage: Audition({ from: Array.from('0123456789').join('|'), where: Text }),
                    },{
                        chat:{
                            isFirstMessage: false,
                        },
                    },{
                        group:{
                            isSubjectChange: Audition({ from: '21', where: String(Events) }),
                            isSomeoneJoined: Audition({ from: '27', where: String(Events) }),
                            isSomeoneExited: Audition({ from: '32', where: String(Events) }),
                            isSomeonePromoted: Audition({ from: '29', where: String(Events) }),
                            isSomeoneDemoted: Audition({ from: '30', where: String(Events) }),
                            isSomeoneBanned: Audition({ from: '28', where: String(Events) }),
                            isDisappearingAddeded: Audition({ from: String(Message[MessageType]?.ephemeralExpiration), where: '0' }),
                            isCurrentDisappearing: !!Message[MessageType]?.contextInfo?.expiration ?? false,
                            isOnlyAdminMessagesEdited: Audition({ from: '26', where: String(Events) }),
                        },
                    }],
                },
                parameters:{
                    details: [
                        {
                            messageKey: Key ?? null,
                            messageId: Key?.id ?? null,
                            messageStatus: Body?.status ?? null,
                            messageJid: Key?.remoteJid ?? null,
                            messageTimeStamp: Body?.messageTimestamp ?? null,
                            messageContextinfo: Message[MessageType]?.contextInfo ?? null,
                            messageType: MessageType ?? null,
                            messageContent: Message,
                            messageBody: Body,
                            messageQuotedText: Message[MessageType]?.contextInfo?.quotedMessage?.conversation ?? Message[MessageType]?.contextInfo?.quotedMessage ?? Message[MessageType] ?? null,
                            messageQuoted: Body.quoted ?? Body ?? null,
                            messageMentionedJids: Message[MessageType]?.contextInfo?.mentionedJid ?? null,
                            messageGroupMetadata: usesMeta? usesMeta : null,
                            messageButtonId: Message[MessageType]?.selectedButtonId ?? null,
                            messageButtonText: Message[MessageType]?.selectedDisplayText ?? null,
                            messageListId: Message[MessageType]?.title ?? null,
                            messageListText: Message[MessageType]?.singleSelectReply?.selectedRowId ?? null,
                            messagePollName: Message[MessageType]?.name ?? null,
                            messagePollOptions: Message[MessageType]?.options ?? null
                        },{
                        sender: {
                            messageName: Body.pushName ?? (Key.participant ?? Key.remoteJid).split('@')[0] ?? false,
                            messageNumber: (Key.participant ?? Key.remoteJid).split('@')[0] ?? false,
                            messageText: Text,
                        },
                    }],
                },
            },
        },
    }

    return Typed
}
