// Be Pi / Thay Phuc mascot bubble — static re-implementation
// of the original Claude-artifact "Mascot" component (teacher persona).

(function () {
  if (typeof document !== 'undefined' && !document.getElementById('mascot-styles')) {
    var style = document.createElement('style');
    style.id = 'mascot-styles';
    style.textContent = [
      '@keyframes mascotBubblePop {',
      '  0% { opacity: 0; transform: scale(0.88) translateY(6px); }',
      '  100% { opacity: 1; transform: scale(1) translateY(0); }',
      '}',
      '@keyframes mascotPulseWave {',
      '  0% { box-shadow: 0 0 0 0 rgba(194, 65, 12, 0.6), 0 4px 14px rgba(17,24,39,0.18); }',
      '  50% { box-shadow: 0 0 0 9px rgba(194, 65, 12, 0), 0 6px 18px rgba(17,24,39,0.22); }',
      '  100% { box-shadow: 0 0 0 0 rgba(194, 65, 12, 0), 0 4px 14px rgba(17,24,39,0.18); }',
      '}',
      '.mascot-avatar-btn { cursor: pointer; transition: transform 0.16s ease, filter 0.16s ease; user-select: none; }',
      '.mascot-avatar-btn:hover { transform: scale(1.06); filter: brightness(1.03); }',
      '.mascot-avatar-btn:active { transform: scale(0.94); }',
      '.mascot-speaking img { animation: mascotPulseWave 1.25s infinite ease-in-out !important; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  // Pre-fetch voices on load
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = function () {
        window.speechSynthesis.getVoices();
      };
    }
  }
})();

function getMascotPlainText(html) {
  if (!html) return '';
  var tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').trim();
}

function speakMascotText(text, avatarEl) {
  if (!('speechSynthesis' in window) || !text) return;
  try {
    window.speechSynthesis.cancel();

    var cleanText = getMascotPlainText(text);
    // Strip emojis & bullet dots for clean Vietnamese pronunciation
    cleanText = cleanText.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').replace(/[·•]/g, ' ').trim();
    if (!cleanText) cleanText = text;

    var utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    var voices = window.speechSynthesis.getVoices();
    var viVoice = null;
    for (var i = 0; i < voices.length; i++) {
      var v = voices[i];
      if (v.lang && (v.lang === 'vi-VN' || v.lang.toLowerCase().indexOf('vi') === 0)) {
        viVoice = v;
        break;
      }
    }
    if (viVoice) {
      utterance.voice = viVoice;
    }

    if (avatarEl) {
      avatarEl.classList.add('mascot-speaking');
      utterance.onend = function () {
        avatarEl.classList.remove('mascot-speaking');
      };
      utterance.onerror = function () {
        avatarEl.classList.remove('mascot-speaking');
      };
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (avatarEl) avatarEl.classList.remove('mascot-speaking');
  }
}

function renderMascot(container, opts) {
  if (!container) return;
  container.style.pointerEvents = 'none';

  opts = opts || {};
  var mood = opts.mood || 'idle';
  var message = opts.message || '';
  var hasBubble = !!message;
  var startVisible = opts.bubble !== false && hasBubble;
  var size = opts.size || 54;
  var sparkle = mood === 'cheer';

  var lift = Math.round(size * 0.45);

  var html = '<div style="width:100%;display:flex;align-items:flex-end;justify-content:flex-end;gap:6px;font-family:\'Be Vietnam Pro\',sans-serif;color:#111827;pointer-events:none">';

  if (hasBubble) {
    var displayStyle = startVisible ? 'display:block;' : 'display:none;';
    html += '<div data-mascot-bubble style="' + displayStyle + 'pointer-events:auto;position:relative;max-width:214px;margin-bottom:' + lift + 'px;background:#FFFFFF;border:1px solid #F3D3BF;border-radius:16px 16px 4px 16px;padding:9px 34px 10px 12px;box-shadow:0 8px 24px rgba(17,24,39,0.14);animation:mascotBubblePop 0.22s ease-out">';
    html += '<div style="display:flex;align-items:center;gap:6px">';
    html += '<span style="font-size:11px;font-weight:700;color:#C2410C;letter-spacing:0.02em">Thầy Phúc</span>';
    html += '<span title="Đang sẵn sàng đọc" style="display:inline-flex;align-items:center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C2410C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></span>';
    html += '</div>';
    html += '<div style="font-size:13.5px;line-height:1.45;margin-top:2px;color:#1F2937">' + message + '</div>';
    html += '<button type="button" data-mascot-close aria-label="Ẩn lời nhắc" style="position:absolute;top:4px;right:4px;width:28px;height:28px;border:0;border-radius:999px;background:transparent;padding:0;display:flex;align-items:center;justify-content:center;cursor:pointer">';
    html += '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>';
    html += '</div>';
  }

  html += '<div data-mascot-avatar class="mascot-avatar-btn" role="button" tabindex="0" title="Bấm vào Thầy Phúc để nghe đọc lời nhắc" aria-label="Bấm vào Thầy Phúc để nghe đọc lời nhắc" style="pointer-events:auto;width:' + size + 'px;height:' + size + 'px;position:relative;flex-shrink:0">';
  html += '<img src="teacher.png" alt="Thầy Phúc" style="width:100%;height:100%;border-radius:999px;object-fit:cover;border:2.5px solid #FFFFFF;box-shadow:0 4px 14px rgba(17,24,39,0.18);display:block">';

  // Small speaker badge
  if (hasBubble) {
    var badgeSize = Math.max(18, Math.round(size * 0.35));
    html += '<div style="position:absolute;bottom:-1px;right:-1px;width:' + badgeSize + 'px;height:' + badgeSize + 'px;border-radius:999px;background:#C2410C;color:#FFFFFF;border:1.5px solid #FFFFFF;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.2)">';
    html += '<svg width="' + Math.round(badgeSize * 0.58) + '" height="' + Math.round(badgeSize * 0.58) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
    html += '</div>';
  }

  if (sparkle) {
    html += '<span aria-hidden="true" style="position:absolute;top:-6px;right:-4px;font-size:' + Math.round(size * 0.3) + 'px">✨</span>';
  }
  html += '</div></div>';

  container.innerHTML = html;

  var avatarEl = container.querySelector('[data-mascot-avatar]');
  var bubbleEl = container.querySelector('[data-mascot-bubble]');
  var closeBtn = container.querySelector('[data-mascot-close]');

  if (closeBtn && bubbleEl) {
    closeBtn.onclick = function (e) {
      e.stopPropagation();
      bubbleEl.style.display = 'none';
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (avatarEl) avatarEl.classList.remove('mascot-speaking');
    };
  }

  if (avatarEl) {
    var triggerSpeech = function () {
      if (bubbleEl) {
        bubbleEl.style.display = 'block';
        bubbleEl.style.animation = 'none';
        void bubbleEl.offsetWidth; // reflow
        bubbleEl.style.animation = 'mascotBubblePop 0.22s ease-out';
      }
      if (message) {
        speakMascotText(message, avatarEl);
      }
    };

    avatarEl.onclick = function (e) {
      e.stopPropagation();
      triggerSpeech();
    };

    avatarEl.onkeydown = function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerSpeech();
      }
    };
  }
}
