/* Interactive questionnaire transcribed from the supplied one-page PDF. */
(() => {
  "use strict";
  const questions = [
  "Слабость, повышенная утомляемость",
  "Раздражительность, психологическая лабильность",
  "Недостаточная концентрация внимания",
  "Депрессивное настроение",
  "Снижение трудоспособности, снижение толерантности к физическим нагрузкам",
  "Дневная сонливость",
  "Головные боли по утрам",
  "Гипотония, головокружение, шум в ушах, склонность к обморокам в душной обстановке",
  "Пониженный аппетит",
  "Отвращение к некоторым продуктам питания (мясо, шоколад, сладости, мёд) и непищевым веществам (глина, шерсть)",
  "Извращение вкуса — непреодолимое желание есть что-либо необычное (зубной порошок, мел, глину, песок, фарш, крупу)",
  "Извращение обоняния — пристрастие к запахам (бензин, керосин, ацетон, запах лаков, красок)",
  "Тяжесть в пояснице / боли в конце рабочего дня",
  "Непроизвольное желание шевелить / двигать ногами перед засыпанием",
  "Повышенная предрасположенность к инфекциям (герпес, фурункулёз, ИППП, частые ОРВИ, ОРЗ)",
  "Обильные менструальные кровопотери (только для женщин; если не относится к вам, выберите 0)",
  "Одышка и сердцебиение при обычных физических нагрузках",
  "Зябкость рук, ног, немотивированный субфебрилитет",
  "Сухость кожи, шелушение, сухие локти, трещины кожи пяток и пальцев, локализованный или распространённый кожный зуд, коричневые пятна на тыльной поверхности кистей и лица",
  "Стоматит (трещины, «заеды» в углах рта); глоссит (распирание, боль, покраснение языка, «лакированный» или «географический» язык); хейлит (покраснение, шелушение, отёк губ); пародонтоз, кариес",
  "Ломкость, тусклость, истончение и исчерченность ногтей, ложкообразная вогнутость ногтей",
  "Тусклость, ломкость, выпадение волос, ранняя седина",
  "Голубоватый оттенок склер (белочной оболочки глаз)",
  "Снижение остроты зрения в темноте",
  "Трудности при проглатывании твёрдой пищи, таблеток, капсул",
  "Снижение мышечного тонуса, мышечная слабость",
  "Императивные позывы на мочеиспускание, недержание мочи при смехе и чихании, ночные позывы к мочеиспусканию",
  "Неустойчивый стул, снижение желудочной секреции, атрофический гастрит, запоры"
];
  const tbody = document.getElementById("iron-questions");
  if (!tbody) return;
  const totalQuestions = questions.length;
  const scoreMax = totalQuestions * 4;
  const answers = Array(totalQuestions).fill(null);
  const count = document.getElementById("iron-counter");
  const runningTotal = document.getElementById("iron-running-total");
  const progress = document.getElementById("iron-progress");
  const fill = document.getElementById("iron-progress-fill");
  const submit = document.getElementById("iron-submit");
  const reset = document.getElementById("iron-reset");
  const again = document.getElementById("iron-again");
  const footerHint = document.getElementById("iron-footer-hint");
  const result = document.getElementById("iron-result");
  const resultHeading = document.getElementById("iron-result-heading");
  const resultScore = document.getElementById("iron-result-score");
  const resultSummary = document.getElementById("iron-result-summary");
  const resultAdvice = document.getElementById("iron-result-advice");

  const fragment = document.createDocumentFragment();
  questions.forEach((question, i) => {
    const tr = document.createElement("tr");
    tr.className = "iron-question-row";
    const th = document.createElement("th");
    th.scope = "row";
    th.id = "iron-q-label-" + i;
    const num = document.createElement("span");
    num.className = "iron-question-number";
    num.textContent = String(i + 1).padStart(2, "0");
    const labelText = document.createElement("span");
    labelText.textContent = question;
    th.append(num, labelText);
    tr.append(th);

    for (let value = 0; value <= 4; value++) {
      const td = document.createElement("td");
      const label = document.createElement("label");
      label.className = "iron-option";
      label.title = question + " — " + ["Нет", "Редко / слабо", "Периодически / терпимо", "Часто / умеренно", "Постоянно / выраженно"][value];
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "iron-question-" + i;
      input.value = String(value);
      input.setAttribute("aria-label", "Вопрос " + (i + 1) + ": " + question + ". Балл " + value);
      input.addEventListener("change", () => {
        answers[i] = value;
        tr.classList.add("iron-answered");
        result.hidden = true;
        update();
      });
      const displayValue = document.createElement("span");
      displayValue.textContent = String(value);
      label.append(input, displayValue);
      td.append(label);
      tr.append(td);
    }
    fragment.append(tr);
  });
  tbody.replaceChildren(fragment);

  // Four compact pages of seven questions. Answers and scoring stay global.
  const pageSize = 7;
  const pages = Math.ceil(totalQuestions / pageSize);
  const questionRows = [...tbody.querySelectorAll(".iron-question-row")];
  const pager = document.createElement("nav");
  pager.className = "iron-pager";
  pager.setAttribute("aria-label", "Страницы анкеты");
  pager.innerHTML = '<button class="iron-page-button" type="button" data-page-prev>← Назад</button><span class="iron-pager-status" role="status" aria-live="polite"></span><button class="iron-page-button iron-page-next" type="button" data-page-next>Далее →</button>';
  document.querySelector(".iron-table-scroller").after(pager);
  const pageStatus = pager.querySelector(".iron-pager-status");
  const previous = pager.querySelector("[data-page-prev]");
  const next = pager.querySelector("[data-page-next]");
  let currentPage = 0;
  function showPage(page, scroll = true) {
    currentPage = Math.max(0, Math.min(page, pages - 1));
    const start = currentPage * pageSize;
    questionRows.forEach((row, index) => { row.hidden = index < start || index >= start + pageSize; });
    previous.disabled = currentPage === 0;
    next.disabled = currentPage === pages - 1;
    const end = Math.min(start + pageSize, totalQuestions);
    const answeredHere = answers.slice(start, end).filter(v => v !== null).length;
    pageStatus.textContent = "Вопросы " + (start + 1) + "–" + end + " из " + totalQuestions + " · Заполнено " + answeredHere + "/" + (end - start) + " · Шаг " + (currentPage + 1) + "/" + pages;
    if (scroll) {
      const legend = document.querySelector(".iron-scale");
      (legend || document.querySelector(".iron-intro")).scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
    }
  }
  previous.addEventListener("click", () => showPage(currentPage - 1));
  next.addEventListener("click", () => showPage(currentPage + 1));
  showPage(0, false);

  function update() {
    const filled = answers.filter(v => v !== null).length;
    const sum = answers.reduce((acc, v) => acc + (v === null ? 0 : v), 0);
    count.textContent = filled + " из " + totalQuestions + " ответов";
    runningTotal.textContent = String(sum);
    progress.setAttribute("aria-valuenow", String(filled));
    fill.style.width = filled / totalQuestions * 100 + "%";
    submit.disabled = filled !== totalQuestions;
    showPage(currentPage, false);
    footerHint.textContent = filled === totalQuestions
      ? "Все ответы заполнены. Можно посмотреть предварительный результат."
      : "Осталось ответить на " + (totalQuestions - filled) + " из " + totalQuestions + " вопросов.";
    return sum;
  }

  function showResult() {
    if (answers.some(v => v === null)) {
      footerHint.textContent = "Пожалуйста, ответьте на все вопросы.";
      return;
    }
    const score = update();
    resultScore.textContent = String(score);
    result.classList.remove("iron-result-low", "iron-result-mid", "iron-result-high");
    if (score < 10) {
      result.classList.add("iron-result-low");
      resultHeading.textContent = "Менее 10 баллов";
      resultSummary.textContent = "По исходной анкете такой результат соответствует вероятно достаточному уровню железа.";
      resultAdvice.textContent = "Низкий балл не исключает дефицит железа, в том числе без выраженных симптомов. Если есть жалобы или факторы риска, обсудите с врачом анализы, например общий анализ крови и ферритин.";
    } else if (score === 10) {
      result.classList.add("iron-result-mid");
      resultHeading.textContent = "10 баллов — пограничный результат";
      resultSummary.textContent = "В оригинальной таблице приведены выводы для сумм меньше и больше 10; для ровно 10 баллов отдельная трактовка не указана.";
      resultAdvice.textContent = "Поэтому мы не относим этот результат автоматически ни к одной из двух групп. При наличии симптомов и факторов риска обсудите необходимость обследования с врачом.";
    } else {
      result.classList.add("iron-result-high");
      resultHeading.textContent = "Более 10 баллов";
      resultSummary.textContent = "По исходной анкете такой результат обозначен как вероятный дефицит железа и повод для дообследования.";
      resultAdvice.textContent = "Симптомы неспецифичны и могут быть вызваны разными состояниями. Обратитесь к врачу для оценки жалоб и подбора обследований (в частности, общего анализа крови и ферритина). Не начинайте приём железа без оценки причины и подтверждения необходимости.";
    }
    result.hidden = false;
    result.focus({preventScroll:true});
    result.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  }

  function resetAll() {
    answers.fill(null);
    tbody.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    tbody.querySelectorAll("tr").forEach(tr => tr.classList.remove("iron-answered"));
    result.hidden = true;
    showPage(0, false);
    update();
    document.getElementById("iron-survey").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  }

  submit.addEventListener("click", showResult);
  reset.addEventListener("click", resetAll);
  again.addEventListener("click", resetAll);
  update();
})();