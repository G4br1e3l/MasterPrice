//
export const Typed = ({ events }) => {

    let Typed = ``

    const Message = events['messages.upsert'].messages[0].message

    if(Message === undefined || Message === null) return 'Mensagem indedfinida.'

    const MessageType = Object.keys(Message)
    .find((key) => !['senderKeyDistributionMessage', 'messageContextInfo']
    .includes(key))
    
    if(Message[MessageType].groupId === 'status@broadcast') return 'Publicação de status detectada.'

    switch(MessageType){
        case 'extendedTextMessage':
            Typed = Message[MessageType]?.text ?? MessageType
        break
        case 'conversation':
            Typed = Message[MessageType] ?? MessageType
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