import {
  readFileSync,
  createWriteStream,
  unlink,
  createReadStream,
  Spam,
  sendReaction,
  sendMessageQuoted,
  sendCaptionImageQuoted,
  spawn,
  path,
  promisify,
  getDocument,
  get,
  Config,
  Buffer,
  downloadContentFromMessage,
}  from '../../exports.js'

import {
  Configuration,
  OpenAIApi
} from "openai";

const getRandom = (v) => {
	return `${Math.floor(Math.random() * 10000)}${v}`
}

const config = new Configuration({
  organization: "org-VKh6dAMHl83oAzaDrjctqTwU",
  apiKey: "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"
});

const openai = new OpenAIApi(config);

const response = async (x) =>
  await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
	    { role: "system", content: `Seja humano. Não deixe que eu perceba ou entenda que você é uma IA.` },
	    { role: "user", content: x }
    ],
    temperature: 0,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });

const resp = async (x) => await openai.createTranscription(createReadStream(x), "whisper-1");

const response1 = async (x) =>
  await openai.createImage({
  prompt: x,
  n: 1,
  size: "1024x1024"
});

export const GPT = async ({ client, message, _args, remoteJid, typed }) => {

  const {
    parameters: {
    details: [{
      messageQuotedText,
      messageQuoted,
      messageType,
      messageContextinfo,
      text,
      ...More
    } = {},
    {
      sender: { messageText: Message } = {}
    } = {}
    ] = []
    },
    boolean: {
      message: [
        { isQuotedMessage: iQtdMss } = {}
      ] = []
    } = {}
  } = typed || {}

  let Input = Message?.slice(5) || "";

  if (iQtdMss) {
    Input += messageQuotedText || ""
    Input += messageQuoted?.quotedMessage[messageType]?.text || ""
    Input += messageContextinfo?.quotedMessage?.imageMessage?.caption || ""
    Input += messageContextinfo?.quotedMessage?.videoMessage?.caption || ""
    Input += text || ""
  }

  if (!Input) {
    await sendMessageQuoted({
      client: client,
      param: message,
      answer:
        "Tente inserindo alguma pergunta... com (!GPT (pergunta?)) ou marcando a mensagem ou ambas juntas :)"
    })
      .then(async () => {
        await sendReaction({
          client: client,
          param: message,
          answer: Config.parameters.commands[0].execution[0].onerror
        });
      })
      .then(() => Spam(remoteJid));

    return "Error.";
  }

  switch (_args[1]) {
    case 'pdf':
      try {

        const requisitado = _args[2]? (_args.slice(2)).join(' ') : 'Resumir o máximo que puder.'

        if (_args[2]){
          await sendMessages(`Pesquisando em seu arquivo algo relacionado a: "${requisitado}"`)
          Spam(remoteJid);
        } else {
          await sendMessages(`Nenhuma pergunta foi inserida, resumindo conteúdo do PDF...`)
          Spam(remoteJid);
        }

        await sendMessages(`*Para arquivos em PDF grandes, talvez erros ocorram! Avise o DEV.*`)
        Spam(remoteJid);

        const quotedMessage =
        message?.details[0]?.messageQuoted?.quotedMessage?.documentWithCaptionMessage?.message
        message?.details[0]?.messageQuoted?.quotedMessage;

        if (!quotedMessage || quotedMessage?.documentMessage?.mimetype !== 'application/pdf') {
          await handlePdfProcessingError('Não é um PDF ou não marcou nenhuma mensagem...')
          return "Error.";
        }
    
        const pdfStream = await downloadContentFromMessage(quotedMessage.documentMessage, "document");
        const pdfBuffer = await promisify(Buffer)(pdfStream);
    
        if (!pdfBuffer) {
          await handlePdfProcessingError('Erro ao converter o PDF.')
          console.error('Erro ao converter o fluxo para Buffer');
          return "Error.";
        }
    
        const pdfFileName = getRandom(".pdf");
        const writer = createWriteStream(pdfFileName, {
          autoClose: true
        });
    
        writer.write(pdfBuffer);
        writer.end();
    
        writer.on('finish', async () => {
          Spam(remoteJid);
          
          const result = [];
          const responses = [];
          const respostas = [];

          const pagesData = await (async function () {
              const doc = await getDocument(new Uint8Array(readFileSync(pdfFileName))).promise;

              for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
                result.push({ index: pageNum, text: (await (await doc.getPage(pageNum)).getTextContent()).items.map(item => item.str).join(' ') });
                Spam(remoteJid);
              }

              return result;
          })()

          try { unlink(pdfFileName, () => {}); } catch {}
    
          if ( !pagesData || pagesData.length === 0) {
            await handlePdfProcessingError('O PDF está vazio.')
            console.log('No data to process.');
            return "Error.";
          }
    
          const uniqueIndices = Array.from(new Set(pagesData.map(page => page.index)));
          const uniqueTexts = Array.from(new Set(pagesData.map(page => page.text)));
    
          for (const index of uniqueIndices) {
            respostas.push(String(uniqueTexts[index-1]));
            Spam(remoteJid);
          }
    
          const resulta = async (x) => await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "user", content: `Organize as informações: ${x}.` }
            ],
            temperature: 0,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
          });
    
          for (const pergunta of respostas) {
            try {
              await sendMessages(`Verificando cada página do documento... Atualmente verificando a página ${respostas.indexOf(pergunta) + 1} de ${respostas.length}`);
              Spam(remoteJid);

              responses.push((await resulta(pergunta)).data.choices[0].message.content.trim());
              
            } catch (error) {
              await sendMessages(`Não consegui ler a página ${respostas.indexOf(pergunta) + 1}`)
              console.error("Erro ao verificar página:", error);
            }
          }

          await sendMessages('Leitura finalizada! Trazendo informações do PDF...')
          Spam(remoteJid);
          
          const concatenado = responses.join(' ');
          const respondido = await response(`${requisitado}. Responda diretamente. Resuma: ${concatenado}.`);
          const respostaFinal = respondido.data.choices[0].message.content.trim();
        
          await sendMessages(`Resultado da leitura para "${concatenado}":\n\n${respostaFinal}`)
          Spam(remoteJid);
        
          return "Success.";
          
        })
        writer.on('error', async (err) => {
          await handlePdfProcessingError('Aconteceu um erro quando estava tentando baixar o PDF.');
          return "Error.";
        });

      } catch (error) {
        await handlePdfProcessingError('Não consegui fazer nada, teve algum erro...');
        return "Error.";
      }
      

      async function handlePdfProcessingError(res) {
        await sendMessageQuoted({
          client: client,
          param: message,
          answer: res
        });
      
        await sendReaction({
          client: client,
          param: message,
          answer: Config.parameters.commands[0].execution[0].onerror
        });
      
        Spam(remoteJid);
      
      }
      
      async function sendMessages(res) {
        await sendMessageQuoted({
          client: client,
          param: message,
          answer: res
        });
      
        await sendReaction({
          client: client,
          param: message,
          answer: Config.parameters.commands[0].execution[0].unsuccess
        });
      
      }

      break;
    case "foto":
      try {
        const resposta = await response1(Input);
        const image = getRandom(".jpeg");
        await downloadImage(resposta.data.data[0].url, image);

        async function downloadImage(url, filename) {
          const response = await get(url, { responseType: "stream" });
          const writer = createWriteStream(filename, { autoClose: true });

          return new Promise((resolve, reject) => {
            response.data.pipe(writer);

            writer.on("finish", async () => {
              await sendCaptionImageQuoted({
                client: client,
                param: message,
                answer: '',
                path_image: image
              });

              await sendReaction({
                client: client,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onsucess
              });

              Spam(remoteJid);

              unlink(filename, () => {
                resolve();
              });

              return "Success.";
            });

            writer.on("error", async (error) => {
              await sendMessageQuoted({
                client: client,
                param: message,
                answer: "Deu para baixar a foto não."
              });
              await sendReaction({
                client: client,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onsucess
              });

              Spam(remoteJid);

              unlink(filename, () => {
                reject(error);
              });

              return "Error.";
            });
          });
        }
      } catch {}
      break;
    case "audio":
      if (
        typed.boolean?.message[0]?.isQuotedMessage &&
        !!typed.parameters?.details[0]?.messageQuoted?.quotedMessage
          ?.audioMessage
      ) {
        (async function createAudio() {
          const buffer = await downloadContentFromMessage(
            typed.parameters.details[0].messageQuoted.quotedMessage
              .audioMessage,
            "audio"
          );
          const INaudio = getRandom(".mp3");
          const OUTaudio = getRandom(".wav");
          const writer = createWriteStream(INaudio, {
            autoClose: true
          });

          return new Promise((resolve) => {
            buffer.pipe(writer);

            writer.on("finish", async () => {

              const args = [
                "-i",
                INaudio,
                "-acodec",
                "pcm_s16le",
                "-ac",
                "1",
                "-ar",
                "16000",
                OUTaudio
              ];

              const ffmpeg = spawn(path, args);

              ffmpeg.on("exit", async () => {
                const transcript = await resp(OUTaudio);

                await sendMessageQuoted({
                  client: client,
                  param: message,
                  answer: transcript.data.text
                });
                await sendReaction({
                  client: client,
                  param: message,
                  answer: Config.parameters.commands[0].execution[0].onsucess
                });

                unlink(INaudio, () => {
                  unlink(OUTaudio, () => {
                    resolve();
                  });
                });

                Spam(remoteJid);

                return "Success.";
              });

              ffmpeg.on("error", async () => {
                await sendMessageQuoted({
                  client: client,
                  param: message,
                  answer: "Vish... Deu ruim a tradução meu bom"
                });
                await sendReaction({
                  client: client,
                  param: message,
                  answer: Config.parameters.commands[0].execution[0].onsucess
                });

                unlink(INaudio, () => {
                  unlink(OUTaudio, () => {
                    resolve();
                  });
                });

                Spam(remoteJid);

                return "Error.";
              });
            });

            writer.on("error", async () => {
              await sendMessageQuoted({
                client: client,
                param: message,
                answer: "Deu para traduzir o audio não."
              });
              await sendReaction({
                client: client,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onsucess
              });

              Spam(remoteJid);

              unlink(INaudio, () => {
                unlink(OUTaudio, () => {
                  resolve();
                });
              });

              return "Error.";
            });
          });
        })();
      }
      break;
    default:
      try {
        const resposta = await response(Input);

        await sendMessageQuoted({
          client: client,
          param: message,
          answer: resposta.data.choices[0].message.content.trim()
        });
        await sendReaction({
          client: client,
          param: message,
          answer: Config.parameters.commands[0].execution[0].onsucess
        });
        Spam(remoteJid);

        return "Success.";
      } catch (erro) {
        switch (erro?.response?.status) {
          case 429:
            await sendMessageQuoted({
              client: client,
              param: message,
              answer:
                "Ooops! Muitas solicitações de resposta, aguarde um momento e tente novamente mais tarde."
            });
            await sendReaction({
              client: client,
              param: message,
              answer: Config.parameters.commands[0].execution[0].onsucess
            });

            Spam(remoteJid);
            return "Error.";

          default:
            await sendMessageQuoted({
              client: client,
              param: message,
              answer:
                "Por um código de erro desconhecido, a API parou de funcionar."
            });
            await sendReaction({
              client: client,
              param: message,
              answer: Config.parameters.commands[0].execution[0].onsucess
            });

            Spam(remoteJid);
            return "Error.";
        }
      }
  }
};