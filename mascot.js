// Be Pi / Thay Phuc mascot bubble — static re-implementation
// of the original Claude-artifact "Mascot" component (teacher persona).
function renderMascot(container, opts) {
  opts = opts || {};
  var mood = opts.mood || 'idle';
  var message = opts.message || '';
  var bubble = opts.bubble !== false && !!message;
  var size = opts.size || 80;
  var sparkle = mood === 'cheer';

  var html = '<div style="width:100%;display:flex;align-items:flex-end;justify-content:flex-end;gap:4px;font-family:\'Be Vietnam Pro\',sans-serif;color:#111827">';

  if (bubble) {
    var lift = Math.round(size * 0.45);
    html += '<div data-mascot-bubble style="position:relative;max-width:214px;margin-bottom:' + lift + 'px;background:#FFFFFF;border:1px solid #F3D3BF;border-radius:16px 16px 4px 16px;padding:9px 34px 10px 12px;box-shadow:0 8px 24px rgba(17,24,39,0.14)">';
    html += '<div style="display:flex;align-items:center;gap:6px"><span style="font-size:11px;font-weight:700;color:#C2410C;letter-spacing:0.02em">Thầy Phúc</span></div>';
    html += '<div style="font-size:14px;line-height:1.45;margin-top:2px">' + message + '</div>';
    html += '<button type="button" aria-label="Ẩn lời nhắc" onclick="this.closest(\'[data-mascot-bubble]\').style.display=\'none\'" style="position:absolute;top:4px;right:4px;width:30px;height:30px;border:0;border-radius:999px;background:transparent;padding:0;display:flex;align-items:center;justify-content:center;cursor:pointer">';
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>';
    html += '</div>';
  }

  html += '<div style="width:' + size + 'px;height:' + size + 'px;position:relative;flex-shrink:0">';
  html += '<img src="teacher.png" alt="Thầy Phúc" style="width:100%;height:100%;border-radius:999px;object-fit:cover;border:2px solid #FFFFFF;box-shadow:0 6px 14px rgba(17,24,39,0.18);display:block">';
  if (sparkle) {
    html += '<span aria-hidden="true" style="position:absolute;top:-6px;right:-6px;font-size:' + Math.round(size * 0.32) + 'px">✨</span>';
  }
  html += '</div></div>';

  container.innerHTML = html;
}
