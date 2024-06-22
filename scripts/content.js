chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'startMessaging') {
    startMessaging();
  } else if (request.action === 'startSwiping') {
    startSwiping();
  }
});

async function startMessaging() {
  goToMessages();
  await helpers.sleep(1000, 2000);
  goToConversation();
  //   setTimeout(getConversationHistory, 2000);
}

async function startSwiping() {
  console.log('startSwiping');
}
