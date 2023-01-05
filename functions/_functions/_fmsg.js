import { readFileSync } from "fs"

import pkg from '@adiwajshing/baileys';
const { getContentType } = pkg;

import pkg1 from 'linkifyjs'
const { find } = pkg1

import { getGroupData } from './_cmds.js'

const emojis = '😃'

//
export const Typed = async ({ events, client }) => {

    const get = (x) => getContentType(x)
    const buff = (x) => {
        if(MessageType === Content) return Buffer.from(MessageType).equals(Buffer.from(x))
        return Buffer.from(Content).equals(Buffer.from(x))
    }
    const buff2 = (z) => Buffer.from(String(Events)).equals(Buffer.from(z))

    var getConfigProperties = JSON.parse(readFileSync("./root/config.json"))

    const Body = events['messages.upsert']?.messages[0] ?? ''
    const Events = Body?.messageStubType ?? ''
    const Key = Body?.key ?? ''
    const Content = get(Body.message) ?? ''
    const MessageType = Content === 'viewOnceMessage'? get(Body.message[Content].message) : Content ?? ''
    const Message = Content === 'viewOnceMessage'? Body.message[Content].message : Body.message ?? ''

    if(Key.fromMe) return 'Mensagem do BOT.'
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

    let usesMeta = Key?.remoteJid?.endsWith('@g.us')? await client.groupMetadata(Key.remoteJid) : false

    const Typed = {  
        msg: {
            key: {
                boolean:{
                    isBot: !!Key.fromMe ?? false,
                    isCommand: !!Text?.startsWith('!') ??  false,
                    isGroup: usesMeta? true : false,
                    isAdmin: usesMeta? !!getGroupData({ Type: 'isAdmin', groupMetadata: usesMeta, message: Body}) : false,
                    isBotAdmin: usesMeta? !!getGroupData({ Type: 'isBotAdmin', groupMetadata: usesMeta, message: Body}) : false,
                    isOwner: !!getConfigProperties.bot.owners.includes((Key.participant ?? Key.remoteJid).split('@')[0]),
                    isQuoted: !!Message[MessageType]?.contextInfo?.quotedMessage ?? false,
                    message: [{
                        isPollMessage: (buff('pollCreationMessage') ?? false) || (buff('pollUpdateMessage') ?? false),
                        isListMessage: (buff('listCreationMessage') ?? false) || (buff('listResponseMessage') ?? false),
                        isDocMessage: (buff('documentMessage') ?? false) || (buff('documentWithCaptionMessage') ?? false),
                        isButtonMessage: (buff('buttonsCreationMessage') ?? false) || (buff('buttonsResponseMessage') ?? false),
                        isAudioMessage: buff('audioMessage') ?? false,
                        isProductMessage: buff('productMessage') ?? false,
                        isViewOnceMessage: buff('viewOnceMessage') ?? false,
                        isVideoMessage: buff('videoMessage') ?? false,
                        isContactMessage: buff('contactMessage') ?? false,
                        isImageMessage: buff('imageMessage') ?? false,
                        isStickerMessage: buff('stickerMessage') ?? false,
                        isLocationMessage: buff('locationMessage') ?? false,
                        isLiveLocationMessage: buff('liveLocationMessage') ?? false,
                        isrequestPaymentMessage: buff('requestPaymentMessage') ?? false,
                        isReactionMessage: buff('reactionMessage') ?? false,
                        isEmojiMessage: new RegExp(Array.from(emojis).join('|')).test(Text) ?? false,
                        isQuotedMessage: !!Message[MessageType]?.contextInfo?.quotedMessage ?? false,
                        isLinkMessage: !!find(Text)[0] ?? false,
                        isForeignerMessage: !!!Buffer.from((Key.participant ?? Key.remoteJid).split('@')[0].substring(0,2)).equals(Buffer.from('55')) ?? false,
                        isTextMessage: typeof(Text) === 'string'? true : false,
                    },{
                        chat:{
                            isFirstMessage: false,
                        },
                    },{
                        group:{
                            isSubjectChange: buff2('21') ?? false,
                            isSomeoneJoined: buff2('27') ?? false,
                            isSomeoneExited: buff2('32') ?? false,
                            isSomeonePromoted: buff2('29') ?? false,
                            isSomeoneDemoted: buff2('30') ?? false,
                            isSomeoneBanned: buff2('28') ?? false,
                            isDisappearingAddeded: !!!Buffer.from(String(Message[MessageType]?.ephemeralExpiration)).equals(Buffer.from('0')) ?? false,
                            isCurrentDisappearing: !!Message[MessageType]?.contextInfo?.expiration ?? false,
                            isOnlyAdminMessagesEdited: buff2('26'),
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
                            messageGroupMetadata: usesMeta? await client.groupMetadata(Key.remoteJid) : null,
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
                            messageText: Text ?? '',
                        },
                    }],
                },
            },
        },
    }

    return Typed
}