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
  styles.href = "assets/consultation-intake.css?v=2";
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
          <div class="intake-footer-copy"><strong>Всё готово?</strong><span>После заполнения откроется личный Telegram Людмилы с вашими ответами.</span></div>
          <button class="intake-submit" type="submit">Отправить анкету и связаться со мной <span aria-hidden="true">↗</span></button>
          <p class="intake-status" id="intake-send-status" aria-live="polite" hidden></p>
        </footer>
      </form>
    </section>
  `;
  document.body.appendChild(overlay);

  const form = overlay.querySelector("form");
  const fieldsRoot = overlay.querySelector("#intake-fields");
  const status = overlay.querySelector("#intake-send-status");
  const firstField = [];
  let lastFocused = null;

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

  function isTargetLink(a) {
    if (!a || !a.getAttribute("href")) return false;
    const raw = a.getAttribute("href").trim();
    if (a.hasAttribute("data-no-intake")) return false;
    if (raw === "#consultation" || raw === "#intake" || raw === "#consultation-intake") return true;
    if (/^(?:\.\/)?services\.html#contacts(?:$|\?)/i.test(raw)) return true;
    if (/^https?:\/\/(?:www\.)?t\.me\/trunova1977\/?(?:[?#].*)?$/i.test(raw)) return true;
    if (a.hasAttribute("data-open-intake")) return true;
    return false;
  }

  function setOpen(open) {
    if (open) lastFocused = document.activeElement;
    overlay.hidden = !open;
    overlay.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("intake-is-open", open);
    if (open) overlay.querySelector(".intake-close").focus({preventScroll:true});
    else if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus({preventScroll:true});
  }
  document.addEventListener("click", e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    const a = e.target.closest("a");
    const opener = e.target.closest("[data-open-intake]");
    if (!opener && !isTargetLink(a)) return;
    e.preventDefault();
    setOpen(true);
  }, true);
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
  function openTelegram(link) {
    const anchor=document.createElement("a");
    anchor.href=link;
    anchor.target="_blank";
    anchor.rel="noopener noreferrer";
    anchor.setAttribute("data-no-intake", "");
    document.body.appendChild(anchor);anchor.click();anchor.remove();
  }
  form.addEventListener("submit", e => {
    e.preventDefault();
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
    const message=formatAnswers();
    // Telegram public-username draft prefill is a supported Telegram deep link.
    // In very long answers, copy the entire text so it cannot be truncated.
    const encoded=encodeURIComponent(message);
    const longMessage=Array.from(message).length > 3750 || encoded.length > 7800;
    const link=longMessage
      ? "https://t.me/" + TELEGRAM_USERNAME
      : "https://t.me/" + TELEGRAM_USERNAME + "?text=" + encoded;

    // Begin copy inside the submit gesture so Safari/iOS permits clipboard access.
    copyAnswers(message).then(ok => {
      if (longMessage) {
        status.textContent=ok
          ? "Анкета скопирована. Вставьте текст в чат Людмилы и нажмите «Отправить»."
          : "В Telegram открылся чат Людмилы. Если текст не скопировался, вернитесь и повторите отправку.";
      } else {
        status.textContent="Telegram открылся с подготовленным сообщением. Нажмите «Отправить» в чате.";
      }
      status.hidden=false;
    });
    openTelegram(link);
    if (!longMessage) {
      status.textContent="Telegram открылся с подготовленным сообщением. Нажмите «Отправить» в чате.";
      status.hidden=false;
    }
  });
})();