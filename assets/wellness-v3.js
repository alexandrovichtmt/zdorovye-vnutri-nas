/* TMT wellness visual system v3 — presentational enhancement only.
 * Keeps authored content, navigation, questionnaires and modals intact. */
(()=>{"use strict";
const root=document.body;root.classList.add("wellness-v3");
const nav=document.querySelector(".nav");
if(nav)nav.classList.add("wellness-nav");
/* Bring the existing authored photo beside the page heading, not one screen below. */
const hero=document.querySelector("header.pageHero");
const section=hero?.nextElementSibling;
if(hero&&section?.classList.contains("section")){
 const heroWrap=hero.querySelector(".wrap");
 const split=section.querySelector(".wrap.split");
 if(heroWrap&&!heroWrap.querySelector(".editorial-copy")){
  const source=split?.querySelector(".art img");
  const copy=document.createElement("div");copy.className="editorial-copy";
  while(heroWrap.firstChild)copy.appendChild(heroWrap.firstChild);
  const art=document.createElement("div");art.className="editorial-visual";
  if(source){
   const image=source.cloneNode(true);image.removeAttribute("loading");image.setAttribute("decoding","async");
   art.appendChild(image);source.closest(".art").classList.add("editorial-image-original");
   if(split)split.classList.add("editorial-cards-only");
  }else{
   art.classList.add("editorial-abstract");
   art.setAttribute("aria-hidden","true");
   art.innerHTML='<span class="editorial-orbit"></span><span class="editorial-orbit editorial-orbit-small"></span><span class="editorial-symbol">✳</span>';
  }
  heroWrap.append(copy,art);hero.classList.add("editorial-intro");
 }
}
/* Telegram: single translucent floating capsule throughout the website. */
let tg=document.querySelector(".tgbar");
if(!tg){tg=document.createElement("div");tg.className="tgbar";document.body.appendChild(tg)}
let anchor=tg.querySelector("a");
if(!anchor){anchor=document.createElement("a");tg.appendChild(anchor)}
if(!anchor.hasAttribute("href"))anchor.href="https://t.me/trunova1977";
anchor.className="tg-floating";
anchor.target="_blank";anchor.rel="noopener noreferrer";
anchor.setAttribute("aria-label","Написать Людмиле в Telegram");
anchor.innerHTML='<svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m21.6 3.1-3.3 17c-.2 1.1-.8 1.3-1.6.8l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.3L5.9 13.5l-4.8-1.5c-1-.3-1-1 .2-1.5L20 3.3c.9-.3 1.8.2 1.6 1.1Z" fill="currentColor"/><path d="m8.7 14.9 9.5-8.5" stroke="#fff" stroke-opacity=".38" stroke-linecap="round"/></svg><span>Telegram</span>';
/* Open the personal Telegram chat on the first tap, including mobile.
   The floating pill's hover/visual styling is unaffected. */
anchor.href="https://t.me/trunova1977";
anchor.setAttribute("data-no-intake","");
/* Back-to-top control: shared across desktop/mobile, positioned above Telegram. */
const topButton=document.createElement("button");
topButton.type="button";
topButton.className="back-to-top-btn";
topButton.setAttribute("aria-label","Вернуться к началу страницы");
topButton.setAttribute("title","Наверх");
topButton.innerHTML='<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 14 6-6 6 6"/><path d="M12 8v11"/></svg>';
document.body.appendChild(topButton);
const updateTopButton=()=>{
  const visible=window.scrollY>320;
  topButton.classList.toggle("is-visible",visible);
  topButton.tabIndex=visible?0:-1;
  topButton.setAttribute("aria-hidden",visible?"false":"true");
};
window.addEventListener("scroll",updateTopButton,{passive:true});
window.addEventListener("pageshow",updateTopButton);
updateTopButton();
topButton.addEventListener("click",()=>{
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({top:0,behavior:reduced?"instant":"smooth"});
});

/* Animate original glass cards — never touch the underlying photos. */
document.querySelectorAll(".hero-glass,.gut-hero-visual,.child-hero-art,.community-hero-art").forEach((node,i)=>{
 node.classList.add("glass-floating");node.style.setProperty("--float-delay",(-i*1.7)+"s");
});
/* Give image-card links a clear accessible indication of navigation. */
document.querySelectorAll(".topicgrid .topic").forEach(node=>{
 if(node.querySelector("img")&&!node.querySelector(".topic-arrow")){
  const arrow=document.createElement("span");arrow.className="topic-arrow";arrow.setAttribute("aria-hidden","true");arrow.textContent="→";node.append(arrow);
 }
});

/* Match the approved homepage composition with an editorial, three-stage FODMAP preview.
   Reuse the existing title, summary and link from the published section. */
const gutPreview=document.querySelector(".gut-home-teaser .gut-teaser-inner");
if(gutPreview&&!gutPreview.classList.contains("gut-glass-preview")){
 const introduction=gutPreview.querySelector(":scope > div");
 const link=gutPreview.querySelector(":scope > a");
 if(introduction&&link){
  gutPreview.classList.add("gut-glass-preview");
  introduction.classList.add("gut-glass-intro");
  introduction.append(link);
  const steps=document.createElement("div");steps.className="gut-glass-steps";
  const data=[
   ["01","Тонкий кишечник","Некоторые FODMAP всасываются не полностью и могут притягивать воду в просвет кишечника."],
   ["02","Толстый кишечник","Часть углеводов достигает толстой кишки, где микробиота ферментирует их с образованием газа."],
   ["03","Самочувствие","У чувствительных людей возможны вздутие, дискомфорт и изменение стула."]
  ];
  data.forEach(([n,title,desc])=>{
   const item=document.createElement("article");item.className="gut-glass-step";
   const index=document.createElement("span");index.className="gut-glass-number";index.textContent=n;
   const h=document.createElement("h3");h.textContent=title;
   const p=document.createElement("p");p.textContent=desc;
   item.append(index,h,p);steps.append(item);
  });
  gutPreview.append(steps);
 }
}
})();