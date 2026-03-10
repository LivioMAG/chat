const SINGLE_CATEGORIES = [
  'Stellenprofil',
  'Unternehmensprofil',
  'Arbeitgeberprofil',
  'Aufgabenprofil',
  'Benefits',
  'Arbeitsalltag',
  'Präferenzen'
];

const MULTI_CATEGORIES = ['Content', 'Mitarbeiterzitate', 'Referenzen'];
const FIXED_CATEGORIES = [...SINGLE_CATEGORIES, 'Content', 'Mitarbeiterzitate'];

const categoryTypeMap = Object.fromEntries([
  ...SINGLE_CATEGORIES.map((name) => [name, 'single']),
  ...MULTI_CATEGORIES.map((name) => [name, 'multi'])
]);

const records = [
  { id: 'rec-001', category: 'Stellenprofil', title: 'Stellenprofil', description: '', value: 'Marketing Manager, 80–100 %, Standort Zürich, Start ab sofort.', attachments: [], updatedAt: 'Heute, 14:12' },
  { id: 'rec-002', category: 'Unternehmensprofil', title: 'Unternehmensprofil', description: '', value: 'Wir sind ein innovatives Unternehmen im Bereich Marketing und Employer Branding.', attachments: [], updatedAt: 'Heute, 14:14' },
  { id: 'rec-003', category: 'Arbeitgeberprofil', title: 'Arbeitgeberprofil', description: '', value: 'Flache Hierarchien, schnelle Entscheidungen und transparente Kommunikation.', attachments: [], updatedAt: 'Heute, 14:18' },
  { id: 'rec-004', category: 'Aufgabenprofil', title: 'Aufgabenprofil', description: '', value: 'Planung, Umsetzung und Optimierung von Paid-Social-Kampagnen.', attachments: [], updatedAt: 'Heute, 14:20' },
  { id: 'rec-005', category: 'Benefits', title: 'Benefits', description: '', value: '5 Wochen Ferien, Homeoffice, Weiterbildungsbudget und moderne Tools.', attachments: [], updatedAt: 'Heute, 14:21' },
  { id: 'rec-006', category: 'Arbeitsalltag', title: 'Arbeitsalltag', description: '', value: 'Agile Team-Weeklys, kurze Feedbackzyklen und enger Austausch mit Sales.', attachments: [], updatedAt: 'Heute, 14:23' },
  { id: 'rec-007', category: 'Präferenzen', title: 'Präferenzen', description: '', value: 'Erfahrung mit Meta Ads, Tracking und datengetriebener Optimierung.', attachments: [], updatedAt: 'Heute, 14:24' },
  { id: 'rec-008', category: 'Content', title: 'Karriereseite Intro', description: 'Einführung für Bewerbende', value: 'Wir suchen Menschen, die Verantwortung übernehmen und Wachstum aktiv mitgestalten.', attachments: ['https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80'], updatedAt: 'Heute, 14:30' },
  { id: 'rec-009', category: 'Content', title: 'LinkedIn Beitrag', description: 'Post für Reichweite', value: 'Wir wachsen! Bewirb dich jetzt als Marketing Manager (m/w/d) in Zürich.', attachments: [], updatedAt: 'Heute, 14:34' },
  { id: 'rec-010', category: 'Mitarbeiterzitate', title: 'Zitat – Sarah Keller', description: 'Teamlead Marketing', value: '„Ich schätze die Eigenverantwortung und das Vertrauen im Team.“', attachments: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80'], updatedAt: 'Heute, 14:36' },
  { id: 'rec-011', category: 'Mitarbeiterzitate', title: 'Zitat – Daniel Meier', description: 'Performance Specialist', value: '„Hier kann ich Ideen direkt testen und sehe sofort den Impact.“', attachments: [], updatedAt: 'Heute, 14:38' },
  { id: 'rec-012', category: 'Referenzen', title: 'Referenz – Firma Müller', description: 'Kundenstimme', value: '„Spürbar bessere Bewerberqualität innerhalb weniger Wochen.“', attachments: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80'], updatedAt: 'Heute, 14:40' }
];

const sectionsRoot = document.getElementById('categorySections');
const editOverlay = document.getElementById('editOverlay');
const titleField = document.getElementById('titleField');
const descriptionField = document.getElementById('descriptionField');
const attachmentsField = document.getElementById('attachmentsField');
const editTitleInput = document.getElementById('editTitle');
const editDescriptionInput = document.getElementById('editDescription');
const editValueInput = document.getElementById('editValue');
const imageInput = document.getElementById('imageInput');
const attachmentList = document.getElementById('attachmentList');

let activeRecordId = null;
let draftAttachments = [];

function getCategoryType(category) {
  return categoryTypeMap[category] || 'single';
}

function getNowLabel() {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `Heute, ${hour}:${min}`;
}

function createCard(record) {
  const card = document.createElement('article');
  card.className = 'card';
  card.setAttribute('data-id', record.id);

  const image = record.attachments.length
    ? `<img class="card-image" src="${record.attachments[0]}" alt="${record.title}" />`
    : '';

  const description = record.description
    ? `<p class="card-description">${record.description}</p>`
    : '';

  card.innerHTML = `
    <div class="card-head">
      <h3 class="card-title">${record.title}</h3>
      <span class="edit-icon" aria-label="Bearbeiten">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z" stroke="currentColor" stroke-width="1.6"/>
          <path d="M13.35 6.9L17.1 10.65" stroke="currentColor" stroke-width="1.6"/>
        </svg>
      </span>
    </div>
    ${description}
    ${image}
    <p class="card-content">${record.value}</p>
    <div class="card-meta">
      <span>${record.category}</span>
      <span>${record.updatedAt}</span>
    </div>
  `;

  card.addEventListener('click', () => openEditor(record.id));
  return card;
}

function categoryOrder() {
  const existingOptional = MULTI_CATEGORIES.filter(
    (category) => !FIXED_CATEGORIES.includes(category) && records.some((entry) => entry.category === category)
  );
  return [...FIXED_CATEGORIES, ...existingOptional];
}

function renderSections() {
  sectionsRoot.innerHTML = '';

  categoryOrder().forEach((category) => {
    const section = document.createElement('section');
    section.className = 'group-section';

    const heading = document.createElement('h2');
    heading.textContent = category;

    const grid = document.createElement('div');
    grid.className = 'card-grid';

    const entries = records.filter((entry) => entry.category === category);
    entries.forEach((entry) => grid.appendChild(createCard(entry)));

    section.appendChild(heading);
    section.appendChild(grid);
    sectionsRoot.appendChild(section);
  });
}

function renderAttachments() {
  attachmentList.innerHTML = '';

  if (!draftAttachments.length) {
    attachmentList.innerHTML = '<span class="attachment-name">Keine Anhänge vorhanden.</span>';
    return;
  }

  draftAttachments.forEach((url, index) => {
    const row = document.createElement('div');
    row.className = 'attachment-item';
    row.innerHTML = `
      <img src="${url}" alt="Anhang ${index + 1}" />
      <span class="attachment-name">Bild ${index + 1}</span>
      <button class="remove-btn" type="button" data-index="${index}">Bild entfernen</button>
    `;
    attachmentList.appendChild(row);
  });

  attachmentList.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const index = Number(event.currentTarget.getAttribute('data-index'));
      draftAttachments.splice(index, 1);
      renderAttachments();
    });
  });
}

function openEditor(recordId) {
  const record = records.find((entry) => entry.id === recordId);
  if (!record) return;

  activeRecordId = recordId;
  const mode = getCategoryType(record.category);

  titleField.classList.toggle('hidden', mode !== 'multi');
  descriptionField.classList.toggle('hidden', mode !== 'multi');
  attachmentsField.classList.toggle('hidden', mode !== 'multi');

  editTitleInput.value = record.title;
  editTitleInput.readOnly = mode === 'single';
  editDescriptionInput.value = record.description || '';
  editValueInput.value = record.value;

  draftAttachments = mode === 'multi' ? [...record.attachments] : [];
  imageInput.value = '';
  renderAttachments();
  editOverlay.classList.remove('hidden');
}

function closeEditor() {
  activeRecordId = null;
  draftAttachments = [];
  imageInput.value = '';
  editOverlay.classList.add('hidden');
}

function getUpdateScore(label) {
  const [, timePart = '00:00'] = label.split(', ');
  const [hours = '0', minutes = '0'] = timePart.split(':');
  return Number(hours) * 60 + Number(minutes);
}

function renderMeta() {
  const latestEntry = records.reduce((latest, current) => {
    if (!latest || getUpdateScore(current.updatedAt) > getUpdateScore(latest.updatedAt)) {
      return current;
    }
    return latest;
  }, null);

  document.getElementById('lastUpdated').textContent = `Zuletzt aktualisiert: ${latestEntry?.updatedAt || '–'}`;
  document.getElementById('contentCount').textContent = `Gesammelte Inhalte: ${records.length}`;
}

function render() {
  renderSections();
  renderMeta();
}

imageInput.addEventListener('change', (event) => {
  const files = Array.from(event.target.files || []);
  files.forEach((file) => {
    if (file.type.startsWith('image/')) {
      draftAttachments.push(URL.createObjectURL(file));
    }
  });
  imageInput.value = '';
  renderAttachments();
});

document.getElementById('saveEditBtn').addEventListener('click', () => {
  const record = records.find((entry) => entry.id === activeRecordId);
  if (!record) {
    closeEditor();
    return;
  }

  const mode = getCategoryType(record.category);

  if (mode === 'multi') {
    record.title = editTitleInput.value.trim() || record.title;
    record.description = editDescriptionInput.value.trim();
    record.attachments = [...draftAttachments];
  }

  if (mode === 'single') {
    record.title = record.category;
    record.description = '';
    record.attachments = [];
  }

  record.value = editValueInput.value;
  record.updatedAt = getNowLabel();

  closeEditor();
  render();
});

document.getElementById('cancelEditBtn').addEventListener('click', closeEditor);
document.getElementById('closeModalBtn').addEventListener('click', closeEditor);

editOverlay.addEventListener('click', (event) => {
  if (event.target === editOverlay) {
    closeEditor();
  }
});

render();
