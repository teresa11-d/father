function addAccessory(src) {
  const img = document.createElement('img');
  img.src = src;
  img.classList.add('accessory');
  img.style.left = '100px';
  img.style.top = '100px';

  makeDraggableAndZoomable(img);
  document.getElementById('canvas-container').appendChild(img);
}

function clearAccessories() {
  document.querySelectorAll('.accessory').forEach(el => el.remove());
}

function downloadImage() {
  const container = document.getElementById('canvas-container');
  html2canvas(container).then(canvas => {
    const link = document.createElement('a');
    link.download = 'my-design.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

function makeDraggableAndZoomable(el) {
  let startX = 0, startY = 0, initialX = 0, initialY = 0;
  let scale = 1, startDist = 0;

  el.addEventListener('touchstart', e => {
    e.preventDefault();
    if (e.touches.length === 1) {
      // 單指拖移
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      const rect = el.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
    } else if (e.touches.length === 2) {
      // 雙指縮放
      startDist = getDistance(e.touches[0], e.touches[1]);
    }
  });

  el.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      el.style.left = `${initialX + dx}px`;
      el.style.top = `${initialY + dy}px`;
    } else if (e.touches.length === 2) {
      const newDist = getDistance(e.touches[0], e.touches[1]);
      const scaleFactor = newDist / startDist;
      el.style.transform = `scale(${scale * scaleFactor})`;
    }
  });

  el.addEventListener('touchend', e => {
    if (e.touches.length < 2) {
      // 記住當前縮放值
      const match = el.style.transform.match(/scale\(([^)]+)\)/);
      if (match) scale = parseFloat(match[1]);
    }
  });
}

function getDistance(t1, t2) {
  const dx = t2.clientX - t1.clientX;
  const dy = t2.clientY - t1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}
