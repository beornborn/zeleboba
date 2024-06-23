// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === 'startMessaging') {
//     startMessaging();
//   } else if (request.action === 'startSwiping') {
//     startSwiping();
//   }
// });

async function startMessaging() {
  console.log('startMessaging');
  goToMessages();
  await helpers.sleep(1000, 2000);
  goToConversation();
  //   setTimeout(getConversationHistory, 2000);
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

function initToolPanel() {
  document.getElementById('zeleboba_container')?.remove();

  const buttonsPanel = helpers.createHtmlFragment(
    `
    <div id="zeleboba_container">
      <button id="startMessagingButton2">
        Start Messaging
      </button>
      ${state === 'idle' ? '<button id="startSwipingButton2">Start Swiping</button>' : ''}
      ${state === 'swiping' ? '<button id="stopSwipingButton">Stop Swiping</button>' : ''}
    </div>
  `
  );
  document.body.insertBefore(buttonsPanel, document.body.childNodes[0]);

  const messagingButton = document.getElementById('startMessagingButton2');
  messagingButton.addEventListener('click', () => startMessaging(), false);

  const swipingButton = document.getElementById('startSwipingButton2');
  swipingButton?.addEventListener('click', () => startSwiping(), false);

  const stopSwipingButton = document.getElementById('stopSwipingButton');
  stopSwipingButton?.addEventListener('click', () => stopSwiping(), false);
}

initToolPanel();
