/* Renders the home page from data.js. Content edits belong in data.js. */
const S = window.SITE;
const $ = (s, el = document) => el.querySelector(s);
const esc = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const wa = `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(S.whatsappMessage)}`;
const img = (src, alt, fallback) => src ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">` : esc(fallback);
const tags = a => `<ul class="tags">${a.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;

/* shared bits: nav, footer, whatsapp button (used on every page) */
const navLinks = [['Work','work'],['Services','services'],['Process','process'],['About','about'],['Contact','contact']];
function chrome(prefix) {
  $('#nav').innerHTML = `<div class="wrap nav"><a class="logo" href="${prefix}#top">${esc(S.name)}</a>
    <button class="burger" aria-expanded="false" aria-controls="menu">Menu</button>
    <ul id="menu">${navLinks.map(([l,id]) => `<li><a href="${prefix}#${id}">${l}</a></li>`).join('')}</ul></div>`;
  const b = $('.burger'), m = $('#menu');
  b.onclick = () => { const o = m.classList.toggle('open'); b.setAttribute('aria-expanded', o); };
  m.onclick = e => { if (e.target.tagName === 'A') { m.classList.remove('open'); b.setAttribute('aria-expanded', false); } };
  $('#footer').innerHTML = `<div class="wrap"><div>&copy; ${new Date().getFullYear()} ${esc(S.name)}. ${esc(S.location)}.</div>
    <ul>${navLinks.map(([l,id]) => `<li><a href="${prefix}#${id}">${l}</a></li>`).join('')}</ul>
    <ul>${S.socials.map(s => `<li><a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.label)}</a></li>`).join('')}</ul></div>`;
  document.body.insertAdjacentHTML('beforeend', `<a class="wa" href="${wa}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">WhatsApp me</a>`);
}
chrome('index.html'.replace('index.html', location.pathname.includes('case-study') ? 'index.html' : ''));

if ($('#projects')) {
  $('#tagline').textContent = S.tagline;
  $('#intro').textContent = S.intro;
  $('#bigname').textContent = S.name;
  $('#projects').innerHTML = S.projects.map(p => `
    <article class="card reveal"><a href="case-study.html?p=${p.slug}" style="text-decoration:none" aria-label="Read case study: ${esc(p.name)}">
      <div class="thumb" style="--c:${p.color}">${img(p.image, p.name + ' screenshot', p.name)}</div></a>
      <div class="body"><h3>${esc(p.name)}</h3><p class="meta">${esc(p.type)}</p>${tags(p.tools)}
      <div class="links"><a href="case-study.html?p=${p.slug}">Case study</a><a href="${esc(p.liveUrl)}" target="_blank" rel="noopener">Live site</a></div></div></article>`).join('');
  $('#svcgrid').innerHTML = S.services.map(s => `<div class="svc reveal"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join('');
  $('#steps').innerHTML = S.process.map(s => `<div class="step reveal"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join('');
  $('#quotes').innerHTML = S.testimonials.map(t => `<blockquote class="reveal"><p>&ldquo;${esc(t.quote)}&rdquo;</p><footer>${esc(t.name)}, ${esc(t.company)}</footer></blockquote>`).join('');
  $('#bio').innerHTML = S.about.bio.map(b => `<p>${esc(b)}</p>`).join('') + tags(S.about.skills);
  $('#photo').innerHTML = img(S.about.photo, 'Portrait of ' + S.name, S.name[0]);
  $('#clist').innerHTML = `<li>WhatsApp: <a href="${wa}" target="_blank" rel="noopener">Message me</a></li>
    <li>Email: <a href="mailto:${esc(S.email)}">${esc(S.email)}</a></li>
    ${S.socials.map(s => `<li>${esc(s.label)}: <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url.replace(/^https?:\/\//,''))}</a></li>`).join('')}`;
  $('#hireLink').href = '#contact';

  /* Contact form: opens the visitor's email app with the details filled in.
     To receive messages without that, swap this for Formspree/Web3Forms (see README). */
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const body = `Name: ${f.get('name')}\nEmail: ${f.get('email')}\n\n${f.get('details')}`;
    location.href = `mailto:${S.email}?subject=${encodeURIComponent('Project enquiry from ' + f.get('name'))}&body=${encodeURIComponent(body)}`;
  });
}

/* Case study page: reads ?p=slug */
if ($('#case')) {
  const p = S.projects.find(x => x.slug === new URLSearchParams(location.search).get('p')) || S.projects[0];
  document.title = `${p.name} case study | ${S.name}`;
  $('#case').innerHTML = `<h1>${esc(p.name)}</h1><p class="meta">${esc(p.type)}</p>${tags(p.tools)}
    <div class="thumb" style="--c:${p.color};border-radius:14px;margin:24px 0">${img(p.image, p.name, p.name)}</div>
    <h2>The problem</h2><p>${esc(p.problem)}</p><h2>What I did</h2><p>${esc(p.did)}</p>
    <h2>Tools I used</h2>${tags(p.tools)}<h2>The result</h2><p>${esc(p.result)}</p>
    <h2>Screenshots</h2><div class="shots">${p.screenshots.map((s,i) => `<div class="thumb" style="--c:${p.color}">${img(s, p.name + ' screenshot ' + (i+1), 'Screenshot ' + (i+1))}</div>`).join('')}</div>
    <div class="btns"><a class="btn primary" href="${esc(p.liveUrl)}" target="_blank" rel="noopener">Visit live site</a><a class="btn" href="index.html#contact">Start a similar project</a></div>`;
}

/* fade-in on scroll */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
