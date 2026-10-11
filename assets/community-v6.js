/* Community v6: three formats, one accessible detailed panel, no public chat links. */
(()=>{"use strict";
const choices=[...document.querySelectorAll("[data-community-choice]")];
const panel=document.getElementById("community-detail-content"),body=document.getElementById("community-detail-body"),image=document.getElementById("community-detail-image");
if(!choices.length||!panel||!body||!image)return;
const photos=[
["images/community-care-hd.webp","images/community-care-gentle.svg"],
["images/community-support-hd.webp","images/community-we-near.svg"],
["%D0%9E%D0%B1%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5.PNG","images/community-courses.svg"]
];
const bullet=(icon,title,desc)=>'<div class="community-detail-bullet"><span class="detail-icon" aria-hidden="true">'+icon+'</span><div><strong>'+title+'</strong><small>'+desc+'</small></div></div>';
const entries=[
 {tag:"01 / Чат заботы",title:"Чат заботы с экспертами",
 desc:"У меня для вас есть «Чат заботы» — пространство, где врачи превентивной медицины и нутрициологи отвечают на вопросы, помогают разобраться в анализах и делятся полезными материалами. Я расскажу, как можно присоединиться, после нашего личного общения.",
 bullets:[["♡","Профессиональные ответы на вопросы","Врачи превентивной медицины и нутрициологи помогают разобраться в вопросах здоровья."],["☷","Обсуждение анализов","Можно отправить результаты исследований и задать специалистам уточняющие вопросы."],["✦","Вкусные и полезные рецепты","По субботам и воскресеньям участники делятся идеями вкусных и полезных блюд."],["◇","Розыгрыши и подарки","В чате проходят розыгрыши и сюрпризы, в том числе для именинников."],["❧","Всё про здоровье","Полезная информация, мотивация и поддержка в дружелюбной атмосфере."]],
 label:"Чат заботы — знания и поддержка ♡",
 extra:'<p class="community-support-note">Ответы в чате не заменяют диагностику и назначения лечащего врача. Доступ и условия участия я обсуждаю с вами лично после консультации.</p>'},
 {tag:"02 / Чат поддержки",title:"Чат поддержки «Мы рядом»",
 desc:"Я расскажу вам о чате поддержки «Мы рядом» — личном пространстве, где врачи превентивной медицины отвечают на вопросы о здоровье, а врачи-нутрициологи помогают разобраться в питании, добавках и коррекции рациона. Здесь можно также обсуждать результаты анализов — своих и близких с их согласия.",
 bullets:[["♡","Врачи превентивной медицины","В чате можно задавать вопросы о самочувствии и здоровье и получать ответы специалистов."],["☷","Обсуждение анализов","Можно отправить результаты своих анализов или анализов близких с их согласия и обсудить вопросы, которые стоит задать лечащему врачу."],["✦","Врачи-нутрициологи","Помогают разобраться с питанием, добавками и возможной коррекцией рациона."],["☺","Поддержка «Мы рядом»","После нашей консультации я расскажу об условиях участия и помогу с доступом, если этот формат вам подходит."]],
 label:"Чат поддержки «Мы рядом» ♡",
 extra:'<p class="community-support-note">Ответы в чате не заменяют очную консультацию, диагностику и назначения лечащего врача. При срочных симптомах обращайтесь за неотложной медицинской помощью.</p>'},
 {tag:"03 / Обучение в записи",title:"Курсы «Сам себе нутрициолог»",
 desc:"Я расскажу вам о программах в записи, к которым можно возвращаться в удобное время: от базовых тем до более глубокого изучения питания.",
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
 body.innerHTML='<span class="community-kicker">'+item.tag+'</span><h2>'+item.title+'</h2><p>'+item.desc+'</p><div class="community-detail-bullets">'+item.bullets.map(x=>bullet(...x)).join("")+'</div>'+(item.extra||'')+'<div class="community-detail-footer">♡ Возможность доступа я обсуждаю с вами лично после консультации.</div>';
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

/* Full-resolution viewer for the selected Community card. */
const viewer=document.getElementById("community-image-viewer");
const viewerImg=viewer?.querySelector("img");
const viewerClose=viewer?.querySelector(".community-image-viewer-close");
function openHdImage(){
 if(!viewer||!viewerImg||!viewer.showModal)return;
 const index=Math.max(0,Math.min(2,Number(panel.dataset.activeFormat||0)));
 const [source,fallback]=photos[index];
 viewerImg.onerror=()=>{if(!viewerImg.src.endsWith(fallback))viewerImg.src=fallback};
 viewerImg.src=source;
 viewerImg.alt=entries[index].title;
 if(!viewer.open)viewer.showModal();
}
image.addEventListener("click",openHdImage);
image.addEventListener("keydown",event=>{
 if(event.key==="Enter"||event.key===" "){event.preventDefault();openHdImage()}
});
viewerClose?.addEventListener("click",()=>viewer.close());
viewer?.addEventListener("click",event=>{if(event.target===viewer)viewer.close()});

if(location.hash==="#format-courses"||location.hash==="#community-programs"){
 select(2,false);
 requestAnimationFrame(()=>panel.scrollIntoView({block:"start",behavior:"auto"}));
}else if(location.hash==="#format-support"||location.hash==="#format-self"){select(1,false);requestAnimationFrame(()=>panel.scrollIntoView({block:"start",behavior:"auto"}))}
else if(location.hash==="#format-care"){select(0,false);requestAnimationFrame(()=>panel.scrollIntoView({block:"start",behavior:"auto"}))}
else select(0,false);
})();