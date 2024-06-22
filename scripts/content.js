chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'startMessaging') {
    startMessaging();
  } else if (request.action === 'startSwiping') {
    startSwiping();
  }
});

async function startMessaging() {
  console.log('startMessaging');
  goToMessages();
  await helpers.sleep(1000, 2000);
  goToConversation();
  //   setTimeout(getConversationHistory, 2000);
}

async function startSwiping() {
  console.log('startSwiping');
}

function initToolPanel() {
  const buttonsPanel = helpers.createHtmlFragment(
    `
    <div id="zeleboba_container">
      <button id="startMessagingButton2">
        Start Messaging
      </button>
      <button id="startSwipingButton2">
        Start Swiping
      </button>
    </div>
  `
  );
  document.body.insertBefore(buttonsPanel, document.body.childNodes[0]);

  const swipingButton = document.getElementById('startSwipingButton2');
  swipingButton.addEventListener('click', () => startSwiping(), false);

  const messagingButton = document.getElementById('startMessagingButton2');
  messagingButton.addEventListener('click', () => startMessaging(), false);
}

initToolPanel();
