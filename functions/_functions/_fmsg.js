export const Typed = ({events}) => {

    var Typed = ``
    const MessageType = Object.keys(events['messages.upsert']?.messages[0]?.message).find((key) => !['senderKeyDistributionMessage', 'messageContextInfo'].includes(key))
    if(events['messages.upsert'].messages[0].message[MessageType].groupId === 'status@broadcast') return 'Publicação de status detectada.'

    switch(MessageType){
        case 'extendedTextMessage':
            Typed = events['messages.upsert']?.messages[0]?.message[MessageType]?.text ?? MessageType
        break
        case 'conversation':
            Typed = events['messages.upsert']?.messages[0]?.message[MessageType] ?? MessageType
        break
        case 'imageMessage':
            Typed = events['messages.upsert']?.messages[0]?.message[MessageType]?.caption ?? MessageType
        break
        case 'videoMessage':
            Typed = events['messages.upsert']?.messages[0]?.message[MessageType]?.caption ?? MessageType
        break
        case 'documentWithCaptionMessage':
            Typed = events['messages.upsert']?.messages[0]?.message[MessageType]?.message?.documentMessage?.caption ?? MessageType
        break
        case 'pollCreationMessage':
            Typed = events['messages.upsert']?.messages[0]?.message[MessageType]?.name ?? MessageType
            //Typed = events['messages.upsert']?.messages[0]?.message[MessageType]?.options ?? MessageType
        break
        case 'viewOnceMessage':
            Typed = `viewOnceMessage: `, events['messages.upsert']?.messages[0]?.message ?? `viewOnceMessage: `, MessageType
        break
        case 'messageStubParameters':
            Typed = `messageStubParameters: `, events['messages.upsert']?.messages[0]?.message ?? `messageStubParameters: `, MessageType
        break
        case 'key':
            Typed = `key: `, events['messages.upsert']?.messages[0]?.message ?? `key: `, MessageType
        break
        case 'low':
            Typed = `low: `, events['messages.upsert']?.messages[0]?.message ?? `low: `, MessageType
        break
        case 'protocolMessage':
            Typed = `Protocolo: `, events['messages.upsert']?.messages[0]?.message ?? MessageType
        break
        default:
            Typed = `Tipo: ${MessageType} Menssagem:`, events['messages.upsert']?.messages[0]?.message ?? events['messages.upsert']?.messages[0] ?? events['messages.upsert']
        break
    }

    return Typed
}