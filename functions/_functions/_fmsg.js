import proto, { getContentType } from '@adiwajshing/baileys'
//
export const Typed = ({ events }) => {

    const MessageType = getContentType(events['messages.upsert'].messages[0].message)

    //onsole.log(events['messages.upsert'].messages[0])

    if(events['messages.upsert'].messages[0].key.fromMe) return 'Mensagem do BOT.'

    const Message = events['messages.upsert'].messages[0].message

    if(Message === undefined || Message === null) return 'Mensagem indefinida.'

    /*const MessageType = Object.keys(Message)
    .find((key) => !['senderKeyDistributionMessage', 'messageContextInfo']
    .includes(key))*/
    
    if(Message[MessageType].groupId === 'status@broadcast') return 'Publicação de status detectada.'

    let Typed = `` 

    //let m = events['messages.upsert'].messages[0]
    //m.pushName = 'teste'
    //m.message[MessageType] = 'teste'
    //m.teste = 'teste'
    //m.testa = 'teste'

    //console.log(m)

    switch(MessageType){
        case 'extendedTextMessage':
            Typed = Message[MessageType]?.text ?? MessageType
        break
        case 'conversation':
            Typed = Message[MessageType] ?? MessageType
        break
        case 'reactionMessage':
            Typed = 'Reação a uma mensagem.'
        break
        case 'imageMessage':
            Typed = Message[MessageType]?.caption ?? MessageType
        break
        case 'videoMessage':
            Typed = Message[MessageType]?.caption ?? MessageType
        break
        case 'documentWithCaptionMessage':
            Typed = Message[MessageType]?.message?.documentMessage?.caption ?? MessageType
        break
        case 'pollCreationMessage':
            Typed = Message[MessageType]?.name ?? MessageType
            //Typed = Message[MessageType]?.options ?? MessageType
        break
        case 'viewOnceMessage':
            Typed = `viewOnceMessage: `, Message ?? `viewOnceMessage: `, MessageType
        break
        case 'messageStubParameters':
            Typed = `messageStubParameters: `, Message ?? `messageStubParameters: `, MessageType
        break
        case 'key':
            Typed = `key: `, Message ?? `key: `, MessageType
        break
        case 'low':
            Typed = `low: `, Message ?? `low: `, MessageType
        break
        case 'protocolMessage':
            Typed = `Protocolo: `, Message ?? MessageType
        break
        default:
            Typed = `Tipo: ${MessageType} Menssagem:`, Message ?? events['messages.upsert']?.messages[0] ?? events['messages.upsert']
        break
    }

    return Typed
}