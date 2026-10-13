// Tour Guide Onboarding Spotlight cho quy trình 10 Bước
// Thiết kế chuẩn cao cấp: Spotlight làm nổi bật phần tử + Card Popover hướng dẫn thông minh

(function () {
  // Inject CSS cho Tour
  var tourStyle = document.createElement('style');
  tourStyle.id = 'app-tour-styles';
  tourStyle.textContent = `
    .tour-overlay {
      position: absolute;
      inset: 0;
      z-index: 999;
      pointer-events: auto;
      overflow: hidden;
      animation: tourFadeIn 0.2s ease forwards;
    }
    @keyframes tourFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .tour-spotlight-frame {
      position: absolute;
      border-radius: 14px;
      border: 2.5px solid #EA580C;
      box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.72), 0 0 24px rgba(234, 88, 12, 0.6);
      transition: top 0.15s ease, height 0.15s ease, width 0.15s ease, left 0.15s ease;
      pointer-events: none;
      z-index: 1000;
    }
    .tour-spotlight-frame.no-transition {
      transition: none !important;
    }
    @keyframes tourPulse {
      0%, 100% { border-color: #EA580C; box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.72), 0 0 24px rgba(234, 88, 12, 0.65); }
      50% { border-color: #F97316; box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.72), 0 0 10px rgba(234, 88, 12, 0.35); }
    }
    .tour-spotlight-frame.pulsing {
      animation: tourPulse 2s infinite ease-in-out;
    }
    .tour-card {
      position: absolute;
      width: calc(100% - 32px);
      max-width: 358px;
      left: 16px;
      background: #FFFFFF;
      border-radius: 18px;
      padding: 16px 18px 14px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.06);
      z-index: 1001;
      box-sizing: border-box;
      transition: top 0.2s ease, transform 0.2s ease;
      animation: tourPop 0.24s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: 'Be Vietnam Pro', -apple-system, sans-serif;
    }
    @keyframes tourPop {
      from { opacity: 0; transform: translateY(6px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .tour-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #FFEDD5;
      color: #C2410C;
      font-size: 11.5px;
      font-weight: 700;
      border-radius: 999px;
      padding: 3px 9px;
      margin-bottom: 8px;
    }
    .tour-title {
      margin: 0 0 6px;
      font-size: 15.5px;
      font-weight: 700;
      color: #0F172A;
      line-height: 1.35;
    }
    .tour-desc {
      margin: 0 0 14px;
      font-size: 13px;
      line-height: 1.5;
      color: #475569;
    }
    .tour-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .tour-btn-next {
      height: 38px;
      padding: 0 16px;
      border-radius: 10px;
      background: #EA580C;
      color: #FFFFFF;
      border: 0;
      font-family: inherit;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      box-shadow: 0 2px 8px rgba(234, 88, 12, 0.28);
    }
    .tour-btn-next:active {
      transform: scale(0.97);
    }
    .tour-btn-skip {
      border: 0;
      background: transparent;
      color: #94A3B8;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 500;
      cursor: pointer;
      padding: 6px 4px;
    }
    .tour-btn-skip:hover {
      color: #64748B;
    }
    .tour-btn-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      border-radius: 999px;
      border: 0;
      background: #F1F5F9;
      color: #64748B;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .tour-btn-close:hover {
      background: #E2E8F0;
      color: #0F172A;
    }
    .tour-help-trigger {
      height: 28px;
      border-radius: 999px;
      border: 1px solid #FED7AA;
      background: #FFF7ED;
      color: #C2410C;
      font-family: inherit;
      font-size: 11.5px;
      font-weight: 600;
      padding: 0 9px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
      margin-left: auto;
    }
    .tour-help-trigger:hover {
      background: #FFEDD5;
    }
  `;
  document.head.appendChild(tourStyle);

  function getScrollParent(node) {
    if (!node) return null;
    var parent = node.parentElement;
    while (parent && parent !== document.body) {
      var style = window.getComputedStyle(parent);
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
        return parent;
      }
      parent = parent.parentElement;
    }
    return window;
  }

  window.AppTour = {
    overlay: null,
    frame: null,
    card: null,
    steps: [],
    currentIndex: 0,
    container: null,
    scrollBound: false,

    start: function (steps, containerSelector, startStepIndex) {
      if (!steps || steps.length === 0) return;
      this.steps = steps;
      this.currentIndex = typeof startStepIndex === 'number' ? startStepIndex : 0;
      this.container = document.querySelector(containerSelector || '#appShell') || document.body.firstElementChild || document.body;

      if (!this.overlay) {
        this.createTourElements();
      }
      this.bindScrollWatcher();
      this.overlay.style.display = 'block';
      this.showCurrentStep();
    },

    createTourElements: function () {
      var self = this;
      var overlay = document.createElement('div');
      overlay.id = 'appTourOverlay';
      overlay.className = 'tour-overlay';

      var frame = document.createElement('div');
      frame.id = 'tourSpotlightFrame';
      frame.className = 'tour-spotlight-frame pulsing';

      var card = document.createElement('div');
      card.id = 'tourCard';
      card.className = 'tour-card';

      overlay.appendChild(frame);
      overlay.appendChild(card);
      this.container.appendChild(overlay);

      this.overlay = overlay;
      this.frame = frame;
      this.card = card;

      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          self.stop();
        }
      });
    },

    bindScrollWatcher: function () {
      if (this.scrollBound) return;
      this.scrollBound = true;
      var self = this;
      var handler = function () {
        if (self.overlay && self.overlay.style.display !== 'none') {
          self.updatePosition(true);
        }
      };
      window.addEventListener('scroll', handler, true);
      window.addEventListener('resize', handler);
    },

    updatePosition: function (isDirectScroll) {
      if (this.currentIndex >= this.steps.length) return;
      var step = this.steps[this.currentIndex];
      if (!step) return;
      var targetEl = typeof step.target === 'string' ? document.querySelector(step.target) : step.target;
      if (targetEl) {
        this.positionElements(targetEl, step, isDirectScroll);
      }
    },

    showCurrentStep: function () {
      var self = this;
      if (this.currentIndex >= this.steps.length) {
        this.stop();
        return;
      }

      var step = this.steps[this.currentIndex];
      var targetEl = typeof step.target === 'string' ? document.querySelector(step.target) : step.target;

      if (!targetEl || targetEl.offsetParent === null) {
        if (this.currentIndex < this.steps.length - 1) {
          this.currentIndex++;
          this.showCurrentStep();
        } else {
          this.stop();
        }
        return;
      }

      // Cuộn chính xác phần tử vào đầu tầm nhìn (instant để đo tọa độ chuẩn 100%)
      var scrollParent = getScrollParent(targetEl);
      if (scrollParent && scrollParent !== window && scrollParent.scrollTop !== undefined) {
        // Cuộn scroll container để target bắt đầu ngay trên đầu (chừa 8px lề)
        var offsetTop = targetEl.offsetTop;
        scrollParent.scrollTop = Math.max(0, offsetTop - 8);
      } else {
        targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      }

      // Render nội dung Card
      var isLast = this.currentIndex === this.steps.length - 1;
      var nextBtnLabel = step.btnLabel || (isLast ? 'Đã hiểu' : 'Tiếp theo ➔');
      this.card.innerHTML = `
        <button type="button" class="tour-btn-close" aria-label="Đóng" onclick="AppTour.stop()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
        </button>
        <div class="tour-badge">${step.badge || 'Bước ' + (this.currentIndex + 1)}</div>
        <h3 class="tour-title">${step.title}</h3>
        <p class="tour-desc">${step.desc}</p>
        <div class="tour-actions">
          <button type="button" class="tour-btn-skip" onclick="AppTour.stop()">Bỏ qua hướng dẫn</button>
          <button type="button" class="tour-btn-next" onclick="AppTour.next()">
            ${nextBtnLabel}
          </button>
        </div>
      `;

      // Định vị ngay lập tức
      self.positionElements(targetEl, step, false);

      // Đồng bộ thêm 1 frame kế tiếp để đảm bảo tuyệt đối
      requestAnimationFrame(function () {
        self.positionElements(targetEl, step, false);
      });
    },

    positionElements: function (targetEl, step, isDirectScroll) {
      var containerRect = this.container.getBoundingClientRect();
      var targetRect = targetEl.getBoundingClientRect();

      var padding = typeof step.padding === 'number' ? step.padding : 6;
      var top = targetRect.top - containerRect.top - padding;
      var left = targetRect.left - containerRect.left - padding;
      var width = targetRect.width + padding * 2;
      var height = targetRect.height + padding * 2;

      if (isDirectScroll) {
        this.frame.classList.add('no-transition');
      } else {
        this.frame.classList.remove('no-transition');
      }

      this.frame.style.top = Math.max(0, top) + 'px';
      this.frame.style.left = Math.max(4, left) + 'px';
      this.frame.style.width = width + 'px';
      this.frame.style.height = height + 'px';

      // Định vị Card Popover thông minh:
      var cardHeight = 175;
      var spaceBelow = containerRect.height - (top + height);
      var cardTop;

      if (spaceBelow >= cardHeight + 16) {
        // Đặt phía dưới target nếu đủ chỗ
        cardTop = top + height + 10;
      } else if (top >= cardHeight + 16) {
        // Đặt phía trên target nếu trên đủ chỗ
        cardTop = top - cardHeight - 10;
      } else {
        // Nếu target phủ dài màn hình (như mục chọn từ Bước 3):
        // Đặt card ở nửa dưới màn hình để không che mất tiêu đề và các nút chọn nhanh ở đầu!
        cardTop = Math.min(containerRect.height - cardHeight - 20, Math.max(top + 80, containerRect.height * 0.45));
      }

      cardTop = Math.max(10, Math.min(containerRect.height - cardHeight - 10, cardTop));
      this.card.style.top = cardTop + 'px';
    },

    next: function () {
      var currentStep = this.steps[this.currentIndex];
      if (currentStep && typeof currentStep.onNext === 'function') {
        currentStep.onNext();
      }
      this.currentIndex++;
      if (this.currentIndex < this.steps.length) {
        this.showCurrentStep();
      } else {
        this.stop();
      }
    },

    goToStep: function (index) {
      if (index >= 0 && index < this.steps.length) {
        this.currentIndex = index;
        this.showCurrentStep();
      }
    },

    stop: function () {
      if (this.overlay) {
        this.overlay.style.display = 'none';
      }
    }
  };
})();
