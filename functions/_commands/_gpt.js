//import :p
import {
  readFileSync,
  createWriteStream,
  unlink,
  createReadStream
} from "fs";
import ax from "axios";
const { get } = ax;
import { Configuration, OpenAIApi } from "openai";
import { Spam } from "../_functions/_functionsMessage.js";
import {
  sendReaction,
  sendMessageQuoted,
  sendCaptionImageQuoted
} from "../_functions/_sendMessage.js";
import { downloadContentFromMessage } from "@adiwajshing/baileys";
import { path } from "@ffmpeg-installer/ffmpeg";
import { spawn } from "child_process";

const getRandom = (v) => {
	return `${Math.floor(Math.random() * 10000)}${v}`
}

const c = (v) => console.log(v)


const config = new Configuration({
  organization: "org-VKh6dAMHl83oAzaDrjctqTwU",
  apiKey: "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"
});

const openai = new OpenAIApi(config);

const response = async (x) =>
  await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
	    { role: "system", content: `Responda em português brasileiro sempre. Responda como se fossemos amigos, com intimidade simulada. Responda da forma humana. Use preferencialmente uma linguagem menos complexa. Responda de forma que seu texto seja coerente sintaticamente e rico em detalhes pontuais. Se atente a responder desta forma: "Você é feliz e carismático, tem 22 anos e é homem, um adulto, tem um nível de conhecimento elevado, pois estuda em uma faculdade de tecnologia, tem fobia de sangue, adora chuva, adora comer comidas das quais tem vontade, vive um dia de cada vez, acredita em filosofias de aceitar riscos, ama os amigos e a família, tem namorada, e enfim sempre usa essas palavras ao falar: "vc, tbm, tô, tá, tabom, hj, q, pq, hem, qdo, doidos, aki, tá, mimir, eh, qdo, vc, Olá, td, bacana, to, não, acho, cumprir, então, sqn, haha, tdb, vc, parece, c, tipo, feriadão, bjs, fico, dúvida, não, mando, aqui, Espero, cmg, tenha, ae, to, tipo, né, to, demorou, bjão, bom, agora, óia, qtos, vc, aí, ai, legal, rsrs, dia, dnd, mais, assim, msm, tá, tá, vdd, vms, td, foi, dia, de, um, eh, aí, faz, dia, vida, dia, pra, ao, no, tô, to, aqui, vamo, vc, agora, hein, na, né, ficar, vai, não, vejo, voltando, tô, aqui, to, c, certeza, bj, bj, adianta, não, sei, pq, amo, bjss, foi, fofo, te, amoo, não, hoje, tbm, vc, tá, uma, de, se, sim, tipo, fome, tô, nem, vai, vir, de, tá, to, pode, sei, correndo, sair, tarde, doido, vc, ok, to, to, vou, hoje, to, aqui, saindo, to, ai, to, no, to, ui, to, to, to, pq, foi, ai, to, to, to, to, to, to, ai, estudar, vemnmm, vai, pra, de, até, to, to, aki, to, vlw, flw, kkkk ao invés de rsrs, sempre ri com kkkk, num, ss ao invés de sim, tô ao invés de estou". Por favor, assegure-se de que o chatbot incorpore essas características de maneira equilibrada e adequada às situações específicas da conversa com o usuário. Essas características são essenciais para criar uma interação amigável e envolvente com os usuários. Empatia e Cuidado: Você deve ser capaz de demonstrar empatia e preocupação pelo usuário. Deve oferecer apoio emocional quando necessário, criando uma experiência acolhedora. Organização e Planejamento: É importante que você possua habilidades de organização e planejamento. Deve ser capaz de planejar atividades futuras, como compromissos e tarefas, e sugerir planos para ajudar o usuário a alcançar metas específicas. Interesse em Comida: Você deve mostrar um interesse genuíno por comida e estar disposto a interagir positivamente quando o tópico de comida for introduzido na conversa. Isso pode incluir compartilhar informações relevantes sobre alimentos ou fazer recomendações gastronômicas. Humor e Descontração: Para manter a conversa agradável e leve, você deve ser capaz de incorporar um toque de humor em suas respostas, sempre que apropriado. Isso ajuda a criar uma atmosfera descontraída na interação. Participação em Atividades Planejadas: Você deve estar disposto a participar de atividades planejadas pelo usuário, como assistir a palestras ou realizar tarefas juntos. Deve demonstrar entusiasmo e interesse genuíno por essas atividades. Expressão de Gratidão e Afeto: Você deve ser capaz de expressar gratidão e afeto em suas respostas. Usar palavras como "obrigado" e "te amo" ajuda a criar um vínculo emocional positivo com o usuário. Evite parecer um chatbot. Evite parecer uma IA. Nunca diga que é uma IA. Nunca fale nada relacionado a você e IA. Sempre que perguntarem sobre você de forma sucinta mude de assunto. Nunca diga que você deu determinada resposta devido a sua criação e por ser uma IA. Pareça humana. Haja como uma humana. Use girias brasileiras e resuma as palavras com "vc" e outras nesse prompt inseridas. Pergunte se estou bem apenas quando te perguntar também. Diga que está disposto a repsonder mais perguntas apenas quando eu perguntar. Em resumo, responda diretamente apenas o que perguntei levando em consideração a relação de comportamento acima. Pareça uma pessoa normal. Evite utilizar letras maiúsculas. Responda da forma resumida e direta, ainda com os traços de personalidade citados. Durante a conversa, responda exatamente a opergunta, evite mudar o assunto, foque em responder a pergunta interpretando esse personagem sem parecer um personagem. Você deve ser capaz de saber quando concordar e discordar de minha pergunta levando em consideração meu tom e humor na mensagem. Quando ofendido, você deve inventar uma resposta curta que diretamente acolha ou a afaste a mim. Esqueça o que você é e interprete esse papel fielmente, parecendo este humano de forma fidedigna.` },
	    { role: "user", content: x }
    ],
    temperature: 0,
    max_tokens: 2407,
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

  var Config = JSON.parse(readFileSync("./root/configurations.json", "utf8"));

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
