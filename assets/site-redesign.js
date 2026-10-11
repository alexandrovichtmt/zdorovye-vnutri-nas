/* Adaptive multipage navigation & progressive design enhancements.
   All business content, existing checks, supplements and recipe data stay untouched. */
(()=>{"use strict";
const desktop=[["index.html","Главная"],["about.html","Обо мне"],["nutrition.html","Питание"],["supplements.html","БАДы"],["labs.html","Анализы"],["child-health.html","Детское здоровье"],["community.html","Комьюнити"],["blog.html","Блог"],["services.html","Услуги"]];
const all=desktop;
const page=location.pathname.split("/").pop()||"index.html";
const nav=document.querySelector(".nav"),inNav=nav?.querySelector(".navin");
const anchors=arr=>arr.map(([file,label])=>'<a href="'+file+'"'+(file===page?' aria-current="page"':'')+'>'+label+'</a>').join("");
if(nav&&inNav){
 const oldLinks=inNav.querySelector(".links");
 if(oldLinks){
   const panel=document.createElement("div");panel.className="links";panel.setAttribute("aria-label","Основное меню");
   panel.innerHTML=anchors(desktop);
   oldLinks.replaceWith(panel);
 }
 const menu=inNav.querySelector(".menu");
 if(menu){
   const drop=document.createElement("div");drop.className="mobile-dropdown";drop.id="site-mobile-menu";
   drop.innerHTML=anchors(all);
   nav.append(drop);
   menu.setAttribute("type","button");menu.setAttribute("aria-controls",drop.id);
   menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","Открыть меню");
   // Prevent the legacy app.js toggling nav.open from showing the outdated menu.
   menu.addEventListener("click",()=>{const on=drop.classList.toggle("open");menu.setAttribute("aria-expanded",String(on));menu.setAttribute("aria-label",on?"Закрыть меню":"Открыть меню");nav.classList.remove("open");},true);
   drop.addEventListener("click",e=>{if(e.target.closest("a")){drop.classList.remove("open");menu.setAttribute("aria-expanded","false")}});
   document.addEventListener("pointerdown",e=>{if(!nav.contains(e.target)){drop.classList.remove("open");menu.setAttribute("aria-expanded","false")}});
   document.addEventListener("keydown",e=>{if(e.key==="Escape"){drop.classList.remove("open");menu.setAttribute("aria-expanded","false")}});
   window.addEventListener("resize",()=>{if(window.innerWidth>1200){drop.classList.remove("open");menu.setAttribute("aria-expanded","false")}},{passive:true});
 }
}
if(document.body.classList.contains("home-sync")){
 const hero=document.querySelector(".hero");
 if(hero&&!hero.querySelector(".hero-glass")){
  const cards=[["glass-one","✦","Индивидуальный подход","под ваши цели"],["glass-two","✓","Понятные рекомендации","без сложных схем"],["glass-three","✦","Полное сопровождение","работа до результата"]];
  cards.forEach(([cls,icon,title,subtitle])=>{
   const card=document.createElement("div");card.className="hero-glass "+cls;
   card.innerHTML="<b aria-hidden='true'>"+icon+"</b><div><strong>"+title+"</strong><span>"+subtitle+"</span></div>";
   hero.append(card);
  });
 }
 const benefits=document.querySelector(".desktop-benefits");
 if(benefits&&!document.querySelector(".home-category-tabs")){
  const tabs=document.createElement("nav");tabs.className="home-category-tabs";
  tabs.setAttribute("aria-label","Популярные разделы");
  tabs.innerHTML=anchors([["nutrition.html","Питание"],["labs.html","Анализы"],["supplements.html","БАДы"],["child-health.html","Детское здоровье"],["nutrition.html#recipes","Рецепты"]]);
  benefits.insertAdjacentElement("afterend",tabs);
 }
}
if(document.body.classList.contains("child-health-page")){
 const first=document.getElementById("child-materials");
 if(first&&!document.querySelector(".child-guide")&&!document.querySelector(".child-path")){
  const section=document.createElement("section");section.className="child-guide";section.id="child-guide";
  section.innerHTML='<div class="wrap"><div class="child-guide-head reveal"><span class="child-eyebrow">Знакомство с памятками</span><h2>Как пользоваться материалами</h2><p>В этом разделе — обучающие карточки о нутриентах и возрасте. Они помогают понять тему, но не являются готовой схемой приёма препаратов для ребёнка.</p></div><div class="child-guide-steps"><article class="child-guide-step reveal"><span class="child-guide-number">01</span><h3>Изучите состав</h3><p>Посмотрите, какие нутриенты упоминаются и для чего они нужны. Уточните пищевые источники и показания.</p></article><article class="child-guide-step reveal"><span class="child-guide-number">02</span><h3>Учитывайте возраст</h3><p>Возрастные таблицы в иллюстрациях — примеры, а не рекомендации для каждого ребёнка. Учитываются рацион, диагнозы и лекарства.</p></article><article class="child-guide-step reveal"><span class="child-guide-number">03</span><h3>Обсудите с врачом</h3><p>Перед приёмом витаминов и других добавок согласуйте необходимость, форму и дозировку с педиатром.</p></article></div><div class="child-guide-callout"><strong>Важно:</strong> в период роста самостоятельный подбор нескольких добавок сразу может быть нежелателен. Сначала определите вместе с врачом, есть ли показания.</div></div>';
  first.parentNode.insertBefore(section,first);
 }
 const grid=document.querySelector(".child-image-grid");
 if(grid&&!document.querySelector(".child-age-tabs")){
  const cards=[...grid.querySelectorAll(".child-visual-card")];
  cards.forEach((card,i)=>card.id="child-card-"+(i+1));
  const guide=document.createElement("div");guide.className="child-gallery-intro";
  guide.innerHTML='<p><strong>Схемы и памятки:</strong> откройте оригинал крупно, чтобы прочитать все подписи. Возрастные нормы зависят от конкретной ситуации.</p><div class="child-age-tabs"><a href="#child-card-3">2–6 лет</a><a href="#child-card-4">7–12 лет</a></div>';
  grid.parentNode.insertBefore(guide,grid);
 }
}
/* Keep arrows with the last word inside all text-only actions. */
document.querySelectorAll("a,button,h3").forEach(node=>{
 if(node.children.length)return;
 const original=node.textContent.trim();
 const parts=original.match(/^(.*?)([^\s]+)\s+([→↗↓])$/su);
 if(!parts)return;
 node.textContent=parts[1];
 const joined=document.createElement("span");
 joined.className="inline-arrow-unit";
 joined.textContent=parts[2]+"\u00a0"+parts[3];
 node.appendChild(joined);
});
const progress=document.createElement("div");progress.className="redesign-progress";progress.setAttribute("aria-hidden","true");
document.body.append(progress);
Object.assign(progress.style,{position:"fixed",left:"0",top:"0",height:"3px",width:"100%",zIndex:"250",pointerEvents:"none",transformOrigin:"left",background:"linear-gradient(to top, #e6b980 0%, #eacda3 100%)",transform:"scaleX(0)"});
let scrollScheduled=false;const updateProgress=()=>{const height=document.documentElement.scrollHeight-window.innerHeight;progress.style.transform="scaleX("+(height>0?Math.min(1,window.scrollY/height):0)+")";scrollScheduled=false};
window.addEventListener("scroll",()=>{if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(updateProgress)}},{passive:true});updateProgress();
const reveal=[...document.querySelectorAll(".reveal")];
if("IntersectionObserver" in window){
 const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("on");observer.unobserve(e.target)}})},{threshold:.07});
 reveal.forEach(e=>observer.observe(e));
}else reveal.forEach(e=>e.classList.add("on"));
})();