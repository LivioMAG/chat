const state = {
  messages: [
    {
      role: 'agent',
      text: 'Willkommen! Du kannst direkt alles nutzen: Chat, Fragebogen, Landingpage und Uploads.'
    }
  ],
  uploadMode: null,
  inputDocuments: [
    { id: 'in-1', name: 'Fragebogen.pdf', type: 'Formular', date: '12.03', status: 'ok' },
    { id: 'in-2', name: 'Briefing.docx', type: 'Text', date: '12.03', status: 'error' }
  ],
  outputDocuments: [
    { id: 'out-1', name: 'Kampagnenanalyse.pdf', type: 'Report', date: '14.03' },
    { id: 'out-2', name: 'Contentstrategie.pdf', type: 'Strategie', date: '14.03' }
  ]
};

const statusIconMap = {
  ok: { icon: '✅', label: 'Status OK' },
  warning: { icon: '⚠️', label: 'Status Warnung' },
  error: { icon: '❌', label: 'Status Fehler' }
};

const chatStream = document.getElementById('chatStream');
const chatInput = document.getElementById('chatInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const uploadDocBtn = document.getElementById('uploadDocBtn');
const uploadMediaBtn = document.getElementById('uploadMediaBtn');
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

function getSortedInputDocuments() {
  return [...state.inputDocuments].sort((a, b) => {
    if (a.id === 'in-1') return -1;
    if (b.id === 'in-1') return 1;
    return 0;
  });
}

function renderStatusIcon(status) {
  const entry = statusIconMap[status] || statusIconMap.warning;
  return `<span class="status-icon" title="${entry.label}" aria-label="${entry.label}">${entry.icon}</span>`;
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
      <td>${renderStatusIcon(doc.status)}</td>
      <td>
        <div class="table-actions">
          <button class="table-action-btn" title="Datei herunterladen" aria-label="Datei herunterladen" data-action="download" data-type="input" data-id="${doc.id}"><span aria-hidden="true">⬇️</span></button>
          <button class="table-action-btn danger" title="Datei löschen" aria-label="Datei löschen" data-action="remove" data-type="input" data-id="${doc.id}"><span aria-hidden="true">🗑️</span></button>
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
    state[listKey] = docs.filter((entry) => entry.id !== id);
    state.messages.push({ role: 'agent', text: `${doc.name} wurde entfernt.` });
    renderDocuments();
  }

  renderChat();
}

function openUploadModal(mode) {
  state.uploadMode = mode;
  mediaTextInput.value = '';

  if (mode === 'media') {
    uploadModalTitle.textContent = 'Bild/Video und Text hochladen';
    uploadModalHint.textContent = 'Bitte lade ein Bild oder Video hoch und ergänze optional einen Text.';
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

sendMessageBtn.addEventListener('click', () => {
  const value = chatInput.value.trim();
  if (!value) return;

  state.messages.push({ role: 'user', text: value });
  chatInput.value = '';
  renderChat();
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
  if (state.uploadMode === 'docs') {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    state.inputDocuments.unshift({
      id: `in-${Date.now()}`,
      name: `Neues_Dokument_${state.inputDocuments.length + 1}.pdf`,
      type: 'Upload',
      date: `${day}.${month}`,
      status: 'warning'
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

inputDocsTableBody.addEventListener('click', handleDocumentAction);
outputDocsTableBody.addEventListener('click', handleDocumentAction);

renderDocuments();
renderChat();
