(()=>{"use strict";
const buttons=[...document.querySelectorAll(".gut-filters button[data-filter]")];
const recipes=[...document.querySelectorAll(".gut-recipe[data-category]")];
if(!buttons.length||!recipes.length)return;
buttons.forEach(button=>button.addEventListener("click",()=>{
 const category=button.dataset.filter;
 buttons.forEach(b=>{const active=b===button;b.classList.toggle("is-current",active);b.setAttribute("aria-pressed",String(active));});
 recipes.forEach(card=>{card.hidden=category!=="all"&&card.dataset.category!==category;});
}));
})();