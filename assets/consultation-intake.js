(() => {
  "use strict";
  const modal = document.getElementById("consultation-intake-modal");
  const form = document.getElementById("consultation-intake-form");
  if (!modal || !form) return;

  const recipient = "trunova1977";
  const buttons = document.querySelectorAll("[data-open-intake]");
  const closeButtons = modal.querySelectorAll("[data-close-intake]");
  const status = document.getElementById("intake-send-status");
  let previousFocus = null;

  function setOpen(open) {
    modal.hidden = !open;
    modal.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("intake-is-open", open);
    if (open) {
      previousFocus = document.activeElement;
      modal.querySelector("[data-close-intake]")?.focus();
    } else if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }
  buttons.forEach(button => button.addEventListener("click", () => setOpen(true)));
  closeButtons.forEach(button => button.addEventListener("click", () => setOpen(false)));
  modal.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
    if (event.key !== "Tab") return;
    const focusable = [...modal.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),a[href]')].filter(el => el.getClientRects().length);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  function buildMessage() {
    const lines = ["АНКЕТА ПЕРЕД КОНСУЛЬТАЦИЕЙ", "Для Людмилы Баран", ""];
    form.querySelectorAll("[data-question]").forEach(field => {
      const label = field.getAttribute("data-question");
      lines.push(label + ":");
      lines.push(field.value.trim() || "—");
      lines.push("");
    });
    lines.push("Анкета заполнена на сайте «Здоровье внутри нас».");
    return lines.join("\n");
  }

  async function copyFullMessage(message) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(message);
        return true;
      }
    } catch (_) {}
    try {
      const temp = document.createElement("textarea");
      temp.value = message; temp.setAttribute("readonly", "");
      temp.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
      document.body.appendChild(temp);
      temp.select();
      const ok = document.execCommand("copy");
      temp.remove();
      return ok;
    } catch (_) { return false; }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const message = buildMessage();
    const longAnswer = [...message].length > 3500;
    // Telegram's deep-link inserts the draft into Ludmila's personal chat.
    // Longer answers are copied in full; the visitor pastes them into Telegram.
    const link = longAnswer
      ? "https://t.me/" + recipient
      : "https://t.me/" + recipient + "?text=" + encodeURIComponent(message);

    status.textContent = longAnswer
      ? "Анкета длинная. Откроется чат Людмилы. Вставьте скопированный текст и нажмите «Отправить» в Telegram."
      : "Откроется личный чат Людмилы с анкетой в поле сообщения. Проверьте текст и нажмите «Отправить» в Telegram.";
    status.hidden = false;

    // Start clipboard write on the actual click and open Telegram on that same
    // user gesture; no health answers are sent to our server.
    copyFullMessage(message).then(ok => {
      if (!ok) status.textContent += " Если копирование не сработало, вернитесь к анкете и повторите попытку.";
    });
    const anchor = document.createElement("a");
    anchor.href = link;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  });
})();
