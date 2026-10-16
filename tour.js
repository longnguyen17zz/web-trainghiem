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
      pointer-events: none;
      overflow: hidden;
      animation: tourFadeIn 0.2s ease forwards;
    }
    @keyframes tourFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .tour-blocker {
      position: absolute;
      background: rgba(15, 23, 42, 0.72);
      pointer-events: auto;
      transition: top 0.18s ease, height 0.18s ease, width 0.18s ease, left 0.18s ease;
      z-index: 999;
    }
    .tour-blocker.no-transition {
      transition: none !important;
    }
    .tour-spotlight-frame {
      position: absolute;
      box-sizing: border-box;
      border-radius: 0;
      border: 2.2px solid #FDE047;
      box-shadow:
        0 0 10px 0px rgba(249, 115, 22, 0.6),
        0 0 18px 0px rgba(251, 191, 36, 0.35),
        inset 0 0 10px rgba(254, 215, 170, 0.35);
      transition: top 0.18s ease, height 0.18s ease, width 0.18s ease, left 0.18s ease;
      pointer-events: none;
      z-index: 1000;
    }
    .tour-spotlight-frame.no-transition {
      transition: none !important;
    }
    @keyframes tourGlowPulse {
      0%, 100% {
        border-color: #FDE047;
        box-shadow:
          0 0 10px 0px rgba(249, 115, 22, 0.6),
          0 0 18px 0px rgba(251, 191, 36, 0.35),
          inset 0 0 10px rgba(254, 215, 170, 0.35);
      }
      50% {
        border-color: #FEF08A;
        box-shadow:
          0 0 14px 0px rgba(249, 115, 22, 0.75),
          0 0 24px 0px rgba(251, 191, 36, 0.45),
          inset 0 0 14px rgba(254, 215, 170, 0.45);
      }
    }
    .tour-spotlight-frame.pulsing {
      animation: tourGlowPulse 2.2s infinite ease-in-out;
    }
    /* Nhấn mạnh phụ: dùng cho 1 phần tử CON bên trong spotlight lớn (vd 2 nút tab),
       để thu hút chú ý vào đúng phần tử đó mà không thu hẹp khung spotlight chính. */
    .tour-focus-highlight {
      position: relative;
      z-index: 1001;
      outline: 2.2px solid #EA580C;
      outline-offset: 2px;
      border-radius: 10px;
      animation: tourFocusPulse 1.4s infinite ease-in-out;
    }
    @keyframes tourFocusPulse {
      0%, 100% {
        outline-color: #EA580C;
        box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.45);
      }
      50% {
        outline-color: #FB923C;
        box-shadow: 0 0 0 5px rgba(234, 88, 12, 0);
      }
    }
    /* Wrapper chứa Phù thủy hướng dẫn và bong bóng tròn mini */
    .tour-card {
      position: absolute;
      z-index: 1003;
      pointer-events: none;
      transition: top 0.25s cubic-bezier(0.16, 1, 0.3, 1), left 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: 'Be Vietnam Pro', -apple-system, sans-serif;
      overflow: visible !important;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      padding: 0 !important;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }

    /* Bong bóng tròn mini (dạng oval pill hoàn toàn bo tròn, KHÔNG PHẢI KHUNG CHỮ NHẬT) */
    .tour-round-bubble {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: #FFFFFF;
      border: 1.5px solid #FDE047;
      border-radius: 999px;
      padding: 6px 14px 6px 10px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18), 0 0 12px rgba(253, 224, 71, 0.4);
      pointer-events: auto;
      cursor: pointer;
      position: relative;
      margin-left: 12px;
      transition: all 0.28s cubic-bezier(0.18, 0.9, 0.32, 1.2);
      animation: tourBubblePop 0.25s cubic-bezier(0.18, 0.9, 0.32, 1.25);
      white-space: nowrap;
    }
    .tour-round-bubble::after {
      content: '';
      position: absolute;
      bottom: -7px;
      left: 22px;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 7px solid #FFFFFF;
      filter: drop-shadow(0 1px 1px rgba(15,23,42,0.1));
    }
    .tour-round-bubble.is-hidden {
      opacity: 0;
      transform: scale(0.65) translateY(10px);
      pointer-events: none;
    }

    @keyframes tourBubblePop {
      0% { opacity: 0; transform: scale(0.8) translateY(6px); }
      70% { opacity: 1; transform: scale(1.05) translateY(-2px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    .tour-round-badge {
      background: #EA580C;
      color: #FFFFFF;
      font-size: 10.5px;
      font-weight: 700;
      border-radius: 999px;
      padding: 2px 7px;
      line-height: 1.2;
    }
    .tour-round-text {
      font-size: 12px;
      font-weight: 700;
      color: #0F172A;
      line-height: 1.2;
    }
    .tour-round-spark {
      font-size: 13px;
    }

    /* Phù thủy 3D bay lơ lửng góc dưới spotlight */
    .tour-fairy-companion {
      position: relative;
      width: 76px;
      height: 76px;
      pointer-events: auto;
      cursor: pointer;
      transition: transform 0.18s ease;
      filter: drop-shadow(0 8px 18px rgba(234, 88, 12, 0.45));
      animation: fairyFlyInCorner 0.45s cubic-bezier(0.18, 0.9, 0.32, 1.2) forwards;
    }
    .tour-fairy-companion:hover {
      transform: scale(1.1);
    }
    .tour-fairy-companion:active {
      transform: scale(0.95);
    }
    .tour-fairy-body {
      width: 100%;
      height: 100%;
      position: relative;
      animation: fairyHoverStay 2.5s ease-in-out infinite alternate;
      filter: drop-shadow(0 6px 14px rgba(234, 88, 12, 0.38));
    }
    @keyframes fairyHoverStay {
      0% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-5px) rotate(-2deg);
      }
      100% {
        transform: translateY(3px) rotate(2deg);
      }
    }
    .tour-fairy-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      pointer-events: none;
      user-select: none;
    }
    .tour-fairy-aura {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 64px;
      height: 64px;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, rgba(251, 146, 60, 0.5) 0%, rgba(251, 146, 60, 0) 70%);
      border-radius: 999px;
      pointer-events: none;
      z-index: -1;
      animation: fairyAuraPulse 2.2s infinite ease-in-out;
    }
    @keyframes fairyAuraPulse {
      0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.5; }
      50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.9; }
    }
    .tour-sparkle {
      position: absolute;
      font-size: 13px;
      pointer-events: none;
      user-select: none;
      line-height: 1;
      animation: sparkleTwinkle 1.8s infinite ease-in-out;
    }
    .tour-sparkle.sp1 {
      top: 2px;
      right: 4px;
      animation-delay: 0.1s;
    }
    .tour-sparkle.sp2 {
      top: 22px;
      right: -8px;
      font-size: 15px;
      animation-delay: 0.6s;
    }
    .tour-sparkle.sp3 {
      bottom: 6px;
      left: -4px;
      font-size: 12px;
      animation-delay: 1.1s;
    }
    @keyframes sparkleTwinkle {
      0%, 100% {
        opacity: 0.3;
        transform: scale(0.7) translateY(0);
      }
      50% {
        opacity: 1;
        transform: scale(1.25) translateY(-4px);
      }
    }

    .tour-card-controls {
      position: absolute;
      top: 13px;
      right: 14px;
      display: flex;
      align-items: center;
      gap: 4px;
      z-index: 5;
    }
    .tour-btn-close {
      width: 22px;
      height: 22px;
      border-radius: 999px;
      border: 0;
      background: #F1F5F9;
      color: #64748B;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      padding: 0;
    }
    .tour-btn-close:hover {
      background: #E2E8F0;
      color: #0F172A;
      transform: scale(1.08);
    }
    .tour-btn-close:active {
      transform: scale(0.95);
    }

    .tour-card-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
      min-height: 20px;
      padding-right: 32px;
    }
    .tour-tooltip-title {
      font-size: 12.5px;
      font-weight: 800;
      color: #1E293B;
      letter-spacing: 0.2px;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .tour-badge {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      background: #EA580C;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      border-radius: 999px;
      padding: 1.5px 8px;
      box-shadow: 0 1px 2px rgba(234, 88, 12, 0.25);
    }
    .tour-title {
      margin: 5px 0 5px;
      font-size: 14.5px;
      font-weight: 800;
      color: #0F172A;
      line-height: 1.35;
    }
    .tour-desc {
      margin: 0;
      font-size: 12px;
      line-height: 1.48;
      color: #334155;
      font-weight: 500;
    }
    .tour-action-hint {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;
      font-weight: 700;
      color: #EA580C;
      background: #FFF7ED;
      border: 1.5px solid #0F172A;
      padding: 4px 11px;
      border-radius: 999px;
      box-shadow: 0 2px 0 #0F172A;
      user-select: none;
    }
    .tour-pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: #EA580C;
      box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.7);
      animation: tourDotPulse 1.4s infinite cubic-bezier(0.66, 0, 0, 1);
    }
    @keyframes tourDotPulse {
      0% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.7); }
      70% { box-shadow: 0 0 0 5px rgba(234, 88, 12, 0); }
      100% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0); }
    }
    .tour-btn-next {
      height: 32px;
      padding: 0 14px;
      border-radius: 999px;
      background: #EA580C;
      color: #FFFFFF;
      border: 1.5px solid #0F172A;
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.2px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s ease;
      box-shadow: 0 2px 0 #0F172A;
    }
    .tour-btn-next:active {
      transform: translateY(1px);
      box-shadow: none;
    }
    .tour-btn-skip {
      border: 0;
      background: transparent;
      color: #64748B;
      font-family: inherit;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      padding: 4px 2px;
      transition: color 0.15s ease;
    }
    .tour-btn-skip:hover {
      color: #0F172A;
    }
    .tour-mini-text {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .tour-mini-badge {
      background: #FFEDD5;
      color: #C2410C;
      font-size: 10px;
      font-weight: 700;
      border-radius: 999px;
      padding: 1.5px 6px;
      flex-shrink: 0;
    }
    .tour-mini-title {
      font-size: 11.5px;
      font-weight: 700;
      color: #0F172A;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tour-btn-expand {
      width: 22px;
      height: 22px;
      border-radius: 999px;
      border: 0;
      background: #FFF7ED;
      color: #EA580C;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
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
    bTop: null,
    bBottom: null,
    bLeft: null,
    bRight: null,
    steps: [],
    currentIndex: 0,
    container: null,
    scrollBound: false,
    isCollapsed: false,
    bubbleVisible: true,
    autoCollapseTimer: null,
    focusEl: null,

    clearFocusHighlight: function () {
      if (this.focusEl) {
        this.focusEl.classList.remove('tour-focus-highlight');
        this.focusEl = null;
      }
    },

    applyFocusHighlight: function (step) {
      this.clearFocusHighlight();
      if (!step || !step.focusTarget) return;
      var el = typeof step.focusTarget === 'string' ? document.querySelector(step.focusTarget) : step.focusTarget;
      if (el) {
        el.classList.add('tour-focus-highlight');
        this.focusEl = el;
      }
    },

    isActive: function () {
      return !!(this.overlay && this.overlay.style.display !== 'none' && this.currentIndex < this.steps.length);
    },

    getCurrentIndex: function () {
      return this.currentIndex;
    },

    start: function (steps, containerSelector, startStepIndex) {
      if (!steps || steps.length === 0) return;
      this.steps = steps;
      this.isCollapsed = false;
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
      var overlay = document.createElement('div');
      overlay.id = 'appTourOverlay';
      overlay.className = 'tour-overlay';

      // 4 blocker divs bao quanh spotlight hole (cho phép click xuyên trực tiếp vào phần tử trong spotlight)
      var bTop = document.createElement('div');
      bTop.className = 'tour-blocker tour-blocker-top';
      var bBottom = document.createElement('div');
      bBottom.className = 'tour-blocker tour-blocker-bottom';
      var bLeft = document.createElement('div');
      bLeft.className = 'tour-blocker tour-blocker-left';
      var bRight = document.createElement('div');
      bRight.className = 'tour-blocker tour-blocker-right';

      var frame = document.createElement('div');
      frame.id = 'tourSpotlightFrame';
      frame.className = 'tour-spotlight-frame pulsing';

      var card = document.createElement('div');
      card.id = 'tourCard';
      card.className = 'tour-card';

      overlay.appendChild(bTop);
      overlay.appendChild(bBottom);
      overlay.appendChild(bLeft);
      overlay.appendChild(bRight);
      overlay.appendChild(frame);
      overlay.appendChild(card);
      this.container.appendChild(overlay);

      this.overlay = overlay;
      this.bTop = bTop;
      this.bBottom = bBottom;
      this.bLeft = bLeft;
      this.bRight = bRight;
      this.frame = frame;
      this.card = card;

      var blockerClickHandler = function () {
        // Nhấp vào vùng ngoài spotlight: tạo hiệu ứng rung nhắc nhở
        frame.classList.remove('pulsing');
        void frame.offsetWidth;
        frame.classList.add('pulsing');
      };
      bTop.addEventListener('click', blockerClickHandler);
      bBottom.addEventListener('click', blockerClickHandler);
      bLeft.addEventListener('click', blockerClickHandler);
      bRight.addEventListener('click', blockerClickHandler);
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

    showCurrentStep: function (keepCollapseState) {
      var self = this;
      if (this.currentIndex >= this.steps.length) {
        this.stop();
        return;
      }

      var step = this.steps[this.currentIndex];
      var targetEl = typeof step.target === 'string' ? document.querySelector(step.target) : step.target;

      this.applyFocusHighlight(step);

      if (!targetEl || targetEl.offsetParent === null) {
        if (this.currentIndex < this.steps.length - 1) {
          this.currentIndex++;
          this.showCurrentStep();
        } else {
          this.stop();
        }
        return;
      }

      // Xử lý cuộn chính xác
      var scrollParent = getScrollParent(targetEl);
      if (scrollParent && scrollParent !== window) {
        if (self.currentIndex === 0) {
          // Bước đầu tiên luôn đưa scrollParent về vị trí đầu trang (scrollTop = 0)
          scrollParent.scrollTop = 0;
        } else {
          // Với các bước sau, kiểm tra xem target đã hiển thị đầy đủ chưa
          var parentRect = scrollParent.getBoundingClientRect();
          var targetRect = targetEl.getBoundingClientRect();
          var isFullyVisible = (targetRect.top >= parentRect.top && targetRect.bottom <= parentRect.bottom);
          if (!isFullyVisible) {
            var diff = targetRect.top - parentRect.top;
            scrollParent.scrollTop = Math.max(0, scrollParent.scrollTop + diff - 8);
          }
        }
      }

      // Render Phù thủy hướng dẫn kèm bong bóng tròn mini (BỎ HOÀN TOÀN KHUNG CHỮ NHẬT)
      if (!keepCollapseState) {
        this.bubbleVisible = true;
        this.startAutoCollapseTimer();
      }

      // step.badge === false -> chỉ dẫn thuần, không gắn số bước (dùng cho các trạng thái
      // trung gian trong cùng 1 bước, tránh cảm giác "lặp lại" số bước đã hiện trước đó).
      var badgeText = step.badge === false ? '' : (step.badge || 'Bước ' + (this.currentIndex + 1));
      var badgeHtml = badgeText ? '<span class="tour-round-badge">' + badgeText + '</span>' : '';

      this.card.innerHTML = `
        <div id="tourRoundBubble" class="tour-round-bubble ${this.bubbleVisible ? '' : 'is-hidden'}" onclick="event.stopPropagation(); AppTour.hideBubble()" title="Bấm để ẩn bong bóng">
          ${badgeHtml}
          <span class="tour-round-text">${step.hintLabel || step.title}</span>
          <span class="tour-round-spark">✨</span>
        </div>
        <div class="tour-fairy-companion" onclick="event.stopPropagation(); AppTour.toggleBubble()" title="Phù thủy hướng dẫn viên (chạm để mở/ẩn gợi ý)">
          <div class="tour-fairy-aura"></div>
          <div class="tour-fairy-body">
            <img src="fairy_3d.png" alt="Phù thủy hướng dẫn" class="tour-fairy-img">
            <span class="tour-sparkle sp1">✨</span>
            <span class="tour-sparkle sp2">⭐</span>
            <span class="tour-sparkle sp3">✨</span>
          </div>
        </div>
      `;

      // Định vị Spotlight Frame & Card ngay lập tức
      self.positionElements(targetEl, step, false);

      // Cập nhật lại 1 lần nữa ở frame kế tiếp để đảm bảo tuyệt đối
      requestAnimationFrame(function () {
        self.positionElements(targetEl, step, false);
      });
    },

    positionElements: function (targetEl, step, isDirectScroll) {
      var containerRect = this.container.getBoundingClientRect();
      var targetRect = targetEl.getBoundingClientRect();

      var headerEl = this.container.querySelector('header');
      var headerBottom = headerEl ? (headerEl.getBoundingClientRect().bottom - containerRect.top) : 0;

      var padding = typeof step.padding === 'number' ? step.padding : 6;
      var top = targetRect.top - containerRect.top - padding;
      var left = targetRect.left - containerRect.left - padding;
      var width = targetRect.width + padding * 2;
      var height = targetRect.height + padding * 2;

      // Không bao giờ cho phép spotlight đè lên header nếu phần tử nằm trong main
      if (targetEl.closest('main')) {
        top = Math.max(headerBottom + 2, top);
      } else {
        top = Math.max(0, top);
      }

      if (isDirectScroll) {
        this.frame.classList.add('no-transition');
        if (this.bTop) {
          this.bTop.classList.add('no-transition');
          this.bBottom.classList.add('no-transition');
          this.bLeft.classList.add('no-transition');
          this.bRight.classList.add('no-transition');
        }
      } else {
        this.frame.classList.remove('no-transition');
        if (this.bTop) {
          this.bTop.classList.remove('no-transition');
          this.bBottom.classList.remove('no-transition');
          this.bLeft.classList.remove('no-transition');
          this.bRight.classList.remove('no-transition');
        }
      }

      this.frame.style.top = Math.round(top) + 'px';
      this.frame.style.left = Math.max(4, Math.round(left)) + 'px';
      this.frame.style.width = Math.round(width) + 'px';
      this.frame.style.height = Math.round(height) + 'px';

      // Định vị 4 blocker divs (bao quanh spotlight, chừa lỗ hổng rỗng cho người dùng chạm/thao tác trực tiếp)
      var cW = containerRect.width;
      var cH = containerRect.height;
      var safeTop = Math.max(0, Math.round(top));
      var safeLeft = Math.max(0, Math.round(left));
      var safeRight = Math.min(cW, Math.round(left + width));
      var safeBottom = Math.min(cH, Math.round(top + height));

      if (this.bTop && this.bBottom && this.bLeft && this.bRight) {
        // Blocker trên
        this.bTop.style.top = '0px';
        this.bTop.style.left = '0px';
        this.bTop.style.width = cW + 'px';
        this.bTop.style.height = safeTop + 'px';

        // Blocker dưới
        this.bBottom.style.top = safeBottom + 'px';
        this.bBottom.style.left = '0px';
        this.bBottom.style.width = cW + 'px';
        this.bBottom.style.height = Math.max(0, cH - safeBottom) + 'px';

        // Blocker trái (ở giữa trên và dưới)
        this.bLeft.style.top = safeTop + 'px';
        this.bLeft.style.left = '0px';
        this.bLeft.style.width = safeLeft + 'px';
        this.bLeft.style.height = Math.max(0, safeBottom - safeTop) + 'px';

        // Blocker phải (ở giữa trên và dưới)
        this.bRight.style.top = safeTop + 'px';
        this.bRight.style.left = safeRight + 'px';
        this.bRight.style.width = Math.max(0, cW - safeRight) + 'px';
        this.bRight.style.height = Math.max(0, safeBottom - safeTop) + 'px';
      }

      // Định vị Phù thủy hẳn xuống dưới Spotlight Frame, chừa khoảng cách rõ ràng
      // để vầng sáng của khung và viền của bong bóng KHÔNG chạm/chồng vào nhau.
      var fairyLeft = Math.max(10, Math.round(left - 12));
      var viewportBottom = containerRect.height - 10;
      var belowTop = Math.round(top + height + 32);
      var fairyTop;

      if (belowTop + 85 <= viewportBottom) {
        // Đủ chỗ bên dưới khung trong vùng đang nhìn thấy
        fairyTop = belowTop;
      } else {
        var aboveTop = Math.round(top - 148);
        if (aboveTop >= headerBottom + 10) {
          // Khung nằm ở cuối trang ngắn, còn đủ chỗ phía trên khung -> đặt lên trên
          fairyTop = aboveTop;
        } else {
          // Khung quá cao / tràn khỏi màn hình (vd mục luyện nghe dài nhiều thẻ câu):
          // không còn chỗ trên lẫn dưới -> neo phù thủy gần mép dưới vùng đang nhìn thấy,
          // tuyệt đối không đặt sát header vì sẽ đè lên tiêu đề/badge của khung.
          fairyTop = Math.max(headerBottom + 10, viewportBottom - 90);
        }
      }

      this.card.style.left = fairyLeft + 'px';
      this.card.style.top = fairyTop + 'px';
    },

    startAutoCollapseTimer: function () {
      var self = this;
      this.clearAutoCollapseTimer();
      this.autoCollapseTimer = setTimeout(function () {
        self.hideBubble();
      }, 3000);
    },

    clearAutoCollapseTimer: function () {
      if (this.autoCollapseTimer) {
        clearTimeout(this.autoCollapseTimer);
        this.autoCollapseTimer = null;
      }
    },

    hideBubble: function () {
      this.clearAutoCollapseTimer();
      this.bubbleVisible = false;
      var el = document.getElementById('tourRoundBubble');
      if (el) el.classList.add('is-hidden');
    },

    showBubble: function () {
      this.clearAutoCollapseTimer();
      this.bubbleVisible = true;
      var el = document.getElementById('tourRoundBubble');
      if (el) el.classList.remove('is-hidden');
      var self = this;
      this.autoCollapseTimer = setTimeout(function () {
        self.hideBubble();
      }, 4500);
    },

    toggleBubble: function () {
      if (this.bubbleVisible) {
        this.hideBubble();
      } else {
        this.showBubble();
      }
    },

    collapse: function () {
      this.hideBubble();
    },

    expand: function () {
      this.showBubble();
    },

    toggleCollapse: function () {
      this.toggleBubble();
    },

    next: function () {
      this.clearAutoCollapseTimer();
      var currentStep = this.steps[this.currentIndex];
      if (currentStep && typeof currentStep.onNext === 'function') {
        currentStep.onNext();
      }
      this.currentIndex++;
      if (this.currentIndex < this.steps.length) {
        this.showCurrentStep(false);
      } else {
        this.stop();
      }
    },

    goToStep: function (index) {
      this.clearAutoCollapseTimer();
      if (index >= 0 && index < this.steps.length) {
        this.currentIndex = index;
        this.showCurrentStep(false);
      }
    },

    stop: function () {
      this.clearAutoCollapseTimer();
      this.clearFocusHighlight();
      if (this.overlay) {
        this.overlay.style.display = 'none';
      }
    }
  };
})();
