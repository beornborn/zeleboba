const buttonSelectors = {
  like: () => {
    return document
      .querySelector(
        "path[d='M21.994 10.225c0-3.598-2.395-6.212-5.72-6.212-1.78 0-2.737.647-4.27 2.135C10.463 4.66 9.505 4 7.732 4 4.407 4 2 6.62 2 10.231c0 1.52.537 2.95 1.533 4.076l8.024 7.357c.246.22.647.22.886 0l7.247-6.58.44-.401.162-.182.168-.174a6.152 6.152 0 0 0 1.54-4.09']"
      )
      ?.closest('button');
  },
  dislike: () => {
    return document
      .querySelector(
        "path[d='m15.44 12 4.768 4.708c1.056.977 1.056 2.441 0 3.499-.813 1.057-2.438 1.057-3.413 0L12 15.52l-4.713 4.605c-.975 1.058-2.438 1.058-3.495 0-1.056-.813-1.056-2.44 0-3.417L8.47 12 3.874 7.271c-1.138-.976-1.138-2.44 0-3.417a1.973 1.973 0 0 1 3.25 0L12 8.421l4.713-4.567c.975-1.139 2.438-1.139 3.413 0 1.057.814 1.057 2.44 0 3.417L15.44 12Z']"
      )
      ?.closest('button');
  },
  openGirlProfile: () => {
    return document
      .querySelector(
        "path[d='M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z']"
      )
      ?.closest('button');
  },
};

const actions = {
  clickButton: {
    like: () => clickButton(buttonSelectors.like, 'LIKE'),
    dislike: () => clickButton(buttonSelectors.dislike, 'DISLIKE'),
    openGirlProfile: () => clickButton(buttonSelectors.openGirlProfile, 'OPEN GIRL PROFILE'),
  },
  waitForGirl,
  goToMatching,

  goToMessages,
  goToProfile,
  goToConversation,
};

function clickButton(selector, buttonName) {
  const button = selector();
  if (button) {
    button.click();
    console.log(`clicked on ${buttonName} button`);
  } else {
    console.log(`cannot find ${buttonName} button`);
  }
}

async function waitForGirl() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      console.log('waiting for girl...');
      const girlLoaded = buttonSelectors.openGirlProfile();
      if (girlLoaded || state === 'idle') {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
}

function goToMatching() {
  if (helpers.location.isOnMatchesPage()) {
    return;
  }
  const link =
    document.querySelector("a[href='/app/matches']") ||
    document.querySelector("a[href='/app/recs']");
  if (link) {
    link.click();
    console.log('clicked on matches link');
  } else {
    console.log('cannot find matches link');
  }
}

// ------------------------------------------------------------

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

function goToProfile() {
  const profileLink = document.querySelector("a[title='My Profile']");
  if (profileLink) {
    profileLink.click();
    console.log('clicked on profile link');
  } else {
    console.log('cannot find profile link');
  }
}

function findElementByText(elements, text) {
  let found;
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].textContent == text) {
      return elements[i];
    }
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
