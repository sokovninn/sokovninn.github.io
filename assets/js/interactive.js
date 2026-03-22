/**
 * CV timeline accordion + focus pills; project grid filter.
 */
(function () {
  function initTimeline() {
    var timeline = document.getElementById('cv-timeline');
    if (!timeline) return;

    timeline.querySelectorAll('.timeline-item__head').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var art = btn.closest('.timeline-item');
        if (!art) return;
        var panel = art.querySelector('.timeline-item__body');
        var expanded = btn.getAttribute('aria-expanded') === 'true';

        if (expanded) {
          btn.setAttribute('aria-expanded', 'false');
          if (panel) panel.setAttribute('hidden', '');
          art.classList.remove('is-open');
        } else {
          timeline.querySelectorAll('.timeline-item').forEach(function (item) {
            var b = item.querySelector('.timeline-item__head');
            var p = item.querySelector('.timeline-item__body');
            if (b) b.setAttribute('aria-expanded', 'false');
            if (p) p.setAttribute('hidden', '');
            item.classList.remove('is-open');
          });
          btn.setAttribute('aria-expanded', 'true');
          if (panel) panel.removeAttribute('hidden');
          art.classList.add('is-open');
        }
      });
    });
  }

  function bindPills(containerId, itemSelector) {
    var root = document.getElementById(containerId);
    if (!root) return;

    root.querySelectorAll('.cv-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        var tag = pill.getAttribute('data-tag') || 'all';
        root.querySelectorAll('.cv-pill').forEach(function (p) {
          p.classList.toggle('is-active', p === pill);
          p.setAttribute('aria-pressed', p === pill ? 'true' : 'false');
        });

        document.querySelectorAll(itemSelector).forEach(function (item) {
          var tags = (item.getAttribute('data-tags') || '').split(',').map(function (s) {
            return s.trim();
          });
          var show = tag === 'all' || tags.indexOf(tag) !== -1;
          item.classList.toggle('is-filtered-out', !show);
          item.setAttribute('aria-hidden', show ? 'false' : 'true');
        });
      });
    });
  }

  initTimeline();
  bindPills('cv-pills', '.js-timeline-item');
  bindPills('project-pills', '.js-project-card');
})();
