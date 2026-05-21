const appData = {
  choices: [
    {
      icon: "home",
      title: "Jeg har fundet en bolig",
      text: "Jeg har en bolig, jeg gerne vil have gennemgået.",
    },
    {
      icon: "document",
      title: "Jeg vil have gennemgået dokumenter",
      text: "Jeg har brug for hjælp til at forstå dokumenter.",
    },
    {
      icon: "calendar",
      title: "Jeg vil booke rådgivning",
      text: "Jeg ønsker en personlig samtale eller rådgivning.",
    },
    {
      icon: "search",
      title: "Jeg undersøger stadig muligheder",
      text: "Jeg er tidligt i processen.",
    },
  ],

  caseTopics: [
    {
      id: "purchase-agreement",
      icon: "document",
      title: "Gennemgang af købsaftale",
      text: "Jeg vil have gennemgået købsaftalen for vilkår og forbehold.",
    },
    {
      id: "condition-report",
      icon: "document",
      title: "Gennemgang af tilstandsrapport",
      text: "Jeg vil have vurderet rapporten for skjulte fejl og risici.",
    },
    {
      id: "reservation",
      icon: "shield",
      title: "Rådgivning om forbehold",
      text: "Hvad betyder forbeholdene for mig og min handel?",
    },
    {
      id: "general",
      icon: "info",
      title: "General køberrådgivning",
      text: "Jeg ønsker sparring og overblik gennem hele processen.",
    },
  ],

  uploadDocuments: [
    "Købsaftale",
    "Tilstandsrapport",
    "Energimærke",
    "Salgsopstilling",
  ],

  processSteps: [
    {
      title: "Opret din sag",
      text: "Fortæl hvilken bolig eller hvilke dokumenter, du ønsker hjælp til.",
      icon: "folder",
    },
    {
      title: "Upload dokumenter",
      text: "Tilføj de filer du har, så Benedikte kan gennemgå dem samlet.",
      icon: "upload",
    },
    {
      title: "Få rådgivning",
      text: "Du får besked, når der er feedback, spørgsmål eller forslag til næste skridt.",
      icon: "message",
    },
  ],

  packages: [
    {
      name: "Pakke 1",
      title: "Køberrådgivning",
      price: "7.950 kr.",
      checks: [
        "Gennemgang af dokumenter",
        "Personlig rådgiver",
        "Direkte kontakt gennem hele processen",
        "Fysiske eller online møder",
      ],
    },
    {
      name: "Pakke 2",
      title: "Køberrådgivning + Forhandling",
      price: "12.950 kr.",
      checks: [
        "Alt fra pakke 1",
        "Vurdering af boligens prisniveau",
        "Forhandling af boligens pris",
        "Dialog med sælgers ejendomsmægler",
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

  meetingTimes: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
};
