import { readFileSync, writeFileSync } from "fs"

import pkg from '@adiwajshing/baileys';
const { getContentType } = pkg;

import pkg1 from 'linkifyjs'
const { find } = pkg1

import { getGroupData } from './_cmds.js'

import pkg2 from 'node-emoji';
const { unemojify, hasEmoji } = pkg2;

//
export const Typed = async ({ events, client }) => {

    const get = (c) => getContentType(c)
    const teste = (c) => !!new RegExp(Array.from(c).join('|')).test(Text)
    const teste1 = (c) => new RegExp(c).test(MessageType)
    const teste2 = (c) => new RegExp(c).test(String(Events))

    var getConfigProperties = JSON.parse(readFileSync("./root/config.json"))
    var getMetadataProperties = JSON.parse(readFileSync("./root/groupsMetadata.json"))

    const Body = events['messages.upsert']?.messages[0] ?? ''
    const Events = Body?.messageStubType ?? ''
    const Key = Body?.key ?? ''
    const Content = get(Body.message) ?? ''
    const MessageType = Content === 'viewOnceMessage'? get(Body.message[Content].message) : Content ?? ''
    const Message = Content === 'viewOnceMessage'? Body.message[Content].message : Body.message ?? ''

    //if(Key.fromMe) return 'Mensagem do BOT.'
    if(Key.remoteJid === 'status@broadcast' || Message[MessageType]?.groupId === 'status@broadcast') return 'Publicação de status detectada.'
    if(Message === undefined || Message === null) return 'Mensagem indefinida.'

    const Text =
    MessageType === 'conversation'? Message[MessageType] :
    MessageType === 'extendedTextMessage'? Message[MessageType]?.text :
    MessageType === 'imageMessage'? Message[MessageType]?.caption ?? Message[MessageType]?.message?.imageMessage?.caption :
    MessageType === 'videoMessage'? Message[MessageType]?.caption ?? Message[MessageType]?.message?.videoMessage?.caption :
    MessageType === 'documentWithCaptionMessage'? Message[MessageType]?.message?.documentMessage?.caption :
    MessageType === 'listResponseMessage'? Message[MessageType]?.singleSelectReply?.selectedRowId :
    MessageType === 'buttonsResponseMessage'? Message[MessageType]?.selectedButtonId :
    MessageType === 'templateButtonReplyMessage' ? Message[MessageType]?.selectedId :
    MessageType === 'messageContextInfo' ? Message[MessageType]?.selectedButtonId || Message[MessageType]?.singleSelectReply.selectedRowId || Message.text :
    JSON.stringify(MessageType)

    const createdData = async () => {
        var jsonData = async () => `{"${Key.remoteJid}": ${JSON.stringify(await client.groupMetadata(Key.remoteJid))}}`
        var a = await jsonData()
        var jsonObj = JSON.parse(a)

        getMetadataProperties.remoteJID.push(jsonObj)
        writeFileSync("./root/groupsMetadata.json", JSON.stringify(getMetadataProperties))
    }

    const _args = []
    Object.keys(getMetadataProperties.remoteJID).forEach(word => {
    _args.push(Object.keys(getMetadataProperties.remoteJID[word]))
    })

    try{ var usesMeta = Key?.remoteJid?.endsWith('@g.us')? new RegExp(Key.remoteJid).test(_args)? getMetadataProperties.remoteJID[0][Key.remoteJid] : await createdData() : false } catch {}

    const Typed = {
        msg: {
            key: {
                boolean:{
                    isBot: !!Key.fromMe ?? false,
                    isCommand: !!Text?.startsWith('!') ??  false,
                    isGroup: usesMeta? true : false,
                    isAdmin: usesMeta? !!getGroupData({ Type: 'isAdmin', groupMetadata: usesMeta, message: Key}) : false,
                    isBotAdmin: usesMeta? !!getGroupData({ Type: 'isBotAdmin', groupMetadata: usesMeta, message: Key}) : false,
                    isOwner: !!getConfigProperties.bot.owners.includes((Key.participant ?? Key.remoteJid).split('@')[0]),
                    isQuoted: !!Message[MessageType]?.contextInfo?.quotedMessage ?? false,
                    message: [{
                        isPollMessage: teste1('pollCreationMessage') || teste1('pollUpdateMessage'),
                        isListMessage: teste1('listCreationMessage') || teste1('listResponseMessage'),
                        isDocMessage: teste1('documentMessage') || teste1('documentWithCaptionMessage'),
                        isButtonMessage: teste1('buttonsCreationMessage') || teste1('buttonsResponseMessage'),
                        isAudioMessage: teste1('audioMessage'),
                        isProductMessage: teste1('productMessage'),
                        isViewOnceMessage: teste1('viewOnceMessage'),
                        isVideoMessage: teste1('videoMessage'),
                        isContactMessage: teste1('contactMessage'),
                        isImageMessage: teste1('imageMessage'),
                        isStickerMessage: teste1('stickerMessage'),
                        isLocationMessage: teste1('locationMessage'),
                        isLiveLocationMessage: teste1('liveLocationMessage'),
                        isrequestPaymentMessage: teste1('requestPaymentMessage') || teste1('declinePaymentRequestMessage'),
                        isReactionMessage: teste1('reactionMessage'),
                        isSymbolsMessage: hasEmoji([unemojify(Text)].join(' ')) || teste(`☠️`) || (/[^A-Za-z 0-9]/g).test(Text),
                        isQuotedMessage: !!Message[MessageType]?.contextInfo?.quotedMessage ?? false,
                        isLinkMessage: !!find(Text)[0] ?? false,
                        isForeignerMessage: !new RegExp((Key.participant ?? Key.remoteJid).split('@')[0].substring(0,2)).test('55'),
                        isTextMessage: teste('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZàèìòùâãáéíóúÀÈÌÙÀÁÉÍÓÚÃÂäëïöüÄËÏÖÜ'),
                        isNumberMessage: teste('0123456789'),
                    },{
                        chat:{
                            isFirstMessage: false,
                        },
                    },{
                        group:{
                            isSubjectChange: teste2('21'),
                            isSomeoneJoined: teste2('27'),
                            isSomeoneExited: teste2('32'),
                            isSomeonePromoted: teste2('29'),
                            isSomeoneDemoted: teste2('30'),
                            isSomeoneBanned: teste2('28'),
                            isDisappearingAddeded: new RegExp(String(Message[MessageType]?.ephemeralExpiration)).test('0'),
                            isCurrentDisappearing: !!Message[MessageType]?.contextInfo?.expiration ?? false,
                            isOnlyAdminMessagesEdited: teste2('26'),
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
