const records = [
  {
    id: 'rec-001',
    type: 'unternehmensprofil',
    group: 'ads',
    title: 'Unternehmensprofil',
    value: 'Wir sind ein innovatives Unternehmen im Bereich Marketing und Employer Branding.',
    attachments: [],
    updatedAt: 'Heute, 14:10'
  },
  {
    id: 'rec-002',
    type: 'stellenprofil',
    group: 'ads',
    title: 'Stellenprofil',
    value: 'Marketing Manager, 80–100 %, Standort Zürich, Start ab sofort.',
    attachments: [],
    updatedAt: 'Heute, 14:12'
  },
  {
    id: 'rec-003',
    type: 'benefits',
    group: 'ads',
    title: 'Benefits',
    value: '5 Wochen Ferien, Homeoffice, Weiterbildungsbudget und moderne Tools.',
    attachments: [],
    updatedAt: 'Heute, 14:20'
  },
  {
    id: 'rec-004',
    type: 'referenz',
    group: 'ads',
    title: 'Referenz – Firma Müller',
    value: '„Tolle Zusammenarbeit und spürbar bessere Bewerberqualität innerhalb weniger Wochen.“',
    attachments: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80'],
    updatedAt: 'Heute, 14:25'
  },
  {
    id: 'rec-005',
    type: 'unternehmensprofil',
    group: 'landingpage',
    title: 'Über uns für Landingpage',
    value: 'Wir begleiten Unternehmen in der digitalen Personalgewinnung mit datenbasierten Kampagnen.',
    attachments: [],
    updatedAt: 'Heute, 14:27'
  },
  {
    id: 'rec-006',
    type: 'aufgaben',
    group: 'landingpage',
    title: 'Aufgaben im Job',
    value: 'Planung, Umsetzung und Optimierung von Paid-Social-Kampagnen.',
    attachments: [],
    updatedAt: 'Heute, 14:28'
  },
  {
    id: 'rec-007',
    type: 'bilder',
    group: 'landingpage',
    title: 'Team-Bilder',
    value: 'Bildmaterial für den authentischen Einblick in den Alltag.',
    attachments: ['https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80'],
    updatedAt: 'Heute, 14:29'
  },
  {
    id: 'rec-008',
    type: 'mitarbeiterzitat',
    group: 'landingpage',
    title: 'Mitarbeiterzitat – Sarah Keller',
    value: '„Ich schätze die Eigenverantwortung und das Vertrauen im Team.“',
    attachments: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80'],
    updatedAt: 'Heute, 14:30'
  },
  {
    id: 'rec-009',
    type: 'qualifikationsfragen',
    group: 'funnel',
    title: 'Qualifikationsfragen',
    value: 'Hast du Erfahrung mit Meta Ads und Conversion Tracking?',
    attachments: [],
    updatedAt: 'Heute, 14:33'
  },
  {
    id: 'rec-010',
    type: 'anforderungen',
    group: 'funnel',
    title: 'Anforderungen',
    value: 'Mindestens 2 Jahre Erfahrung im Performance Marketing.',
    attachments: [],
    updatedAt: 'Heute, 14:35'
  },
  {
    id: 'rec-011',
    type: 'bewerber-vorselektion',
    group: 'funnel',
    title: 'Bewerber-Vorselektion',
    value: 'Kurze Verfügbarkeits- und Gehaltsabfrage vor Terminbuchung.',
    attachments: [],
    updatedAt: 'Heute, 14:37'
  },
  {
    id: 'rec-012',
    type: 'hinweise',
    group: 'funnel',
    title: 'Zusätzliche Hinweise',
    value: 'Bitte Kontaktaufnahme innerhalb von 48h nach Formularabschluss.',
    attachments: [],
    updatedAt: 'Heute, 14:38'
  }
];

const groupMap = {
  ads: document.getElementById('adsCards'),
  landingpage: document.getElementById('landingpageCards'),
  funnel: document.getElementById('funnelCards')
};

const groupOrder = ['ads', 'landingpage', 'funnel'];

const editOverlay = document.getElementById('editOverlay');
const editTitleInput = document.getElementById('editTitle');
const editValueInput = document.getElementById('editValue');
const imageInput = document.getElementById('imageInput');
const attachmentList = document.getElementById('attachmentList');

let activeRecordId = null;
let draftAttachments = [];

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
    ${image}
    <p class="card-content">${record.value}</p>
    <div class="card-meta">
      <span>Type: ${record.type}</span>
      <span>Geändert am: ${record.updatedAt}</span>
    </div>
  `;

  card.addEventListener('click', () => openEditor(record.id));

  return card;
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
  if (!record) {
    return;
  }

  activeRecordId = recordId;
  editTitleInput.value = record.title;
  editValueInput.value = record.value;
  draftAttachments = [...record.attachments];
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

function render() {
  Object.values(groupMap).forEach((container) => {
    container.innerHTML = '';
  });

  const sorted = [...records].sort(
    (a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group)
  );

  sorted.forEach((entry) => {
    const container = groupMap[entry.group];
    if (container) {
      container.appendChild(createCard(entry));
    }
  });

  const latestEntry = records.reduce((latest, current) => {
    if (!latest || getUpdateScore(current.updatedAt) > getUpdateScore(latest.updatedAt)) {
      return current;
    }
    return latest;
  }, null);

  document.getElementById('lastUpdated').textContent = `Zuletzt aktualisiert: ${latestEntry?.updatedAt || '–'}`;
  document.getElementById('contentCount').textContent = `Gesammelte Inhalte: ${records.length}`;
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

  record.title = editTitleInput.value.trim();
  record.value = editValueInput.value;
  record.attachments = [...draftAttachments];
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
