document.getElementById('startMessagingButton').addEventListener('click', function () {
  console.log('startMessagingButton clicked');
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'startMessaging' });
  });
});
document.getElementById('startSwipingButton').addEventListener('click', function () {
  console.log('startSwipingButton clicked');
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'startSwiping' });
  });
});
