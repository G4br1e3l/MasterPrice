import {
    getContentType,
    hasEmoji,
    unemojify,
    find,
    getGroupData,
    createdData,
    Audition,
    getMessageText,
    Config,
    detectMessageStatus
} from '../../exports.js'

export const Typed = async ({ events, client }) => {

    const metadata = Config.parameters.metadata.store[0]
    const { remoteJid = null } = metadata

    const {
        messageStubType: Events = undefined,
        messageTimestamp: Time = undefined,
        key: Key = undefined,
        message: Mssge = undefined,
        status: Status = undefined,
        quoted: Quoted = undefined,
        pushName: getName = undefined,
        broadcast: BC = undefined,
        ...Body
    } = events?.messages[0] || {}

    if (Events) return `Event was detected! Code: ${Events}`

    const {
        viewOnceMessage: vom1 = undefined,
        viewOnceMessageV2: vom2 = undefined,
        ...m
    } = Mssge || {}

    const Message = vom1?.message ?? vom2?.message ?? m ?? {}

    const MessageType = getContentType(Message)

    if(detectMessageStatus({ Message: Message, MessageType: MessageType }) !== null) return 'Status published.'

    const Text = getMessageText({ MessageType: MessageType, Message: Message })

    const isGroup = Key?.remoteJid?.endsWith('@g.us')

    let usesMeta = false

    if (isGroup) {
        const _argas = [...new Set(Object.keys(remoteJid)?.flatMap(key => Object.keys(remoteJid[key])?.[0]))]
        const argaIndex = _argas.indexOf(Key.remoteJid)
        const arga = argaIndex >= 0 ? metadata.remoteJid[argaIndex] : await createdData(Key, client)
        usesMeta = new RegExp(Key.remoteJid).test(_argas) ? arga : false
    }

    const Typed = {
        msg: {
            key: {
                boolean:{
                    isBot: !!Key.fromMe ?? false,
                    isCommand: !!Text?.startsWith(Config.parameters.bot[1].prefix.set) ??  false,
                    isGroup: isGroup,
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
                        isViewOnceMessage: !!(Mssge.viewOnceMessage ?? Mssge.viewOnceMessageV2?.message),
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
                            messageAll: events?.messages[0],
                            messageKey: Key ?? null,
                            messageId: Key?.id ?? null,
                            messageStatus: Status ?? null,
                            messageJid: Key?.remoteJid ?? null,
                            messageTimeStamp: Time ?? null,
                            messageContextinfo: Message[MessageType]?.contextInfo ?? null,
                            messageType: MessageType ?? null,
                            messageContent: Message ?? null,
                            messageContext: Message[MessageType] ?? null,
                            messageBody: Body ?? null,
                            messageQuotedText: Message[MessageType]?.contextInfo?.quotedMessage? Message[MessageType]?.contextInfo?.quotedMessage?.conversation ?? Message[MessageType]?.contextInfo?.quotedMessage ?? Message[MessageType] : null,
                            messageQuoted: Message[MessageType]?.contextInfo?.quotedMessage? Message[MessageType]?.contextInfo ?? Quoted ?? Body : null,
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
                            messageName: getName ?? (Key.participant ?? Key.remoteJid).split('@')[0] ?? false,
                            messageNumber: (Key.participant ?? Key.remoteJid).split('@')[0] ?? false,
                            messageText: Text ?? null,
                        },
                    }],
                },
            },
        },
    }

    return Typed
}
