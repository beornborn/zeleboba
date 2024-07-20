const helpers = {
  sleep,
  girlName: () => document.querySelector('.chatProfile h1')?.textContent || '',
  girlDescription: () => document.querySelector('.chatProfile .BreakWord')?.textContent || '',
  rand: (arr) => arr[Math.floor(Math.random() * arr.length)],
  findElementByText,
  createHtmlFragment,
  setMessageToTextArea,
  location: {
    isOnMatchesPage: () =>
      isOnPage('/app/matches') || (isOnPage('/app/recs') && !isOnPage('/app/recs/profile')),
    isOnMatchesProfilePage: () => isOnPage('/app/recs/profile'),
    isOnMessagesPage: () => isOnPage('/app/messages'),
    isOnProfilePage: () => isOnPage('/app/profile'),
  },
};

function setMessageToTextArea(message) {
  const openRequest = indexedDB.open('keyval-store');
  openRequest.onsuccess = function () {
    db = openRequest.result;
    const objectStore = db.transaction(['keyval'], 'readwrite').objectStore('keyval');
    const request = objectStore.get('persist::sendMessages');
    request.onsuccess = (event) => {
      const data = JSON.parse(event.target.result);
      data.text[window.location.pathname.replace('/app/messages/', '')] = message;
      const jsonData = JSON.stringify(data);
      const request = objectStore.openCursor(IDBKeyRange.only('persist::sendMessages'));
      request.onsuccess = () => {
        const cursor = request.result;
        const updateRequest = cursor.update(jsonData);
        updateRequest.onsuccess = () => window.location.reload();
      };
    };
  };
}

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
