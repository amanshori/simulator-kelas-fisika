async function loadModule(modulePath, element) {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = '<div class="loading">Memuat Modul...</div>';

  if (element) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
  }

  try {
    const response = await fetch(`./modules/${modulePath}.html`);
    if (!response.ok) throw new Error(`File tidak ditemukan: ./modules/${modulePath}.html`);

    const html = await response.text();
    contentArea.innerHTML = html;

    // Render ulang rumus LaTeX dengan KaTeX
    if (window.renderMathInElement) {
      renderMathInElement(contentArea, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false}
        ]
      });
    }

    // Jalankan otomatis fungsi simulator jika ada di dalam modul
    if (typeof initTrigoSimulator === 'function') {
      initTrigoSimulator();
    }

  } catch (err) {
    contentArea.innerHTML = `<div class="card">
      <h3 style="color: #e11d48;">Gagal Memuat Modul</h3>
      <p style="margin-top: 0.5rem;">${err.message}</p>
    </div>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadModule('01-mekanika/01-vektor/01-trigonometri', document.querySelector('.nav-btn.active'));

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
