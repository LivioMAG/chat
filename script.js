const state = {
  stage: 'configuration',
  messages: [
    {
      role: 'agent',
      text: 'Willkommen! Erzähl mir etwas über dein Unternehmen.'
    }
  ],
  uploadMode: null
};

const navItems = document.querySelectorAll('.nav-item');
const workplacePage = document.getElementById('workplacePage');
const settingsPage = document.getElementById('settingsPage');
const chatStream = document.getElementById('chatStream');
const chatInput = document.getElementById('chatInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const uploadDocBtn = document.getElementById('uploadDocBtn');
const uploadMediaBtn = document.getElementById('uploadMediaBtn');
const statusBanner = document.getElementById('statusBanner');
const headerActionBtn = document.getElementById('headerActionBtn');

const uploadModal = document.getElementById('uploadModal');
const uploadModalTitle = document.getElementById('uploadModalTitle');
const uploadModalHint = document.getElementById('uploadModalHint');
const mediaTextField = document.getElementById('mediaTextField');
const mediaTextInput = document.getElementById('mediaTextInput');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const confirmUploadBtn = document.getElementById('confirmUploadBtn');

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

function updateWorkspaceHeader() {
  if (state.stage === 'configuration') {
    statusBanner.classList.remove('hidden');
    headerActionBtn.classList.add('hidden');
    return;
  }

  statusBanner.classList.add('hidden');
  headerActionBtn.classList.remove('hidden');

  if (state.stage === 'content') {
    headerActionBtn.textContent = 'Fragebogen herunterladen';
  } else {
    headerActionBtn.textContent = 'Kampagne veröffentlichen';
  }
}

function openUploadModal(mode) {
  state.uploadMode = mode;
  mediaTextInput.value = '';

  if (mode === 'media') {
    uploadModalTitle.textContent = 'Bild/Video und Text hochladen';
    uploadModalHint.textContent = 'Bitte lade ein Bild oder Video hoch und ergänze einen Text, bevor du auf Hochladen klickst.';
    mediaTextField.classList.remove('hidden');
  } else {
    uploadModalTitle.textContent = 'Dokument hochladen';
    uploadModalHint.textContent = 'Dummy-Interface: Dokument per Drag & Drop hinzufügen und mit Hochladen bestätigen.';
    mediaTextField.classList.add('hidden');
  }

  uploadModal.classList.remove('hidden');
}

function closeUploadModal() {
  state.uploadMode = null;
  uploadModal.classList.add('hidden');
}

function unlockContentStage() {
  if (state.stage !== 'configuration') return;

  state.stage = 'content';
  chatTabs.content.disabled = false;
  chatTabs.content.classList.remove('locked');
  uploadDocBtn.disabled = false;
  uploadMediaBtn.disabled = false;

  state.messages.push({
    role: 'agent',
    text: 'Konfiguration abgeschlossen. Du kannst jetzt den Fragebogen herunterladen und Input-Dokumente/Medien hochladen.'
  });
  updateWorkspaceHeader();
  renderChat();
}

function unlockCampaignStage() {
  if (state.stage !== 'content') return;

  state.stage = 'campaign';
  chatTabs.campaign.disabled = false;
  chatTabs.campaign.classList.remove('locked');
  state.messages.push({
    role: 'agent',
    text: 'Alle Inhalte vollständig. Kampagne kann jetzt veröffentlicht werden.'
  });
  updateWorkspaceHeader();
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

uploadDocBtn.addEventListener('click', () => openUploadModal('docs'));
uploadMediaBtn.addEventListener('click', () => openUploadModal('media'));

headerActionBtn.addEventListener('click', () => {
  if (state.stage === 'content') {
    state.messages.push({ role: 'agent', text: 'Der Fragebogen-Download wurde gestartet (Demo).' });
  } else if (state.stage === 'campaign') {
    state.messages.push({ role: 'agent', text: 'Kampagne wird veröffentlicht (Demo).' });
  }
  renderChat();
});

confirmUploadBtn.addEventListener('click', () => {
  if (state.uploadMode === 'media' && !mediaTextInput.value.trim()) {
    state.messages.push({ role: 'agent', text: 'Für Bild/Video-Uploads ist ein begleitender Text erforderlich.' });
    renderChat();
    return;
  }

  const modeText = state.uploadMode === 'media' ? 'Bild/Video + Text' : 'Dokument';
  state.messages.push({ role: 'agent', text: `${modeText} erfolgreich hochgeladen (Dummy).` });
  renderChat();
  closeUploadModal();
});

closeModalBtn.addEventListener('click', closeUploadModal);
cancelModalBtn.addEventListener('click', closeUploadModal);
uploadModal.addEventListener('click', (event) => {
  if (event.target === uploadModal) closeUploadModal();
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

updateWorkspaceHeader();
renderChat();
showPage('workplace');
