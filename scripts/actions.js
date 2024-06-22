const actions = {
  goToMessages,
  goToSwipes,
  closeMessages,
  goToConversation,
};

function goToMessages() {
  const buttons = document.querySelectorAll("button[type='button'][aria-selected='false']");
  const messagesButton = helpers.findElementByText(buttons, 'Messages');
  if (messagesButton) {
    messagesButton.click();
    console.log('clicked on messages button');
  } else {
    console.log('already on messages');
  }
}

function goToSwipes() {
  const profileLink = document.querySelector("a[title='My Profile']");
  if (profileLink) {
    profileLink.click();
    console.log('clicked on profile link');
  } else {
    console.log('cannot find profile link');
  }
}

function closeMessages() {
  const matchesButton = document.querySelector("a[href='/app/matches']");
  if (matchesButton) {
    matchesButton.click();
    console.log('clicked on matches button');
  } else {
    console.log('cannot find matches button');
  }
}

function goToConversation() {
  const firstMessageElement = document.querySelector('.messageList li');
  if (firstMessageElement) {
    console.log('clicked on first conversation');
    firstMessageElement.firstChild.click();
  } else {
    console.log('First message element not found');
  }
}
