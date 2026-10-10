(() => {
  const dialog = document.getElementById("child-lightbox");
  const image = document.getElementById("child-lightbox-image");
  const title = document.getElementById("child-lightbox-title");
  const close = document.getElementById("child-lightbox-close");
  if (!dialog || !image || !close) return;
  const allowed = new Set(["IMG_0262.png","IMG_0263.png","IMG_0264.png","IMG_0265.png","IMG_0266.png","IMG_0306.png","IMG_0307.png"]);
  document.querySelectorAll(".child-image-open").forEach(button => {
    button.addEventListener("click", () => {
      const file = button.getAttribute("data-child-image");
      if (!allowed.has(file)) return;
      image.src = "assets/child-health/" + file;
      image.alt = button.getAttribute("data-child-alt") || "Памятка по детскому здоровью";
      title.textContent = image.alt;
      if (typeof dialog.showModal === "function") dialog.showModal();
    });
  });
  close.addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
})();