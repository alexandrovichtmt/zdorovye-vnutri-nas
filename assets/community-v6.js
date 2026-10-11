/* Community v6: three formats, one accessible detailed panel, no public chat links. */
(()=>{"use strict";
const choices=[...document.querySelectorAll("[data-community-choice]")];
const panel=document.getElementById("community-detail-content"),body=document.getElementById("community-detail-body"),image=document.getElementById("community-detail-image");
if(!choices.length||!panel||!body||!image)return;
const photos=[
["https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=86","images/community-care.svg"],
["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=86","images/community-self.svg"],
["https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=86","images/community-courses.svg"]
];
const bullet=(icon,title,desc)=>'<div class="community-detail-bullet"><span class="detail-icon" aria-hidden="true">'+icon+'</span><div><strong>'+title+'</strong><small>'+desc+'</small></div></div>';
const entries=[
 {tag:"01 / Экспертное сопровождение",title:"Чат заботы с экспертами",
 desc:"Живое общение с врачами и нутрициологами, где можно задавать свои вопросы, обсуждать результаты анализов и получать профессиональные ответы и поддержку.",
 bullets:[["♡","Профессиональные ответы","Вопросы о самочувствии, питании и здоровье."],["☷","Разборы анализов","Обсуждение результатов и следующих шагов."],["✦","Индивидуальный подход","Внимание к вашему запросу и привычкам."],["☺","Поддержка и мотивация","Заботливое комьюнити и сопровождение."]],
 label:"Рядом эксперты, которые заботятся о вас ♡"},
 {tag:"02 / Самостоятельное обучение",title:"Чат «Сам себе нутрициолог»",
 desc:"Формат для тех, кто хочет самостоятельно разбираться в питании, анализах и повседневных привычках, внедряя изменения в комфортном для себя темпе.",
 bullets:[["✎","Составление рациона","Изучайте принципы сбалансированного питания."],["☷","Понимание анализов","Обучающие разборы лабораторных показателей."],["❋","Полезные привычки","Шаг за шагом, без спешки и крайностей."],["♡","Знания для семьи","Практические темы для повседневной жизни."]],
 label:"Мои знания, моё здоровье, мои привычки ♡"},
 {tag:"03 / Обучение в записи",title:"Курсы «Сам себе нутрициолог»",
 desc:"Записанные уроки, к которым можно возвращаться в любое время. Два уровня обучения: сначала основы, затем более глубокое погружение в вопросы питания и организма.",
 bullets:[["▶","Смотрите когда удобно","Уроки доступны для изучения в своём темпе."],["☑","Два уровня","Базовый и продвинутый курс."],["↶","Возвращайтесь к темам","Повторяйте материалы, когда это нужно."],["✧","Практическое применение","Разбирайте рацион и привычки шаг за шагом."]],
 label:"Знания, которые меняют жизнь ♡",
 extra:'<div class="community-course-programs" id="community-programs"><details><summary>01 / Базовый курс — основы нутрициологии</summary><p>Системное знакомство с питанием и организмом, выбором продуктов и сбалансированным рационом.</p><ul><li>Как работает организм</li><li>Питание и обмен веществ</li><li>Витамины и минералы</li><li>Вода и распространённые мифы о детоксе</li><li>Построение сбалансированного рациона</li></ul></details><details><summary>02 / Продвинутый курс — глубже в тему</summary><p>Расширенные темы о взаимодействии питания, пищеварения и физиологических процессов.</p><ul><li>Гормоны и питание</li><li>Кишечник и микробиом</li><li>Воспалительные процессы и иммунная система</li><li>Индивидуальные особенности рациона</li><li>Разбор непростых практических ситуаций</li></ul></details></div>'
 }
];
const asideCaption=document.createElement("em");asideCaption.setAttribute("aria-hidden","true");
const detailPhoto=image.parentElement;detailPhoto.querySelector("em")?.remove();detailPhoto.append(asideCaption);
const supportsMotion=!window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function select(index,scroll){
 const item=entries[index];if(!item)return;
 choices.forEach((card,i)=>{const active=i===index;card.classList.toggle("is-selected",active);card.querySelector(".community-card-trigger")?.setAttribute("aria-expanded",String(active))});
 body.innerHTML='<span class="community-kicker">'+item.tag+'</span><h2>'+item.title+'</h2><p>'+item.desc+'</p><div class="community-detail-bullets">'+item.bullets.map(x=>bullet(...x)).join("")+'</div>'+(item.extra||'')+'<div class="community-detail-footer">♡ Доступ к формату открывается после личной работы с Людмилой.</div>';
 image.src=photos[index][0];image.dataset.fallback=photos[index][1];image.alt=item.title;asideCaption.textContent=item.label;
 panel.dataset.activeFormat=String(index);
 if(scroll)panel.scrollIntoView({behavior:supportsMotion?"smooth":"auto",block:"start"});
}
choices.forEach((card,i)=>{
 card.addEventListener("click",e=>{if(e.target.closest("button")||!e.defaultPrevented)select(i,true)});
 card.addEventListener("keydown",e=>{if(e.target===card&&(e.key==="Enter"||e.key===" ")){e.preventDefault();select(i,true)}});
});
document.querySelectorAll("img[data-fallback]").forEach(el=>el.addEventListener("error",function(){
 if(this.src.endsWith(this.dataset.fallback))return;
 this.src=this.dataset.fallback;
},{once:true}));
if(location.hash==="#format-courses"||location.hash==="#community-programs"){
 select(2,false);
 requestAnimationFrame(()=>panel.scrollIntoView({block:"start",behavior:"auto"}));
}else if(location.hash==="#format-self"){select(1,false);requestAnimationFrame(()=>panel.scrollIntoView({block:"start",behavior:"auto"}))}
else if(location.hash==="#format-care"){select(0,false);requestAnimationFrame(()=>panel.scrollIntoView({block:"start",behavior:"auto"}))}
else select(0,false);
})();