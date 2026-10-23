async function loadModule(modulePath, element) {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = '<div class="loading">Memuat Modul...</div>';

  if (element) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
  }

  try {
    const response = await fetch(`modules/${modulePath}.html`);
    if (!response.ok) throw new Error('Modul belum tersedia');

    const html = await response.text();
    contentArea.innerHTML = html;

    // Render Ulang LaTeX (KaTeX)
    if (window.renderMathInElement) {
      renderMathInElement(contentArea, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false}
        ]
      });
    }

    // Inisialisasi skrip simulator khusus modul jika ada
    if (typeof initCurrentModule === 'function') {
      initCurrentModule();
    }

  } catch (err) {
    contentArea.innerHTML = `<div class="card"><h3>Modul Sedang Dikembangkan</h3><p>${err.message}</p></div>`;
  }
}

// Inisialisasi Otomatis & Register Service Worker PWA
document.addEventListener('DOMContentLoaded', () => {
  loadModule('01-mekanika/01-vektor/01-trigonometri', document.querySelector('.nav-btn.active'));

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
