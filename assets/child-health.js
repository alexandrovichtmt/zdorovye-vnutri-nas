(() => {
  const dialog = document.getElementById("child-lightbox");
  const image = document.getElementById("child-lightbox-image");
  const title = document.getElementById("child-lightbox-title");
  const close = document.getElementById("child-lightbox-close");
  if (!dialog || !image || !close) return;
  const allowed = new Set(["IMG_0262.PNG","IMG_0263.PNG","IMG_0264.PNG","IMG_0265.PNG","IMG_0266.PNG","images/community-care.svg","images/community-courses.svg"]);
  document.querySelectorAll(".child-image-open").forEach(button => {
    button.addEventListener("click", () => {
      const file = button.getAttribute("data-child-image");
      if (!allowed.has(file)) return;
      image.src = file;
      image.alt = button.getAttribute("data-child-alt") || "Памятка по детскому здоровью";
      title.textContent = image.alt;
      if (typeof dialog.showModal === "function") dialog.showModal();
    });
  });
  close.addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
})();