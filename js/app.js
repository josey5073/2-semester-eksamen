const appContent = document.getElementById("app-content");
const storageKey = "koeberraadgivning-prototype-v3";

let currentPage = "welcome";
let selectedChoices = new Set();
let openFaqIndex = null;
let selectedTopics = new Set();
let selectedDocuments = new Set();
let selectedCaseId = null;
let selectedDocumentName = null;
let selectedConversationId = null;
let selectedDate = "2026-05-18";
let selectedTime = "16:00";
let calendarYear = 2026;
let calendarMonth = 4;
let isMeetingsSheetOpen = false;
let isChatAttachmentsOpen = false;
const previousMeetings = [
  {
    id: "previous-meeting-1",
    date: "2026-05-06",
    time: "14:00",
    address: "Kastanievej 8, 2800 Lyngby",
    topic: "Gennemgang af k\u00f8bsaftale",
  },
];

const navIcons = {
  home: "home",
  faq: "FAQ",
  messages: "beskeder",
  cases: "sager",
  notifications: "notifikationer",
};
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
  const iconAssets = {
    back: "assets/ikoner/andet/image 61.png",
    chevron: "assets/ikoner/andet/image 63.png",
    arrowRight: "assets/ikoner/andet/image 63.png",
    down: "assets/ikoner/andet/image 62.png",
    user: "assets/ikoner/ikoner_til_profil_og_login/profil_ikon.png",
    mail: "assets/ikoner/ikoner_til_profil_og_login/mail_ikon.png",
    phone: "assets/ikoner/ikoner_til_profil_og_login/telefon_ikon.png",
    lock: "assets/ikoner/ikoner_til_profil_og_login/adgangskode_ikon.png",
    lockOpen: "assets/ikoner/security/security_ikon.png",
    eye: "assets/ikoner/ikoner_til_profil_og_login/se_eller_ikke_se_adgangskode_ikon.png",
    home: "assets/ikoner/andet/image 65.png",
    document: "assets/ikoner/andet/image 56.png",
    folder: "assets/ikoner/navigations_ikoner/sager.png",
    calendar: "assets/ikoner/andet/moede_ikon.png",
    search: "assets/ikoner/hjaelp/undersoerger_stadig_ikon.png",
    shield: "assets/ikoner/security/ingen_deling_ikon.png",
    info: "assets/ikoner/andet/image 68.png",
    message: "assets/ikoner/andet/image 67.png",
    bell: "assets/ikoner/navigations_ikoner/notifikationer.png",
    upload: "assets/ikoner/ikoner_til_beskeder/tilfoej_ikon.png",
    plus: "assets/ikoner/ikoner_til_beskeder/tilfoej_ikon.png",
    check: "assets/ikoner/andet/image 57.png",
    clock: "assets/ikoner/andet/image 59.png",
    trash: "assets/ikoner/andet/image 56.png",
    placeholder: "assets/ikoner/andet/image 56.png",
  };
  const key = String(name || "placeholder");
  const safeName = key.replace(/[^a-z0-9_-]/gi, "-");
  const src = iconAssets[key] || iconAssets.placeholder;
  return `<span class="icon icon--${safeName}"><img class="icon__image" src="${src}" alt="" /></span>`;
}
function imageIcon(src, alt, className = "image-icon") {
  return `<img class="${className}" src="${src}" alt="${alt}" />`;
}

function navImage(pageName, isActive) {
  const fileName = navIcons[pageName];
  const suffix = isActive ? "_roed" : "";
  return imageIcon(`assets/ikoner/navigations_ikoner/${fileName}${suffix}.png`, "", "bottom-nav__image");
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

function formatShortDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
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
      ${imageIcon("assets/ikoner/andet/image 64.png", "", "profile-button__image")}
    </button>
  `;
}

function renderField(options) {
  const value = options.value ? `value="${escapeHtml(options.value)}"` : "";
  const dataField = options.field ? `data-field="${options.field}"` : "";
  const action = options.actionIconSrc ? `<span class="field__action">${imageIcon(options.actionIconSrc, "", "field__image-icon field__image-icon--action")}</span>` : options.actionIcon ? `<span class="field__action">${icon(options.actionIcon)}</span>` : `<span></span>`;

  return `
    <label class="field">
      <span class="field__label">${options.label}</span>
      <span class="field__control">
        ${options.iconSrc ? `<span class="field__icon">${imageIcon(options.iconSrc, "", "field__image-icon")}</span>` : options.iconName ? `<span class="field__icon">${icon(options.iconName)}</span>` : ""}
        <input class="field__input" type="${options.type || "text"}" placeholder="${options.placeholder || ""}" autocomplete="${options.autocomplete || "off"}" ${dataField} ${value} />
        ${action}
      </span>
    </label>
  `;
}

function bottomNav(activePage) {
  const items = [
    ["Home", "home"],
    ["FAQ", "faq"],
    ["Beskeder", "messages"],
    ["Sager", "cases"],
    ["Notif", "notifications"],
  ];

  return `
    <nav class="bottom-nav" aria-label="Hovednavigation">
      ${items
        .map(
          ([label, page]) => `
            <button class="bottom-nav__item ${activePage === page ? "bottom-nav__item--active" : ""}" type="button" data-page="${page}">
              ${navImage(page, activePage === page)}
              <span class="bottom-nav__label">${label}</span>
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
      ${options.nav === false ? "" : bottomNav(options.active === undefined ? "home" : options.active)}
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
        <span class="quick-actions__icon">${imageIcon("assets/ikoner/andet/moede_ikon.png", "", "quick-actions__image")}</span>
        <strong class="quick-actions__title">Book m\u00f8de</strong>
        <span class="quick-actions__text">Tal med Benedikte</span>
      </button>
      <button class="quick-actions__button" type="button" data-page="how">
        <span class="quick-actions__icon quick-actions__icon--info">${icon("info")}</span>
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
        <span class="logo-box__image-frame"><img class="logo-box__image" src="assets/billeder/logo.png" alt="Benedikte Brechmann Køberrådgivning" /></span>
        <h1 class="logo-box__title">Benedikte Brechmann</h1>
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
    <section class="screen auth-screen auth-screen--create">
      ${backButton("welcome")}
      <header class="screen__header">
        <h1 class="screen__title">Opret profil</h1>
        <p class="screen__lead">Så jeg kan hjælpe dig bedst muligt gennem din boligproces.</p>
      </header>

      <form class="auth-form">
        ${renderField({ iconSrc: "assets/ikoner/ikoner_til_profil_og_login/profil_ikon.png", label: "Fulde navn", type: "text", placeholder: "Fulde navn", autocomplete: "name" })}
        ${renderField({ iconSrc: "assets/ikoner/ikoner_til_profil_og_login/mail_ikon.png", label: "E-mail", type: "email", placeholder: "E-mail", autocomplete: "email" })}
        ${renderField({ iconSrc: "assets/ikoner/ikoner_til_profil_og_login/telefon_ikon.png", label: "Telefonnummer", type: "tel", placeholder: "Telefonnummer (valgfrit)", autocomplete: "tel" })}
        ${renderField({ iconSrc: "assets/ikoner/ikoner_til_profil_og_login/adgangskode_ikon.png", label: "Opret adgangskode", type: "password", placeholder: "Opret adgangskode", autocomplete: "new-password", actionIconSrc: "assets/ikoner/ikoner_til_profil_og_login/se_eller_ikke_se_adgangskode_ikon.png" })}
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
      const isSelected = selectedChoices.has(index);
      return `
        <button class="choice-card ${isSelected ? "choice-card--selected" : ""}" type="button" data-choice-index="${index}" aria-pressed="${isSelected}">
          <span class="choice-card__icon">${choice.iconSrc ? imageIcon(choice.iconSrc, "", "choice-card__image") : icon(choice.icon)}</span>
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
      <div class="security-hero">${imageIcon("assets/ikoner/security/security_ikon.png", "", "security-hero__image")}</div>
      <div class="feature-list">
        <article class="feature-card">
          <div class="feature-card__icon">${imageIcon("assets/ikoner/security/ingen_deling_ikon.png", "", "feature-card__image")}</div>
          <div class="feature-card__copy"><h3>Dine dokumenter deles ikke med andre</h3><p>Alt du deler med mig er fortroligt.</p></div>
        </article>
        <article class="feature-card">
          <div class="feature-card__icon">${imageIcon("assets/ikoner/security/direkte_kontakt_ikon.png", "", "feature-card__image")}</div>
          <div class="feature-card__copy"><h3>Direkte kontakt med Benedikte</h3><p>Du har altid direkte kontakt til mig.</p></div>
        </article>
        <article class="feature-card">
          <div class="feature-card__icon">${imageIcon("assets/ikoner/security/sikker_opbevaring_ikon.png", "", "feature-card__image")}</div>
          <div class="feature-card__copy"><h3>Sikker opbevaring a filer</h3><p>Dine filer opbevares sikker og kan kun tilg\u00e5s af dig og mig.</p></div>
        </article>
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
        ${renderField({ iconSrc: "assets/ikoner/ikoner_til_profil_og_login/mail_ikon.png", label: "E-mail", type: "email", placeholder: "E-mail", autocomplete: "email" })}
        ${renderField({ iconSrc: "assets/ikoner/ikoner_til_profil_og_login/adgangskode_ikon.png", label: "Adgangskode", type: "password", placeholder: "Adgangskode", autocomplete: "current-password", actionIconSrc: "assets/ikoner/ikoner_til_profil_og_login/se_eller_ikke_se_adgangskode_ikon.png" })}
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
  const latestCase = state.cases[0];
  const hasCase = Boolean(latestCase);
  const latestCaseTitle = latestCase
    ? [latestCase.address, [latestCase.postal, latestCase.city].filter(Boolean).join(" ")].filter(Boolean).join(", ")
    : "";

  const latestActivity = latestCase
    ? `
      <section class="home-activity" aria-label="Seneste aktivitet">
        <h2 class="home-activity__title">Seneste aktivitet</h2>
        <button class="home-case-card" type="button" data-case-id="${latestCase.id}">
          <span class="home-case-card__icon">${imageIcon("assets/ikoner/hjaelp/fundet_en_bolig_ikon.png", "", "home-case-card__image")}</span>
          <span class="home-case-card__body">
            <strong class="home-case-card__title">${escapeHtml(latestCaseTitle)}</strong>
            <small class="home-case-card__status">${icon("clock")} Afventer gennemgang</small>
          </span>
          <span class="home-case-card__arrow">${icon("chevron")}</span>
        </button>
      </section>
    `
    : "";

  const body = `
    <div class="home-screen__art" aria-hidden="true"></div>
    <button class="hero-action" type="button" data-page="new-case-1">
      <span class="hero-action__icon">${icon("folder")}</span>
      <span class="hero-action__body"><strong class="hero-action__title">Upload dokument</strong><small class="hero-action__text">Start en sag p\u00e5 en bolig<br />du \u00f8nsker r\u00e5dgivning om.</small></span>
      <span class="hero-action__arrow">${icon("arrowRight")}</span>
    </button>
    ${homeQuickActions()}
    ${latestActivity}
    <button class="help-card" type="button" data-page="faq">
      <span class="help-card__icon">${imageIcon("assets/ikoner/navigations_ikoner/beskeder.png", "", "help-card__image")}</span>
      <span class="help-card__body"><strong class="help-card__title">Har du sp\u00f8rgsm\u00e5l?</strong><small class="help-card__text">Tjek FAQ for mulige svar</small></span>
      <span class="help-card__arrow">${icon("chevron")}</span>
    </button>
  `;

  appContent.innerHTML = appShell({
    active: "home",
    title: "Hej Theresa",
    lead: "Hvordan kan jeg hj\u00e6lpe dig i dag?",
    profile: true,
    className: `home-screen ${hasCase ? "home-screen--content" : "home-screen--empty"}`,
    body,
  });
}

function renderCasesPage() {
  const body = `
    <div class="cases-screen__art" aria-hidden="true"></div>
    <button class="button button--primary cases-screen__new-button" type="button" data-page="new-case-1">+ Opret ny sag</button>
    ${
      state.cases.length
        ? `<section class="cases-list" aria-label="Mine sager">${state.cases.map(renderCaseCard).join("")}</section>`
        : ""
    }
  `;

  appContent.innerHTML = appShell({
    active: "cases",
    title: "Mine sager",
    lead: "Her har du overblik over alle dine<br />igangv\u00e6rende og tidligere sager",
    profile: true,
    className: `cases-screen ${state.cases.length ? "cases-screen--content" : "cases-screen--empty"}`,
    body,
  });
}

function caseDisplayTitle(caseItem) {
  return [caseItem.address, [caseItem.postal, caseItem.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
}

function caseUpdatedLabel(caseItem) {
  if (caseItem.updatedLabel) return caseItem.updatedLabel;
  const date = caseItem.updatedAt || caseItem.createdAt;
  if (!date) return "Opdateret i dag";
  const updated = new Date(date);
  const today = new Date();
  const isToday = updated.toDateString() === today.toDateString();
  if (isToday) return "Opdateret i dag";
  return `Opdateret ${updated.toLocaleDateString("da-DK", { day: "numeric", month: "long" })}`;
}

function caseStatusIcon(status) {
  const normalized = String(status || "").toLowerCase();
  return normalized.includes("afventer") ? icon("clock") : icon("check");
}

function renderCaseCard(caseItem) {
  const title = caseDisplayTitle(caseItem) || "Ny boligsag";
  const status = caseItem.status || "Afventer gennemgang";
  return `
    <button class="case-card" type="button" data-case-id="${caseItem.id}">
      <strong class="case-card__title">${escapeHtml(title)}</strong>
      <span class="case-card__status-row"><span class="case-card__status-icon">${caseStatusIcon(status)}</span><span>${escapeHtml(status)}</span></span>
      <small class="case-card__updated">${escapeHtml(caseUpdatedLabel(caseItem))}</small>
      <span class="case-card__arrow">${icon("chevron")}</span>
    </button>
  `;
}

function renderCaseDetailPage() {
  const caseItem = state.cases.find((item) => item.id === selectedCaseId) || state.cases[0];
  if (!caseItem) {
    renderCasesPage();
    return;
  }

  const address = caseItem.address || "Skovvej 12";
  const postal = caseItem.postal || "2800";
  const city = caseItem.city || "Lyngby";
  const documents = normalizeCaseDocuments(caseItem);

  appContent.innerHTML = appShell({
    active: "cases",
    title: escapeHtml(address),
    lead: escapeHtml([postal, city].filter(Boolean).join(" ")),
    backTo: "cases",
    centered: true,
    className: "case-uploaded-screen",
    body: `
      <section class="case-review-status">
        <strong class="case-review-status__header"><span class="case-review-status__icon" aria-hidden="true"></span>Afventer gennemgang</strong>
        <p>Jeg gennemgår dine dokumenter.</p>
        <p>Du hører fra mig snarest.</p>
      </section>
      <section class="uploaded-documents">
        <header class="uploaded-documents__header">
          <h2>Dokumenter</h2>
          <button class="uploaded-documents__add" type="button">+ Tilføj dokument</button>
        </header>
        <div class="uploaded-documents__list">
          ${documents.map(renderUploadedDocumentCard).join("")}
        </div>
      </section>
      <button class="more-documents-card" type="button">
        <span class="more-documents-card__icon">${icon("info")}</span>
        <span class="more-documents-card__copy"><strong>Har du flere dokumenter?</strong><small>Tilføj løbende, hvis der er nyt materiale.</small></span>
      </button>
    `,
  });
}

function normalizeCaseDocuments(caseItem) {
  const documents = Array.isArray(caseItem?.documents) && caseItem.documents.length ? caseItem.documents : ["Købsaftale"];
  return documents.map((documentItem, index) => {
    if (typeof documentItem === "object" && documentItem !== null) {
      const name = documentItem.name || documentItem.title || `Dokument ${index + 1}.pdf`;
      return {
        name: name.endsWith(".pdf") ? name : `${name}.pdf`,
        uploaded: documentItem.uploaded || documentItem.date || "15. maj 2026",
      };
    }

    const name = String(documentItem || `Dokument ${index + 1}`);
    return {
      name: name.endsWith(".pdf") ? name : `${name}.pdf`,
      uploaded: "15. maj 2026",
    };
  });
}

function renderUploadedDocumentCard(documentItem) {
  return `
    <button class="uploaded-document-card" type="button" data-case-document="${escapeHtml(documentItem.name)}">
      ${imageIcon("assets/ikoner/andet/image 56.png", "", "uploaded-document-card__image")}
      <span class="uploaded-document-card__copy">
        <strong class="uploaded-document-card__title">${escapeHtml(documentItem.name)}</strong>
        <small class="uploaded-document-card__date">Uploadet ${escapeHtml(documentItem.uploaded)}</small>
      </span>
      ${imageIcon("assets/ikoner/andet/image 63.png", "", "uploaded-document-card__arrow-image")}
    </button>
  `;
}

function renderDocumentDetailPage() {
  const caseItem = state.cases.find((item) => item.id === selectedCaseId) || state.cases[0];
  const documents = normalizeCaseDocuments(caseItem);
  const documentItem = documents.find((item) => item.name === selectedDocumentName) || documents[0] || { name: "Købsaftale.pdf", uploaded: "15. maj 2026" };
  const focusItems = [
    "Rådgiverforbehold",
    "Finansieringsforbehold",
    "Overtagelsesdato og disponibelret",
    "Tilstandsrapport, el-rapport og ejerskifteforsikring",
    "Tinglyste servitutter og hæftelser",
  ];

  appContent.innerHTML = appShell({
    active: "cases",
    title: escapeHtml(documentItem.name),
    lead: `Uploadet ${escapeHtml(documentItem.uploaded)}`,
    backTo: "case-detail",
    centered: true,
    className: "document-detail-screen",
    body: `
      <section class="document-focus">
        <h2>Hvad kigger jeg efter?</h2>
        <ul class="document-focus-card">
          ${focusItems.map((item) => `<li class="document-focus-card__item">${imageIcon("assets/ikoner/andet/image 68.png", "", "document-focus-card__check-image")}<span>${escapeHtml(item)}</span></li>`).join("")}
        </ul>
      </section>
      <section class="document-note">
        <h2>Vigtigt at vide</h2>
        <p>Små detaljer kan have stor betydning i din Købsaftale - derfor gennemgår jeg det hele grundigt for dig.</p>
      </section>
      <button class="button button--primary document-detail-screen__button" type="button" data-page="chat">Spørg mig om dokumentet</button>
    `,
  });
}
function stepper(step) {
  return `
    <div class="case-stepper" aria-label="Trin ${step} af 3">
      ${[1, 2, 3]
        .map((number) => {
          const stateClass = number < step ? "case-stepper__dot--done" : number === step ? "case-stepper__dot--active" : "";
          const label = number < step ? imageIcon("assets/ikoner/andet/image 76.png", "", "case-stepper__check-image") : number;
          return `<span class="case-stepper__dot ${stateClass}">${label}</span>`;
        })
        .join('<span class="case-stepper__line"></span>')}
    </div>
  `;
}

function renderNewCaseField({ label, placeholder, field, optional = false }) {
  return `
    <label class="new-case-field">
      <span class="new-case-field__label">${label}${optional ? ' <span class="new-case-field__optional">(valgfrit)</span>' : ""}</span>
      <input class="new-case-field__input" type="text" placeholder="${placeholder}" data-field="${field}" value="${escapeHtml(draftCase[field])}" autocomplete="off" />
    </label>
  `;
}

function renderNewCaseStepOnePage() {
  appContent.innerHTML = appShell({
    active: "cases",
    title: "Opret ny sag",
    backTo: "cases",
    centered: true,
    className: "new-case-screen new-case-screen--step-one",
    body: `
      ${stepper(1)}
      <section class="new-case-section">
        <h2 class="new-case-section__title">Hvilken bolig \u00f8nsker du hj\u00e6lp til?</h2>
        <p class="new-case-section__text">Fort\u00e6l os om boligen, s\u00e5 vi kan<br />oprette din sag.</p>
      </section>
      <form class="new-case-form">
        ${renderNewCaseField({ label: "Adresse", placeholder: "Fx Skovvej 12", field: "address" })}
        ${renderNewCaseField({ label: "Postnummer", placeholder: "2800", field: "postal" })}
        ${renderNewCaseField({ label: "By", placeholder: "Lyngby", field: "city" })}
        ${renderNewCaseField({ label: "Link til boligannonce", placeholder: "Inds\u00e6t link her", field: "link", optional: true })}
      </form>
      <button class="button button--primary new-case-screen__button" type="button" data-action="case-step-one">Forts\u00e6t</button>
    `,
  });
}

function renderTopicRow(topic) {
  const isSelected = selectedTopics.has(topic.id);
  return `
    <button class="new-case-topic ${isSelected ? "new-case-topic--selected" : ""}" type="button" data-topic-id="${topic.id}" aria-pressed="${isSelected}">
      <span class="new-case-topic__icon">${imageIcon("assets/ikoner/andet/image 56.png", "", "new-case-topic__image")}</span>
      <span class="new-case-topic__copy">
        <strong class="new-case-topic__title">${escapeHtml(topic.title)}</strong>
        <small class="new-case-topic__text">${escapeHtml(topic.text)}</small>
      </span>
      <span class="new-case-topic__checkbox" aria-hidden="true">${imageIcon(isSelected ? "assets/ikoner/andet/image 59.png" : "assets/ikoner/andet/image 60.png", "", "new-case-topic__checkbox-image")}</span>
    </button>
  `;
}

function renderNewCaseStepTwoPage() {
  appContent.innerHTML = appShell({
    active: "cases",
    title: "Opret ny sag",
    backTo: "new-case-1",
    centered: true,
    className: "new-case-screen new-case-screen--step-two",
    body: `
      ${stepper(2)}
      <section class="new-case-section">
        <h2 class="new-case-section__title">Hvad har du brug for hj\u00e6lp til?</h2>
        <p class="new-case-section__text">V\u00e6lg de emner, du \u00f8nsker r\u00e5dgivning om.<br />Du kan v\u00e6lge flere.</p>
      </section>
      <div class="new-case-topic-list">
        ${appData.caseTopics.map(renderTopicRow).join("")}
      </div>
      <button class="button button--primary new-case-screen__button" type="button" data-page="new-case-3">Forts\u00e6t</button>
    `,
  });
}

function renderUploadRow(name) {
  const isSelected = selectedDocuments.has(name);
  return `
    <button class="new-case-upload ${isSelected ? "new-case-upload--selected" : ""}" type="button" data-document-name="${escapeHtml(name)}" aria-pressed="${isSelected}">
      <span class="new-case-upload__icon">${imageIcon("assets/ikoner/andet/image 56.png", "", "new-case-upload__image")}</span>
      <span class="new-case-upload__copy">
        <strong class="new-case-upload__title">${escapeHtml(name)}</strong>
        <small class="new-case-upload__text">${isSelected ? "Tilf\u00f8jet" : "Tilf\u00f8j fil"}</small>
      </span>
      <span class="new-case-upload__action" aria-hidden="true">${imageIcon(isSelected ? "assets/ikoner/andet/image 59.png" : "assets/ikoner/ikoner_til_beskeder/tilfoej_ikon.png", "", "new-case-upload__action-image")}</span>
    </button>
  `;
}

function renderNewCaseStepThreePage() {
  appContent.innerHTML = appShell({
    active: "cases",
    title: "Opret ny sag",
    backTo: "new-case-2",
    centered: true,
    className: "new-case-screen new-case-screen--step-three",
    body: `
      ${stepper(3)}
      <section class="new-case-section">
        <h2 class="new-case-section__title">Upload relevante dokumenter</h2>
        <p class="new-case-section__text">Jo flere dokumenter, jo bedre kan jeg<br />hj\u00e6lpe dig.</p>
      </section>
      <div class="new-case-upload-list">
        ${appData.uploadDocuments.map(renderUploadRow).join("")}
      </div>
      <button class="button button--primary new-case-screen__button" type="button" data-action="create-case">Opret sag</button>
      <p class="new-case-privacy">${imageIcon("assets/ikoner/ikoner_til_profil_og_login/adgangskode_ikon.png", "", "new-case-privacy__image")} Dine dokumenter behandles fortroligt og deles ikke.</p>
    `,
  });
}

function createCase() {
  collectDraftFields();
  const selectedTopicItems = appData.caseTopics.filter((topic) => selectedTopics.has(topic.id));
  const documents = selectedDocuments.size ? Array.from(selectedDocuments) : ["K\u00f8bsaftale"];
  const id = Date.now().toString();
  const address = draftCase.address.trim() || "Skovvej 12";
  const postal = draftCase.postal.trim() || "2800";
  const city = draftCase.city.trim() || "Lyngby";

  const caseItem = {
    id,
    address,
    postal,
    city,
    link: draftCase.link.trim(),
    status: "Afventer gennemgang",
    createdAt: new Date().toISOString(),
    topics: selectedTopicItems.length ? selectedTopicItems.map((topic) => topic.title) : ["General k\u00f8berr\u00e5dgivning"],
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
        text: "Tak, jeg har modtaget din sag. Jeg gennemg\u00e5r dokumenterne og vender tilbage hurtigst muligt.",
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

function caseCreatedDateLabel(caseItem) {
  const date = caseItem?.createdAt ? new Date(caseItem.createdAt) : new Date();
  if (Number.isNaN(date.getTime())) return "Oprettet i dag";
  return `Oprettet ${date.toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" })}`;
}

function renderCreatedCaseSummary(caseItem) {
  const address = caseItem?.address || "Skovvej 12";
  const postal = caseItem?.postal || "2800";
  const city = caseItem?.city || "Lyngby";
  return `
    <article class="created-case-card">
      <span class="created-case-card__icon">${imageIcon("assets/ikoner/andet/image 65.png", "", "created-case-card__image")}</span>
      <span class="created-case-card__copy">
        <strong class="created-case-card__address">${escapeHtml(address)}</strong>
        <strong class="created-case-card__city">${escapeHtml([postal, city].filter(Boolean).join(" "))}</strong>
        <small class="created-case-card__date">${caseCreatedDateLabel(caseItem)}</small>
      </span>
    </article>
  `;
}

function renderCaseCreatedPage() {
  const caseItem = state.cases.find((item) => item.id === selectedCaseId) || state.cases[0];
  appContent.innerHTML = appShell({
    active: "cases",
    title: "Sag oprettet",
    className: "success-screen success-screen--case-created",
    body: `
      <div class="success-screen__mark">${imageIcon("assets/ikoner/andet/image 54.png", "", "success-screen__mark-image")}</div>
      <section class="success-screen__copy">
        <h2>Tak! Din sag er nu oprettet</h2>
        <p>Jeg g\u00e5r i gang med at gennemg\u00e5 dine dokumenter og vender tilbage hurtigst muligt.</p>
      </section>
      ${renderCreatedCaseSummary(caseItem)}
      <section class="timeline timeline--case-created">
        <h2>N\u00e6ste skridt</h2>
        <article><span class="timeline__marker">${imageIcon("assets/ikoner/andet/image 76.png", "", "timeline__marker-image")}</span><strong>Jeg gennemg\u00e5r dine dokumenter</strong><small>Typisk svar inden for 24 timer</small></article>
        <article><span class="timeline__marker">${imageIcon("assets/ikoner/andet/image 76.png", "", "timeline__marker-image")}</span><strong>Du f\u00e5r besked her i appen</strong><small>N\u00e5r jeg har feedback til dig</small></article>
        <article><span class="timeline__marker">${imageIcon("assets/ikoner/andet/image 76.png", "", "timeline__marker-image")}</span><strong>Vi kan holde et m\u00f8de</strong><small>Hvis du har brug for sparring</small></article>
      </section>
      ${button("Afslut", "cases", "new-case-screen__button success-screen__button")}
    `,
  });
}
const chatAttachmentActions = [
  { label: "Dokument", iconSrc: "assets/ikoner/ikoner_til_beskeder/dokument_ikon.png" },
  { label: "Billede", iconSrc: "assets/ikoner/ikoner_til_beskeder/billede_ikon.png" },
  { label: "PDF", iconSrc: "assets/ikoner/ikoner_til_beskeder/pdf_ikon.png" },
  { label: "Kamera", iconSrc: "assets/ikoner/ikoner_til_beskeder/kamera_ikon.png" },
  { label: "Notat", iconSrc: "assets/ikoner/ikoner_til_beskeder/notat_ikon.png" },
  { label: "Andet", iconSrc: "assets/ikoner/ikoner_til_beskeder/andet_ikon.png" },
];

function conversationForCase(caseItem) {
  return state.conversations.find((conversation) => conversation.caseId === caseItem.id);
}

function caseMessageStatus(caseItem) {
  const status = String(caseItem.status || "").toLowerCase();
  if (status.includes("afsluttet")) return { label: "Afsluttet", tone: "done" };
  if (status.includes("afventer")) return { label: "Afventer", tone: "waiting" };
  return { label: "Aktiv sag", tone: "active" };
}

function caseMessageSnippet(caseItem, conversation) {
  const latest = conversation?.messages?.at(-1);
  if (latest?.text) return `${latest.from}: ${latest.text}`;
  if (caseMessageStatus(caseItem).tone === "done") return "Samtalen er afsluttet";
  if (caseMessageStatus(caseItem).tone === "waiting") return "Benedikte: Tak for dokumenterne. Jeg vender tilbage snarest.";
  return "Benedikte: Jeg gennemgår købsaftalen nu og vender tilbage...";
}

function caseMessageTime(caseItem, conversation) {
  const latest = conversation?.messages?.at(-1);
  if (latest?.time) return `I dag kl. ${latest.time}`;
  if (caseMessageStatus(caseItem).tone === "done") return "I dag kl. 10:24";
  return "I dag kl. 10:24";
}

function renderMessagesCaseCard(caseItem) {
  const conversation = conversationForCase(caseItem);
  const status = caseMessageStatus(caseItem);
  const title = caseDisplayTitle(caseItem) || "Ny boligsag";

  return `
    <button class="messages-case-card messages-case-card--${status.tone}" type="button" data-open-conversation="${caseItem.id}">
      <span class="messages-case-card__icon">${imageIcon("assets/ikoner/andet/image 65.png", "", "messages-case-card__image")}</span>
      <span class="messages-case-card__content">
        <strong class="messages-case-card__title">${escapeHtml(title)}</strong>
        <span class="messages-case-card__status">${escapeHtml(status.label)}</span>
        <small class="messages-case-card__snippet">${escapeHtml(caseMessageSnippet(caseItem, conversation))}</small>
        <small class="messages-case-card__time">${escapeHtml(caseMessageTime(caseItem, conversation))}</small>
      </span>
      <span class="messages-case-card__arrow">${imageIcon("assets/ikoner/andet/image 63.png", "", "messages-case-card__arrow-image")}</span>
    </button>
  `;
}

function renderMessagesPage() {
  const hasCases = state.cases.length > 0;
  const activeCases = state.cases.filter((caseItem) => caseMessageStatus(caseItem).tone !== "done");
  const previousCases = state.cases.filter((caseItem) => caseMessageStatus(caseItem).tone === "done");
  const fallbackPrevious = hasCases && previousCases.length === 0
    ? [
        { id: "previous-message-case", address: "Engparken 5", postal: "2800", city: "Lyngby", status: "Afsluttet" },
      ]
    : previousCases;

  const body = hasCases
    ? `
      <label class="search-field messages-search">${icon("search")}<input type="search" placeholder="Søg i samtaler..." /></label>
      <section class="messages-section">
        <h2 class="messages-section__title">Aktive sager</h2>
        <div class="messages-section__list">${activeCases.map(renderMessagesCaseCard).join("")}</div>
      </section>
      <section class="messages-section">
        <h2 class="messages-section__title">Tidligere sager</h2>
        <div class="messages-section__list">${fallbackPrevious.map(renderMessagesCaseCard).join("")}</div>
      </section>
    `
    : `
      <label class="search-field">${icon("search")}<input type="search" placeholder="Søg i samtaler..." /></label>
      <section class="messages-screen__empty">
        ${emptyState("Ingen samtaler endnu", "Når du har oprettet en sag, kan du skrive direkte med Benedikte her.", "message")}
        ${button("+ Opret en sag", "new-case-1")}
      </section>
    `;

  appContent.innerHTML = appShell({
    active: "messages",
    title: "Beskeder",
    lead: hasCases ? "Her har du overblik over dine samtaler med Benedikte om dine sager." : "",
    profile: true,
    className: `messages-screen ${hasCases ? "messages-screen--content" : ""}`,
    body,
  });
}

function ensureConversationForCase(caseId) {
  let conversation = state.conversations.find((item) => item.caseId === caseId);
  const caseItem = state.cases.find((item) => item.id === caseId);
  if (conversation || !caseItem) return conversation;

  conversation = {
    id: `conv-${caseId}`,
    caseId,
    title: caseDisplayTitle(caseItem) || caseItem.address || "Samtale med Benedikte",
    updatedAt: new Date().toISOString(),
    messages: [
      { from: "Benedikte", text: "", time: "10:12" },
      { from: "Dig", text: "", time: "10:15" },
      { from: "Benedikte", text: "", time: "10:24" },
    ],
  };
  state.conversations.unshift(conversation);
  saveState();
  return conversation;
}

function chatTitle(conversation) {
  const caseItem = state.cases.find((item) => item.id === conversation.caseId);
  return caseItem ? caseDisplayTitle(caseItem) : conversation.title;
}

function renderChatMessage(message) {
  const isMine = message.from === "Dig";
  const bubbleText = message.text ? `<p>${escapeHtml(message.text)}</p>` : "";
  if (isMine) {
    return `
      <article class="chat-message chat-message--me">
        <time class="chat-message__time">${escapeHtml(message.time)}</time>
        <div class="chat-message__bubble">${bubbleText}</div>
      </article>
    `;
  }

  return `
    <article class="chat-message chat-message--benedikte">
      ${imageIcon("assets/ikoner/andet/Type=Photo.png", "Benedikte", "chat-message__avatar")}
      <span class="chat-message__content">
        <span class="chat-message__meta"><strong>Benedikte</strong><time>${escapeHtml(message.time)}</time></span>
        <div class="chat-message__bubble">${bubbleText}</div>
      </span>
    </article>
  `;
}

function renderAttachmentTray() {
  if (!isChatAttachmentsOpen) return "";
  return `
    <div class="chat-attachments" aria-label="Tilføj til besked">
      ${chatAttachmentActions.map((item) => `
        <button class="chat-attachments__item" type="button">
          ${imageIcon(item.iconSrc, "", "chat-attachments__icon")}
          <span>${escapeHtml(item.label)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderChatPage() {
  let conversation = state.conversations.find((item) => item.id === selectedConversationId) || state.conversations[0];
  if (!conversation && selectedCaseId) conversation = ensureConversationForCase(selectedCaseId);
  if (!conversation) {
    renderMessagesPage();
    return;
  }

  selectedConversationId = conversation.id;
  const messages = conversation.messages?.length
    ? conversation.messages
    : [
        { from: "Benedikte", text: "", time: "10:12" },
        { from: "Dig", text: "", time: "10:15" },
        { from: "Benedikte", text: "", time: "10:24" },
      ];

  appContent.innerHTML = appShell({
    active: "messages",
    title: escapeHtml(chatTitle(conversation)),
    lead: '<span class="chat-screen__status">Aktiv sag</span><span class="chat-screen__dot">•</span><span>Samtale med Benedikte</span>',
    backTo: "messages",
    centered: true,
    className: `chat-screen ${isChatAttachmentsOpen ? "chat-screen--attachments-open" : ""}`,
    body: `
      <div class="chat-day-divider"><span>I dag</span></div>
      <div class="chat-screen__list">
        ${messages.map(renderChatMessage).join("")}
      </div>
      <form class="chat-form" data-chat-form>
        <label class="chat-form__field">
          <span class="chat-form__label">Skriv en besked</span>
          <input type="text" placeholder="Skriv en besked..." aria-label="Skriv en besked" />
        </label>
        <button class="chat-form__toggle" type="button" data-action="toggle-attachments" aria-expanded="${isChatAttachmentsOpen}">
          ${imageIcon("assets/ikoner/ikoner_til_beskeder/tilfoej_ikon.png", "", "chat-form__toggle-icon")}
        </button>
        ${renderAttachmentTray()}
      </form>
    `,
  });
}

const notificationIconSources = {
  document: "assets/ikoner/andet/image 56.png",
  check: "assets/ikoner/andet/image 57.png",
  message: "assets/ikoner/andet/image 58.png",
};

function notificationFeedGroups() {
  return [
    {
      title: "I dag",
      items: [
        { icon: "document", title: "Jeg har set din købsaftale", text: "Uploadet 15. maj 2026", meta: "10:45" },
        { icon: "check", title: "Møde bekræftet", text: "Torsdag d. 22 maj kl. 16:00", meta: "09:30" },
        { icon: "message", title: "Ny besked fra Benedikte", text: "", meta: "08:15" },
      ],
    },
    {
      title: "Tidligere",
      items: [
        { icon: "document", title: "Tilstandsrapport uploadet", text: "", meta: "8. maj" },
        { icon: "document", title: "Dokument gennemgået", text: "", meta: "25. april" },
        { icon: "check", title: "Møde afholdt", text: "", meta: "21. april" },
      ],
    },
  ];
}

function renderNotificationCard(item) {
  const iconSrc = notificationIconSources[item.icon] || notificationIconSources.message;
  const text = item.text ? `<small class="notification-card__text">${escapeHtml(item.text)}</small>` : "";
  return `
    <article class="notification-card">
      <span class="notification-card__icon">${imageIcon(iconSrc, "", "notification-card__image")}</span>
      <span class="notification-card__body"><strong class="notification-card__title">${escapeHtml(item.title)}</strong>${text}</span>
      <em class="notification-card__meta">${escapeHtml(item.meta)}</em>
    </article>
  `;
}

function renderNotificationGroup(group) {
  return `
    <section class="notifications-screen__group">
      <h2 class="notifications-screen__group-title">${escapeHtml(group.title)}</h2>
      <div class="notifications-screen__cards">${group.items.map(renderNotificationCard).join("")}</div>
    </section>
  `;
}

function renderNotificationsPage() {
  const hasNotifications = state.notifications.length > 0 || state.cases.length > 0 || state.meetings.length > 0;
  const body = hasNotifications ? `<div class="notifications-screen__feed">${notificationFeedGroups().map(renderNotificationGroup).join("")}</div>` : "";

  appContent.innerHTML = appShell({
    active: "notifications",
    title: "Notifikationer",
    profile: true,
    className: `notifications-screen screen--illustrated ${hasNotifications ? "notifications-screen--content" : "notifications-screen--empty"}`,
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

const howFeatures = [
  {
    iconSrc: "assets/ikoner/security/ingen_deling_ikon.png",
    title: "Dine dokumenter deles ikke med andre",
    text: "Alt du deler med mig er fortroligt.",
  },
  {
    iconSrc: "assets/ikoner/security/direkte_kontakt_ikon.png",
    title: "Dine dokumenter deles ikke med andre",
    text: "Alt du deler med mig er fortroligt.",
  },
  {
    iconSrc: "assets/ikoner/security/sikker_opbevaring_ikon.png",
    title: "Dine dokumenter deles ikke med andre",
    text: "Alt du deler med mig er fortroligt.",
  },
];

const processIconSources = {
  home: "assets/ikoner/andet/image 65.png",
  document: "assets/ikoner/andet/image 66.png",
  message: "assets/ikoner/andet/image 67.png",
  check: "assets/ikoner/andet/image 68.png",
};

function renderHowPage() {
  appContent.innerHTML = appShell({
    active: "home",
    title: "Hvordan?",
    backTo: "home",
    centered: true,
    className: "how-screen",
    body: `
      <section class="how-screen__intro">
        <h2 class="how-screen__intro-title">Sådan hjælper jeg dig</h2>
        <p class="how-screen__intro-text">Få professionel køberrådgivning<br />hele vejen trygt, klar og til at betale.</p>
      </section>
      <div class="how-screen__hero" aria-hidden="true">
        ${imageIcon("assets/ikoner/andet/image 23.png", "", "how-screen__hero-image")}
      </div>
      <section class="how-screen__features">
        ${howFeatures
          .map(
            (feature) => `
              <article class="how-feature">
                <span class="how-feature__icon-wrap">${imageIcon(feature.iconSrc, "", "how-feature__icon")}</span>
                <span class="how-feature__copy">
                  <strong class="how-feature__title">${escapeHtml(feature.title)}</strong>
                  <small class="how-feature__text">${escapeHtml(feature.text)}</small>
                </span>
              </article>
            `,
          )
          .join("")}
      </section>
      ${button("Se processen og priser", "process", "how-screen__button")}
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
      <div class="process-screen__timeline">
        ${imageIcon("assets/ikoner/andet/image 55.png", "", "process-screen__timeline-image")}
        ${appData.processSteps
          .map((step, index) => {
            const isLast = index === appData.processSteps.length - 1;
            const iconSrc = processIconSources[step.icon] || processIconSources.document;
            return `
              <article class="process-step">
                <span class="process-step__marker">
                  <span class="process-step__number">${index + 1}</span>
                  ${isLast ? "" : '<span class="process-step__connector" aria-hidden="true"></span>'}
                </span>
                <span class="process-step__icon-wrap">${imageIcon(iconSrc, "", "process-step__icon")}</span>
                <span class="process-step__copy">
                  <strong class="process-step__title">${escapeHtml(step.title)}</strong>
                  <small class="process-step__text">${escapeHtml(step.text)}</small>
                </span>
              </article>
            `;
          })
          .join("")}
      </div>
      ${button("Næste", "prices", "process-screen__button")}
    `,
  });
}

function renderPricesPage() {
  appContent.innerHTML = appShell({
    active: "home",
    title: "Priser",
    backTo: "process",
    centered: true,
    className: "prices-screen",
    body: `
      <h2 class="prices-screen__heading">Rådgivningspakker</h2>
      <div class="prices-screen__list">
        ${appData.packages
          .map((pack, index) => {
            const isRed = pack.tone === "red" || index === 1;
            return `
              <article class="price-card price-card--${isRed ? "red" : "blue"}">
                <header class="price-card__header">
                  ${imageIcon(isRed ? "assets/ikoner/andet/image 77.png" : "assets/ikoner/andet/image 75.png", "", "price-card__package-icon")}
                  <span class="price-card__heading">
                    <small class="price-card__eyebrow">${escapeHtml(pack.name)}</small>
                    <strong class="price-card__title">${escapeHtml(pack.title)}</strong>
                  </span>
                </header>
                <ul class="price-card__features">
                  ${pack.checks
                    .map(
                      (item) => `
                        <li class="price-card__feature">
                          ${imageIcon(isRed ? "assets/ikoner/andet/image 78.png" : "assets/ikoner/andet/image 76.png", "", "price-card__check")}
                          <span class="price-card__feature-text">${escapeHtml(item)}</span>
                        </li>
                      `,
                    )
                    .join("")}
                </ul>
                <footer class="price-card__footer">
                  <strong class="price-card__price">${escapeHtml(pack.price)}</strong>
                  <span class="price-card__details">Se alle detaljer ${imageIcon("assets/ikoner/andet/image 63.png", "", "price-card__arrow")}</span>
                </footer>
              </article>
            `;
          })
          .join("")}
      </div>
      ${button("Tilbage", "process", "prices-screen__button")}
    `,
  });
}
function currentMeetingAddress() {
  const activeCase = state.cases[0];
  if (!activeCase || !activeCase.address) return "Birkely 3, 2800 Lyngby";
  return `${activeCase.address}, ${activeCase.postal || "2800"} ${activeCase.city || "Lyngby"}`;
}

function meetingDateLine(meeting) {
  return `${formatShortDate(meeting.date)} <span aria-hidden="true">&bull;</span> ${meeting.time}`;
}

function availableTimesLabel() {
  if (selectedDate === "2026-05-18") return "Ledige tider torsdag d. 18 maj";
  const date = new Date(`${selectedDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "Ledige tider";
  const weekday = new Intl.DateTimeFormat("da-DK", { weekday: "long" }).format(date);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat("da-DK", { month: "long" }).format(date);
  return `Ledige tider ${weekday} d. ${day} ${month}`;
}

function meetingPreview(meeting) {
  const actionAttributes = meeting ? ` data-action="open-meetings-sheet" aria-expanded="${isMeetingsSheetOpen}"` : "";
  const content = meeting
    ? `
        <span class="meeting-preview__content">
          <strong class="meeting-preview__status">Kommende møde</strong>
          <span class="meeting-preview__date">${meetingDateLine(meeting)}</span>
          <span class="meeting-preview__address">${escapeHtml(meeting.address || currentMeetingAddress())}</span>
          <small class="meeting-preview__topic">${escapeHtml(meeting.topic || "Dokumentgennemgang")}</small>
        </span>
      `
    : `
        <span class="meeting-preview__content meeting-preview__content--empty">
          <strong class="meeting-preview__status">Ingen kommende møder</strong>
        </span>
      `;

  return `
    <button class="meeting-preview ${meeting ? "meeting-preview--interactive" : "meeting-preview--empty"}" type="button"${actionAttributes}>
      <span class="meeting-preview__icon-wrap">${imageIcon("assets/ikoner/andet/moede_ikon.png", "", "meeting-preview__icon")}</span>
      ${content}
      <span class="meeting-preview__arrow">${icon("chevron")}</span>
    </button>
  `;
}

function meetingSheetCard(meeting) {
  return `
    <article class="meetings-sheet__card">
      ${imageIcon("assets/ikoner/andet/moede_ikon.png", "", "meetings-sheet__card-icon")}
      <span class="meetings-sheet__card-body">
        <strong class="meetings-sheet__card-time">${meetingDateLine(meeting)}</strong>
        <span class="meetings-sheet__card-address">${escapeHtml(meeting.address || currentMeetingAddress())}</span>
        <small class="meetings-sheet__card-topic">${escapeHtml(meeting.topic || "Dokumentgennemgang")}</small>
      </span>
    </article>
  `;
}

function upcomingMeetingsForSheet() {
  const meetings = state.meetings.length ? [...state.meetings] : [];
  if (meetings.length === 1) {
    meetings.push({
      id: "fallback-upcoming-meeting",
      date: "2026-05-29",
      time: "13:00",
      address: "Engparken 5, 2800 Lyngby",
      topic: "Gennemgang af købsaftale",
    });
  }
  return meetings;
}

function renderMeetingsSheet() {
  if (!isMeetingsSheetOpen || state.meetings.length === 0) return "";
  const upcomingMeetings = upcomingMeetingsForSheet();

  return `
    <div class="meetings-sheet" role="dialog" aria-modal="true" aria-labelledby="meetings-sheet-title">
      <button class="meetings-sheet__backdrop" type="button" data-action="close-meetings-sheet" aria-label="Luk kommende møder"></button>
      <section class="meetings-sheet__panel">
        <button class="meetings-sheet__handle" type="button" data-action="close-meetings-sheet" aria-label="Luk kommende møder"></button>
        <header class="meetings-sheet__header">
          ${imageIcon("assets/ikoner/andet/moede_ikon.png", "", "meetings-sheet__header-icon")}
          <h2 class="meetings-sheet__title" id="meetings-sheet-title">Kommende møder</h2>
        </header>
        <div class="meetings-sheet__list">${upcomingMeetings.map(meetingSheetCard).join("")}</div>
        <h3 class="meetings-sheet__subheading">Tidligere møder</h3>
        <div class="meetings-sheet__list">${previousMeetings.map(meetingSheetCard).join("")}</div>
      </section>
    </div>
  `;
}

function renderBookPage() {
  const meeting = state.meetings[0];
  appContent.innerHTML = appShell({
    active: null,
    title: "Book møde",
    lead: "Vælg en tid, der passer dig",
    backTo: "home",
    centered: true,
    className: "book-screen",
    body: `
      ${meetingPreview(meeting)}
      <section class="calendar-card">
        <header class="calendar-card__header">
          <button class="calendar-card__nav-button" type="button" data-calendar-prev>${icon("back")}</button>
          <h2 class="calendar-card__title">${monthName(calendarMonth)} ${calendarYear}</h2>
          <button class="calendar-card__nav-button" type="button" data-calendar-next>${icon("chevron")}</button>
        </header>
        <div class="calendar-grid">${renderCalendarDays()}</div>
      </section>
      <section class="book-screen__time-section">
        <h2>${availableTimesLabel()}</h2>
        <div class="time-grid">${appData.meetingTimes.map((time) => `<button class="time-chip ${selectedTime === time ? "time-chip--selected" : ""}" type="button" data-time="${time}">${time}</button>`).join("")}</div>
      </section>
      <button class="button button--primary button--fixed" type="button" data-action="confirm-meeting">Bekræft tid</button>
      ${renderMeetingsSheet()}
    `,
  });
}
function monthName(monthIndex) {
  return new Intl.DateTimeFormat("da-DK", { month: "long" }).format(new Date(2026, monthIndex, 1)).replace(/^\w/, (letter) => letter.toUpperCase());
}

function renderCalendarDays() {
  const weekdays = ["Ma", "Ti", "On", "To", "Fr", "L\u00f8", "S\u00f8"];
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const cells = weekdays.map((day) => `<span class="calendar-grid__weekday">${day}</span>`);

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push(`<button class="calendar-grid__day ${selectedDate === date ? "calendar-grid__day--active" : ""}" type="button" data-date="${date}">${day}</button>`);
  }

  let nextMonthDay = 1;
  while ((cells.length - weekdays.length) % 7 !== 0) {
    cells.push(`<button class="calendar-grid__day calendar-grid__day--muted" type="button" disabled>${nextMonthDay}</button>`);
    nextMonthDay += 1;
  }

  return cells.join("");
}

function confirmMeeting() {
  const id = `meeting-${Date.now()}`;
  const meeting = {
    id,
    date: selectedDate,
    time: selectedTime,
    title: "R\u00e5dgivningsm\u00f8de med Benedikte",
    address: currentMeetingAddress(),
    topic: "Dokumentgennemgang",
  };

  state.meetings = [meeting, ...state.meetings.filter((item) => item.id !== id)];
  state.notifications.unshift({
    id: `note-${id}`,
    title: "M\u00f8de booket",
    text: `Du har booket m\u00f8de ${formatDate(selectedDate)} kl. ${selectedTime}.`,
    date: todayLabel(),
    read: false,
  });
  isMeetingsSheetOpen = false;
  saveState();
}

function renderMeetingConfirmedPage() {
  const meetingDateText = selectedDate === "2026-05-18" ? "torsdag d. 18 maj 2026" : formatDate(selectedDate);

  appContent.innerHTML = `
    <section class="screen screen--app meeting-confirmed-screen">
      <div class="meeting-confirmed-screen__scroll">
        <div class="meeting-confirmed-screen__mark">${imageIcon("assets/ikoner/andet/image 54.png", "", "meeting-confirmed-screen__mark-image")}</div>
        <section class="meeting-confirmed-screen__copy">
          <h1 class="meeting-confirmed-screen__title">Mødet er booket!</h1>
          <p class="meeting-confirmed-screen__time">Vi ses ${meetingDateText}<br />kl. ${selectedTime}</p>
          <small class="meeting-confirmed-screen__note">Du modtager en påmindelse<br />inden mødet.</small>
        </section>
        <div class="meeting-confirmed-screen__actions">
          <button class="button button--primary" type="button" data-page="book">Se i kalender</button>
          <button class="button button--outline" type="button" data-page="home">Afslut</button>
        </div>
      </div>
      ${bottomNav(null)}
    </section>
  `;
}

const profileRows = [
  { label: "Notifikationer", iconSrc: "assets/ikoner/profil/notifikationer_profil.png" },
  { label: "Privatliv & sikkerhed", iconSrc: "assets/ikoner/profil/privatliv_og_sikkerhed_profil.png" },
  { label: "Adgangskode", iconSrc: "assets/ikoner/profil/adgangskode_profil.png" },
  { label: "Sprog", iconSrc: "assets/ikoner/profil/sprog_profil.png" },
];

const appInfoRows = [
  { label: "Vilkår og privatliv", iconSrc: "assets/ikoner/profil/vilkaar_og_privatliv_profil.png" },
  { label: "Version", iconSrc: "assets/ikoner/profil/version_profil.png", value: "1.0.0" },
];

function renderProfileRow(row) {
  const trailing = row.value
    ? `<span class="profile-row__value">${escapeHtml(row.value)}</span>`
    : imageIcon("assets/ikoner/andet/image 63.png", "", "profile-row__arrow");
  return `
    <button class="profile-row" type="button">
      ${imageIcon(row.iconSrc, "", "profile-row__icon")}
      <span class="profile-row__label">${escapeHtml(row.label)}</span>
      ${trailing}
    </button>
  `;
}

function renderProfilePage() {
  appContent.innerHTML = `
    <section class="screen screen--app profile-screen">
      <div class="profile-screen__scroll">
        <header class="profile-screen__hero">
          <span class="profile-screen__avatar" aria-hidden="true"></span>
          <span class="profile-screen__identity">
            <h1>Theresa Hansen</h1>
            <p>theresa@mail.dk</p>
          </span>
        </header>
        <section class="profile-section">
          <h2>Indstillinger</h2>
          <div class="profile-section__list">${profileRows.map(renderProfileRow).join("")}</div>
        </section>
        <section class="profile-section">
          <h2>Om appen</h2>
          <div class="profile-section__list">${appInfoRows.map(renderProfileRow).join("")}</div>
        </section>
        <div class="profile-screen__actions">
          <button class="button button--primary profile-screen__button" type="button" data-page="home">Tilbage</button>
          <button class="button button--outline profile-screen__reset-button" type="button" data-action="reset-app">Reset app</button>
        </div>
      </div>
      ${bottomNav("home")}
    </section>
  `;
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
  const conversation = ensureConversationForCase(caseId);
  if (!conversation) return;
  selectedCaseId = caseId;
  selectedConversationId = conversation.id;
  renderPage("chat");
}

function resetAppData() {
  state = {
    cases: [],
    conversations: [],
    notifications: [],
    meetings: [],
  };
  selectedChoices = new Set();
  selectedTopics = new Set();
  selectedDocuments = new Set();
  selectedCaseId = null;
  selectedDocumentName = null;
  selectedConversationId = null;
  openFaqIndex = null;
  draftCase = { ...emptyDraftCase };
  selectedDate = "2026-05-18";
  selectedTime = "16:00";
  calendarYear = 2026;
  calendarMonth = 4;
  isMeetingsSheetOpen = false;
  isChatAttachmentsOpen = false;
  localStorage.removeItem(storageKey);
  saveState();
  renderPage("welcome");
}

function renderPage(pageName) {
  if (pageName !== "book") isMeetingsSheetOpen = false;
  if (pageName !== "chat") isChatAttachmentsOpen = false;
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
    "document-detail": renderDocumentDetailPage,
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
  const caseDocumentButton = event.target.closest("[data-case-document]");
  const caseButton = event.target.closest("[data-case-id]");
  const conversationButton = event.target.closest("[data-conversation-id]");
  const openConversationButton = event.target.closest("[data-open-conversation]");
  const faqButton = event.target.closest("[data-faq-index]");
  const actionButton = event.target.closest("[data-action]");
  const dateButton = event.target.closest("[data-date]");
  const timeButton = event.target.closest("[data-time]");

  if (choiceButton) {
    const choiceIndex = Number(choiceButton.dataset.choiceIndex);
    selectedChoices.has(choiceIndex) ? selectedChoices.delete(choiceIndex) : selectedChoices.add(choiceIndex);
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

  if (caseDocumentButton) {
    selectedDocumentName = caseDocumentButton.dataset.caseDocument;
    renderPage("document-detail");
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

    if (actionButton.dataset.action === "open-meetings-sheet") {
      isMeetingsSheetOpen = state.meetings.length > 0;
      renderBookPage();
      return;
    }

    if (actionButton.dataset.action === "close-meetings-sheet") {
      isMeetingsSheetOpen = false;
      renderBookPage();
      return;
    }

    if (actionButton.dataset.action === "toggle-attachments") {
      isChatAttachmentsOpen = !isChatAttachmentsOpen;
      renderChatPage();
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
