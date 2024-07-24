// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === 'startMessaging') {
//     startMessaging();
//   } else if (request.action === 'startSwiping') {
//     startSwiping();
//   }
// });

const persons = [
  { value: 'me', text: 'Я' },
  { value: 'pechorin', text: 'Печорин' },
  { value: 'kazanova', text: 'Казанова' },
  { value: 'tolya', text: 'Тотоля' },
  { value: 'bydlo', text: 'Быдло' },
  { value: 'onegin', text: 'Онегин' },
];
const languages = [
  {
    value: 'ru',
    text: 'RU',
    prompt: 'Отвечай на русском языке, это важно, пиши на русском!',
    translate: 'переводи отправленный текст на русский язык',
  },
  {
    value: 'ua',
    text: 'UA',
    prompt: 'Відповідай українською мовою, це важливо, пиши українською мовою',
    translate: 'перекладай відправлений текст українською мовою',
  },
  {
    value: 'us',
    text: 'US',
    prompt: 'Answer on English language, it is important, write on English',
    translate: 'translate the sent text into English',
  },
];

function getConversationHistory() {
  const cachedPerson = localStorage.getItem('zeleboba_person');
  const systemMessage = `
    ${prompts[cachedPerson]}
    ${prompts.modificators()}
  `;
  const messageList = [{ role: 'system', content: systemMessage }];
  const messagesContainer = document.querySelector('div[aria-live="polite"][role="log"]');
  let role = '';
  if (messagesContainer) {
    const messages = messagesContainer.querySelectorAll('.msgHelper');
    messages.forEach((message) => {
      const isBaba =
        message.querySelector('.Bgc\\(\\$c-ds-background-chat-bubble-receive\\)') ||
        message.querySelector('.C\\(\\$c-ds-text-chat-bubble-receive\\)');
      const content = message.querySelector('.text').textContent.trim();
      role = 'assistant';
      role = isBaba ? 'user' : 'assistant';
      messageList.push({ role, content });
    });
  }
  return messageList;
}

async function callGpt(model, mode) {
  let messageList = [];
  const options = {};
  if (mode === 'answer_my_question') {
    messageList = [
      { role: 'system', content: prompts.empty },
      { role: 'user', content: document.getElementById('zeleboba_textarea').value },
    ];
  } else if (mode === 'conversation') {
    messageList = getConversationHistory();
  } else if (mode === 'opener') {
    const cachedPerson = localStorage.getItem('zeleboba_person');
    const prompt = `
      ${prompts.whatAreYouDoing}
      ${prompts[cachedPerson]}
      ${prompts.modificators()}
    `;
    messageList = [{ role: 'system', content: prompt }];
    messageList.push({
      role: 'user',
      content: messages.opener,
    });
  } else if (mode === 'translate') {
    const cachedLang = localStorage.getItem('zeleboba_lang');
    const selectedLang = languages.find((lang) => lang.value === cachedLang);
    const text = document.getElementById('zeleboba_textarea').value;
    messageList = [{ role: 'system', content: selectedLang.translate }];
    messageList.push({ role: 'user', content: text });
    options['n'] = 1;
  }
  console.log(mode, messageList);
  const gptResult = await getGPTResponse(model, messageList, options);
  initMessagingPanel(gptResult.choices, { cost: gptResult.cost });
}

async function getGPTResponse(model, messageList, options = {}) {
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
    n: options['n'] || 2,
    temperature: 1,
    max_tokens: 200,
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

async function startSwiping() {
  state = 'swiping';
  initMessagingPanel([]);
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
  initMessagingPanel([]);
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
  document.getElementById('zeleboba_hide_show_button')?.remove();
  const { cost } = metadata;
  const constTotal = cost?.total ? `<div class="metadata">Стоимость: ${cost.total}</div>` : '';
  const cachedPerson = localStorage.getItem('zeleboba_person');
  const cachedLang = localStorage.getItem('zeleboba_lang');
  const shouldHideAll = localStorage.getItem('zeleboba_hide_all') === 'true';
  const shouldHideTextarea = localStorage.getItem('zeleboba_hide_textarea') === 'true';

  const visibilityStyle = shouldHideAll ? 'display: none;' : '';
  const textareaStyle = shouldHideTextarea ? 'display: none;' : '';
  const swipeButton =
    state === 'swiping'
      ? '<button class="zeleboba_button_gpt" id="zeleboba_stop_swipe">Stop</button>'
      : '<button class="zeleboba_button_gpt" id="zeleboba_start_swipe">Swipe</button>';
  const messagingPanel = helpers.createHtmlFragment(
    `
    <button id="zeleboba_hide_show_button">
      All
    </button>
    <button id="textarea_hide_show_button">
      Textarea
    </button>
    <div id="zeleboba_popup" style="${visibilityStyle}">
      <div class="zeleboba_popup_buttons">
        <button class="zeleboba_button_gpt" id="gpt_3_5">GPT 3.5</button>
        <button class="zeleboba_button_gpt" id="gpt_4">GPT 4</button>
        ${swipeButton}
        <select id="zeleboba_person_select">
          ${persons.map((personData) => {
            const selected = personData.value === cachedPerson ? 'selected' : '';
            return `<option value="${personData.value}" ${selected} >${personData.text}</option>`;
          })}
        </select>
        <select id="zeleboba_lang_select">
          ${languages.map((langData) => {
            const selected = langData.value === cachedLang ? 'selected' : '';
            return `<option value="${langData.value}" ${selected} >${langData.text}</option>`;
          })}
        </select>
      </div>
      <div class="zeleboba_popup_buttons">
        <button id="zeleboba_opener_gpt_3_5">Opener 3.5</button>
        <button id="zeleboba_opener_gpt_4">Opener 4</button>
      </div>
      <div id="zeleboba_popup_metadata">
        ${constTotal}
      </div>
      <div id="zeleboba_popup_messages">
        ${messages.map((message) => `<div class="message">${message}</div>`).join('')}
      </div>
      <div id="zeleboba_popup_input" style="${textareaStyle}">
        <textarea id="zeleboba_textarea"></textarea>
        <div id="textarea_buttons">
          <button id="zeleboba_send_gpt_3_5">Send 3.5</button>
          <button id="zeleboba_send_gpt_4">Send 4</button>
        </div>
        <div id="textarea_buttons">
          <button id="zeleboba_translate_gpt_3_5">Translate 3.5</button>
          <button id="zeleboba_translate_gpt_4">Translate 4</button>
        </div>
      </div>
    </div>
  `
  );
  document.body.insertBefore(messagingPanel, document.body.childNodes[0]);
  document.querySelector('#zeleboba_hide_show_button').addEventListener(
    'click',
    () => {
      const shouldHideAll = localStorage.getItem('zeleboba_hide_all') === 'true';
      localStorage.setItem('zeleboba_hide_all', !shouldHideAll);
      initMessagingPanel([]);
    },
    false
  );
  if (shouldHideAll) {
    return;
  }
  document.querySelector('#textarea_hide_show_button').addEventListener(
    'click',
    () => {
      const shouldHideTextarea = localStorage.getItem('zeleboba_hide_textarea') === 'true';
      localStorage.setItem('zeleboba_hide_textarea', !shouldHideTextarea);
      initMessagingPanel([]);
    },
    false
  );
  document
    .getElementById('zeleboba_start_swipe')
    ?.addEventListener('click', () => startSwiping(), false);
  document
    .getElementById('zeleboba_stop_swipe')
    ?.addEventListener('click', () => stopSwiping(), false);
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
    .querySelector('#zeleboba_translate_gpt_3_5')
    .addEventListener('click', () => callGpt('gpt-3.5-turbo-0125', 'translate'), false);
  document
    .querySelector('#zeleboba_translate_gpt_4')
    .addEventListener('click', () => callGpt('gpt-4o-2024-05-13', 'translate'), false);
  document
    .querySelector('#zeleboba_person_select')
    .addEventListener(
      'change',
      (e) => localStorage.setItem('zeleboba_person', e.target.value),
      false
    );
  document
    .querySelector('#zeleboba_lang_select')
    .addEventListener(
      'change',
      (e) => localStorage.setItem('zeleboba_lang', e.target.value),
      false
    );
}

initMessagingPanel([]);
