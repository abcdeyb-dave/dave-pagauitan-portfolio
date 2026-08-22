/* Editable content: replace placeholder entries with verified resume and portfolio details. */
const skillData = {
  design: ['Graphic Design', 'Branding', 'Print Layout', 'Prepress', 'Print-Ready Files', 'Photo Editing', 'Basic Video Editing', 'Social Media Graphics'],
  technical: ['Basic HTML', 'Basic CSS', 'Basic Python', 'Microsoft Office'],
  professional: ['Client Communication', 'Teamwork', 'Time Management', 'Data Accuracy', 'Customer Assistance', 'Confidentiality']
};
const projects = [
  { title: 'Development project placeholder', category: 'Development', type: 'development', description: 'Add a verified web or programming project from your resume or project archive.', technologies: ['Python', 'Flask', 'HTML', 'CSS'], github: '', demo: '' },
  { title: 'Design project placeholder', category: 'Design', type: 'design', description: 'Add a selected design project with a concise description of your role and deliverables.', technologies: ['Photoshop', 'Illustrator'], github: '', demo: '' },
  { title: 'Other project placeholder', category: 'Other', type: 'other', description: 'A flexible slot for a print, academic, or technical project you want to feature.', technologies: ['Add tools here'], github: '', demo: '' }
];
const portfolioItems = [
  { title: 'Poster composition', category: 'Posters', description: 'A bold typographic poster composition exploring scale, contrast, and expressive lettering.', tools: ['Adobe Photoshop', 'Adobe Illustrator'], image: 'assets/projects/Design-web.jpg' },
  { title: 'Realocal apparel mockup', category: 'Branding', description: 'An apparel branding mockup for Realocal, combining logo placement with a promotional product presentation.', tools: ['Adobe Photoshop', 'Adobe Illustrator'], image: 'assets/projects/Realocal.jpg' },
  { title: 'Morrow Coffee Co. social design', category: 'Social Media', description: 'A social media design for Morrow Coffee Co., balancing warm coffeehouse character with a clear promotional layout.', tools: ['Photoshop', 'Illustrator'], image: 'assets/projects/Morrow Coffee Co-01.jpg' },
  { title: 'Print design work', category: 'Print Design', description: 'Add a production-ready print design from your archive.', tools: ['Photoshop'], image: '' }
];

const select = (selector, parent = document) => parent.querySelector(selector);
const selectAll = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function renderSkills() {
  selectAll('[data-skill-category]').forEach((container) => {
    const skills = skillData[container.dataset.skillCategory] || [];
    container.innerHTML = skills.map((skill) => `<span class="tag">${skill}</span>`).join('');
  });
}
function renderProjects(filter = 'all') {
  const grid = select('#project-grid');
  const visible = filter === 'all' ? projects : projects.filter((project) => project.type === filter);
  grid.innerHTML = visible.map((project, index) => `<article class="project-card" style="animation-delay:${index * 70}ms"><div class="project-top"><span>${project.category}</span><span>${String(index + 1).padStart(2, '0')}</span></div><div><h3>${project.title}</h3><p>${project.description}</p></div><div class="project-tech">${project.technologies.join(' / ')}</div></article>`).join('');
}
function renderPortfolio(filter = 'all') {
  const grid = select('#portfolio-grid');
  const visible = filter === 'all' ? portfolioItems : portfolioItems.filter((item) => item.category.toLowerCase() === filter);
  grid.innerHTML = visible.map((item, index) => `<button class="portfolio-card" type="button" style="animation-delay:${index * 70}ms" data-portfolio-index="${portfolioItems.indexOf(item)}"><span class="portfolio-placeholder">${item.image ? `<img src="${item.image}" alt="${item.title}" loading="lazy">` : `<strong>${item.title.split(' ')[0]}</strong><span>Image pending +</span>`}</span><span class="portfolio-card-info"><strong>${item.title}</strong><span>${item.category}</span></span></button>`).join('');
}
function setupFilters() {
  selectAll('[data-filter]').forEach((button) => button.addEventListener('click', () => { selectAll('[data-filter]').forEach((item) => item.classList.remove('active')); button.classList.add('active'); renderProjects(button.dataset.filter); }));
  selectAll('[data-portfolio-filter]').forEach((button) => button.addEventListener('click', () => { selectAll('[data-portfolio-filter]').forEach((item) => item.classList.remove('active')); button.classList.add('active'); renderPortfolio(button.dataset.portfolioFilter); }));
}
function setupModal() {
  const modal = select('#portfolio-modal'); const image = select('#modal-image');
  const close = () => { modal.hidden = true; document.body.style.overflow = ''; };
  select('#portfolio-grid').addEventListener('click', (event) => { const card = event.target.closest('[data-portfolio-index]'); if (!card) return; const item = portfolioItems[card.dataset.portfolioIndex]; select('#modal-title').textContent = item.title; select('#modal-category').textContent = item.category; select('#modal-description').textContent = item.description; select('#modal-tools').textContent = `Tools: ${item.tools.join(' / ')}`; image.innerHTML = item.image ? `<img src="${item.image}" alt="${item.title}">` : `<span>${item.title.split(' ')[0]}</span>`; modal.hidden = false; document.body.style.overflow = 'hidden'; select('.modal-close').focus(); });
  selectAll('[data-close-modal], .modal-close').forEach((element) => element.addEventListener('click', close));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) close(); });
}
function setupNavigation() {
  const toggle = select('.menu-toggle'); const menu = select('.site-menu');
  const closeMenu = () => { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => { const open = menu.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
  selectAll('.site-menu a').forEach((link) => link.addEventListener('click', closeMenu));
  const sections = selectAll('main section[id]'); const navLinks = selectAll('.site-menu a');
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)); }), { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach((section) => observer.observe(section));
}
function setupTheme() {
  const button = select('.theme-toggle'); const stored = localStorage.getItem('dave-theme'); if (stored) document.documentElement.dataset.theme = stored;
  const updateLabel = () => button.setAttribute('aria-label', document.documentElement.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); updateLabel();
  button.addEventListener('click', () => { const dark = document.documentElement.dataset.theme !== 'dark'; document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('dave-theme', dark ? 'dark' : 'light'); updateLabel(); });
}
function setupPageUtilities() {
  const topButton = select('.back-to-top'); const progress = select('.scroll-progress');
  window.addEventListener('scroll', () => { const scrollable = document.documentElement.scrollHeight - window.innerHeight; progress.style.width = `${scrollable ? window.scrollY / scrollable * 100 : 0}%`; topButton.classList.toggle('visible', window.scrollY > 600); }, { passive: true });
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' })); select('#current-year').textContent = new Date().getFullYear();
  const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12 }); selectAll('.reveal').forEach((element) => revealObserver.observe(element));
}
function setupForm() {
  const form = select('#contact-form'); const status = select('#form-status');
  form.addEventListener('submit', (event) => { event.preventDefault(); if (!form.checkValidity()) { status.textContent = 'Please complete your name, email, and message.'; form.reportValidity(); return; } status.textContent = 'Your message is ready, but this form needs an email service or backend to deliver it.'; form.reset(); });
}
renderSkills(); renderProjects(); renderPortfolio(); setupFilters(); setupModal(); setupNavigation(); setupTheme(); setupPageUtilities(); setupForm();
