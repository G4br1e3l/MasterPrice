import { readFileSync } from "fs"

import pkg from '@adiwajshing/baileys'
const { getContentType } = pkg

import pkg1 from 'linkifyjs'
const { find } = pkg1

import {
    getGroupData,
    createdData,
    Audition,
    getMessageText,
    detectMessageStatus
} from './_functionsMessage.js'

import pkg2 from 'node-emoji'
const { unemojify, hasEmoji } = pkg2

//
export const Typed = async ({ events, client }) => {

    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    const metadata = Config.parameters.metadata.store[0]
    const { remoteJid } = metadata
    const Body = events['messages.upsert']?.messages[0] ?? ''
    const Events = Body?.messageStubType ?? ''
    const Key = Body?.key ?? ''
    const MessageType = getContentType(Body?.message?.viewOnceMessage?.message) ?? getContentType(Body?.message?.viewOnceMessageV2?.message) ?? getContentType(Body?.message) ?? ''
    const Message = Body?.message?.viewOnceMessage?.message ?? Body?.message?.viewOnceMessageV2?.message ?? Body?.message ?? ''
    if(detectMessageStatus({ Message: Message, MessageType: MessageType }) !== null) return 'Aiin calica!!'
    const Text = getMessageText({ MessageType: MessageType, Message: Message })
    const _argas = [...new Set(Object.keys(remoteJid)?.flatMap(key => Object.keys(remoteJid[key])?.[0]))]
    const isGroup = Key?.remoteJid?.endsWith('@g.us')

    let usesMeta = false

    if (isGroup){
        const argaIndex = _argas.indexOf(Key.remoteJid)
        const arga = argaIndex >= 0 ? metadata.remoteJid[argaIndex] : await createdData(Key, client)
        usesMeta = new RegExp(Key.remoteJid).test(_argas) ? arga : false
    }

    const Typed = {
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
                            messageQuotedText: Message[MessageType]?.contextInfo?.quotedMessage ?? Message[MessageType] ?? null,
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
