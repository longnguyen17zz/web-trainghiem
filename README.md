# Web trải nghiệm 3 phương pháp — PPS Vietnam

Site tĩnh (HTML/CSS/JS thuần, không phụ thuộc Claude) mô phỏng lại toàn bộ 14 màn hình
trải nghiệm "3 phương pháp học tiếng Anh" cho khoá học của thầy Phúc. Không cần build
step nào — chỉ là các file `.html` tĩnh + 2 ảnh + 1 file JS/CSS nhỏ dùng chung.

## Cấu trúc

- `index.html` — Trang chủ (bản sao của `Home.html`, Vercel sẽ tự phục vụ ở `/`)
- `M1Setup.html`, `M1Sentence.html`, `M1Arrange.html`, `M1Practice.html` — Phương pháp 1 (Ghép câu từ vựng)
- `M2Writing.html`, `M2Result.html` — Phương pháp 2 (Chấm writing)
- `M3Mindmap.html`, `M3Chat.html`, `M3Voice.html`, `M3Summary.html` — Phương pháp 3 (Phát triển ý)
- `LeadSheet.html`, `ThankYou.html` — Form xin thông tin liên hệ & trang cảm ơn
- `mascot.js`, `style.css` — logic/stylesheet dùng chung (linh vật "Bé Pi"/thầy Phúc, animation keyframes)
- `logo.png`, `teacher.png` — 2 ảnh dùng chung (logo PPS Vietnam, ảnh thầy Phúc)

Một số tương tác (chọn từ, chấm bài giả lập, mic giọng nói, nối từ, sắp xếp câu…) đã được
viết lại bằng JavaScript thuần để vẫn bấm được khi deploy độc lập — không có chấm AI thật
phía sau, đây vẫn là bản demo UI/lead-gen như thiết kế gốc.

## Deploy lên Vercel qua GitHub

1. Tạo repo mới trên GitHub (trống, không cần README/.gitignore).
2. Trong thư mục này, chạy:
   ```
   git remote add origin <URL_REPO_GITHUB_CUA_BAN>
   git branch -M main
   git push -u origin main
   ```
3. Vào https://vercel.com/new, chọn **Import Git Repository**, chọn repo vừa push.
4. Vercel tự nhận đây là static site (không có `package.json`/framework) — để nguyên
   mặc định (Framework Preset: *Other*, Build Command: trống, Output Directory: `.`),
   bấm **Deploy**.
5. Sau khi deploy xong, Vercel cho một URL dạng `ten-repo.vercel.app` — có thể đổi domain
   riêng trong tab **Settings → Domains** của project đó.

Domain Vercel không gắn tên Claude/claude.ai ở đâu cả — phù hợp để gửi cho người khác xem
mà không lộ việc dùng Claude để dựng UI.
