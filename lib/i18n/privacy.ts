// Treść polityki prywatności. Opisuje to, co faktycznie robi strona:
// formularz kontaktowy (baza danych + powiadomienie przez webhook Discorda), logi serwera,
// ustawienia zapisane w przeglądarce (motyw, język, kraj, zgoda), Google Analytics po zgodzie, podgląd stron klientów w ramce.
// Nie zastępuje porady prawnej — przed publikacją warto dać ją do przejrzenia.

import { siteConfig } from "@/lib/site";

import type { Locale } from "./config";

export type PolicyBlock = string | { list: string[] };
export type PolicySection = { id: string; title: string; body: PolicyBlock[] };

// Znacznik pustego pola — komponent strony podświetla go na żółto.
export const MISSING = "⟦";

function field(value: string, label: string) {
  return value || `${MISSING}${label}${MISSING}`;
}

export function getPrivacyPolicy(locale: Locale): { title: string; intro: string; sections: PolicySection[] } {
  const legal = siteConfig.legal;
  const email = siteConfig.email;

  if (locale === "en") {
    const company = field(legal.companyName, "FILL IN: company name");

    return {
      title: "Privacy policy",
      intro:
        "This policy explains how we process personal data when you visit desflow.pl and when you contact us. We process only the data we genuinely need, in line with the EU General Data Protection Regulation (GDPR).",
      sections: [
        {
          id: "controller",
          title: "1. Data controller",
          body: [
            `The controller of your personal data is ${company} (hereinafter “desflow”, “we”).`,
            `For any questions about your data, contact us at ${email}.`,
          ],
        },
        {
          id: "data",
          title: "2. What data we process",
          body: [
            "Contact form: full name, email address, and — if you choose to provide them — phone number, company name and the content of your message.",
            "Technical data: when you visit the site, the hosting server automatically records technical logs (e.g. IP address, date and time of the request, browser type). This is standard for any website.",
            "Preferences saved in your browser: chosen colour theme, language choice and the detected country (see section 7).",
          ],
        },
        {
          id: "purposes",
          title: "3. Purposes and legal bases",
          body: [
            {
              list: [
                "Replying to your enquiry and preparing a quote — Art. 6(1)(b) GDPR (steps taken at your request before entering into a contract).",
                "Correspondence and keeping a record of enquiries — Art. 6(1)(f) GDPR (our legitimate interest in communicating with people who contact us).",
                "Protecting the form against spam and abuse (automatic message filtering) and ensuring website security — Art. 6(1)(f) GDPR.",
                "Establishing, pursuing or defending claims, if necessary — Art. 6(1)(f) GDPR.",
                "Website traffic statistics (Google Analytics) — Art. 6(1)(a) GDPR, only if you consent in the cookie banner.",
              ],
            },
            "We do not use your data for automated decision-making or profiling, and we do not send newsletters.",
          ],
        },
        {
          id: "retention",
          title: "4. How long we keep data",
          body: [
            "Form messages are kept for as long as needed to handle your enquiry and then for no longer than 12 months, unless we enter into a contract — in which case the data is kept for the duration of the cooperation and the period required by law (e.g. tax regulations) or until any claims become time-barred.",
            "Server logs are kept for the period set by the hosting provider, usually no longer than a few weeks.",
          ],
        },
        {
          id: "recipients",
          title: "5. Who receives your data",
          body: [
            "We do not sell your data. We share it only with providers who help us run the website, under data processing agreements:",
            {
              list: [
                "Discord Inc. — form notifications are delivered to our team's private channel via a Discord webhook;",
                "Google Ireland Limited / Google LLC — Google Analytics traffic statistics (only with your consent);",
                "our team members who handle enquiries.",
              ],
            },
          ],
        },
        {
          id: "transfers",
          title: "6. Transfers outside the EEA",
          body: [
            "Some providers (e.g. Discord Inc., Google LLC, and depending on configuration also the hosting provider) are based in the United States. In such cases data is transferred on the basis of the EU–US Data Privacy Framework or standard contractual clauses approved by the European Commission. You can request a copy of the relevant safeguards by writing to us.",
          ],
        },
        {
          id: "cookies",
          title: "7. Cookies and browser storage",
          body: [
            "We do not use advertising cookies. Google Analytics cookies are set only after you click “Accept” in the cookie banner; without consent the Google script is not loaded at all. Necessary data we store:",
            {
              list: [
                "“desflow-theme” (browser storage) — the colour theme you selected;",
                "“desflow-locale” (cookie, 12 months) — your chosen website language;",
                "“desflow-country” (cookie, 30 days) — the country code provided by the hosting server, used only to suggest a language;",
                "“desflow-lang-prompt” (browser storage) — information that the language suggestion has already been shown;",
                "“desflow-consent” (browser storage) — your cookie choice and its date.",
              ],
            },
            "With your consent — Google Analytics 4: cookies “_ga” and “_ga_<ID>” (up to 2 years) used to count visits and measure how the site is used. We have disabled advertising features and ad personalisation. You can withdraw consent at any time using “Cookie settings” in the footer — the Google Analytics cookies will then be deleted.",
            "Our fonts are served from our own server — we don't connect to Google Fonts. You can delete this data at any time in your browser settings.",
          ],
        },
        {
          id: "external",
          title: "8. External content and links",
          body: [
            "In the “Websites” section you can open a live preview of a client's website. Only after you click it is that website loaded in a frame, and it may process data according to its own privacy policy.",
            "Links to YouTube, TikTok and our clients' websites lead to external services with their own rules.",
          ],
        },
        {
          id: "rights",
          title: "9. Your rights",
          body: [
            "You have the right to access your data, rectify it, erase it, restrict processing, data portability and to object to processing based on our legitimate interest. Where processing is based on consent (Google Analytics), you can withdraw it at any time without affecting the lawfulness of processing before withdrawal. To exercise these rights, email us.",
            "You also have the right to lodge a complaint with a supervisory authority — in Poland this is the President of the Personal Data Protection Office (UODO), ul. Stawki 2, 00-193 Warsaw, or the authority in your country of residence.",
          ],
        },
        {
          id: "voluntary",
          title: "10. Providing data is voluntary",
          body: [
            "Providing your data in the form is voluntary, but your name, email address and message are necessary for us to reply.",
          ],
        },
        {
          id: "changes",
          title: "11. Changes to this policy",
          body: [
            "We may update this policy, e.g. when we add new features to the site. The current version is always available on this page, with the date of the last update.",
          ],
        },
      ],
    };
  }

  if (locale === "de") {
    const company = field(legal.companyName, "AUSFÜLLEN: Firmenname");

    return {
      title: "Datenschutzerklärung",
      intro:
        "Diese Erklärung beschreibt, wie wir personenbezogene Daten verarbeiten, wenn Sie desflow.pl besuchen und uns kontaktieren. Wir verarbeiten nur die Daten, die wir tatsächlich benötigen — im Einklang mit der Datenschutz-Grundverordnung (DSGVO).",
      sections: [
        {
          id: "controller",
          title: "1. Verantwortlicher",
          body: [
            `Verantwortlich für die Verarbeitung Ihrer Daten ist ${company} (nachfolgend „desflow“, „wir“).`,
            `Bei Fragen zu Ihren Daten erreichen Sie uns unter ${email}.`,
          ],
        },
        {
          id: "data",
          title: "2. Welche Daten wir verarbeiten",
          body: [
            "Kontaktformular: Vor- und Nachname, E-Mail-Adresse sowie — freiwillig — Telefonnummer, Unternehmen und der Inhalt Ihrer Nachricht.",
            "Technische Daten: Beim Besuch der Webseite speichert der Hosting-Server automatisch technische Protokolle (z. B. IP-Adresse, Datum und Uhrzeit des Zugriffs, Browsertyp). Das ist bei jeder Webseite üblich.",
            "In Ihrem Browser gespeicherte Einstellungen: gewähltes Farbdesign, Sprachwahl und erkanntes Land (siehe Abschnitt 7).",
          ],
        },
        {
          id: "purposes",
          title: "3. Zwecke und Rechtsgrundlagen",
          body: [
            {
              list: [
                "Beantwortung Ihrer Anfrage und Erstellung eines Angebots — Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen auf Ihre Anfrage).",
                "Korrespondenz und Dokumentation von Anfragen — Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Kommunikation mit Interessenten).",
                "Schutz des Formulars vor Spam und Missbrauch (automatische Filterung) sowie Sicherheit der Webseite — Art. 6 Abs. 1 lit. f DSGVO.",
                "Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen, falls erforderlich — Art. 6 Abs. 1 lit. f DSGVO.",
                "Statistiken zur Nutzung der Webseite (Google Analytics) — Art. 6 Abs. 1 lit. a DSGVO, nur mit Ihrer Einwilligung im Cookie-Banner.",
              ],
            },
            "Wir nutzen Ihre Daten nicht für automatisierte Entscheidungen oder Profiling und versenden keine Newsletter.",
          ],
        },
        {
          id: "retention",
          title: "4. Speicherdauer",
          body: [
            "Nachrichten aus dem Formular speichern wir so lange, wie es für die Bearbeitung Ihrer Anfrage nötig ist, danach höchstens 12 Monate — es sei denn, es kommt zu einem Vertrag. Dann speichern wir die Daten für die Dauer der Zusammenarbeit und die gesetzlich vorgeschriebenen Fristen (z. B. steuerrechtlich) bzw. bis zur Verjährung möglicher Ansprüche.",
            "Server-Protokolle werden für den vom Hosting-Anbieter festgelegten Zeitraum gespeichert, in der Regel nicht länger als einige Wochen.",
          ],
        },
        {
          id: "recipients",
          title: "5. Empfänger der Daten",
          body: [
            "Wir verkaufen Ihre Daten nicht. Wir geben sie nur an Dienstleister weiter, die uns beim Betrieb der Webseite unterstützen — auf Grundlage von Auftragsverarbeitungsverträgen:",
            {
              list: [
                "Discord Inc. — Benachrichtigungen über neue Anfragen gelangen per Discord-Webhook in einen privaten Kanal unseres Teams;",
                "Google Ireland Limited / Google LLC — Besucherstatistiken mit Google Analytics (nur mit Ihrer Einwilligung);",
                "unsere Teammitglieder, die Anfragen bearbeiten.",
              ],
            },
          ],
        },
        {
          id: "transfers",
          title: "6. Übermittlung in Drittländer",
          body: [
            "Einige Anbieter (z. B. Discord Inc., Google LLC, je nach Konfiguration auch der Hosting-Anbieter) haben ihren Sitz in den USA. In diesen Fällen erfolgt die Übermittlung auf Grundlage des EU-US Data Privacy Framework oder der von der Europäischen Kommission genehmigten Standardvertragsklauseln. Eine Kopie der Garantien erhalten Sie auf Anfrage.",
          ],
        },
        {
          id: "cookies",
          title: "7. Cookies und Browserspeicher",
          body: [
            "Wir verwenden keine Werbe-Cookies. Google-Analytics-Cookies werden erst gesetzt, nachdem Sie im Cookie-Banner auf „Akzeptieren“ geklickt haben; ohne Einwilligung wird das Google-Skript gar nicht geladen. Notwendige Daten, die wir speichern:",
            {
              list: [
                "„desflow-theme“ (Browserspeicher) — das von Ihnen gewählte Farbdesign;",
                "„desflow-locale“ (Cookie, 12 Monate) — die gewählte Sprache der Webseite;",
                "„desflow-country“ (Cookie, 30 Tage) — der vom Hosting-Server übermittelte Ländercode, ausschließlich für den Sprachvorschlag;",
                "„desflow-lang-prompt“ (Browserspeicher) — die Information, dass der Sprachvorschlag bereits angezeigt wurde;",
                "„desflow-consent“ (Browserspeicher) — Ihre Cookie-Auswahl und deren Datum.",
              ],
            },
            "Mit Ihrer Einwilligung — Google Analytics 4: Cookies „_ga“ und „_ga_<ID>“ (bis zu 2 Jahre) zur Zählung von Besuchen und zur Analyse der Nutzung. Werbefunktionen und personalisierte Werbung haben wir deaktiviert. Sie können Ihre Einwilligung jederzeit über „Cookie-Einstellungen“ in der Fußzeile widerrufen — die Google-Analytics-Cookies werden dann gelöscht.",
            "Unsere Schriften werden von unserem eigenen Server geladen — es besteht keine Verbindung zu Google Fonts. Sie können diese Daten jederzeit in den Browsereinstellungen löschen.",
          ],
        },
        {
          id: "external",
          title: "8. Externe Inhalte und Links",
          body: [
            "Im Bereich „Webseiten“ können Sie eine Live-Vorschau einer Kundenwebseite öffnen. Erst nach Ihrem Klick wird diese Webseite in einem Rahmen geladen; sie kann Daten gemäß ihrer eigenen Datenschutzerklärung verarbeiten.",
            "Links zu YouTube, TikTok und den Webseiten unserer Kunden führen zu externen Diensten mit eigenen Regeln.",
          ],
        },
        {
          id: "rights",
          title: "9. Ihre Rechte",
          body: [
            "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch gegen eine Verarbeitung auf Grundlage unseres berechtigten Interesses. Eine Einwilligung (Google Analytics) können Sie jederzeit widerrufen, ohne dass die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung berührt wird. Schreiben Sie uns dazu einfach eine E-Mail.",
            "Außerdem haben Sie das Recht auf Beschwerde bei einer Aufsichtsbehörde — in Polen beim Präsidenten des Amtes für Datenschutz (UODO), ul. Stawki 2, 00-193 Warschau, oder bei der Aufsichtsbehörde Ihres Wohnsitzlandes.",
          ],
        },
        {
          id: "voluntary",
          title: "10. Freiwilligkeit",
          body: [
            "Die Angabe Ihrer Daten im Formular ist freiwillig. Name, E-Mail-Adresse und Nachricht sind jedoch erforderlich, damit wir antworten können.",
          ],
        },
        {
          id: "changes",
          title: "11. Änderungen",
          body: [
            "Wir können diese Erklärung aktualisieren, z. B. wenn wir neue Funktionen hinzufügen. Die aktuelle Fassung mit dem Datum der letzten Änderung finden Sie immer auf dieser Seite.",
          ],
        },
      ],
    };
  }

  const company = field(legal.companyName, "UZUPEŁNIJ: nazwa firmy");

  return {
    title: "Polityka prywatności",
    intro:
      "Ta polityka wyjaśnia, jak przetwarzamy dane osobowe, gdy odwiedzasz desflow.pl i gdy się z nami kontaktujesz. Przetwarzamy tylko dane, które są nam naprawdę potrzebne — zgodnie z RODO.",
    sections: [
      {
        id: "administrator",
        title: "1. Administrator danych",
        body: [
          `Administratorem Twoich danych osobowych jest ${company} (dalej „desflow”, „my”).`,
          `We wszystkich sprawach dotyczących danych możesz napisać do nas na ${email}.`,
        ],
      },
      {
        id: "dane",
        title: "2. Jakie dane przetwarzamy",
        body: [
          "Formularz kontaktowy: imię i nazwisko, adres e-mail oraz — jeśli zdecydujesz się je podać — numer telefonu, nazwa firmy i treść wiadomości.",
          "Dane techniczne: podczas wizyty na stronie serwer hostingu automatycznie zapisuje logi techniczne (np. adres IP, datę i godzinę żądania, typ przeglądarki). To standard w przypadku każdej strony internetowej.",
          "Ustawienia zapisane w przeglądarce: wybrany motyw kolorystyczny, wybór języka i wykryty kraj (szczegóły w punkcie 7).",
        ],
      },
      {
        id: "cele",
        title: "3. Cele i podstawy prawne",
        body: [
          {
            list: [
              "Odpowiedź na zapytanie i przygotowanie wyceny — art. 6 ust. 1 lit. b RODO (działania na Twoje żądanie przed zawarciem umowy).",
              "Prowadzenie korespondencji i ewidencja zapytań — art. 6 ust. 1 lit. f RODO (nasz prawnie uzasadniony interes w komunikacji z osobami, które się z nami kontaktują).",
              "Ochrona formularza przed spamem i nadużyciami (automatyczne filtrowanie wiadomości) oraz bezpieczeństwo strony — art. 6 ust. 1 lit. f RODO.",
              "Ustalenie, dochodzenie lub obrona roszczeń, jeśli będzie to potrzebne — art. 6 ust. 1 lit. f RODO.",
              "Statystyki odwiedzin strony (Google Analytics) — art. 6 ust. 1 lit. a RODO, wyłącznie jeśli wyrazisz zgodę w banerze cookies.",
            ],
          },
          "Nie podejmujemy wobec Ciebie zautomatyzowanych decyzji, nie profilujemy i nie wysyłamy newslettera.",
        ],
      },
      {
        id: "okres",
        title: "4. Jak długo przechowujemy dane",
        body: [
          "Wiadomości z formularza przechowujemy przez czas potrzebny do obsługi zapytania, a następnie nie dłużej niż 12 miesięcy — chyba że zawrzemy umowę. Wtedy dane przechowujemy przez czas współpracy i okres wymagany przepisami (np. podatkowymi) albo do przedawnienia ewentualnych roszczeń.",
          "Logi serwera są przechowywane przez okres określony przez dostawcę hostingu, zwykle nie dłużej niż kilka tygodni.",
        ],
      },
      {
        id: "odbiorcy",
        title: "5. Komu przekazujemy dane",
        body: [
          "Nie sprzedajemy Twoich danych. Przekazujemy je wyłącznie dostawcom, którzy pomagają nam prowadzić stronę, na podstawie umów powierzenia przetwarzania:",
          {
            list: [
              "Discord Inc. — powiadomienia o nowych zapytaniach trafiają przez webhook Discorda na prywatny kanał naszego zespołu;",
              "Google Ireland Limited / Google LLC — statystyki odwiedzin w Google Analytics (tylko za Twoją zgodą);",
              "członkowie naszego zespołu obsługujący zapytania.",
            ],
          },
        ], 
      },
      {
        id: "poza-eog",
        title: "6. Przekazywanie danych poza EOG",
        body: [
          "Niektórzy dostawcy (np. Discord Inc., Google LLC, a w zależności od konfiguracji także dostawca hostingu) mają siedzibę w USA. W takim przypadku dane są przekazywane na podstawie programu EU–US Data Privacy Framework lub standardowych klauzul umownych zatwierdzonych przez Komisję Europejską. Kopię zabezpieczeń możesz otrzymać, pisząc do nas.",
        ],
      },
      {
        id: "cookies",
        title: "7. Pliki cookies i pamięć przeglądarki",
        body: [
          "Nie używamy cookies reklamowych. Cookies Google Analytics zapisujemy dopiero po kliknięciu „Akceptuję” w banerze cookies — bez zgody skrypt Google w ogóle się nie ładuje. Niezbędne dane, które zapisujemy:",
          {
            list: [
              "„desflow-theme” (pamięć przeglądarki) — wybrany motyw kolorystyczny;",
              "„desflow-locale” (cookie, 12 miesięcy) — wybrany język strony;",
              "„desflow-country” (cookie, 30 dni) — kod kraju przekazany przez serwer hostingu, używany wyłącznie do zaproponowania języka;",
              "„desflow-lang-prompt” (pamięć przeglądarki) — informacja, że propozycja zmiany języka została już wyświetlona;",
              "„desflow-consent” (pamięć przeglądarki) — Twój wybór dotyczący cookies i jego data.",
            ],
          },
          "Za Twoją zgodą — Google Analytics 4: cookies „_ga” i „_ga_<ID>” (do 2 lat), służące do liczenia odwiedzin i sprawdzania, jak korzystasz ze strony. Funkcje reklamowe i personalizację reklam wyłączyliśmy. Zgodę możesz w każdej chwili wycofać przyciskiem „Ustawienia cookies” w stopce — cookies Google Analytics zostaną wtedy usunięte.",
          "Czcionki ładujemy z naszego serwera — nie łączymy się z Google Fonts. Te dane możesz w każdej chwili usunąć w ustawieniach przeglądarki.",
        ],
      },
      {
        id: "zewnetrzne",
        title: "8. Treści zewnętrzne i linki",
        body: [
          "W sekcji „Strony WWW” możesz otworzyć podgląd strony klienta na żywo. Dopiero po kliknięciu ta strona ładuje się w ramce i może przetwarzać dane zgodnie z własną polityką prywatności.",
          "Linki do YouTube, TikToka i stron naszych klientów prowadzą do zewnętrznych serwisów, które mają własne zasady.",
        ],
      },
      {
        id: "prawa",
        title: "9. Twoje prawa",
        body: [
          "Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu wobec przetwarzania opartego na naszym prawnie uzasadnionym interesie. Zgodę (Google Analytics) możesz wycofać w dowolnym momencie — nie wpływa to na zgodność z prawem przetwarzania sprzed jej wycofania. Aby skorzystać z tych praw, napisz do nas.",
          "Przysługuje Ci także prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).",
        ],
      },
      {
        id: "dobrowolnosc",
        title: "10. Dobrowolność podania danych",
        body: [
          "Podanie danych w formularzu jest dobrowolne, ale imię, adres e-mail i treść wiadomości są niezbędne, żebyśmy mogli odpowiedzieć.",
        ],
      },
      {
        id: "zmiany",
        title: "11. Zmiany polityki",
        body: [
          "Możemy aktualizować tę politykę, np. gdy dodamy nowe funkcje na stronie. Aktualna wersja z datą ostatniej zmiany jest zawsze dostępna na tej stronie.",
        ],
      },
    ],
  };
}
