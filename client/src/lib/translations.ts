export type Language = 'ru' | 'en' | 'de' | 'es';

export const LANGUAGES: { code: Language; name: string; flag: string; tagline: string }[] = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺', tagline: 'Я твой лучший сотрудник' },
  { code: 'en', name: 'English', flag: '🇬🇧', tagline: "I'm your best employee" },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', tagline: 'Ich bin dein bester Mitarbeiter' },
  { code: 'es', name: 'Español', flag: '🇪🇸', tagline: 'Soy tu mejor empleado' },
];

export const translations = {
  ru: {
    home: {
      badge: 'Wow Agent',
      greeting: 'Привет, я WOW-Agent',
      description: 'Покажу формат, от которого уже через 24 часа ты почувствуешь усиление бизнеса — и вау-эффект. Если ты готов — это займёт 3 минуты.',
      highlight: '',
      readyButton: 'Готов',
    },
    nav: {
      videoChat: 'Видео-звонок с агентом',
      textChat: 'Текстовый диалог',
      howItWorks: 'Как это работает',
    },
    videoChat: {
      title: 'Видео-звонок',
      heading: 'Живой разговор с AI',
      description: 'Также можно пообщаться через видео — я отвечу голосом и покажу, как работает WOW-Agent.',
      startCall: 'Начать звонок',
      micRequired: 'Для работы требуется разрешение на микрофон',
      connecting: 'Подключение...',
      waiting: 'Ожидание аватара...',
      endedTitle: 'Звонок завершён',
      endedDescription: 'Спасибо за диалог! Хотите узнать больше?',
    },
    chat: {
      title: 'Wow Agent',
      online: 'Online',
      placeholder: 'Сообщение для Wow Agent...',
      initialMessages: [
        'Ок 🙂 Как тебя зовут?',
      ],
      suggestedReplies: [
        'Заявка',
        'Созвон',
        'Напишут в Telegram',
        'Показать вживую',
      ],
      responses: [
        'Понимаю. Именно здесь я и помогаю. Я мгновенно реагирую на каждый лид, чтобы вы не теряли клиентов из-за «тишины».',
        'В отличие от кнопочного чат-бота, я поддерживаю живой диалог. Я понимаю контекст, отрабатываю возражения и веду к продаже.',
        'Хотите посмотреть, как мы можем запустить это для вашего бизнеса всего за 72 часа?',
      ],
    },
    contact: {
      title: 'Готовы к запуску?',
      subtitle: 'Создайте своего цифрового сотрудника за 72 часа.',
      nameLabel: 'Имя',
      namePlaceholder: 'Иван Иванов',
      contactLabel: 'Telegram / Контакт',
      contactPlaceholder: '@username',
      goalLabel: 'Бизнес-цель',
      goals: ['Увеличить продажи', 'Автоматизировать поддержку', 'Вебинары и дожим', 'Другое'],
      submit: 'Получить Wow Agent',
      submitting: 'Отправка...',
      error: 'Ошибка отправки. Попробуйте снова.',
      successTitle: 'Заявка отправлена!',
      successMessage: 'Наша команда свяжется с вами в ближайшее время для брифинга.',
      backToAgent: 'Вернуться к агенту',
      disclaimer: 'Нажимая кнопку, вы соглашаетесь трансформировать свой бизнес.',
    },
    presentation: {
      back: 'Назад',
      next: 'Далее',
      start: 'Начать',
      showInAction: 'Показать в действии (3 минуты)',
      talkLive: 'Поговорить вживую',
      leaveContact: 'Оставить контакт — пришлю пример под твою нишу',
      slides: {
        hero: {
          badge: 'WOW-EFFECT',
          title: 'Вау-эффект для твоего бизнеса — сразу',
          subtitle: 'Заходят → понимают за минуту → делают шаг. Ты выглядишь дороже, понятнее и сильнее конкурентов.',
          badges: ['выглядит как встреча', '24/7', 'в твоём стиле'],
        },
        included: {
          badge: 'INCLUDED',
          title: 'Твоё онлайн-представительство нового формата',
          subtitle: 'Mini-app / визитка / mini-landing — одна точка входа, где человек не читает, а взаимодействует.',
          items: [
            { title: 'Точка входа', desc: '«одна ссылка — человек внутри»' },
            { title: 'Агенты', desc: '«текст / голос / видео»' },
            { title: 'Шаг в финале', desc: '«заявка / сообщение / созвон»' },
          ],
        },
        roles: {
          badge: 'WHAT IT DOES',
          title: 'Один агент — несколько ролей под твою задачу',
          subtitle: 'Он встречает, объясняет и доводит до шага. Ты снимаешь рутину и усиливаешь продажи «в моменте».',
          items: [
            'Презентация продукта',
            'Ответы на вопросы (FAQ)',
            'Доведение до звонка',
            'Онбординг / объяснение',
            'Поддержка 24/7',
            'Командный помощник (MLM)',
          ],
          note: 'Стартуем с одной роли — потом расширяем.',
        },
        launch: {
          badge: '72H',
          title: 'Запуск за 72 часа',
          subtitle: 'Один короткий созвон — и собираем точку входа под твою нишу.',
          steps: [
            { title: 'Смысл и цель', desc: '20–40 мин' },
            { title: 'Настраиваем стиль и логику', desc: '' },
            { title: 'Запускаем mini-app / визитку / лендинг', desc: '' },
          ],
          fomo: 'Берём ограниченное число запусков в неделю — делаем под задачу, не шаблоном.',
        },
        cta: {
          badge: 'FIRST STEP',
          title: 'Хочешь такой же формат под себя?',
          subtitle: 'Можно посмотреть в действии или сразу обсудить под твою нишу.',
        },
      },
    },
  },
  en: {
    home: {
      badge: 'Wow Agent',
      greeting: "Hi, I'm WOW-Agent",
      description: "I'll show you a format that will make you feel your business strengthening and a wow-effect in just 24 hours. If you're ready, it'll take 3 minutes.",
      highlight: '',
      readyButton: 'Ready',
    },
    nav: {
      videoChat: 'Video call with agent',
      textChat: 'Text chat',
      howItWorks: 'How it works',
    },
    videoChat: {
      title: 'Video Call',
      heading: 'Live conversation with AI',
      description: 'You can also chat via video — I will answer with voice and show you how WOW-Agent works.',
      startCall: 'Start call',
      micRequired: 'Microphone permission required',
      connecting: 'Connecting...',
      waiting: 'Waiting for avatar...',
      endedTitle: 'Call ended',
      endedDescription: 'Thanks for the conversation! Want to learn more?',
    },
    chat: {
      title: 'Wow Agent',
      online: 'Online',
      placeholder: 'Message for Wow Agent...',
      initialMessages: [
        'Ok 🙂 What is your name?',
      ],
      suggestedReplies: [
        'Application',
        'Call',
        'Message in Telegram',
        'Show live',
      ],
      responses: [
        "I understand. This is exactly where I help. I respond instantly to every lead so you don't lose customers due to 'silence'.",
        "Unlike a button-based chatbot, I maintain a live dialogue. I understand context, handle objections, and lead to a sale.",
        'Want to see how we can launch this for your business in just 72 hours?',
      ],
    },
    contact: {
      title: 'Ready to launch?',
      subtitle: 'Create your digital employee in 72 hours.',
      nameLabel: 'Name',
      namePlaceholder: 'John Doe',
      contactLabel: 'Telegram / Contact',
      contactPlaceholder: '@username',
      goalLabel: 'Business goal',
      goals: ['Increase sales', 'Automate support', 'Webinars and follow-ups', 'Other'],
      submit: 'Get Wow Agent',
      submitting: 'Sending...',
      error: 'Failed to send. Please try again.',
      successTitle: 'Request sent!',
      successMessage: 'Our team will contact you shortly for a briefing.',
      backToAgent: 'Back to agent',
      disclaimer: 'By clicking, you agree to transform your business.',
    },
    presentation: {
      back: 'Back',
      next: 'Next',
      start: 'Start',
      showInAction: 'See it in action (3 minutes)',
      talkLive: 'Talk live',
      leaveContact: 'Leave your contact — I\'ll send an example for your niche.',
      slides: {
        hero: {
          badge: 'WOW-EFFECT',
          title: 'Wow-effect for your business — instantly',
          subtitle: 'Enter → understand in a minute → take a step. You look more premium, clearer, and stronger than competitors.',
          badges: ['feels like a meeting', '24/7', 'in your style'],
        },
        included: {
          badge: 'INCLUDED',
          title: 'Your new-format online presence',
          subtitle: 'Mini-app / card / mini-landing — one entry point where people don\'t read, they interact.',
          items: [
            { title: 'Entry point', desc: '"one link — person is inside"' },
            { title: 'Agents', desc: '"text / voice / video"' },
            { title: 'Final step', desc: '"request / message / call"' },
          ],
        },
        roles: {
          badge: 'WHAT IT DOES',
          title: 'One agent — multiple roles for your task',
          subtitle: 'It greets, explains, and leads to action. You remove routine and boost sales "in the moment".',
          items: [
            'Product presentation',
            'FAQ answers',
            'Lead to call',
            'Onboarding / explanation',
            '24/7 support',
            'Team assistant (MLM)',
          ],
          note: 'Start with one role — expand later.',
        },
        launch: {
          badge: '72H',
          title: 'Launch in 72 hours',
          subtitle: 'One short call — and we build your entry point for your niche.',
          steps: [
            { title: 'Meaning and goal', desc: '20–40 min' },
            { title: 'Set up style and logic', desc: '' },
            { title: 'Launch mini-app / card / landing', desc: '' },
          ],
          fomo: 'We take a limited number of launches per week — built for the task, not a template.',
        },
        cta: {
          badge: 'FIRST STEP',
          title: 'Want the same format for yourself?',
          subtitle: 'See it in action or discuss for your niche right away.',
        },
      },
    },
  },
  de: {
    home: {
      badge: 'Wow Agent',
      greeting: 'Hallo, ich bin WOW-Agent',
      description: 'Ich zeige dir ein Format, von dem du schon nach 24 Stunden eine Stärkung deines Business spüren wirst — und einen Wow-Effekt. Wenn du bereit bist — es dauert 3 Minuten.',
      highlight: '',
      readyButton: 'Bereit',
    },
    nav: {
      videoChat: 'Videoanruf mit Agent',
      textChat: 'Text-Chat',
      howItWorks: 'Wie es funktioniert',
    },
    videoChat: {
      title: 'Videoanruf',
      heading: 'Live-Gespräch mit KI',
      description: 'Sie können auch per Video chatten — ich antworte mit Stimme und zeige Ihnen, wie WOW-Agent funktioniert.',
      startCall: 'Anruf starten',
      micRequired: 'Mikrofonberechtigung erforderlich',
      connecting: 'Verbindung wird hergestellt...',
      waiting: 'Warte auf Avatar...',
      endedTitle: 'Anruf beendet',
      endedDescription: 'Danke für das Gespräch! Möchten Sie mehr erfahren?',
    },
    chat: {
      title: 'Wow Agent',
      online: 'Online',
      placeholder: 'Nachricht an Wow Agent...',
      initialMessages: [
        'Ok 🙂 Wie heißt du?',
      ],
      suggestedReplies: [
        'Anfrage',
        'Anruf',
        'Nachricht in Telegram',
        'Live zeigen',
      ],
      responses: [
        'Verstehe. Genau hier helfe ich. Ich reagiere sofort auf jeden Lead, damit Sie keine Kunden durch "Stille" verlieren.',
        'Anders als ein Button-Chatbot führe ich einen lebendigen Dialog. Ich verstehe den Kontext, bearbeite Einwände und führe zum Verkauf.',
        'Möchten Sie sehen, wie wir das für Ihr Unternehmen in nur 72 Stunden starten können?',
      ],
    },
    contact: {
      title: 'Bereit zum Start?',
      subtitle: 'Erstellen Sie Ihren digitalen Mitarbeiter in 72 Stunden.',
      nameLabel: 'Name',
      namePlaceholder: 'Max Mustermann',
      contactLabel: 'Telegram / Kontakt',
      contactPlaceholder: '@username',
      goalLabel: 'Geschäftsziel',
      goals: ['Verkäufe steigern', 'Support automatisieren', 'Webinare und Follow-ups', 'Sonstiges'],
      submit: 'Wow Agent erhalten',
      submitting: 'Wird gesendet...',
      error: 'Fehler beim Senden. Bitte erneut versuchen.',
      successTitle: 'Anfrage gesendet!',
      successMessage: 'Unser Team wird sich in Kürze für ein Briefing bei Ihnen melden.',
      backToAgent: 'Zurück zum Agenten',
      disclaimer: 'Mit dem Klick stimmen Sie zu, Ihr Unternehmen zu transformieren.',
    },
    presentation: {
      back: 'Zurück',
      next: 'Weiter',
      start: 'Starten',
      showInAction: 'In Aktion sehen (3 Minuten)',
      talkLive: 'Live sprechen',
      leaveContact: 'Hinterlasse deinen Kontakt — ich sende dir ein Beispiel für deine Nische.',
      slides: {
        hero: {
          badge: 'WOW-EFFEKT',
          title: 'Wow-Effekt für dein Business — sofort',
          subtitle: 'Eintreten → in einer Minute verstehen → Schritt machen. Du wirkst hochwertiger, klarer und stärker als die Konkurrenz.',
          badges: ['fühlt sich an wie ein Treffen', '24/7', 'in deinem Stil'],
        },
        included: {
          badge: 'INKLUSIVE',
          title: 'Deine Online-Präsenz im neuen Format',
          subtitle: 'Mini-App / Visitenkarte / Mini-Landing — ein Einstiegspunkt, wo Menschen nicht lesen, sondern interagieren.',
          items: [
            { title: 'Einstiegspunkt', desc: '„ein Link — Person ist drin"' },
            { title: 'Agenten', desc: '„Text / Stimme / Video"' },
            { title: 'Finaler Schritt', desc: '„Anfrage / Nachricht / Anruf"' },
          ],
        },
        roles: {
          badge: 'WAS ES TUT',
          title: 'Ein Agent — mehrere Rollen für deine Aufgabe',
          subtitle: 'Er begrüßt, erklärt und führt zur Aktion. Du entfernst Routine und steigerst Verkäufe „im Moment".',
          items: [
            'Produktpräsentation',
            'FAQ-Antworten',
            'Zum Anruf führen',
            'Onboarding / Erklärung',
            '24/7 Support',
            'Team-Assistent (MLM)',
          ],
          note: 'Starte mit einer Rolle — erweitere später.',
        },
        launch: {
          badge: '72H',
          title: 'Start in 72 Stunden',
          subtitle: 'Ein kurzer Anruf — und wir bauen deinen Einstiegspunkt für deine Nische.',
          steps: [
            { title: 'Sinn und Ziel', desc: '20–40 Min' },
            { title: 'Stil und Logik einrichten', desc: '' },
            { title: 'Mini-App / Visitenkarte / Landing starten', desc: '' },
          ],
          fomo: 'Wir nehmen begrenzt Starts pro Woche an — gebaut für die Aufgabe, nicht als Vorlage.',
        },
        cta: {
          badge: 'ERSTER SCHRITT',
          title: 'Willst du das gleiche Format für dich?',
          subtitle: 'Sieh es in Aktion oder besprich es sofort für deine Nische.',
        },
      },
    },
  },
  es: {
    home: {
      badge: 'Wow Agent',
      greeting: 'Hola, soy WOW-Agent',
      description: 'Te mostraré un formato con el que sentirás el fortalecimiento de tu negocio y un efecto wow en solo 24 horas. Si estás listo, te tomará 3 minutos.',
      highlight: '',
      readyButton: 'Listo',
    },
    nav: {
      videoChat: 'Videollamada con agente',
      textChat: 'Chat de texto',
      howItWorks: 'Cómo funciona',
    },
    videoChat: {
      title: 'Videollamada',
      heading: 'Conversación en vivo con IA',
      description: 'También puedes chatear por video — responderé con voz y te mostraré cómo funciona WOW-Agent.',
      startCall: 'Iniciar llamada',
      micRequired: 'Se requiere permiso de micrófono',
      connecting: 'Conectando...',
      waiting: 'Esperando avatar...',
      endedTitle: 'Llamada terminada',
      endedDescription: '¡Gracias por la conversación! ¿Quieres saber más?',
    },
    chat: {
      title: 'Wow Agent',
      online: 'En línea',
      placeholder: 'Mensaje para Wow Agent...',
      initialMessages: [
        'Ok 🙂 ¿Cómo te llamas?',
      ],
      suggestedReplies: [
        'Solicitud',
        'Llamada',
        'Mensaje en Telegram',
        'Mostrar en vivo',
      ],
      responses: [
        'Entiendo. Aquí es exactamente donde ayudo. Respondo instantáneamente a cada lead para que no pierdas clientes por el "silencio".',
        'A diferencia de un chatbot de botones, mantengo un diálogo vivo. Entiendo el contexto, manejo objeciones y llevo a la venta.',
        '¿Quieres ver cómo podemos lanzar esto para tu negocio en solo 72 horas?',
      ],
    },
    contact: {
      title: '¿Listo para lanzar?',
      subtitle: 'Crea tu empleado digital en 72 horas.',
      nameLabel: 'Nombre',
      namePlaceholder: 'Juan Pérez',
      contactLabel: 'Telegram / Contacto',
      contactPlaceholder: '@username',
      goalLabel: 'Objetivo de negocio',
      goals: ['Aumentar ventas', 'Automatizar soporte', 'Webinars y seguimientos', 'Otro'],
      submit: 'Obtener Wow Agent',
      submitting: 'Enviando...',
      error: 'Error al enviar. Por favor, intenta de nuevo.',
      successTitle: '¡Solicitud enviada!',
      successMessage: 'Nuestro equipo se pondrá en contacto contigo pronto para un briefing.',
      backToAgent: 'Volver al agente',
      disclaimer: 'Al hacer clic, aceptas transformar tu negocio.',
    },
    presentation: {
      back: 'Atrás',
      next: 'Siguiente',
      start: 'Comenzar',
      showInAction: 'Verlo en acción (3 minutos)',
      talkLive: 'Hablar en vivo',
      leaveContact: 'Deja tu contacto — te enviaré un ejemplo para tu nicho.',
      slides: {
        hero: {
          badge: 'EFECTO WOW',
          title: 'Efecto wow para tu negocio — al instante',
          subtitle: 'Entran → entienden en un minuto → dan un paso. Te ves más premium, más claro y más fuerte que la competencia.',
          badges: ['se siente como una reunión', '24/7', 'en tu estilo'],
        },
        included: {
          badge: 'INCLUIDO',
          title: 'Tu presencia online en nuevo formato',
          subtitle: 'Mini-app / tarjeta / mini-landing — un punto de entrada donde la gente no lee, interactúa.',
          items: [
            { title: 'Punto de entrada', desc: '"un enlace — persona adentro"' },
            { title: 'Agentes', desc: '"texto / voz / video"' },
            { title: 'Paso final', desc: '"solicitud / mensaje / llamada"' },
          ],
        },
        roles: {
          badge: 'QUÉ HACE',
          title: 'Un agente — múltiples roles para tu tarea',
          subtitle: 'Saluda, explica y lleva a la acción. Quitas rutina y potencias ventas "en el momento".',
          items: [
            'Presentación de producto',
            'Respuestas FAQ',
            'Llevar a llamada',
            'Onboarding / explicación',
            'Soporte 24/7',
            'Asistente de equipo (MLM)',
          ],
          note: 'Empieza con un rol — expande después.',
        },
        launch: {
          badge: '72H',
          title: 'Lanzamiento en 72 horas',
          subtitle: 'Una llamada corta — y construimos tu punto de entrada para tu nicho.',
          steps: [
            { title: 'Sentido y objetivo', desc: '20–40 min' },
            { title: 'Configurar estilo y lógica', desc: '' },
            { title: 'Lanzar mini-app / tarjeta / landing', desc: '' },
          ],
          fomo: 'Tomamos lanzamientos limitados por semana — construido para la tarea, no plantilla.',
        },
        cta: {
          badge: 'PRIMER PASO',
          title: '¿Quieres el mismo formato para ti?',
          subtitle: 'Míralo en acción o discútelo para tu nicho ahora mismo.',
        },
      },
    },
  },
} as const;

interface SlideStep {
  title: string;
  desc: string;
}

interface FormatItem {
  title: string;
  desc: string;
}

interface ChatMessage {
  type: 'agent' | 'user';
  text: string;
}

export interface Translations {
  home: {
    badge: string;
    greeting: string;
    description: string;
    highlight: string;
    readyButton: string;
  };
  nav: {
    videoChat: string;
    textChat: string;
    howItWorks: string;
  };
  videoChat: {
    title: string;
    heading: string;
    description: string;
    startCall: string;
    micRequired: string;
    connecting: string;
    waiting: string;
    endedTitle: string;
    endedDescription: string;
  };
  chat: {
    title: string;
    online: string;
    placeholder: string;
    initialMessages: readonly string[];
    suggestedReplies: readonly string[];
    responses: readonly string[];
  };
  contact: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    contactLabel: string;
    contactPlaceholder: string;
    goalLabel: string;
    goals: readonly string[];
    submit: string;
    submitting: string;
    error: string;
    successTitle: string;
    successMessage: string;
    backToAgent: string;
    disclaimer: string;
  };
  presentation: {
    back: string;
    next: string;
    start: string;
    showInAction: string;
    talkLive: string;
    leaveContact: string;
    slides: {
      hero: {
        badge: string;
        title: string;
        subtitle: string;
        badges: readonly string[];
      };
      included: {
        badge: string;
        title: string;
        subtitle: string;
        items: readonly FormatItem[];
      };
      roles: {
        badge: string;
        title: string;
        subtitle: string;
        items: readonly string[];
        note: string;
      };
      launch: {
        badge: string;
        title: string;
        subtitle: string;
        steps: readonly SlideStep[];
        fomo: string;
      };
      cta: {
        badge: string;
        title: string;
        subtitle: string;
      };
    };
  };
}

export function getTranslations(lang: Language): Translations {
  return translations[lang] as Translations;
}
