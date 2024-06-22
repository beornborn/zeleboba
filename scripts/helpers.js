const helpers = {
  sleep,
  findElementByText,
};

function sleep(min, max) {
  const sleepTime = min + Math.random() * (max - min);
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

const locationHelper = {
  isOnMatchesPage: () =>
    isOnPage('/app/matches') || (isOnPage('/app/recs') && !isOnPage('/app/recs/profile')),
  isOnMatchesProfilePage: () => isOnPage('/app/recs/profile'),
  isOnMessagesPage: () => isOnPage('/app/messages'),
  isOnProfilePage: () => isOnPage('/app/profile'),
};

function isOnPage(path) {
  return window.location.pathname.includes(path);
}
