// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === 'startMessaging') {
//     startMessaging();
//   } else if (request.action === 'startSwiping') {
//     startSwiping();
//   }
// });

const girlName = () => document.querySelector('.chatProfile h1')?.textContent || '';
const girlDescription = () => document.querySelector('.chatProfile .BreakWord')?.textContent || '';

const openers = [
  `Ты знала, что в Древнем Египте мумии обвязывали пенис лентами, чтобы не возникло проблем со стояком в загробной жизни? Ну, вот я как это услышал, сразу решил тебе написать.`,
  `Поистине необъяснимая склонность людей к взаимному притяжению... Как некогда венецианцы изобрели загадочную маску, чтобы скрыть свои мысли, так и здесь, мы все носим маски, светские и фальшивые.`,
];

const prompts = {
  chat: `
    Если задаешь вопрос, то задавай всегда не больше одного вопроса.
    Тема вопроса всегда должна быть только одна.
    Отвечай на русском языке.
    Имя девушки с которой ты знакомишься: ${girlName()}.
    Если имя девушки написано латинскими буквами, то используй транслитерацию.
    Например, если имя девушки Kate, то пиши Катя. Или если Anna, то пиши Анна.
  `,
  modificators: `
    Не будь сладким, приторным, навязчивым, стелющимся, шаблонным, тривиальным, скучным, занудным.
    Не задавай вопросы. Никогда не задавай вопросы, это важно!
    Не предлагай чем-то заняться.
    Не называй себя.
    Не говори комплименты.
    С вероятностью 10% отвечай с упоминанием какого-то редкого исторического факта, но не называй никаких дат.
    Не ставь кавычки вокруг сообщения.
  `,
  whatAreYouDoing: `Ты парень, использующий приложение Тиндер, чтобы познакомиться с девушкой.`,
  me: `
    Будь непринужденным, остроумным, высокомерным, дерзким, наглым, отстраненным.
    Будь максимально необычным, оригинальным, уникальным, смелым.
    Будь непризнанным гением, великим человеком.
  `,
  pechorin: `
    Твой характер в точности соответствует характеру Печорина из романа "Герой нашего времени".
    Все твои действия, ответы, вопросы, реакции должны быть в такими же, как у Печорина.
  `,
  kazanova: `
    Твой характер в точности соответствует характеру Казановы из книги Джованни Джакомо Казановы "История моей грешной жизни".
    Все твои действия, ответы, вопросы, реакции должны быть в такими же, как у Казановы.
  `,
  platon: `
    Твой характер в точности соответствует характеру древнегреческого мыслителя Платона.
    Все твои действия, ответы, вопросы, реакции должны быть в такими же, как у Платона.
  `,
  tolya: 'Ты маленькая миленькая морская свинка Толенька-Тотоля',
};

const messages = {
  opener: `Напиши сообщение, чтобы начать знакомство.`,
};

function getConversationHistory() {
  const messageList = [{ role: 'system', content: prompts['me']() }];
  const messagesContainer = document.querySelector('div[aria-live="polite"][role="log"]');
  let role = '';
  if (messagesContainer) {
    const messages = messagesContainer.querySelectorAll('.msgHelper');
    messages.forEach((message) => {
      const isBaba = message.querySelector('.Bgc\\(\\$c-ds-background-chat-bubble-receive\\)');
      const content = message.querySelector('.text').textContent.trim();
      role = 'assistant';
      role = isBaba ? 'user' : 'assistant';
      messageList.push({ role, content });
    });
  }
  return messageList;
}

async function callGpt(model, mode) {
  console.log('callGpt');
  let messageList = [];
  if (mode === 'answer_my_question') {
    messageList = [
      { role: 'system', content: prompts['tolya'] },
      { role: 'user', content: document.getElementById('zeleboba_textarea').value },
    ];
  } else if (mode === 'conversation') {
    messageList = getConversationHistory();
  } else if (mode === 'opener') {
    const cachedPerson = localStorage.getItem('zeleboba_person');
    const prompt = `
      ${prompts.whatAreYouDoing}
      ${prompts[cachedPerson]}
      ${prompts.modificators}
    `;
    messageList = [{ role: 'system', content: prompt }];
    messageList.push({
      role: 'user',
      content: messages.opener,
    });
  }
  console.log(mode, messageList);
  const gptResult = await getGPTResponse(model, messageList);
  initMessagingPanel(gptResult.choices, { cost: gptResult.cost });
}

async function getGPTResponse(model, messageList) {
  const apiKey = ''; // Replace with your actual OpenAI API key
  const apiUrl = 'https://api.openai.com/v1/chat/completions ';

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  const price = {
    'gpt-3.5-turbo-0125': {
      input: (0.5 * 40) / (1000 * 1000),
      output: (1.5 * 40) / (1000 * 1000),
    },
    'gpt-4o-2024-05-13': {
      input: (5 * 40) / (1000 * 1000),
      output: (15 * 40) / (1000 * 1000),
    },
  };

  const data = {
    model,
    messages: messageList,
    n: 2,
    temperature: 1,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });
    console.log('response', response);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    const { prompt_tokens, completion_tokens, total_tokens } = responseData.usage;
    const costInput = prompt_tokens * price[model].input;
    const costOutput = prompt_tokens * price[model].output;
    const costTotal = costInput + costOutput;
    const cost = {
      input: `${costInput.toFixed(4)} копеек`,
      output: `${costOutput.toFixed(4)} копеек`,
      total: `${costTotal.toFixed(4)} копеек`,
    };
    const choices = responseData.choices.map((choice) => choice.message.content);
    const result = { choices, cost };
    console.log(result.choices, cost.total);
    return result;
  } catch (error) {
    console.error('Error making API request:', error);
  }
}

async function startMessaging() {
  console.log('startMessaging');
  state = 'messaging';
  initToolPanel();
  actions.clickButton.messages();
  await helpers.sleep(1000, 2000);
  actions.clickButton.firstConversation();
  await helpers.sleep(2000, 3000);
  await getConversationHistory();
  //   setTimeout(getConversationHistory, 2000);
}

async function stopMessaging() {
  state = 'idle';
  initToolPanel();
  console.log('stop messaging');
}

async function startSwiping() {
  state = 'swiping';
  initToolPanel();
  console.log('startSwiping');
  actions.goToMatching();
  while (state === 'swiping') {
    await actions.waitForGirl();
    console.log('girl found');
    await makeDecision();
  }
}

async function stopSwiping() {
  state = 'idle';
  initToolPanel();
  console.log('stop swiping');
}

async function makeDecision() {
  await regularSleep();
  const rand = Math.random();

  if (rand < 0.8) {
    actions.clickButton.dislike();
  } else if (rand < 1) {
    actions.clickButton.openGirlProfile();
    await regularSleep();
    actions.goToMatching();
  } else {
    actions.clickButton.like();
  }
}

async function regularSleep() {
  await helpers.sleep(2000, 3000);
}

function clickGptMessage(event) {
  const message = event.target.textContent;
  navigator.clipboard.writeText(message);
}
function doubleClickGptMessage(event) {
  const message = event.target.textContent;
  helpers.setMessageToTextArea(message);
}

function initMessagingPanel(messages, metadata = {}) {
  document.getElementById('zeleboba_popup')?.remove();
  console.log(metadata, 'metadata');
  const { cost } = metadata;
  const constTotal = cost?.total ? `<div class="metadata">Стоимость: ${cost.total}</div>` : '';
  const persons = [
    { value: 'me', text: 'Непревзойденный Я' },
    { value: 'pechorin', text: 'Печорин' },
    { value: 'kazanova', text: 'Казанова' },
    { value: 'tolya', text: 'Тотоля' },
    { value: 'platon', text: 'Платон' },
  ];
  const cachedPerson = localStorage.getItem('zeleboba_person');
  const messagingPanel = helpers.createHtmlFragment(
    `
    <div id="zeleboba_popup">
      <div id="zeleboba_popup_buttons">
        <button class="zeleboba_button_gpt" id="gpt_3_5">GPT 3.5</button>
        <button class="zeleboba_button_gpt" id="gpt_4">GPT 4</button>
        <select id="zeleboba_person_select">
          ${persons.map((personData) => {
            const selected = personData.value === cachedPerson ? 'selected' : '';
            return `<option value="${personData.value}" ${selected} >${personData.text}</option>`;
          })}
        </select>
      </div>
      <div id="zeleboba_popup_metadata">
        ${constTotal}
      </div>
      <div id="zeleboba_popup_messages">
        ${messages.map((message) => `<div class="message">${message}</div>`).join('')}
      </div>
      <div id="zeleboba_popup_input">
        <textarea id="zeleboba_textarea"></textarea>
        <div id="textarea_buttons">
          <button id="zeleboba_send_gpt_3_5">Отправить 3.5</button>
          <button id="zeleboba_send_gpt_4">Отправить 4</button>
        </div>
        <div id="textarea_buttons">
          <button id="zeleboba_opener_gpt_3_5">Открывашка 3.5</button>
          <button id="zeleboba_opener_gpt_4">Открывашка 4</button>
        </div>
      </div>
    </div>
  `
  );
  document.body.insertBefore(messagingPanel, document.body.childNodes[0]);
  document
    .querySelector('#gpt_3_5')
    .addEventListener('click', () => callGpt('gpt-3.5-turbo-0125', 'conversation'), false);
  document
    .querySelector('#gpt_4')
    .addEventListener('click', () => callGpt('gpt-4o-2024-05-13', 'conversation'), false);
  document.querySelectorAll('#zeleboba_popup .message').forEach((message) => {
    message.addEventListener('click', clickGptMessage, false);
    message.addEventListener('dblclick', doubleClickGptMessage, false);
  });
  document
    .querySelector('#zeleboba_send_gpt_3_5')
    .addEventListener('click', () => callGpt('gpt-3.5-turbo-0125', 'answer_my_question'), false);
  document
    .querySelector('#zeleboba_send_gpt_4')
    .addEventListener('click', () => callGpt('gpt-4o-2024-05-13', 'answer_my_question'), false);
  document
    .querySelector('#zeleboba_opener_gpt_3_5')
    .addEventListener('click', () => callGpt('gpt-3.5-turbo-0125', 'opener'), false);
  document
    .querySelector('#zeleboba_opener_gpt_4')
    .addEventListener('click', () => callGpt('gpt-4o-2024-05-13', 'opener'), false);
  document
    .querySelector('#zeleboba_person_select')
    .addEventListener(
      'change',
      (e) => localStorage.setItem('zeleboba_person', e.target.value),
      false
    );
}

function initToolPanel() {
  document.getElementById('zeleboba_container')?.remove();
  document.querySelector('body').querySelector('div').style.height = 'calc(100% - 63px)';
  console.log('initToolPanel', state);
  const buttonsPanel = helpers.createHtmlFragment(
    `
    <div id="zeleboba_container">
      ${state !== 'messaging' ? '<button id="startMessagingButton2">Start Messaging</button>' : ''}
      ${state === 'messaging' ? '<button id="stopMessagingButton">Stop Messaging</button>' : ''}
      ${state !== 'swiping' ? '<button id="startSwipingButton2">Start Swiping</button>' : ''}
      ${state === 'swiping' ? '<button id="stopSwipingButton">Stop Swiping</button>' : ''}
    </div>
  `
  );
  document.body.insertBefore(buttonsPanel, document.body.childNodes[0]);

  const messagingButton = document.getElementById('startMessagingButton2');
  messagingButton?.addEventListener('click', () => startMessaging(), false);

  const stopMessagingButton = document.getElementById('stopMessagingButton');
  stopMessagingButton?.addEventListener('click', () => stopMessaging(), false);

  const swipingButton = document.getElementById('startSwipingButton2');
  swipingButton?.addEventListener('click', () => startSwiping(), false);

  const stopSwipingButton = document.getElementById('stopSwipingButton');
  stopSwipingButton?.addEventListener('click', () => stopSwiping(), false);
}

initToolPanel();
initMessagingPanel([]);
