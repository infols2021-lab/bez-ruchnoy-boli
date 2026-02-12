import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Без ручной боли — автоматизация • боты • AI",
  description: "Автоматизация Google Таблиц, Apps Script и Telegram-боты под задачи: заявки, рассылки, парсинг, отчёты, тесты и админки.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        {/* ✅ Стартовый лоадер, чтобы не было “пусто → внезапно появилось” */}
        <div id="app-preloader" aria-hidden="true">
          <div className="apl-card">
            <div className="apl-dot" />
            <div className="apl-text">
              <div className="apl-title">Загружаю страницу…</div>
              <div className="apl-sub">секундочку</div>
            </div>
            <div className="apl-bar" />
          </div>
        </div>

        {/* Дети */}
        {children}

        {/* ✅ Убираем прелоадер, когда страница готова */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  var el = document.getElementById('app-preloader');
  if(!el) return;

  var done = false;
  function hide(){
    if(done) return;
    done = true;
    el.classList.add('apl-hide');
    setTimeout(function(){ try{ el.remove(); }catch(e){} }, 250);
  }

  // 1) Минимальная задержка — чтобы не мигало на быстрых сетях
  var minDelay = setTimeout(function(){ /* allow */ }, 420);

  // 2) Спрячем при готовности
  function ready(){
    clearTimeout(minDelay);
    hide();
  }

  if(document.readyState === 'complete'){
    ready();
  } else {
    window.addEventListener('load', ready, { once: true });
    // страховка: если load долго/не случился
    setTimeout(ready, 2500);
  }
})();
`,
          }}
        />

        {/* ✅ Стили прелоадера (встроено тут, чтобы появилось моментально даже при медленном CSS) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
#app-preloader{
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background:
    radial-gradient(900px 700px at 18% 12%, rgba(103,232,249,.40), transparent 62%),
    radial-gradient(900px 700px at 88% 18%, rgba(167,139,250,.28), transparent 62%),
    radial-gradient(900px 700px at 30% 90%, rgba(34,211,238,.18), transparent 62%),
    linear-gradient(180deg, #F4F7FF, #EAF1FF);
}

.apl-card{
  width: min(520px, calc(100vw - 28px));
  border-radius: 18px;
  border: 1px solid rgba(10,18,34,.14);
  background: rgba(255,255,255,.92);
  box-shadow: 0 18px 50px rgba(10,18,34,.12);
  padding: 16px 16px 14px;
  position: relative;
  overflow: hidden;
}

.apl-dot{
  width: 10px; height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(34,211,238,1), rgba(167,139,250,1));
  box-shadow: 0 10px 22px rgba(34,211,238,.22);
  margin-bottom: 10px;
}

.apl-text{ display: grid; gap: 4px; }
.apl-title{
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  font-weight: 900;
  letter-spacing: -0.2px;
  color: #0A1222;
  font-size: 16px;
}
.apl-sub{
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  font-weight: 600;
  color: rgba(10,18,34,.65);
  font-size: 13px;
}

.apl-bar{
  margin-top: 12px;
  height: 10px;
  border-radius: 999px;
  background: rgba(10,18,34,.08);
  overflow: hidden;
  position: relative;
}

.apl-bar::before{
  content:"";
  position: absolute;
  inset: 0;
  width: 38%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(34,211,238,.65), rgba(167,139,250,.60));
  transform: translateX(-120%);
  animation: aplMove 1.05s ease-in-out infinite;
}

@keyframes aplMove{
  0%{ transform: translateX(-120%); opacity: .55; }
  50%{ transform: translateX(220%); opacity: 1; }
  100%{ transform: translateX(220%); opacity: .55; }
}

#app-preloader.apl-hide{
  animation: aplFade .22s ease-out forwards;
}

@keyframes aplFade{
  to{ opacity: 0; transform: scale(0.985); }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce){
  .apl-bar::before{ animation: none; transform: translateX(30%); }
  #app-preloader.apl-hide{ animation: none; opacity: 0; }
}
`,
          }}
        />
      </body>
    </html>
  );
}
