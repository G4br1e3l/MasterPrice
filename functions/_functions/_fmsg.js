import pkg from '@adiwajshing/baileys';
const { getContentType, getPollUpdateMessage } = pkg;
//
export const Typed = ({ events }) => {

    const get = (x) => getContentType(x)

    const Body = events['messages.upsert']?.messages[0] ?? ''
    const Key = Body?.key ?? ''
    const Content = get(Body.message) ?? ''
    const MessageType = Content === 'viewOnceMessage'? get(Body.message[Content].message) : Content ?? ''
    const Message = Content === 'viewOnceMessage'? Body.message[Content].message : Body.message ?? ''

    if(Key.fromMe) return 'Mensagem do BOT.'
    if(Key.remoteJid === 'status@broadcast' || Message[MessageType]?.groupId === 'status@broadcast') return 'Publicação de status detectada.'
    if(Message === undefined || Message === null) return 'Mensagem indefinida.'

    let Typed = {  
        msg: {
            key: {
                extra: {
                    type: MessageType ?? false,
                    quoted: Message[MessageType]?.contextInfo?.quotedMessage ?? false,
                    mentionedJid: Message[MessageType]?.contextInfo?.mentionedJid ?? false,
                    fromMe: Key.fromMe ?? false,
                    fromChat: Key.remoteJid.endsWith('@g.us')? true : false,
                    status: Body.status ?? false,
                    id: Key.id ?? false,
                    remoteJid: Key.remoteJid ?? false,
                    timeStamp: Body.messageTimestamp ?? false
                },
                buttonId: false,
                buttonText: false,
                listId: false,
                listText: false,
                pollName: false,
                pollOptions: false
            },
            text: false,
            sender: {
                name: Body.pushName ?? (Key.participant ?? Key.remoteJid).split('@')[0] ?? false,
                number: (Key.participant ?? Key.remoteJid).split('@')[0] ?? false
            }
        }
    }

    switch(MessageType){
        case 'extendedTextMessage':
            Typed.msg.text = Message[MessageType].text
        break
        case 'conversation':
            Typed.msg.text = Message[MessageType]
        break
        case 'imageMessage':
            Typed.msg.text = Message[MessageType].caption
        break
        case 'videoMessage':
            Typed.msg.text = Message[MessageType].caption
        break
        case 'documentWithCaptionMessage':
            Typed.msg.text = Message[MessageType].message.documentMessage.caption
        break
        case 'pollCreationMessage':
            Typed.msg.text = 'criou enquete fds'
            Typed.msg.key.pollName = Message[MessageType].name
            Typed.msg.key.pollOptions = Message[MessageType]?.options
        break
        case 'buttonsResponseMessage':
            Typed.msg.text = Typed.msg.key.buttonId = Message[MessageType].selectedButtonId
            Typed.msg.key.buttonText = Message[MessageType].selectedDisplayText
        break
        case 'listResponseMessage':
            Typed.msg.key.listText = Message[MessageType].title
            Typed.msg.text = Typed.msg.key.listId = Message[MessageType].singleSelectReply.selectedRowId
        break
        case 'pollUpdateMessage':
            Typed.msg.text = 'atualizou enquete fds'
        break
        default:
            Typed.msg.text = `nonRecognized: ${MessageType}`
        break
    }

    return Typed
}