/* Точная цветовая схема по присланной пользователем таблице. Образовательная иллюстрация, не клинические рекомендации. */
(() => {
  "use strict";
  const mount = document.getElementById("nutrient-matrix");
  if (!mount) return;

  const nutrients = [
    ["A","Витамин A"],["B₁","Витамин B1"],["B₂","Витамин B2"],["B₃","Витамин B3"],
    ["B₅","Витамин B5"],["B₆","Витамин B6"],["B₉","Витамин B9"],["B₁₂","Витамин B12"],
    ["C","Витамин C"],["D","Витамин D"],["E","Витамин E"],["K","Витамин K"],
    ["Fe","Железо"],["Mg","Магний"],["Cu","Медь"],["Ca","Кальций"],["P","Фосфор"],["Zn","Цинк"]
  ];
  const patterns = [
    ".nnnnnnrynyrynnnny",
    "n.rryrnrrnnnnrnrnn",
    "nr.yyyyrnnnyrnrnny",
    "nry.nynnnnnnynnnnn",
    "nyyn.nyyynnnnnrnnn",
    "nryyn.nrnnnnnnyyny",
    "nnynyn.yynnnnnnnnr",
    "rrrnyry.rnrnrnrynn",
    "yrnnynyr.nynynrynn",
    "nnnnnnnnn.rnnnnyyn",
    "ynnnnnryr.rrrrnnr".replace("nnnnnry", "nnnnnnry"),
    "rnynnnnnnnr.nnnynn",
    "ynrynnnrynrn.ryrnr",
    "nrnnnnnnnnrnr.nyrn",
    "nnrnrynrrnrnyn.nnr",
    "nrnnnynyyynyryn.rr",
    "nnnnnnnnnynnnrnr.n",
    "ynynnyrnnnrnrnrrn."
  ];
  /* Reassert the diagram's 18-column schema before rendering. */
  patterns[10] = "ynnnnnnryr.rrrrnnr";
  const states = {
    y: { title: "Совместимы по схеме", cls: "is-compatible" },
    r: { title: "Не совместимы по схеме", cls: "is-incompatible" },
    n: { title: "Нейтральны по схеме", cls: "is-neutral" },
    ".": { title: "Один и тот же нутриент", cls: "is-self" }
  };
  const table = document.createElement("table");
  table.className = "nutrient-matrix-table";
  table.setAttribute("aria-label", "Таблица совместимости витаминов и минералов по присланной схеме");
  const colgroup = document.createElement("colgroup");
  const labelCol = document.createElement("col");
  labelCol.className = "nutrient-label-column";
  colgroup.append(labelCol);
  nutrients.forEach(() => colgroup.append(document.createElement("col")));
  table.append(colgroup);

  const thead = document.createElement("thead");
  const groupHead = document.createElement("tr");
  groupHead.className = "nutrient-groups";
  const spacer = document.createElement("th");
  spacer.setAttribute("scope","col");
  spacer.className="nutrient-head-spacer";
  spacer.rowSpan=2;
  groupHead.append(spacer);
  [["Витамины",12],["Минералы",6]].forEach(([name,count]) => {
    const th=document.createElement("th");
    th.colSpan=count;
    th.textContent=name;
    th.scope="colgroup";
    groupHead.append(th);
  });
  const labelsHead = document.createElement("tr");
  labelsHead.className="nutrient-labels-head";
  nutrients.forEach(([label,name]) => {
    const th=document.createElement("th");
    th.textContent=label;
    th.title=name;
    th.scope="col";
    labelsHead.append(th);
  });
  thead.append(groupHead,labelsHead);
  table.append(thead);

  const tbody=document.createElement("tbody");
  nutrients.forEach(([rowLabel,rowName],i) => {
    const tr=document.createElement("tr");
    tr.dataset.row=String(i);
    const th=document.createElement("th");
    th.scope="row";
    th.textContent=rowName;
    th.className="nutrient-row-name";
    if(i===0||i===12)tr.classList.add("nutrient-group-start");
    tr.append(th);
    [...patterns[i]].forEach((state,j) => {
      const td=document.createElement("td");
      const item=states[state]||states.n;
      td.className="nutrient-cell "+item.cls;
      if(state!=="."){
        const dot=document.createElement("span");
        dot.className="nutrient-dot";
        dot.setAttribute("aria-hidden","true");
        td.append(dot);
      }
      const info=rowName+" + "+nutrients[j][1]+": "+item.title;
      td.title=info;
      td.setAttribute("aria-label",info);
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);
  mount.replaceChildren(table);
  table.addEventListener("pointerover", e=>{
    const cell=e.target.closest("td");
    if(!cell)return;
    table.querySelectorAll(".nutrient-focused").forEach(x=>x.classList.remove("nutrient-focused"));
    const row=cell.closest("tr");
    const col=cell.cellIndex;
    row.classList.add("nutrient-focused");
    table.querySelectorAll("tr").forEach(tr=>{
      if(tr.children[col])tr.children[col].classList.add("nutrient-focused");
    });
  });
  table.addEventListener("pointerleave",()=>{
    table.querySelectorAll(".nutrient-focused").forEach(x=>x.classList.remove("nutrient-focused"));
  });
})();