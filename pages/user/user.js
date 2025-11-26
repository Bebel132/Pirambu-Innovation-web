document.addEventListener("DOMContentLoaded", function () {
      const buttons = document.querySelectorAll(".menu-btn");

      // Começar pela Home (limpa e ativa)
      buttons.forEach(btn => btn.classList.remove("active"));
      document.querySelector('[data-section="home"]').classList.add("active");

      // Ativa botão clicado
      buttons.forEach(btn => {
        btn.addEventListener("click", function () {
          buttons.forEach(b => b.classList.remove("active"));
          this.classList.add("active");
        });
      });
    });

    (function () {
      const track = document.getElementById('slideTrack');
      const dotsContainer = document.getElementById('newsDots');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');

      const slides = Array.from(track.querySelectorAll('.slide'));
      const realCount = slides.length; // now 10
      let index = 0;
      let slidesPerView = getSlidesPerView();

      // build dots based on number of "pages" (not necessarily slides)
      function buildDots() {
        dotsContainer.innerHTML = '';
        const pages = getMaxIndex() + 1; // pages available (indexes)
        for (let i = 0; i < pages; i++) {
          const d = document.createElement('button');
          d.className = 'dot';
          d.type = 'button';
          d.setAttribute('aria-label', 'Ir para a página ' + (i + 1));
          d.addEventListener('click', () => {
            index = i;
            show();
          });
          dotsContainer.appendChild(d);
        }
        updateDots();
      }

      // measure slidesPerView by media query
      function getSlidesPerView() {
        return window.matchMedia('(min-width: 900px)').matches ? 2 : 1;
      }

      function getMaxIndex() {
        // max starting page index so last page displays valid slides
        return Math.max(0, Math.ceil(realCount / slidesPerView) - 1);
      }

      function show() {
        // calculate translate by page (index) and slide widths
        const spv = slidesPerView;
        // compute percentage translate: each page = 100% of visible area
        const translatePercent = index * 100;
        track.style.transform = `translateX(-${translatePercent}%)`;
        updateDots();
        updateArrows();
      }

      function updateDots() {
        const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
        const maxIdx = getMaxIndex();
        // clamp index into 0..maxIdx
        const current = Math.min(Math.max(0, index), maxIdx);
        dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
      }

      function updateArrows() {
        const maxIdx = getMaxIndex();
        prevBtn.disabled = index <= 0;
        nextBtn.disabled = index >= maxIdx;
      }

      // next/prev operate in pages
      function next() {
        const maxIdx = getMaxIndex();
        if (index < maxIdx) {
          index++;
          show();
        }
      }
      function prev() {
        if (index > 0) {
          index--;
          show();
        }
      }

      // Events
      nextBtn.addEventListener('click', next);
      prevBtn.addEventListener('click', prev);

      // Resize handler: recalc slidesPerView and rebuild dots/pages; keep visible page stable
      function handleResize() {
        const oldSpv = slidesPerView;
        slidesPerView = getSlidesPerView();
        if (slidesPerView !== oldSpv) {
          // convert current page to approximate new page index based on first visible slide
          const firstVisibleSlideIndex = index * oldSpv;
          index = Math.floor(firstVisibleSlideIndex / slidesPerView);
        }
        // ensure index in range
        const maxIdx = getMaxIndex();
        if (index > maxIdx) index = maxIdx;
        buildDots();
        show();
      }

      // small helper: debounce
      function debounce(fn, wait) {
        let t;
        return (...args) => {
          clearTimeout(t);
          t = setTimeout(() => fn.apply(this, args), wait);
        };
      }

      // initialize
      buildDots();
      handleResize();
      window.addEventListener('resize', debounce(handleResize, 120));

      // Accessibility: keyboard for arrows
      prevBtn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); prev(); } });
      nextBtn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); } });
    })();