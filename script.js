const canvasArea = document.getElementById("canvasArea");

function addAccessory(name, src, isFrame = false) {
  const img = document.createElement("img");
  img.src = src;
  img.className = "draggable";
  img.style.left = "100px";
  img.style.top = "100px";
  img.style.zIndex = isFrame ? "0" : "2";
  img.style.width = "100px";
  img.dataset.scale = 1;
  makeDraggable(img);
  canvasArea.appendChild(img);
}

function addText() {
  const text = prompt("請輸入文字：");
  if (text) {
    const span = document.createElement("span");
    span.textContent = text;
    span.className = "draggable";
    span.style.position = "absolute";
    span.style.left = "80px";
    span.style.top = "80px";
    span.style.zIndex = "3";
    span.style.color = "#000";
    span.style.background = "rgba(255,255,255,0.6)";
    span.style.padding = "5px";
    span.style.borderRadius = "5px";
    span.style.fontSize = "16px";
    span.dataset.scale = 1;
    makeDraggable(span);
    canvasArea.appendChild(span);
  }
}

function makeDraggable(el) {
  let offsetX, offsetY;

  // 拖曳
  el.onmousedown = function (e) {
    e.preventDefault();
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    document.onmousemove = function (e) {
      el.style.left = `${e.pageX - canvasArea.offsetLeft - offsetX}px`;
      el.style.top = `${e.pageY - canvasArea.offsetTop - offsetY}px`;
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  // 滾輪縮放
  el.addEventListener("wheel", function (e) {
    e.preventDefault();
    let scale = parseFloat(el.dataset.scale || 1);
    scale += e.deltaY < 0 ? 0.1 : -0.1;
    scale = Math.max(0.2, Math.min(3, scale)); // 限制縮放倍數
    el.dataset.scale = scale;
    if (el.tagName === "IMG") {
      el.style.width = `${100 * scale}px`;
    } else if (el.tagName === "SPAN") {
      el.style.transform = `scale(${scale})`;
    }
  });
}

function clearAccessories() {
  const elements = canvasArea.querySelectorAll(".draggable");
  elements.forEach((el) => {
    if (el.id !== "baseCharacter") el.remove();
  });
}

function downloadImage() {
  html2canvas(canvasArea).then((canvas) => {
    const link = document.createElement("a");
    link.download = "character.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
