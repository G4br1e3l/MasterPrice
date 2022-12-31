import { getContentType } from '@adiwajshing/baileys'
//
export const Typed = ({ events }) => {

    const get = (x) => getContentType(x)

    const Body = events['messages.upsert'].messages[0]
    const Content = get(Body.message)
    const MessageType = Content === 'viewOnceMessage'? get(Body.message[Content].message) : Content
    const Message = Content === 'viewOnceMessage'? Body.message[Content].message : Body.message
    
    if(Body.key.fromMe) return 'Mensagem do BOT.'
    if(Body?.key?.remoteJid === 'status@broadcast' || Message[MessageType]?.groupId === 'status@broadcast') return 'Publicação de status detectada.'
    if(Message === undefined || Message === null) return 'Mensagem indefinida.'

    /*const MessageType = Object.keys(Message)
    .find((key) => !['senderKeyDistributionMessage', 'messageContextInfo']
    .includes(key))*/
    
    let Typed = {  
        msg: {
            key: {
                extra: {
                    type: MessageType ?? false,
                    quoted: Message[MessageType]?.contextInfo?.quotedMessage ?? false,
                    mentionedJid: Message[MessageType]?.contextInfo?.mentionedJid ?? false,
                    fromMe: Body.key.fromMe ?? false,
                    fromChat: Body.key.remoteJid.endsWith('@g.us')? 'group' : 'private',
                    status: false,
                    id: Body.key.id ?? false,
                    remoteJid: Body.key.remoteJid ?? false,
                    timeStamp: Body.messageTimestamp ?? false
                },
                buttonId: false,
                buttonText: false,
                listTitle: false,
                listDescription: false,
                pollName: false,
                pollOptions: false
            },
            text: false,
            sender: {
                name: Body.pushName ?? (Body.key.participant ?? Body.key.remoteJid).split('@')[0] ?? false,
                number: (Body.key.participant ?? Body.key.remoteJid).split('@')[0] ?? false
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
            Typed.msg.key.pollName = Message[MessageType].name
            Typed.msg.key.pollOptions = Message[MessageType]?.options
        break
        case 'buttonsResponseMessage':
            Typed.msg.key.buttonId = Message[MessageType].selectedButtonId
            Typed.msg.key.buttonText = Message[MessageType].selectedDisplayText
        break
        case 'listResponseMessage':
            Typed.msg.key.listTitle = Message[MessageType].title
            Typed.msg.key.listDescription = Message[MessageType].description
        break
        default:
            Typed.msg.text = `nonRecognized: ${MessageType}`
        break
    }

    return Typed
}