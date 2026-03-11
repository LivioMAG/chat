const state = {
  stage: 'configuration',
  messages: [
    {
      role: 'agent',
      text: 'Willkommen! Erzähl mir etwas über dein Unternehmen.'
    }
  ]
};

const navItems = document.querySelectorAll('.nav-item');
const workplacePage = document.getElementById('workplacePage');
const settingsPage = document.getElementById('settingsPage');
const chatStream = document.getElementById('chatStream');
const chatInput = document.getElementById('chatInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const publishCampaignBtn = document.getElementById('publishCampaignBtn');
const chatTabs = {
  config: document.querySelector('.chat-tab[data-tab="config"]'),
  content: document.querySelector('.chat-tab[data-tab="content"]'),
  campaign: document.querySelector('.chat-tab[data-tab="campaign"]')
};

function showPage(pageKey) {
  const isWorkplace = pageKey === 'workplace';
  workplacePage.classList.toggle('active-page', isWorkplace);
  settingsPage.classList.toggle('active-page', !isWorkplace);

  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.page === pageKey);
  });
}

function renderChat() {
  chatStream.innerHTML = '';
  state.messages.forEach((entry) => {
    const msg = document.createElement('div');
    msg.className = `message ${entry.role}`;
    msg.textContent = entry.text;
    chatStream.appendChild(msg);
  });
  chatStream.scrollTop = chatStream.scrollHeight;
}

function unlockContentStage() {
  if (state.stage !== 'configuration') return;

  state.stage = 'content';
  chatTabs.content.disabled = false;
  chatTabs.content.classList.remove('locked');
  state.messages.push({
    role: 'agent',
    text: 'Bitte lade den Fragebogen herunter, fülle ihn aus und lade ihn anschließend hoch.'
  });
  renderChat();
}

function unlockCampaignStage() {
  if (state.stage !== 'content') return;

  state.stage = 'campaign';
  chatTabs.campaign.disabled = false;
  chatTabs.campaign.classList.remove('locked');
  publishCampaignBtn.classList.remove('hidden');
  state.messages.push({
    role: 'agent',
    text: 'Alle Inhalte vollständig. Du kannst jetzt die Kampagne freischalten und veröffentlichen.'
  });
  renderChat();
}

sendMessageBtn.addEventListener('click', () => {
  const value = chatInput.value.trim();
  if (!value) return;

  state.messages.push({ role: 'user', text: value });
  chatInput.value = '';
  renderChat();

  if (state.stage === 'configuration') {
    unlockContentStage();
  } else if (state.stage === 'content') {
    unlockCampaignStage();
  }
});

chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessageBtn.click();
  }
});

navItems.forEach((item) => {
  item.addEventListener('click', () => showPage(item.dataset.page));
});

Object.values(chatTabs).forEach((tab) => {
  tab.addEventListener('click', () => {
    Object.values(chatTabs).forEach((entry) => entry.classList.remove('active'));
    tab.classList.add('active');
  });
});

renderChat();
showPage('workplace');
