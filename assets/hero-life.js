(()=>{"use strict";const title=document.querySelector("body.home-sync .hero-title");if(!title)return;
const txt=(title.textContent||"").replace(/\s+/g," ").trim();
const lines=title.innerHTML.split(/<br\s*\/?\s*>/i).map(line=>line.replace(/<[^>]*>/g,"").trim()).filter(Boolean);
if(!lines.length)return;
title.setAttribute("aria-label",lines.join(" "));
title.textContent="";
lines.forEach(line=>{let index=0;const wrapper=document.createElement("span");wrapper.className="hero-title-line";wrapper.setAttribute("aria-hidden","true");for(const char of Array.from(line)){const el=document.createElement("span");el.className="hero-letter";el.textContent=char===" "?"\u00A0":char;el.style.setProperty("--letter-index",String(index++));wrapper.append(el)}title.append(wrapper)});
document.querySelectorAll("body.home-sync .benefits").forEach(set=>set.querySelectorAll(".benefit").forEach((node,i)=>node.style.setProperty("--benefit-index",String(i))));
})();