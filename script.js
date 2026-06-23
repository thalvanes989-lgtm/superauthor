(function(){
  const params = new URLSearchParams(window.location.search);
  const school = sanitize(params.get('school')) || 'Your school';
  const grades = sanitize(params.get('grades')) || 'K-8';
  const state = sanitize(params.get('state')) || 'your state';
  const owner = sanitize(params.get('owner')) || 'internal';
  const cohort = sanitize(params.get('cohort')) || 'school-impact-v2';
  const schoolLogoUrl = safePublicImageUrl(params.get('logo'));
  const initialStudents = parsePositiveInt(params.get('students'), 300);

  const ASSUMED_TOTAL_REVENUE_PER_300_STUDENTS = 7000;
  const SCHOOL_SHARE_RATE = 0.10;
  const ESTIMATED_ATTENDEES_PER_STUDENT = 3;

  const bookExamples = {
    prek: {
      grade: 'PreK–K',
      title: 'My Magical World of Shapes',
      copy: 'I see a red triangle and a big blue circle.',
      image: 'http://superauthor.com/wp-content/uploads/2026/06/Pre-kindergaten.png',
      imageAlt: 'Student book example: My Magical World of Shapes',
      heading: 'Early learners can become authors through simple writing and visual storytelling.',
      description: 'For PreK and Kindergarten, the book can combine shapes, colors, drawings, dictated ideas, and teacher-supported writing.',
      bullets: ['Simple sentence structure','Drawing-led storytelling','High family pride at the Publishing Party'],
      gradient: 'linear-gradient(135deg,#E33D57,#EB801E)'
    },
    g12: {
      grade: '1st–2nd',
      title: "Aalam's Super Power",
      copy: 'My superpower is flying high up to the sun to save the day!',
      image: 'http://superauthor.com/wp-content/uploads/2026/06/2th-grade.png',
      imageAlt: "Student book example: Aalam's Super Power",
      heading: 'Early writers build confidence when their ideas become real books.',
      description: 'Students can write short scenes, describe personal ideas, and connect their illustrations to a clear story.',
      bullets: ['Short narrative scenes','Personal interests and identity','Illustrations connected to text'],
      gradient: 'linear-gradient(135deg,#00A0D9,#009A80)'
    },
    g35: {
      grade: '3rd–5th',
      title: 'The Big Hit',
      copy: 'I held the bat tight and looked at the ball. With one fast swing, I heard a loud crack and knew it was a home run!',
      image: 'http://superauthor.com/wp-content/uploads/2026/06/5th-grade.png',
      imageAlt: 'Student book example: The Big Hit',
      heading: 'Upper elementary students can create stronger, more detailed narratives.',
      description: 'Students can work with sequence, action, sensory detail, personal voice, and revision while still creating an individual book.',
      bullets: ['Structured narrative arc','Revision and paragraph development','Clear connection to ELA standards'],
      gradient: 'linear-gradient(135deg,#F4A801,#EB801E)'
    },
    g68: {
      grade: '6th–8th',
      title: 'A Moment in Time',
      copy: "Every gear turns to reflect how we perceive history. Time doesn't just pass; it shapes our choices, our growth, and who we eventually become.",
      image: 'http://superauthor.com/wp-content/uploads/2026/06/8th-grade.png',
      imageAlt: 'Student book example: A Moment in Time',
      heading: 'Middle school can move into reflection, argument, and longer-form writing.',
      description: 'For older students, SuperAuthor can adapt into personal essays, science portfolios, identity writing, or other structured projects.',
      bullets: ['Personal essay or portfolio format','Longer-form writing and reflection','Strong fit for ELA, science, or project-based learning'],
      gradient: 'linear-gradient(135deg,#2A3A4D,#00A0D9)'
    }
  };

  document.querySelectorAll('[data-school-name]').forEach(el => el.textContent = school);
  document.querySelectorAll('[data-grade-band]').forEach(el => el.textContent = grades);
  document.querySelectorAll('[data-state]').forEach(el => el.textContent = state);

  setupSchoolLogo(schoolLogoUrl);

  const studentsInput = document.getElementById('studentsInput');
  studentsInput.value = initialStudents;
  updateImpact(initialStudents);
  updateSummary(initialStudents);

  document.querySelectorAll('[data-scroll-target]').forEach(button => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.getAttribute('data-scroll-target'));
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
      track('cta_scroll_clicked',{target:button.getAttribute('data-scroll-target')});
    });
  });

  document.querySelector('[data-recalculate]').addEventListener('click', () => {
    const value = parsePositiveInt(studentsInput.value, initialStudents);
    studentsInput.value = value;
    updateImpact(value);
    updateSummary(value);
    track('calculator_adjusted',{students:value, owner, cohort});
  });

  studentsInput.addEventListener('change', () => {
    const value = parsePositiveInt(studentsInput.value, initialStudents);
    studentsInput.value = value;
    updateImpact(value);
    updateSummary(value);
    track('calculator_adjusted',{students:value, owner, cohort});
  });

  document.querySelectorAll('[data-grade-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-grade-tab]').forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      updateBookExample(tab.dataset.gradeTab);
      track(tab.dataset.gradeTab === 'g68' ? 'gallery_middle_school_viewed' : 'gallery_grade_viewed', {grade:tab.dataset.gradeTab, owner, cohort});
    });
  });

  document.querySelector('[data-copy-summary]').addEventListener('click', async () => {
    const text = document.getElementById('summaryText').value;
    await copyText(text);
    setFeedback('Summary copied.');
    track('copy_summary_clicked',{school, students:parsePositiveInt(studentsInput.value, initialStudents), owner, cohort});
  });

  document.querySelector('[data-copy-link]').addEventListener('click', async () => {
    await copyText(window.location.href);
    setFeedback('Page link copied.');
    track('copy_link_clicked',{school, owner, cohort});
  });

  document.querySelector('[data-placeholder-cta]').addEventListener('click', () => {
    track('placeholder_cta_clicked',{school, owner, cohort});
    setFeedback('CTA clicked. Connect this to the chosen form later.');
  });

  updateBookExample('prek');
  track('page_view_school_impact',{school, students:initialStudents, grades, state, has_school_logo:Boolean(schoolLogoUrl), owner, cohort});

  function setupSchoolLogo(logoUrl){
    const badge = document.querySelector('[data-school-logo-badge]');
    const img = document.querySelector('[data-school-logo]');
    const text = document.querySelector('[data-school-logo-text]');
    if(text) text.textContent = `for ${school}`;
    if(!badge || !img || !logoUrl){
      if(badge) badge.hidden = true;
      return;
    }
    img.onload = () => {
      if(img.naturalWidth > 0 && img.naturalHeight > 0){
        badge.hidden = false;
        track('school_logo_loaded',{school, logo_url:logoUrl, owner, cohort});
      }
    };
    img.onerror = () => {
      badge.hidden = true;
      track('school_logo_failed',{school, logo_url:logoUrl, owner, cohort});
    };
    img.src = logoUrl;
  }

  function updateImpact(students){
    const books = students;
    const attendees = students * ESTIMATED_ATTENDEES_PER_STUDENT;
    const grossRevenue = students * (ASSUMED_TOTAL_REVENUE_PER_300_STUDENTS / 300);
    const schoolShare = grossRevenue * SCHOOL_SHARE_RATE;

    document.querySelectorAll('[data-student-authors]').forEach(el => el.textContent = formatNumber(students));
    document.querySelectorAll('[data-books-created]').forEach(el => el.textContent = formatNumber(books));
    document.querySelectorAll('[data-attendees]').forEach(el => el.textContent = formatNumber(attendees));
    document.querySelectorAll('[data-total-revenue]').forEach(el => el.textContent = formatCurrency(grossRevenue));
    document.querySelectorAll('[data-school-share]').forEach(el => el.textContent = formatCurrency(schoolShare));
  }

  function updateSummary(students){
    const attendees = students * ESTIMATED_ATTENDEES_PER_STUDENT;
    const grossRevenue = students * (ASSUMED_TOTAL_REVENUE_PER_300_STUDENTS / 300);
    const schoolShare = grossRevenue * SCHOOL_SHARE_RATE;
    const summary = `I came across SuperAuthor, a writing and publishing program where students create individual published books and the school hosts a Publishing Party for families and guests.\n\nFor ${school}, this could mean approximately ${formatNumber(students)} student-authors, ${formatNumber(students)} individual published books, and ${formatNumber(attendees)} estimated Publishing Party attendees.\n\nBased on current assumptions, this represents about ${formatCurrency(grossRevenue)} in estimated total book revenue, with an estimated ${formatCurrency(schoolShare)} school fund share at 10%. Final results depend on participation and book orders. The program appears to be no cost to the school, with teacher training and implementation support included. This page shows grade-level examples and possible implementation options.`;
    document.getElementById('summaryText').value = summary;
  }

  function updateBookExample(key){
    const item = bookExamples[key] || bookExamples.prek;
    document.querySelector('[data-book-grade]').textContent = item.grade;
    document.querySelector('[data-book-title]').textContent = item.title;
    document.querySelector('[data-book-copy]').textContent = item.copy;
    document.querySelector('[data-book-heading]').textContent = item.heading;
    document.querySelector('[data-book-description]').textContent = item.description;
    document.querySelector('[data-book-cover]').style.background = item.gradient;
    const image = document.querySelector('[data-book-image]');
    if(image){
      image.src = item.image;
      image.alt = item.imageAlt || `Student book example: ${item.title}`;
    }
    const bullets = document.querySelector('[data-book-bullets]');
    bullets.innerHTML = item.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('');
  }

  function parsePositiveInt(value, fallback){
    const parsed = parseInt(String(value || '').replace(/[^0-9]/g,''),10);
    if(!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return Math.min(parsed,5000);
  }

  function sanitize(value){
    if(!value) return '';
    return String(value).replace(/[<>]/g,'').trim().slice(0,80);
  }

  function safePublicImageUrl(value){
    if(!value) return '';
    const raw = String(value).trim();
    try{
      const url = new URL(raw);
      if(url.protocol !== 'https:' && url.protocol !== 'http:') return '';
      return url.href;
    }catch(err){
      return '';
    }
  }

  function escapeHtml(value){
    return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function formatNumber(value){
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  }

  function formatCurrency(value){
    return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Math.round(value));
  }

  async function copyText(text){
    if(navigator.clipboard && window.isSecureContext){
      await navigator.clipboard.writeText(text);
      return;
    }
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    document.body.removeChild(helper);
  }

  function setFeedback(message){
    const el = document.querySelector('.copy-feedback');
    if(!el) return;
    el.textContent = message;
    window.clearTimeout(setFeedback.timeout);
    setFeedback.timeout = window.setTimeout(() => { el.textContent = ''; }, 2600);
  }

  function track(eventName, payload){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:eventName,...payload});
    console.log('[SuperAuthor tracking]', eventName, payload || {});
  }
})();
