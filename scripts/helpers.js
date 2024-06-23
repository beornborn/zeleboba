const helpers = {
  sleep,
  findElementByText,
  createHtmlFragment,
  location: {
    isOnMatchesPage: () =>
      isOnPage('/app/matches') || (isOnPage('/app/recs') && !isOnPage('/app/recs/profile')),
    isOnMatchesProfilePage: () => isOnPage('/app/recs/profile'),
    isOnMessagesPage: () => isOnPage('/app/messages'),
    isOnProfilePage: () => isOnPage('/app/profile'),
  },
};

function sleep(min, max) {
  const sleepTime = min + Math.random() * (max - min);
  console.log(`Sleeping for ${sleepTime / 1000} seconds`);
  return new Promise((resolve) => setTimeout(resolve, sleepTime));
}

function findElementByText(elements, text) {
  let found;
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].textContent == text) {
      return elements[i];
    }
  }
}

function createHtmlFragment(htmlStr) {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  div.innerHTML = htmlStr;
  while (div.firstChild) {
    fragment.appendChild(div.firstChild);
  }
  return fragment;
}

function isOnPage(path) {
  return window.location.pathname.includes(path);
}
