const records = [
  {
    id: 'rec-001',
    type: 'unternehmensprofil',
    title: 'Unternehmensprofil',
    value: 'Wir sind ein innovatives Unternehmen im Bereich Marketing.',
    attachments: [],
    updatedAt: 'Heute, 14:10'
  },
  {
    id: 'rec-002',
    type: 'stellenprofil',
    title: 'Stellenprofil',
    value: 'Marketing Manager, 80–100 %, Standort Zürich, Start ab sofort.',
    attachments: [],
    updatedAt: 'Heute, 14:12'
  },
  {
    id: 'rec-003',
    type: 'aufgaben',
    title: 'Kampagnenplanung',
    value: 'Social Media Management, Performance Analyse.',
    attachments: [],
    updatedAt: 'Heute, 14:20'
  },
  {
    id: 'rec-004',
    type: 'benefits',
    title: 'Benefits',
    value: '5 Wochen Ferien, Gratis Parkplatz.',
    attachments: [],
    updatedAt: 'Heute, 14:25'
  },
  {
    id: 'rec-005',
    type: 'referenz',
    title: 'Referenz – Firma Müller',
    value: '„Tolle Zusammenarbeit...“',
    attachments: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80'],
    updatedAt: 'Heute, 14:27'
  },
  {
    id: 'rec-006',
    type: 'referenz',
    title: 'Referenz – Firma Meier',
    value: '„Sehr professionelles Team.“',
    attachments: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80'],
    updatedAt: 'Heute, 14:28'
  },
  {
    id: 'rec-007',
    type: 'mitarbeiterzitat',
    title: 'Mitarbeiterzitat – Sarah Keller',
    value: '„Ich freue mich, Teil dieses tollen Teams zu sein.“',
    attachments: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80'],
    updatedAt: 'Heute, 14:29'
  },
  {
    id: 'rec-008',
    type: 'mitarbeiterzitat',
    title: 'Mitarbeiterzitat – David Meier',
    value: '„Das Team ist sehr professionell und offen.“',
    attachments: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'],
    updatedAt: 'Heute, 14:30'
  }
];

const singleTypes = ['unternehmensprofil', 'stellenprofil', 'aufgaben', 'benefits'];

function createCard(record) {
  const card = document.createElement('article');
  card.className = 'card';

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

  return card;
}

function render() {
  const singleContainer = document.getElementById('singleCards');
  const referenceContainer = document.getElementById('referenceCards');
  const quoteContainer = document.getElementById('quoteCards');

  const singleCards = records.filter((entry) => singleTypes.includes(entry.type));
  const references = records.filter((entry) => entry.type === 'referenz');
  const quotes = records.filter((entry) => entry.type === 'mitarbeiterzitat');

  singleCards.forEach((entry) => singleContainer.appendChild(createCard(entry)));
  references.forEach((entry) => referenceContainer.appendChild(createCard(entry)));
  quotes.forEach((entry) => quoteContainer.appendChild(createCard(entry)));

  const latestUpdate = records[records.length - 1]?.updatedAt || '–';
  document.getElementById('lastUpdated').textContent = `Zuletzt aktualisiert: ${latestUpdate}`;
  document.getElementById('contentCount').textContent = `Gesammelte Inhalte: ${records.length}`;
}

render();
