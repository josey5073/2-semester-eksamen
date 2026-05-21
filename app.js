const appContent = document.getElementById("app-content");
const storageKey = "koeberraadgivning-prototype-v3";

let currentPage = "welcome";
let selectedChoice = null;
let openFaqIndex = null;
let selectedTopics = new Set();
let selectedDocuments = new Set();
let selectedCaseId = null;
let selectedConversationId = null;
let selectedDate = "2026-05-18";
let selectedTime = "13:00";
let calendarYear = 2026;
let calendarMonth = 4;

const emptyDraftCase = {
  address: "",
  postal: "",
  city: "",
  link: "",
};

let draftCase = { ...emptyDraftCase };

const defaultState = {
  cases: [],
  conversations: [],
  notifications: [],
  meetings: [],
};

let state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? { ...defaultState, ...JSON.parse(saved) } : { ...defaultState };
  } catch (error) {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function icon(name) {
  const icons = {
    back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M15 5 8 12l7 7" /></svg>`,
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>`,
    down: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>`,
    user: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="16" cy="9.5" r="6" /><path d="M5 29c1.8-6 6-9 11-9s9.2 3 11 9" /></svg>`,
    mail: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" aria-hidden="true"><rect x="3" y="7" width="26" height="18" rx="1.5" /><path d="m4.5 8.5 11.5 8 11.5-8" /></svg>`,
    phone: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" aria-hidden="true"><path d="M10.7 4.2 6.4 8.5c-.8.8-.9 2-.3 3 3 5.9 8.7 11.6 14.6 14.6 1 .6 2.2.5 3-.3l4.1-4.1-6.2-5.2-3.1 3.1c-2.8-1.5-5.1-3.8-6.6-6.6l3.1-3.1-4.3-5.7Z" /></svg>`,
    lock: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" aria-hidden="true"><rect x="6" y="13" width="20" height="15" rx="2" /><path d="M10.5 13V9.5a5.5 5.5 0 0 1 11 0V13" /><circle cx="16" cy="20.5" r="1.7" fill="currentColor" stroke="none" /></svg>`,
    lockOpen: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" aria-hidden="true"><rect x="17" y="28" width="30" height="25" rx="3" fill="currentColor" stroke="none" /><path d="M25 28v-7.5a9 9 0 0 1 18 0" stroke-width="5" /><path d="M32 37v9" stroke="#ed0011" stroke-width="3" /><circle cx="32" cy="37" r="4" fill="#ffffff" stroke="#ed0011" stroke-width="2" /></svg>`,
    eye: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3.5 16s4.4-7.2 12.5-7.2S28.5 16 28.5 16 24.1 23.2 16 23.2 3.5 16 3.5 16Z" /><circle cx="16" cy="16" r="3.7" /></svg>`,
    home: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" aria-hidden="true"><path d="M7 21.5 22 9l15 12.5" stroke-width="3.2" /><path d="M12 20.5v16h8V26h5v10.5h8v-16" /></svg>`,
    document: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" aria-hidden="true"><path d="M12 8h16l6 6v22l-5-2.5-5 2.5-5-2.5-5 2.5-2-1V8Z" /><path d="M28 8v8h6M16 21h12M16 27h9" /></svg>`,
    folder: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" aria-hidden="true"><path d="M7 14h12l4 5h14v17H7V14Z" /><path d="M7 20h30" /></svg>`,
    calendar: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" aria-hidden="true"><rect x="8" y="11" width="28" height="27" rx="3" /><path d="M8 19h28M15 7v8M29 7v8" /><path d="M16 26h.1M22 26h.1M28 26h.1M16 32h.1M22 32h.1" stroke-width="3" /></svg>`,
    search: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="19" cy="19" r="10" /><path d="m27 27 8 8" /></svg>`,
    shield: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" aria-hidden="true"><path d="M22 6 34 10v10c0 8-5.2 13.7-12 17-6.8-3.3-12-9-12-17V10l12-4Z" /><path d="m16 22 4 4 8-9" /></svg>`,
    info: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="22" cy="22" r="15" /><path d="M22 20v10M22 14h.1" stroke-width="3" /></svg>`,
    message: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" aria-hidden="true"><path d="M8 10h28v20H16l-8 7V10Z" /><path d="M15 18h14M15 24h9" /></svg>`,
    bell: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" aria-hidden="true"><path d="M13 29v-9a9 9 0 0 1 18 0v9l4 5H9l4-5Z" /><path d="M19 36a3 3 0 0 0 6 0" /></svg>`,
    upload: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" aria-hidden="true"><path d="M22 31V10M14 18l8-8 8 8" /><path d="M9 30v6h26v-6" /></svg>`,
    plus: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" aria-hidden="true"><path d="M22 10v24M10 22h24" /></svg>`,
    check: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" aria-hidden="true"><path d="m10 23 8 8 16-18" /></svg>`,
    clock: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="22" cy="22" r="15" /><path d="M22 13v10l7 4" /></svg>`,
    trash: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" aria-hidden="true"><path d="M10 13h24M18 13V9h8v4M15 18l1 18h12l1-18" /></svg>`,
  };

  return `<span class="icon icon--${name} ${icons[name] ? "" : "icon--placeholder"}">${icons[name] || '<span class="icon__placeholder-mark"></span>'}</span>`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function todayLabel() {
  return "I dag";
}

function button(label, page, className = "") {
  return `<button class="button button--primary ${className}" type="button" data-page="${page}">${label}</button>`;
}

function backButton(pageName) {
  return `
    <button class="screen__back" type="button" data-page="${pageName}" aria-label="Gå tilbage">
      ${icon("back")}
    </button>
  `;
}

function profileButton() {
  return `
    <button class="profile-button" type="button" data-page="profile" aria-label="Profil">
      <span class="avatar"></span>
    </button>
  `;
}

function renderField(options) {
  const value = options.value ? `value="${escapeHtml(options.value)}"` : "";
  const dataField = options.field ? `data-field="${options.field}"` : "";
  const action = options.actionIcon ? `<span class="field__action">${icon(options.actionIcon)}</span>` : `<span></span>`;

  return `
    <label class="field">
      <span class="field__label">${options.label}</span>
      <span class="field__control">
        ${options.iconName ? `<span class="field__icon">${icon(options.iconName)}</span>` : ""}
        <input class="field__input" type="${options.type || "text"}" placeholder="${options.placeholder || ""}" autocomplete="${options.autocomplete || "off"}" ${dataField} ${value} />
        ${action}
      </span>
    </label>
  `;
}

function bottomNav(activePage) {
  const items = [
    ["home", "Home", "home"],
    ["document", "FAQ", "faq"],
    ["message", "Beskeder", "messages"],
    ["folder", "Sager", "cases"],
    ["bell", "Notif", "notifications"],
  ];

  return `
    <nav class="bottom-nav" aria-label="Hovednavigation">
      ${items
        .map(
          ([iconName, label, page]) => `
            <button class="bottom-nav__item ${activePage === page ? "bottom-nav__item--active" : ""}" type="button" data-page="${page}">
              ${icon(iconName)}
              <span>${label}</span>
            </button>
          `,
        )
        .join("")}
    </nav>
  `;
}

function appShell(options) {
  const lead = options.lead ? `<p class="screen__lead">${options.lead}</p>` : "";
  const headerClass = options.centered ? "app-shell__header app-shell__header--centered" : "app-shell__header";

  return `
    <section class="screen screen--app app-shell ${options.className || ""}">
      <div class="app-shell__scroll">
        <header class="${headerClass}">
          ${options.backTo ? backButton(options.backTo) : ""}
          <div class="app-shell__header-text">
            <h1 class="screen__title">${options.title}</h1>
            ${lead}
          </div>
          ${options.profile ? profileButton() : ""}
        </header>
        ${options.body || ""}
      </div>
      ${options.nav === false ? "" : bottomNav(options.active || "home")}
    </section>
  `;
}

function emptyState(title, text, iconName) {
  return `
    <section class="empty-state">
      <div class="empty-state__icon">${icon(iconName)}</div>
      <h2>${title}</h2>
      <p>${text}</p>
    </section>
  `;
}

function homeQuickActions() {
  return `
    <div class="quick-actions">
      <button class="quick-actions__button" type="button" data-page="book">
        <span class="quick-actions__icon">${icon("calendar")}</span>
        <strong class="quick-actions__title">Book møde</strong>
        <span class="quick-actions__text">Tal med Benedikte</span>
      </button>
      <button class="quick-actions__button" type="button" data-page="how">
        <span class="quick-actions__icon">${icon("info")}</span>
        <strong class="quick-actions__title">Hvordan?</strong>
        <span class="quick-actions__text">Se processen og priser</span>
      </button>
    </div>
  `;
}

function routeTo(pageName, options = {}) {
  if (options.caseId) selectedCaseId = options.caseId;
  if (options.conversationId) selectedConversationId = options.conversationId;
  renderPage(pageName);
}

function renderWelcomePage() {
  appContent.innerHTML = `
    <section class="screen welcome-screen">
      <div class="logo-box">
        <img class="logo-box__image" src="assets/billeder/logo.png" alt="Benedikte Brechmann Køberrådgivning" />
        <h1 class="logo-box__title">Benedikte<br />Brechmann</h1>
        <p class="logo-box__subtitle">KØBERRÅDGIVNING</p>
      </div>

      <header class="screen__header">
        <h2 class="screen__title">Din personlige rådgiver gennem hele boligrejsen</h2>
        <p class="screen__lead">Få tryghed, overblik og professionel hjælp - når du har brug for det.</p>
      </header>

      <div class="welcome-screen__actions">
        <button class="button button--primary" type="button" data-page="create-profile">Opret profil</button>
        <button class="button button--plain" type="button" data-page="login">Log ind</button>
      </div>
    </section>
  `;
}

function renderCreateProfilePage() {
  appContent.innerHTML = `
    <section class="screen auth-screen">
      ${backButton("welcome")}
      <header class="screen__header">
        <h1 class="screen__title">Opret profil</h1>
        <p class="screen__lead">Så jeg kan hjælpe dig bedst muligt gennem din boligproces.</p>
      </header>

      <form class="auth-form">
        ${renderField({ iconName: "user", label: "Fulde navn", type: "text", placeholder: "Fulde navn", autocomplete: "name" })}
        ${renderField({ iconName: "mail", label: "E-mail", type: "email", placeholder: "E-mail", autocomplete: "email" })}
        ${renderField({ iconName: "phone", label: "Telefonnummer", type: "tel", placeholder: "Telefonnummer (valgfrit)", autocomplete: "tel" })}
        ${renderField({ iconName: "lock", label: "Opret adgangskode", type: "password", placeholder: "Opret adgangskode", autocomplete: "new-password", actionIcon: "eye" })}
        <button class="button button--primary auth-form__button" type="button" data-page="needs">Fortsæt</button>
      </form>

      <div class="profile-switch">
        <span class="profile-switch__text">Har du allerede en profil?</span>
        <button class="text-link" type="button" data-page="login">Log ind</button>
      </div>
    </section>
  `;
}

function renderNeedsPage() {
  const choicesHTML = appData.choices
    .map((choice, index) => {
      const isSelected = selectedChoice === index;
      return `
        <button class="choice-card ${isSelected ? "choice-card--selected" : ""}" type="button" data-choice-index="${index}" aria-pressed="${isSelected}">
          <span class="choice-card__icon">${icon(choice.icon)}</span>
          <span class="choice-card__copy">
            <span class="choice-card__title">${choice.title}</span>
            <span class="choice-card__text">${choice.text}</span>
          </span>
          <span class="choice-card__radio" aria-hidden="true"></span>
        </button>
      `;
    })
    .join("");

  appContent.innerHTML = `
    <section class="screen auth-screen auth-screen--needs">
      ${backButton("create-profile")}
      <header class="screen__header">
        <h1 class="screen__title">Velkommen Theresa</h1>
        <p class="screen__lead">Hvad har du brug for hjælp til?</p>
      </header>
      <div class="choice-list">${choicesHTML}</div>
      <button class="button button--primary auth-screen__bottom-button" type="button" data-page="security">Fortsæt</button>
    </section>
  `;
}

function renderSecurityPage() {
  appContent.innerHTML = `
    <section class="screen auth-screen auth-screen--security">
      ${backButton("needs")}
      <div class="security-hero">${icon("lockOpen")}</div>
      <div class="feature-list">
        <article class="feature-card"><div class="feature-card__icon">${icon("shield")}</div><div><h3>Dine dokumenter deles ikke med andre</h3><p>Alt du deler med mig er fortroligt.</p></div></article>
        <article class="feature-card"><div class="feature-card__icon">${icon("user")}</div><div><h3>Direkte kontakt med Benedikte</h3><p>Du har altid direkte kontakt til mig.</p></div></article>
        <article class="feature-card"><div class="feature-card__icon">${icon("lock")}</div><div><h3>Sikker opbevaring af filer</h3><p>Dine filer opbevares sikkert og kan kun tilgås af dig og mig.</p></div></article>
      </div>
      <button class="button button--primary auth-screen__bottom-button" type="button" data-page="home">Kom i gang</button>
    </section>
  `;
}

function renderLoginPage() {
  appContent.innerHTML = `
    <section class="screen auth-screen auth-screen--login">
      ${backButton("welcome")}
      <header class="screen__header">
        <h1 class="screen__title">Log ind</h1>
        <p class="screen__lead">Velkommen tilbage</p>
      </header>
      <form class="auth-form">
        ${renderField({ iconName: "mail", label: "E-mail", type: "email", placeholder: "E-mail", autocomplete: "email" })}
        ${renderField({ iconName: "lock", label: "Adgangskode", type: "password", placeholder: "Adgangskode", autocomplete: "current-password", actionIcon: "eye" })}
        <button class="forgot-link" type="button">Glemt adgangskode?</button>
        <button class="button button--primary auth-form__button--login" type="button" data-page="home">Log ind</button>
      </form>
      <div class="divider">eller</div>
      <button class="button button--outline" type="button" data-page="home"><span class="google-mark" aria-hidden="true">G</span> Log ind med Google</button>
      <div class="login-switch">
        <span class="login-switch__text">Har du ikke en profil?</span>
        <button class="text-link" type="button" data-page="create-profile">Opret profil</button>
      </div>
    </section>
  `;
}

function renderHomePage() {
  const hasContent = state.cases.length > 0 || state.meetings.length > 0;
  const latestCase = state.cases[0];
  const nextMeeting = state.meetings[0];
  const latestConversation = state.conversations[0];

  const emptyBody = `
    <button class="hero-action" type="button" data-page="new-case-1">
      <span class="hero-action__icon">${icon("folder")}</span>
      <span class="hero-action__body"><strong class="hero-action__title">Upload dokument</strong><small class="hero-action__text">Start en sag på en bolig du ønsker rådgivning om.</small></span>
      <span class="hero-action__arrow">${icon("chevron")}</span>
    </button>
    ${homeQuickActions()}
    <div class="home-screen__illustration" aria-hidden="true"></div>
    <button class="help-card" type="button" data-page="faq">
      <span class="help-card__icon">${icon("message")}</span>
      <span class="help-card__body"><strong class="help-card__title">Har du spørgsmål?</strong><small class="help-card__text">Tjek FAQ for mulige svar</small></span>
      ${icon("chevron")}
    </button>
  `;

  const contentBody = `
    <button class="hero-action" type="button" data-page="new-case-1">
      <span class="hero-action__icon">${icon("folder")}</span>
      <span class="hero-action__body"><strong class="hero-action__title">Upload dokument</strong><small class="hero-action__text">Start en ny sag eller tilføj flere dokumenter.</small></span>
      <span class="hero-action__arrow">${icon("chevron")}</span>
    </button>
    ${homeQuickActions()}
    <section class="section-stack section-stack--home">
      <h2>Overblik</h2>
      ${
        latestCase
          ? `<button class="case-card case-card--compact" type="button" data-case-id="${latestCase.id}">
              <span class="case-card__status"></span>
              <span class="case-card__body"><strong class="case-card__title">${escapeHtml(latestCase.address)}</strong><small class="case-card__meta">${escapeHtml(latestCase.status)} · ${latestCase.documents.length} dokumenter</small></span>
              ${icon("chevron")}
            </button>`
          : ""
      }
      ${
        nextMeeting
          ? `<article class="info-row"><span class="info-row__icon">${icon("calendar")}</span><span class="info-row__body"><strong class="info-row__title">Næste møde</strong><small class="info-row__text">${formatDate(nextMeeting.date)} kl. ${nextMeeting.time}</small></span></article>`
          : ""
      }
      ${
        latestConversation
          ? `<button class="conversation-card conversation-card--compact" type="button" data-conversation-id="${latestConversation.id}">
              <span class="conversation-card__icon">${icon("message")}</span><span class="conversation-card__body"><strong class="conversation-card__title">Besked fra Benedikte</strong><small class="conversation-card__text">${escapeHtml(latestConversation.messages.at(-1).text)}</small></span>${icon("chevron")}
            </button>`
          : ""
      }
    </section>
    <div class="home-screen__illustration" aria-hidden="true"></div>
  `;

  appContent.innerHTML = appShell({
    active: "home",
    title: "Hej Theresa",
    lead: "Hvordan kan jeg hjælpe dig i dag?",
    profile: true,
    className: `home-screen screen--illustrated ${hasContent ? "home-screen--content" : ""}`,
    body: hasContent ? contentBody : emptyBody,
  });
}

function renderCasesPage() {
  const body =
    state.cases.length === 0
      ? `${button("+ Opret ny sag", "new-case-1", "button--large")}`
      : `
        ${button("+ Opret ny sag", "new-case-1", "button--large")}
        <section class="section-stack">
          <h2>Aktive sager</h2>
          ${state.cases.map(renderCaseCard).join("")}
        </section>
      `;

  appContent.innerHTML = appShell({
    active: "cases",
    title: "Mine sager",
    lead: "Her har du overblik over alle dine igangværende og tidligere sager",
    profile: true,
    className: `cases-screen screen--illustrated ${state.cases.length ? "cases-screen--content" : ""}`,
    body,
  });
}

function renderCaseCard(caseItem) {
  return `
    <button class="case-card" type="button" data-case-id="${caseItem.id}">
      <span class="case-card__status"></span>
      <span class="case-card__body">
        <strong class="case-card__title">${escapeHtml(caseItem.address)}</strong>
        <small class="case-card__meta">${escapeHtml(caseItem.city)} · ${escapeHtml(caseItem.status)}</small>
      </span>
      ${icon("chevron")}
    </button>
  `;
}

function renderCaseDetailPage() {
  const caseItem = state.cases.find((item) => item.id === selectedCaseId) || state.cases[0];
  if (!caseItem) {
    renderCasesPage();
    return;
  }

  appContent.innerHTML = appShell({
    active: "cases",
    title: "Sag",
    lead: caseItem.address,
    backTo: "cases",
    centered: true,
    className: "case-detail-screen",
    body: `
      <section class="detail-card">
        <span class="detail-card__status">${caseItem.status}</span>
        <h2 class="detail-card__title">${escapeHtml(caseItem.address)}</h2>
        <p class="detail-card__text">${escapeHtml(caseItem.postal)} ${escapeHtml(caseItem.city)}</p>
      </section>
      <section class="section-stack">
        <h2>Valgte emner</h2>
        ${caseItem.topics.map((topic) => `<article class="info-row"><span class="info-row__icon">${icon("check")}</span><span class="info-row__body"><strong class="info-row__title">${escapeHtml(topic)}</strong><small class="info-row__text">Tilføjet til sagen</small></span></article>`).join("")}
      </section>
      <section class="section-stack">
        <h2>Dokumenter</h2>
        ${caseItem.documents.map((doc) => `<article class="document-row"><span class="document-row__icon">${icon("document")}</span><span class="document-row__body"><strong class="document-row__title">${escapeHtml(doc)}</strong><small class="document-row__text">Uploadet</small></span></article>`).join("")}
      </section>
      <button class="button button--outline" type="button" data-open-conversation="${caseItem.id}">${icon("message")} Skriv til Benedikte</button>
    `,
  });
}

function stepper(step) {
  return `
    <div class="stepper" aria-label="Trin ${step} af 3">
      ${[1, 2, 3]
        .map((number) => `<span class="stepper__dot ${number < step ? "stepper__dot--done" : number === step ? "stepper__dot--active" : ""}">${number < step ? "✓" : number}</span>`)
        .join('<span class="stepper__line"></span>')}
    </div>
  `;
}

function renderNewCaseStepOnePage() {
  appContent.innerHTML = appShell({
    active: "cases",
    title: "Opret ny sag",
    backTo: "cases",
    centered: true,
    className: "new-case-screen",
    body: `
      ${stepper(1)}
      <section class="form-section">
        <h2>Hvilken bolig ønsker du hjælp til?</h2>
        <p>Fortæl os om boligen, så vi kan oprette din sag.</p>
        <form class="stacked-form">
          ${renderField({ label: "Adresse", placeholder: "Fx Skovvej 12", field: "address", value: draftCase.address })}
          ${renderField({ label: "Postnummer", placeholder: "2800", field: "postal", value: draftCase.postal })}
          ${renderField({ label: "By", placeholder: "Lyngby", field: "city", value: draftCase.city })}
          ${renderField({ label: "Link til boligannonce (valgfrit)", placeholder: "Indsæt link her", field: "link", value: draftCase.link })}
        </form>
      </section>
      <button class="button button--primary button--fixed" type="button" data-action="case-step-one">Fortsæt</button>
    `,
  });
}

function renderNewCaseStepTwoPage() {
  appContent.innerHTML = appShell({
    active: "cases",
    title: "Opret ny sag",
    backTo: "new-case-1",
    centered: true,
    className: "new-case-screen",
    body: `
      ${stepper(2)}
      <section class="form-section">
        <h2>Hvad har du brug for hjælp til?</h2>
        <p>Vælg de emner, du ønsker rådgivning om. Du kan vælge flere.</p>
      </section>
      <div class="topic-list">
        ${appData.caseTopics
          .map(
            (topic) => `
              <button class="topic-row ${selectedTopics.has(topic.id) ? "topic-row--selected" : ""}" type="button" data-topic-id="${topic.id}">
                <span class="topic-row__icon">${icon(topic.icon)}</span>
                <span class="topic-row__body"><strong class="topic-row__title">${topic.title}</strong><small class="topic-row__text">${topic.text}</small></span>
                <span class="topic-row__checkbox"></span>
              </button>
            `,
          )
          .join("")}
      </div>
      <button class="button button--primary button--fixed" type="button" data-page="new-case-3">Fortsæt</button>
    `,
  });
}

function renderNewCaseStepThreePage() {
  appContent.innerHTML = appShell({
    active: "cases",
    title: "Opret ny sag",
    backTo: "new-case-2",
    centered: true,
    className: "new-case-screen",
    body: `
      ${stepper(3)}
      <section class="form-section">
        <h2>Upload relevante dokumenter</h2>
        <p>Vælg de dokumenter du vil tilføje. I prototypen markerer klik på rækken dokumentet som uploadet.</p>
      </section>
      <div class="upload-list">
        ${appData.uploadDocuments
          .map(
            (name) => `
              <button class="upload-row ${selectedDocuments.has(name) ? "upload-row--selected" : ""}" type="button" data-document-name="${name}">
                <span class="upload-row__icon">${icon(selectedDocuments.has(name) ? "check" : "upload")}</span>
                <span class="upload-row__body"><strong class="upload-row__title">${name}</strong><small class="upload-row__text">${selectedDocuments.has(name) ? "Tilføjet" : "Tilføj fil"}</small></span>
                ${icon("plus")}
              </button>
            `,
          )
          .join("")}
      </div>
      <p class="privacy-note">${icon("lock")} Dine dokumenter behandles fortroligt og deles ikke.</p>
      <button class="button button--primary button--fixed" type="button" data-action="create-case">Opret sag</button>
    `,
  });
}

function createCase() {
  collectDraftFields();
  const selectedTopicItems = appData.caseTopics.filter((topic) => selectedTopics.has(topic.id));
  const documents = selectedDocuments.size ? Array.from(selectedDocuments) : ["Købsaftale"];
  const id = Date.now().toString();
  const address = draftCase.address.trim() || "Ny boligsag";
  const city = draftCase.city.trim() || "Ikke angivet";

  const caseItem = {
    id,
    address,
    postal: draftCase.postal.trim(),
    city,
    link: draftCase.link.trim(),
    status: "Ny sag oprettet",
    createdAt: new Date().toISOString(),
    topics: selectedTopicItems.length ? selectedTopicItems.map((topic) => topic.title) : ["General køberrådgivning"],
    documents,
  };

  const conversation = {
    id: `conv-${id}`,
    caseId: id,
    title: address,
    updatedAt: new Date().toISOString(),
    messages: [
      {
        from: "Benedikte",
        text: "Tak, jeg har modtaget din sag. Jeg gennemgår dokumenterne og vender tilbage hurtigst muligt.",
        time: todayLabel(),
      },
    ],
  };

  state.cases.unshift(caseItem);
  state.conversations.unshift(conversation);
  state.notifications.unshift({
    id: `note-${id}`,
    title: "Sag oprettet",
    text: `${address} er nu oprettet.`,
    date: todayLabel(),
    read: false,
  });

  saveState();
  selectedCaseId = id;
  draftCase = { ...emptyDraftCase };
  selectedTopics = new Set();
  selectedDocuments = new Set();
}

function renderCaseCreatedPage() {
  appContent.innerHTML = appShell({
    active: "cases",
    title: "Sag oprettet",
    className: "success-screen",
    body: `
      <div class="success-screen__mark">${icon("check")}</div>
      <section class="success-screen__copy">
        <h2>Tak! Din sag er nu oprettet</h2>
        <p>Jeg går i gang med at gennemgå dine dokumenter og vender tilbage hurtigst muligt.</p>
      </section>
      <section class="timeline">
        <h2>Næste skridt</h2>
        <article><span></span><strong>Jeg gennemgår dine dokumenter</strong><small>Typisk svar inden for 24 timer</small></article>
        <article><span></span><strong>Du får besked her i appen</strong><small>Når jeg har feedback til dig</small></article>
        <article><span></span><strong>Vi kan holde et møde</strong><small>Hvis du har brug for sparring</small></article>
      </section>
      ${button("Se sag", "cases", "button--fixed")}
    `,
  });
}

function renderMessagesPage() {
  const body =
    state.conversations.length === 0
      ? `
        <label class="search-field">${icon("search")}<input type="search" placeholder="Søg i samtaler..." /></label>
        <section class="messages-screen__empty">
          ${emptyState("Ingen samtaler endnu", "Når du har oprettet en sag, kan du skrive direkte med Benedikte her.", "message")}
          ${button("+ Opret en sag", "new-case-1")}
        </section>
      `
      : `
        <label class="search-field">${icon("search")}<input type="search" placeholder="Søg i samtaler..." /></label>
        <section class="section-stack">
          <h2>Samtaler</h2>
          ${state.conversations.map(renderConversationCard).join("")}
        </section>
      `;

  appContent.innerHTML = appShell({
    active: "messages",
    title: "Beskeder",
    lead: "Her har du overblik over dine samtaler med Benedikte om dine sager.",
    profile: true,
    className: "messages-screen",
    body,
  });
}

function renderConversationCard(conversation) {
  const latestMessage = conversation.messages.at(-1);
  return `
    <button class="conversation-card" type="button" data-conversation-id="${conversation.id}">
      <span class="conversation-card__icon">${icon("message")}</span>
      <span class="conversation-card__body"><strong class="conversation-card__title">${escapeHtml(conversation.title)}</strong><small class="conversation-card__text">${escapeHtml(latestMessage.text)}</small></span>
      ${icon("chevron")}
    </button>
  `;
}

function renderChatPage() {
  const conversation = state.conversations.find((item) => item.id === selectedConversationId) || state.conversations[0];
  if (!conversation) {
    renderMessagesPage();
    return;
  }

  appContent.innerHTML = appShell({
    active: "messages",
    title: conversation.title,
    backTo: "messages",
    centered: true,
    className: "chat-screen",
    body: `
      <div class="chat-screen__list">
        ${conversation.messages
          .map((message) => `<article class="chat-bubble ${message.from === "Dig" ? "chat-bubble--me" : ""}"><strong>${message.from}</strong><p>${escapeHtml(message.text)}</p><small>${message.time}</small></article>`)
          .join("")}
      </div>
      <form class="chat-form" data-chat-form>
        <input type="text" placeholder="Skriv besked..." aria-label="Skriv besked" />
        <button type="submit">${icon("chevron")}</button>
      </form>
    `,
  });
}

function renderNotificationsPage() {
  const body =
    state.notifications.length === 0
      ? `${emptyState("Ingen notifikationer", "Du får besked her, når der sker noget nyt på dine sager.", "bell")}`
      : `<section class="section-stack notifications-screen__list">${state.notifications.map((note) => `<article class="notification-row"><span class="notification-row__icon">${icon("bell")}</span><span class="notification-row__body"><strong class="notification-row__title">${escapeHtml(note.title)}</strong><small class="notification-row__text">${escapeHtml(note.text)}</small></span><em class="notification-row__date">${note.date}</em></article>`).join("")}</section>`;

  appContent.innerHTML = appShell({
    active: "notifications",
    title: "Notifikationer",
    profile: true,
    className: `notifications-screen screen--illustrated ${state.notifications.length ? "notifications-screen--content" : "notifications-screen--empty"}`,
    body,
  });
}

function renderFaqPage() {
  const items = appData.faqItems
    .map((item, index) => {
      const isOpen = openFaqIndex === index;
      return `
        <article class="faq-answer ${isOpen ? "faq-answer--open" : ""}">
          <button class="faq-answer__button ${isOpen ? "faq-answer__button--open" : ""}" type="button" data-faq-index="${index}">
            <span class="faq-answer__question">${item.question}</span>
            ${icon(isOpen ? "down" : "chevron")}
          </button>
          ${isOpen ? `<div class="faq-answer__body"><p>${item.answer}</p><p><strong>Eksempel:</strong><br />${item.example}</p></div>` : ""}
        </article>
      `;
    })
    .join("");

  appContent.innerHTML = appShell({
    active: "faq",
    title: "FAQ",
    lead: "Få hurtige svar på det, der er vigtigt i din bolighandel.",
    profile: true,
    className: "faq-screen screen--illustrated",
    body: `
      <label class="search-field">${icon("search")}<input type="search" placeholder="Søg på emner..." /></label>
      <section class="section-stack">
        <h2>Populære emner</h2>
        ${items}
      </section>
    `,
  });
}

function renderHowPage() {
  appContent.innerHTML = appShell({
    active: "home",
    title: "Hvordan?",
    backTo: "home",
    centered: true,
    className: "how-screen",
    body: `
      <section class="how-intro">
        <h2>Sådan hjælper jeg dig</h2>
        <p>Få professionel køberrådgivning hele vejen trygt, klart og til at betale.</p>
      </section>
      <div class="feature-list feature-list--soft">
        <article class="feature-card"><div class="feature-card__icon">${icon("shield")}</div><div><h3>Dine dokumenter deles ikke med andre</h3><p>Alt du deler med mig er fortroligt.</p></div></article>
        <article class="feature-card"><div class="feature-card__icon">${icon("user")}</div><div><h3>Direkte kontakt med Benedikte</h3><p>Du har altid direkte kontakt til mig.</p></div></article>
        <article class="feature-card"><div class="feature-card__icon">${icon("lock")}</div><div><h3>Sikker opbevaring af filer</h3><p>Dine filer opbevares sikkert og kan kun tilgås af dig og mig.</p></div></article>
      </div>
      ${button("Se processen og priser", "process", "button--fixed")}
    `,
  });
}

function renderProcessPage() {
  appContent.innerHTML = appShell({
    active: "home",
    title: "Processen",
    backTo: "how",
    centered: true,
    className: "process-screen",
    body: `
      <div class="process-screen__list">
        ${appData.processSteps.map((step, index) => `<article class="process-step"><span>${index + 1}</span>${icon(step.icon)}<div><strong>${step.title}</strong><p>${step.text}</p></div></article>`).join("")}
      </div>
      ${button("Se priser", "prices", "button--fixed")}
    `,
  });
}

function renderPricesPage() {
  appContent.innerHTML = appShell({
    active: "home",
    title: "Priser",
    lead: "Rådgivningspakker",
    backTo: "process",
    centered: true,
    className: "prices-screen",
    body: `
      <div class="prices-screen__list">
        ${appData.packages
          .map(
            (pack) => `
              <article class="price-card">
                <header>${icon("user")}<span><small>${pack.name}</small><strong>${pack.title}</strong></span></header>
                <ul>${pack.checks.map((item) => `<li>${icon("check")} ${item}</li>`).join("")}</ul>
                <footer><strong>${pack.price}</strong><span>Se alle detaljer ${icon("chevron")}</span></footer>
              </article>
            `,
          )
          .join("")}
      </div>
      ${button("Tilbage", "process", "button--fixed")}
    `,
  });
}

function renderBookPage() {
  const meeting = state.meetings[0];
  appContent.innerHTML = appShell({
    active: "home",
    title: "Book møde",
    lead: "Vælg en tid, der passer dig",
    backTo: "home",
    centered: true,
    className: "book-screen",
    body: `
      <article class="meeting-preview">
        ${icon("calendar")}
        <span><strong>${meeting ? "Kommende møde" : "Ingen kommende møder"}</strong><small>${meeting ? `${formatDate(meeting.date)} kl. ${meeting.time}` : "Vælg en tid i kalenderen"}</small></span>
      </article>
      <section class="calendar-card">
        <header>
          <button type="button" data-calendar-prev>${icon("back")}</button>
          <h2>${monthName(calendarMonth)} ${calendarYear}</h2>
          <button type="button" data-calendar-next>${icon("chevron")}</button>
        </header>
        <div class="calendar-grid">
          ${renderCalendarDays()}
        </div>
      </section>
      <section class="section-stack book-screen__time-section">
        <h2>Ledige tider ${formatDate(selectedDate)}</h2>
        <div class="time-grid">
          ${appData.meetingTimes.map((time) => `<button class="time-chip ${selectedTime === time ? "time-chip--selected" : ""}" type="button" data-time="${time}">${time}</button>`).join("")}
        </div>
      </section>
      <button class="button button--primary button--fixed" type="button" data-action="confirm-meeting">Bekræft tid</button>
    `,
  });
}

function monthName(monthIndex) {
  return new Intl.DateTimeFormat("da-DK", { month: "long" }).format(new Date(2026, monthIndex, 1)).replace(/^\w/, (letter) => letter.toUpperCase());
}

function renderCalendarDays() {
  const weekdays = ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"];
  const firstDay = new Date(calendarYear, calendarMonth, 1);
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const offset = (firstDay.getDay() + 6) % 7;
  const cells = weekdays.map((day) => `<span class="calendar-grid__weekday">${day}</span>`);

  for (let index = 0; index < offset; index += 1) {
    cells.push("<span></span>");
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push(`<button class="${selectedDate === date ? "calendar-grid__active" : ""}" type="button" data-date="${date}">${day}</button>`);
  }

  return cells.join("");
}

function confirmMeeting() {
  const id = `meeting-${Date.now()}`;
  state.meetings = [
    {
      id,
      date: selectedDate,
      time: selectedTime,
      title: "Rådgivningsmøde med Benedikte",
    },
  ];
  state.notifications.unshift({
    id: `note-${id}`,
    title: "Møde booket",
    text: `Du har booket møde ${formatDate(selectedDate)} kl. ${selectedTime}.`,
    date: todayLabel(),
    read: false,
  });
  saveState();
}

function renderMeetingConfirmedPage() {
  appContent.innerHTML = appShell({
    active: "home",
    title: "Møde booket",
    className: "success-screen success-screen--meeting",
    body: `
      <div class="success-screen__mark">${icon("check")}</div>
      <section class="success-screen__copy">
        <h2>Din tid er bekræftet</h2>
        <p>${formatDate(selectedDate)} kl. ${selectedTime}</p>
      </section>
      ${button("Til forsiden", "home", "button--fixed")}
    `,
  });
}

function renderProfilePage() {
  appContent.innerHTML = appShell({
    active: "home",
    title: "Theresa Hansen",
    lead: "theresa@mail.dk",
    backTo: "home",
    className: "profile-screen",
    body: `
      <section class="section-stack">
        <h2>Indstillinger</h2>
        <button class="settings-row" type="button">${icon("bell")}<strong>Notifikationer</strong>${icon("chevron")}</button>
        <button class="settings-row" type="button">${icon("shield")}<strong>Privatliv & sikkerhed</strong>${icon("chevron")}</button>
        <button class="settings-row" type="button">${icon("lock")}<strong>Adgangskode</strong>${icon("chevron")}</button>
      </section>
      <section class="section-stack">
        <h2>Prototype</h2>
        <button class="settings-row settings-row--danger" type="button" data-action="reset-app">${icon("trash")}<strong>Nulstil sager, beskeder og møder</strong></button>
      </section>
    `,
  });
}

function collectDraftFields() {
  document.querySelectorAll("[data-field]").forEach((input) => {
    draftCase[input.dataset.field] = input.value;
  });
}

function sendMessage(form) {
  const input = form.querySelector("input");
  const text = input.value.trim();
  if (!text) return;

  const conversation = state.conversations.find((item) => item.id === selectedConversationId);
  if (!conversation) return;

  conversation.messages.push({ from: "Dig", text, time: todayLabel() });
  conversation.messages.push({
    from: "Benedikte",
    text: "Tak for din besked. Jeg vender tilbage med et konkret svar, så snart jeg har gennemgået det.",
    time: todayLabel(),
  });
  conversation.updatedAt = new Date().toISOString();
  state.conversations = [conversation, ...state.conversations.filter((item) => item.id !== conversation.id)];
  saveState();
  renderChatPage();
}

function openConversationForCase(caseId) {
  const conversation = state.conversations.find((item) => item.caseId === caseId);
  if (!conversation) return;
  selectedConversationId = conversation.id;
  renderPage("chat");
}

function resetAppData() {
  state = { ...defaultState };
  saveState();
  renderPage("home");
}

function renderPage(pageName) {
  currentPage = pageName;
  const routes = {
    welcome: renderWelcomePage,
    "create-profile": renderCreateProfilePage,
    needs: renderNeedsPage,
    security: renderSecurityPage,
    login: renderLoginPage,
    home: renderHomePage,
    cases: renderCasesPage,
    "case-detail": renderCaseDetailPage,
    "new-case-1": renderNewCaseStepOnePage,
    "new-case-2": renderNewCaseStepTwoPage,
    "new-case-3": renderNewCaseStepThreePage,
    "case-created": renderCaseCreatedPage,
    messages: renderMessagesPage,
    chat: renderChatPage,
    notifications: renderNotificationsPage,
    faq: renderFaqPage,
    how: renderHowPage,
    process: renderProcessPage,
    prices: renderPricesPage,
    book: renderBookPage,
    "meeting-confirmed": renderMeetingConfirmedPage,
    profile: renderProfilePage,
  };

  const render = routes[pageName] || renderWelcomePage;
  render();
}

document.addEventListener("click", (event) => {
  const routeButton = event.target.closest("[data-page]");
  const choiceButton = event.target.closest("[data-choice-index]");
  const topicButton = event.target.closest("[data-topic-id]");
  const documentButton = event.target.closest("[data-document-name]");
  const caseButton = event.target.closest("[data-case-id]");
  const conversationButton = event.target.closest("[data-conversation-id]");
  const openConversationButton = event.target.closest("[data-open-conversation]");
  const faqButton = event.target.closest("[data-faq-index]");
  const actionButton = event.target.closest("[data-action]");
  const dateButton = event.target.closest("[data-date]");
  const timeButton = event.target.closest("[data-time]");

  if (choiceButton) {
    selectedChoice = Number(choiceButton.dataset.choiceIndex);
    renderNeedsPage();
    return;
  }

  if (topicButton) {
    const topicId = topicButton.dataset.topicId;
    selectedTopics.has(topicId) ? selectedTopics.delete(topicId) : selectedTopics.add(topicId);
    renderNewCaseStepTwoPage();
    return;
  }

  if (documentButton) {
    const documentName = documentButton.dataset.documentName;
    selectedDocuments.has(documentName) ? selectedDocuments.delete(documentName) : selectedDocuments.add(documentName);
    renderNewCaseStepThreePage();
    return;
  }

  if (caseButton) {
    selectedCaseId = caseButton.dataset.caseId;
    renderPage("case-detail");
    return;
  }

  if (conversationButton) {
    selectedConversationId = conversationButton.dataset.conversationId;
    renderPage("chat");
    return;
  }

  if (openConversationButton) {
    openConversationForCase(openConversationButton.dataset.openConversation);
    return;
  }

  if (faqButton) {
    const index = Number(faqButton.dataset.faqIndex);
    openFaqIndex = openFaqIndex === index ? null : index;
    renderFaqPage();
    return;
  }

  if (event.target.closest("[data-calendar-prev]")) {
    calendarMonth -= 1;
    if (calendarMonth < 0) {
      calendarMonth = 11;
      calendarYear -= 1;
    }
    renderBookPage();
    return;
  }

  if (event.target.closest("[data-calendar-next]")) {
    calendarMonth += 1;
    if (calendarMonth > 11) {
      calendarMonth = 0;
      calendarYear += 1;
    }
    renderBookPage();
    return;
  }

  if (dateButton) {
    selectedDate = dateButton.dataset.date;
    renderBookPage();
    return;
  }

  if (timeButton) {
    selectedTime = timeButton.dataset.time;
    renderBookPage();
    return;
  }

  if (actionButton) {
    if (actionButton.dataset.action === "case-step-one") {
      collectDraftFields();
      renderPage("new-case-2");
      return;
    }

    if (actionButton.dataset.action === "create-case") {
      createCase();
      renderPage("case-created");
      return;
    }

    if (actionButton.dataset.action === "confirm-meeting") {
      confirmMeeting();
      renderPage("meeting-confirmed");
      return;
    }

    if (actionButton.dataset.action === "reset-app") {
      resetAppData();
      return;
    }
  }

  if (routeButton) {
    if (currentPage === "new-case-1") collectDraftFields();
    routeTo(routeButton.dataset.page);
  }
});

document.addEventListener("submit", (event) => {
  event.preventDefault();
  const chatForm = event.target.closest("[data-chat-form]");
  if (chatForm) sendMessage(chatForm);
});

window.renderPage = renderPage;

renderPage(currentPage);
