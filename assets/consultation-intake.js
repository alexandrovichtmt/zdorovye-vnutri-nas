(() => {
  "use strict";
  if (window.__ludmilaIntakeInitialized) return;
  window.__ludmilaIntakeInitialized = true;

  const TELEGRAM_USERNAME = "trunova1977";
  const SECTION_DATA = [
    { title: "О вас", fields: [
      ["Имя, город или село", "Как вас зовут и откуда вы?", "text"],
      ["Возраст", "Укажите возраст", "text"],
      ["Вес, рост и желаемый вес", "Текущий вес, рост, желаемый вес", "text"]
    ]},
    { title: "Самочувствие", fields: [
      ["На что жалуетесь? Какие симптомы? Состояние кожи, ногтей и волос", "Опишите всё, что беспокоит", "textarea"],
      ["Как часто болеете вирусными заболеваниями?", "Например, сколько раз за последний год", "textarea"],
      ["Как часто бывают головные боли? Бывают ли циститы?", "Если нет — напишите «нет»", "textarea"],
      ["Как проходит менструация? Есть ли сгустки, боли, выраженный ПМС?", "Если не относится к вам — напишите «не относится»", "textarea"]
    ]},
    { title: "История здоровья", fields: [
      ["Были ли гинекологические операции? Если да, какие?", "Если не было — напишите «нет»", "textarea"],
      ["Какие диагнозы ставили? Есть ли кисты, миомы, полипы или камни?", "Если есть результаты УЗИ, их можно отдельно прислать в Telegram", "textarea"],
      ["Есть ли аллергические реакции на продукты, сезонные факторы, пыль или лекарства?", "Если нет — напишите «нет»", "textarea"],
      ["Артериальное давление: бывают ли колебания?", "Если нет — напишите «нет»", "textarea"],
      ["Щитовидная железа: когда последний раз посещали эндокринолога?", "Если не посещали — напишите «не посещала/не посещал»", "textarea"],
      ["Какие лекарства, БАДы или гормональные препараты принимаете или принимали?", "Укажите также контрацептивы; если ничего — напишите «нет»", "textarea"]
    ]},
    { title: "Образ жизни и цели", fields: [
      ["Есть ли привычки, которые вредят самочувствию?", "Переедание, переутомление, алкоголь, курение, недосыпание, трудности с расслаблением", "textarea"],
      ["Какие основные цели по здоровью и самочувствию вы ставите на ближайшие месяцы?", "Расскажите, какого результата хотите достичь", "textarea"]
    ]}
  ];
  const fields = SECTION_DATA.flatMap(x => x.fields);
  const styles = document.createElement("link");
  styles.rel = "stylesheet";
  styles.href = "assets/consultation-intake.css?v=3";
  document.head.appendChild(styles);

  const overlay = document.createElement("div");
  overlay.id = "consultation-intake-modal";
  overlay.className = "intake-overlay";
  overlay.setAttribute("role", "presentation");
  overlay.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  overlay.innerHTML = `
    <section class="intake-dialog" role="dialog" aria-modal="true" aria-labelledby="intake-title">
      <header class="intake-header">
        <div class="intake-header-copy">
          <span class="intake-eyebrow">Людмила Баран · Личная консультация</span>
          <h2 id="intake-title">Давайте <em>познакомимся</em></h2>
          <p>Заполните все 15 вопросов, чтобы я могла заранее узнать о вашем самочувствии и подготовиться к разговору. Если вопрос не относится к вам, напишите «нет» или «не относится».</p>
        </div>
        <button type="button" class="intake-close" data-close-intake aria-label="Закрыть анкету">×</button>
      </header>
      <form id="consultation-intake-form" class="intake-form" autocomplete="on">
        <div id="intake-fields"></div>
        <footer class="intake-footer">
          <div class="intake-footer-copy"><strong>Всё готово?</strong><span>После заполнения откроется мой личный чат в Telegram. Ваши ответы можно будет вставить в сообщение и отправить мне.</span></div>
          <button class="intake-submit" type="submit">Отправить анкету и связаться со мной <span aria-hidden="true">↗</span></button>
          <p class="intake-status" id="intake-send-status" aria-live="polite" hidden></p>
          <div class="intake-fallback-actions" id="intake-fallback-actions" hidden>
            <button type="button" id="intake-copy-again">Скопировать анкету</button>
            <a href="https://t.me/trunova1977" target="_blank" rel="noopener noreferrer" data-no-intake>Открыть мой Telegram ↗</a>
          </div>
          <textarea class="intake-manual-copy" id="intake-manual-copy" aria-label="Текст заполненной анкеты для копирования" readonly hidden></textarea>
        </footer>
      </form>
    </section>
  `;
  document.body.appendChild(overlay);

  const chooser = document.createElement("div");
  chooser.id = "consultation-choice-modal";
  chooser.className = "intake-overlay intake-choice-overlay";
  chooser.hidden = true;
  chooser.setAttribute("aria-hidden", "true");
  chooser.innerHTML = `
    <section class="intake-dialog intake-choice-dialog" role="dialog" aria-modal="true" aria-labelledby="choice-title">
      <header class="intake-header">
        <div class="intake-header-copy">
          <span class="intake-eyebrow">Людмила Баран · Консультация</span>
          <h2 id="choice-title">Как вам <em>удобнее?</em></h2>
          <p>Выберите, как хотите начать общение со мной.</p>
        </div>
        <button type="button" class="intake-close" data-close-choice aria-label="Закрыть окно выбора">×</button>
      </header>
      <div class="intake-choice-actions">
        <a class="intake-choice-direct" href="https://t.me/trunova1977" target="_blank" rel="noopener noreferrer" data-no-intake>Написать мне в Telegram <span aria-hidden="true">↗</span></a>
        <button type="button" class="intake-choice-questionnaire" id="intake-choose-form">Заполнить анкету <span aria-hidden="true">→</span></button>
      </div>
    </section>
  `;
  document.body.appendChild(chooser);

  const form = overlay.querySelector("form");
  const fieldsRoot = overlay.querySelector("#intake-fields");
  const status = overlay.querySelector("#intake-send-status");
  const fallbackActions = overlay.querySelector("#intake-fallback-actions");
  const copyAgain = overlay.querySelector("#intake-copy-again");
  const manualCopy = overlay.querySelector("#intake-manual-copy");
  const firstField = [];
  let lastFocused = null;
  let latestFormattedAnswer = "";

  let qNum = 0;
  for (const section of SECTION_DATA) {
    const group = document.createElement("section");
    group.className = "intake-field-group";
    const heading = document.createElement("h3");
    heading.textContent = section.title;
    group.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "intake-field-grid";
    for (const [question, help, kind] of section.fields) {
      qNum++;
      const id = "intake-q-" + qNum;
      const row = document.createElement("div");
      row.className = "intake-field";
      if (kind === "textarea") row.classList.add("intake-field-wide");

      const label = document.createElement("label");
      label.htmlFor = id;
      const number = document.createElement("span");
      number.className = "intake-question-num";
      number.textContent = String(qNum).padStart(2,"0");
      label.appendChild(number);
      label.appendChild(document.createTextNode(question));

      const field = document.createElement(kind === "textarea" ? "textarea" : "input");
      field.id = id;
      field.name = "question_" + qNum;
      field.setAttribute("data-question", question);
      field.required = true;
      field.setAttribute("aria-required","true");
      field.placeholder = help;
      field.maxLength = kind === "textarea" ? 1600 : 180;
      if (kind === "textarea") field.rows = 2;
      else field.type = "text";
      field.addEventListener("input", () => {
        field.setCustomValidity("");
        status.hidden = true;
      });

      row.append(label, field);
      grid.appendChild(row);
      firstField.push(field);
    }
    group.appendChild(grid);
    fieldsRoot.appendChild(group);
  }

  // Only the top navigation "Консультация" and the homepage
  // "Начать консультацию" button open the two-action chooser.
  // The explicit "Заполнить анкету" button in Анализы opens the form directly.
  // Everything else (including the floating Telegram and Услуги) is direct.
  function shouldOfferChoice(anchor) {
    if (!anchor) return false;
    if (anchor.classList.contains("navcta") && anchor.textContent.trim() === "Консультация") return true;
    if (anchor.textContent.trim() === "Начать консультацию →") return true;
    return false;
  }

  function setOpen(open, preserveFocus = false) {
    if (open && !preserveFocus) lastFocused = document.activeElement;
    overlay.hidden = !open;
    overlay.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("intake-is-open", open);
    if (open) overlay.querySelector(".intake-close").focus({preventScroll:true});
    else if (!preserveFocus && lastFocused && typeof lastFocused.focus === "function") lastFocused.focus({preventScroll:true});
  }
  function setChooser(open, preserveFocus = false) {
    if (open && !preserveFocus) lastFocused = document.activeElement;
    chooser.hidden = !open;
    chooser.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("intake-is-open", open);
    if (open) chooser.querySelector(".intake-close").focus({preventScroll:true});
    else if (!preserveFocus && lastFocused && typeof lastFocused.focus === "function") lastFocused.focus({preventScroll:true});
  }
  document.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const button = event.target.closest("[data-open-intake]");
    const anchor = event.target.closest("a");
    if (button) {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (shouldOfferChoice(anchor)) {
      event.preventDefault();
      setChooser(true);
    }
  }, true);
  chooser.querySelector("[data-close-choice]").addEventListener("click", () => setChooser(false));
  chooser.addEventListener("click", e => {if (e.target === chooser) setChooser(false);});
  chooser.querySelector("#intake-choose-form").addEventListener("click", () => {
    setChooser(false, true);
    setOpen(true, true);
  });
  chooser.addEventListener("keydown", e => {
    if (e.key === "Escape") {e.preventDefault();setChooser(false);return;}
    if (e.key !== "Tab") return;
    const focus = [...chooser.querySelectorAll("a[href],button:not(:disabled)")].filter(el => el.getClientRects().length > 0);
    if (!focus.length) return;
    if (e.shiftKey && document.activeElement === focus[0]) {e.preventDefault();focus[focus.length-1].focus();}
    else if (!e.shiftKey && document.activeElement === focus[focus.length-1]) {e.preventDefault();focus[0].focus();}
  });
  overlay.querySelector(".intake-close").addEventListener("click", () => setOpen(false));
  overlay.addEventListener("click", e => {if (e.target === overlay) setOpen(false);});
  overlay.addEventListener("keydown", e => {
    if (e.key === "Escape") {e.preventDefault();setOpen(false);return;}
    if (e.key !== "Tab") return;
    const focus = [...overlay.querySelectorAll("button:not(:disabled),input:not(:disabled),textarea:not(:disabled),a[href]")].filter(el => el.getClientRects().length > 0);
    if (!focus.length) return;
    if (e.shiftKey && document.activeElement === focus[0]) {e.preventDefault();focus[focus.length-1].focus();}
    else if (!e.shiftKey && document.activeElement === focus[focus.length-1]) {e.preventDefault();focus[0].focus();}
  });

  const formatAnswers = () => {
    const parts = ["АНКЕТА ДЛЯ ЛЮДМИЛЫ БАРАН", "Запрос на консультацию", ""];
    firstField.forEach((el,i) => {
      parts.push((i+1) + ". " + el.getAttribute("data-question"));
      parts.push(el.value.trim());
      parts.push("");
    });
    return parts.join("\n");
  };
  async function copyAnswers(message) {
    try {if (navigator.clipboard && window.isSecureContext) {await navigator.clipboard.writeText(message);return true;}} catch (_) {}
    try {
      const ta=document.createElement("textarea");
      ta.value=message;ta.style.cssText="position:fixed;top:-10000px;left:0;opacity:0";
      document.body.appendChild(ta);ta.focus();ta.select();
      const success=document.execCommand("copy");
      ta.remove();return success;
    } catch (_) {return false;}
  }
  // Use a SHORT Telegram link only. Passing an entire Russian questionnaire in
  // ?text= produced 400 Bad Request on mobile Telegram/nginx.
  const TELEGRAM_CHAT_URL = "https://t.me/" + TELEGRAM_USERNAME;

  function openTelegram() {
    // Synchronous user-gesture navigation, plus a visible fallback real link.
    const a = document.createElement("a");
    a.href = TELEGRAM_CHAT_URL;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("data-no-intake", "");
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  copyAgain.addEventListener("click", async () => {
    if (!latestFormattedAnswer) return;
    const ok = await copyAnswers(latestFormattedAnswer);
    manualCopy.hidden = ok;
    status.hidden = false;
    status.textContent = ok
      ? "Анкета скопирована. Откройте мой Telegram, вставьте её и нажмите «Отправить»."
      : "Не удалось скопировать автоматически. Выделите текст ниже и скопируйте его вручную.";
    if (!ok) {
      manualCopy.value = latestFormattedAnswer;
      manualCopy.focus();
      manualCopy.select();
    }
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    for (const field of firstField) {
      field.setCustomValidity("");
      if (!field.value.trim()) {
        field.setCustomValidity("Пожалуйста, заполните это поле.");
        field.reportValidity();
        field.focus();
        return;
      }
    }
    if (!form.reportValidity()) return;

    latestFormattedAnswer = formatAnswers();
    fallbackActions.hidden = false;
    manualCopy.hidden = true;
    status.hidden = false;
    status.textContent = "Открываю мой Telegram. Анкета копируется — вставьте её в сообщение и нажмите «Отправить».";
    // Start clipboard in the click/submit gesture; do not wait for it before
    // launching Telegram or the browser may block the popup.
    copyAnswers(latestFormattedAnswer).then(ok => {
      status.hidden = false;
      status.textContent = ok
        ? "Анкета скопирована. В моём Telegram вставьте её в сообщение и нажмите «Отправить»."
        : "Автоматическое копирование недоступно. Нажмите «Скопировать анкету» или скопируйте текст вручную.";
      manualCopy.hidden = ok;
      if (!ok) manualCopy.value = latestFormattedAnswer;
    });
    openTelegram();
  });

})();