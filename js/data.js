const appData = {
  choices: [
    {
      iconSrc: "assets/ikoner/hjaelp/fundet_en_bolig_ikon.png",
      title: "Jeg har fundet en bolig",
      text: "Jeg har en bolig, jeg gerne vil have gennemgået.",
    },
    {
      iconSrc: "assets/ikoner/hjaelp/dokumenter_ikon.png",
      title: "Jeg vil have gennemgået dokumenter",
      text: "Jeg har brug for hjælp til at forstå dokumenter.",
    },
    {
      iconSrc: "assets/ikoner/hjaelp/booke_raadgivning_ikon.png",
      title: "Jeg vil booke rådgivning",
      text: "Jeg ønsker en personlig samtale eller rådgivning.",
    },
    {
      iconSrc: "assets/ikoner/hjaelp/undersoerger_stadig_ikon.png",
      title: "Jeg undersøger stadig muligheder",
      text: "Jeg er tidligt i processen.",
    },
  ],

  caseTopics: [
    {
      id: "purchase-agreement",
      icon: "document",
      title: "Gennemgang af k\u00f8bsaftale",
      text: "Jeg vil have gennemg\u00e5et k\u00f8bsaftalen for vilk\u00e5r og forbehold.",
    },
    {
      id: "condition-report",
      icon: "document",
      title: "Gennemgang af tilstandsrapport",
      text: "Jeg vil have vurderet rapporten for skjulte fejl risici.",
    },
    {
      id: "purchase-review",
      icon: "document",
      title: "Gennemgang af k\u00f8bsaftale",
      text: "Jeg vil have gennemg\u00e5et k\u00f8bsaftalen for vilk\u00e5r og forbehold.",
    },
    {
      id: "reservation",
      icon: "document",
      title: "R\u00e5dgivning om forbehold",
      text: "Hvad betyder forbeholdne for mig og min handel?",
    },
    {
      id: "general",
      icon: "document",
      title: "General k\u00f8berr\u00e5dgivning",
      text: "Jeg \u00f8nsker sparring og overblik gennem hele processen.",
    },
  ],

  uploadDocuments: [
    "K\u00f8bsaftale",
    "Tilstandsrapport",
    "Elinstallationsrapport",
    "Salgsopstilling",
    "Andet dokument",
  ],

  processSteps: [
    {
      title: "Vi starter med din bolig",
      text: "Du opretter en sag, og vi ser p\u00e5 boligen og dine behov.",
      icon: "home",
    },
    {
      title: "Gennemgang & analyse",
      text: "Jeg gennemg\u00e5r materialet og vurderer pris, forhold og risici.",
      icon: "document",
    },
    {
      title: "Feedback & r\u00e5dgivning",
      text: "Du f\u00e5r min feedback og vi dr\u00f8fter, hvad der giver mest mening for dig.",
      icon: "message",
    },
    {
      title: "Du beslutter",
      text: "Du f\u00e5r et klart grundlag at tr\u00e6ffe den rigtige beslutning p\u00e5.",
      icon: "check",
    },
  ],

  packages: [
    {
      name: "Pakke 1",
      title: "K\u00f8berr\u00e5dgivning",
      price: "7.950 kr.",
      tone: "blue",
      checks: [
        "Gennemgang af dokumenter",
        "Personlig r\u00e5dgiver",
        "Direkte kontakt gennem hele processen",
        "Fysiske eller online m\u00f8der",
        "Dialog med bank, m\u00e6gler og \u00f8vrige parter",
        "R\u00e5dgivning om ejerskifteforsikring",
      ],
    },
    {
      name: "Pakke 2",
      title: "K\u00f8berr\u00e5dgivning + Forhandling",
      price: "12.950 kr.",
      tone: "red",
      checks: [
        "Alt fra pakke 1",
        "Vurdering af boligens prisniveau",
        "Undg\u00e5 at betale for meget for dr\u00f8mmehuset",
        "Forhandling af boligens pris",
        "Alt dialog med s\u00e6lgers ejendomsm\u00e6gler",
        "Vi bestiger boligen",
      ],
    },
  ],

  faqItems: [
    {
      question: "Hvad er en servitut?",
      answer:
        "En servitut er en regel eller rettighed, der er knyttet til ejendommen. Den kan for eksempel handle om brug af grunden, adgangsvej eller byggeri.",
      example: "En servitut kan betyde, at du ikke må bygge højere end en bestemt højde.",
    },
    {
      question: "Forbehold i købsaftalen",
      answer:
        "Et forbehold beskytter dig, hvis noget skal være på plads før handlen er endelig. Det kan være bank, advokat eller teknisk gennemgang.",
      example: "Et rådgiverforbehold kan give tid til at få dokumenterne gennemgået.",
    },
    {
      question: "Tilstandsrapport - hvad er det?",
      answer:
        "Tilstandsrapporten beskriver synlige skader og fejl ved boligen. Den er vigtig, fordi den giver et overblik over risici og kommende udgifter.",
      example: "En K3-skade kan være noget, du bør undersøge ekstra grundigt.",
    },
    {
      question: "Elinstallationsrapport",
      answer:
        "Elinstallationsrapporten gennemgår boligens elinstallationer og markerer fejl eller ulovlige installationer.",
      example: "Ulovlige installationer kan kræve udbedring efter overtagelse.",
    },
    {
      question: "Overtagelse og betaling",
      answer:
        "Overtagelsesdagen er den dag, du får rådighed over boligen. Betaling, refusion og praktiske aftaler skal være på plads inden da.",
      example: "Refusionsopgørelsen fordeler udgifter mellem køber og sælger.",
    },
  ],

  meetingTimes: ["13:00", "14:00", "15:00", "13:30", "14:30", "15:30"],
};
