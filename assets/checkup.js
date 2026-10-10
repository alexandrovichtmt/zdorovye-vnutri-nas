(() => {
  const root=document.getElementById("checkup"); if(!root) return;
  const items=[...root.querySelectorAll('.checkup-item input[type="checkbox"]')];
  const counter=document.getElementById("checkup-selected-count");
  const copy=document.getElementById("checkup-copy");
  const clear=document.getElementById("checkup-clear");
  const refresh=()=>{
    const n=items.filter(i=>i.checked).length;
    counter.textContent=String(n);
    copy.disabled=n===0;
    copy.textContent=n ? "Скопировать отмеченные ↗" : "Скопировать отмеченные";
  };
  items.forEach(el=>el.addEventListener("change",refresh));
  clear.addEventListener("click",()=>{items.forEach(el=>el.checked=false);refresh()});
  copy.addEventListener("click",async()=>{
    const list=items.filter(i=>i.checked).map((i,j)=>(j+1)+". "+i.value+" — "+i.dataset.detail);
    if(!list.length)return;
    const txt="Вопросы для обсуждения с врачом (по памятке):\n\n"+list.join("\n");
    try {
      await navigator.clipboard.writeText(txt);
      copy.textContent="Скопировано ✓";
      setTimeout(refresh,1800);
    } catch (_) {
      const promptBox=document.createElement("textarea");
      promptBox.value=txt;promptBox.style.position="fixed";promptBox.style.opacity="0";
      document.body.appendChild(promptBox);promptBox.select();
      try {document.execCommand("copy");copy.textContent="Скопировано ✓";}
      catch (_) {copy.textContent="Не удалось скопировать";}
      promptBox.remove();setTimeout(refresh,1800);
    }
  });
  refresh();
})();