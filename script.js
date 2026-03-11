const state = {
  stage: 'configuration',
  messages: [
    {
      role: 'agent',
      text: 'Willkommen! Erzähl mir etwas über dein Unternehmen.'
    }
  ],
  uploadMode: null,
  inputDocuments: [
    { id: 'in-1', name: 'Fragebogen.pdf', type: 'Formular', date: '12.03', status: 'OK' },
    { id: 'in-2', name: 'Briefing.docx', type: 'Text', date: '12.03', status: 'OK' }
  ],
  outputDocuments: [
    { id: 'out-1', name: 'Kampagnenanalyse.pdf', type: 'Report', date: '14.03' },
    { id: 'out-2', name: 'Contentstrategie.pdf', type: 'Strategie', date: '14.03' }
  ]
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
const headerQuestionnaireBtn = document.getElementById('headerQuestionnaireBtn');
const headerLandingPageBtn = document.getElementById('headerLandingPageBtn');
const inputDocsTableBody = document.getElementById('inputDocsTableBody');
const outputDocsTableBody = document.getElementById('outputDocsTableBody');

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


function getSortedInputDocuments() {
  return [...state.inputDocuments].sort((a, b) => {
    if (a.id === 'in-1') return -1;
    if (b.id === 'in-1') return 1;
    return 0;
  });
}

function renderDocuments() {
  inputDocsTableBody.innerHTML = '';
  outputDocsTableBody.innerHTML = '';

  getSortedInputDocuments().forEach((doc) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${doc.name}</td>
      <td>${doc.type}</td>
      <td>${doc.date}</td>
      <td><span class="status-pill">${doc.status}</span></td>
      <td>
        <div class="table-actions">
          <button class="table-action-btn" title="Datei herunterladen" aria-label="Datei herunterladen" data-action="download" data-type="input" data-id="${doc.id}"><span aria-hidden="true">⬇️</span></button>
          <button class="table-action-btn danger" title="Datei löschen" aria-label="Datei löschen" data-action="remove" data-type="input" data-id="${doc.id}"><span aria-hidden="true">🗑️</span></button>
          <button class="table-action-btn" title="Status anzeigen" aria-label="Status anzeigen" data-action="status" data-type="input" data-id="${doc.id}"><span aria-hidden="true">ℹ️</span></button>
        </div>
      </td>
    `;
    inputDocsTableBody.appendChild(row);
  });

  if (!state.inputDocuments.length) {
    const empty = document.createElement('tr');
    empty.innerHTML = '<td colspan="5" class="empty-cell">Keine Input-Dokumente vorhanden.</td>';
    inputDocsTableBody.appendChild(empty);
  }

  state.outputDocuments.forEach((doc) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${doc.name}</td>
      <td>${doc.type}</td>
      <td>${doc.date}</td>
      <td>
        <div class="table-actions">
          <button class="table-action-btn" title="Datei herunterladen" aria-label="Datei herunterladen" data-action="download" data-type="output" data-id="${doc.id}"><span aria-hidden="true">⬇️</span></button>
          <button class="table-action-btn danger" title="Datei löschen" aria-label="Datei löschen" data-action="remove" data-type="output" data-id="${doc.id}"><span aria-hidden="true">🗑️</span></button>
          <button class="table-action-btn" title="Status anzeigen" aria-label="Status anzeigen" data-action="status" data-type="output" data-id="${doc.id}"><span aria-hidden="true">ℹ️</span></button>
        </div>
      </td>
    `;
    outputDocsTableBody.appendChild(row);
  });

  if (!state.outputDocuments.length) {
    const empty = document.createElement('tr');
    empty.innerHTML = '<td colspan="4" class="empty-cell">Keine Dokumente von Ben vorhanden.</td>';
    outputDocsTableBody.appendChild(empty);
  }
}

function triggerDocumentDownload(doc) {
  const blob = new Blob([`Demo-Download für ${doc.name}`], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = doc.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function handleDocumentAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, type, id } = button.dataset;
  const listKey = type === 'input' ? 'inputDocuments' : 'outputDocuments';
  const docs = state[listKey];
  const doc = docs.find((entry) => entry.id === id);
  if (!doc) return;

  if (action === 'download') {
    triggerDocumentDownload(doc);
    state.messages.push({ role: 'agent', text: `${doc.name} wird heruntergeladen.` });
  }

  if (action === 'remove') {
    if (type === 'input' && id === 'in-1') {
      state.messages.push({ role: 'agent', text: 'Der Fragebogen bleibt immer oben bestehen und kann nicht entfernt werden.' });
      renderChat();
      return;
    }

    state[listKey] = docs.filter((entry) => entry.id !== id);
    state.messages.push({ role: 'agent', text: `${doc.name} wurde entfernt.` });
    renderDocuments();
  }

  if (action === 'status') {
    const statusText = type === 'input' ? `Status von ${doc.name}: ${doc.status}.` : `Status von ${doc.name}: bereit für Download.`;
    state.messages.push({ role: 'agent', text: statusText });
  }

  renderChat();
}

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
  statusBanner.classList.remove('hidden');

  if (state.stage === 'configuration') {
    statusBanner.textContent = '🔒 Arbeitsplatz wird freigeschaltet, nachdem die Konfiguration abgeschlossen ist.';
  } else if (state.stage === 'content') {
    statusBanner.textContent = '🔓 Inhalt ist freigeschaltet und bereit für Uploads.';
  } else {
    statusBanner.textContent = '🚀 Kampagne ist freigeschaltet und kann veröffentlicht werden.';
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

headerQuestionnaireBtn.addEventListener('click', () => {
  const questionnaire = state.inputDocuments.find((doc) => doc.id === 'in-1');
  if (questionnaire) {
    triggerDocumentDownload(questionnaire);
  }
  state.messages.push({ role: 'agent', text: 'Der Fragebogen-Download wurde gestartet (Demo).' });
  renderChat();
});

headerLandingPageBtn.addEventListener('click', () => {
  state.messages.push({ role: 'agent', text: 'Die Landingpage-Vorschau wird geöffnet (Demo).' });
  renderChat();
});

confirmUploadBtn.addEventListener('click', () => {
  if (state.uploadMode === 'media' && !mediaTextInput.value.trim()) {
    state.messages.push({ role: 'agent', text: 'Für Bild/Video-Uploads ist ein begleitender Text erforderlich.' });
    renderChat();
    return;
  }

  if (state.uploadMode === 'docs') {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    state.inputDocuments.unshift({
      id: `in-${Date.now()}`,
      name: `Neues_Dokument_${state.inputDocuments.length + 1}.pdf`,
      type: 'Upload',
      date: `${day}.${month}`,
      status: 'Neu'
    });
    renderDocuments();
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

inputDocsTableBody.addEventListener('click', handleDocumentAction);
outputDocsTableBody.addEventListener('click', handleDocumentAction);

Object.values(chatTabs).forEach((tab) => {
  tab.addEventListener('click', () => {
    Object.values(chatTabs).forEach((entry) => entry.classList.remove('active'));
    tab.classList.add('active');
  });
});

updateWorkspaceHeader();
renderDocuments();
renderChat();
showPage('workplace');
