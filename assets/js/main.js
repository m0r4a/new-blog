document.querySelectorAll('.prose .highlight, .prose pre:not(.highlight pre)').forEach((block) => {
  const pre = block.matches('pre') ? block : block.querySelector('pre');
  if (!pre) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'copy';
  btn.textContent = 'Copy';
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ''));
      btn.textContent = 'Copied';
      setTimeout(() => (btn.textContent = 'Copy'), 1500);
    } catch {}
  });
  if (block.matches('pre')) {
    const wrap = document.createElement('div');
    wrap.className = 'highlight';
    block.replaceWith(wrap);
    wrap.append(block);
    wrap.append(btn);
  } else {
    block.append(btn);
  }
});

const progress = document.querySelector('.progress');
if (progress) {
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}

const tocLinks = [...document.querySelectorAll('.toc a')];
if (tocLinks.length && 'IntersectionObserver' in window) {
  const byId = new Map(tocLinks.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
  const spy = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        tocLinks.forEach((a) => a.classList.remove('is-active'));
        byId.get(e.target.id)?.classList.add('is-active');
      }
    }
  }, { rootMargin: '0px 0px -75% 0px' });
  byId.forEach((_, id) => {
    const h = document.getElementById(id);
    if (h) spy.observe(h);
  });
}
