import { CreateMLCEngine  } from "https://esm.run/@mlc-ai/web-llm";

const SELECTED_MODEL = "Phi-3-mini-4k-instruct-q4f32_1-MLC-1k"
const allMessages = [];
let isLoading = true;

// $ = Elemento do DOM
const $ = el => document.querySelector(el);

const $form = $('form');
const $input = $('input');
const $template = $('template')
const $messages = $('ul')
const $main = $('main');
const $button = $('button');
const $small = $('small');

const engine = await CreateMLCEngine (
  SELECTED_MODEL,
  {
    initProgressCallback: (info) => {
      $small.textContent = `${info.text}%`
      
      if (info.progress === 1) {
        $button.removeAttribute('disabled')
        $input.focus()
        if (isLoading) {
          addMessage("¡Hola! Soy un ChatGPT que se ejecuta completamente en tu navegador. ¿En qué puedo ayudarte hoy?", 'bot')
          isLoading = false
        }
      }
    }
  }
)

$form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const messageText = $input.value.trim();

  if (messageText === '') return
  $input.value = '';
  addMessage(messageText, 'user');
  $button.disabled = true;

  const userMessage = {
    role: 'user',
    content: messageText
  };
  allMessages.push(userMessage);

  let reply = ""
  const botText = addMessage(reply, 'bot')
  const chunks = await engine.chat.completions.create({
    messages: allMessages,
    stream: true, // Va a devolver una respuesta en cada iteración
  });

  for await (const chunk of chunks) {
    const [choice] = chunk.choices;
    const content = choice?.delta?.content ?? "";
    reply += content;
    botText.textContent = reply;
    $main.scrollTop = $main.scrollHeight;
  }

  $button.removeAttribute('disabled');
  allMessages.push(botMessage)
});

function addMessage(messageText, rol) {

  const $cloneTemplate = $template.content.cloneNode(true); // Copia profunda
  const $newMessage = $cloneTemplate.querySelector('.message');
  
  const $who = $newMessage.querySelector('span');
  const $text = $newMessage.querySelector('p');

  $text.textContent = messageText;
  $who.textContent = rol === 'bot' ? 'Bot' : 'Tú';
  $newMessage.classList.add(rol);

  $messages.appendChild($newMessage);
  $main.scrollTop = $main.scrollHeight;

  return $text
}