"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Service } from "@/lib/services";
import { X, Copy, Mail } from "lucide-react";
import { CONTACT } from "@/lib/services";

function copy(text: string) {
  if (typeof navigator === "undefined") return;
  navigator.clipboard.writeText(text).catch(() => {});
}

export function ServiceModal({
  service,
  open,
  onClose,
}: {
  service: Service | null;
  open: boolean;
  onClose: () => void;
}) {
  const tgUser = (CONTACT.telegram || "").replace(/^@/, "").trim();
  const telegramHref = tgUser ? `https://t.me/${tgUser}` : "https://t.me/";
  const emailHref = `mailto:${CONTACT.email}`;

  // ===== Responsive: phone vs desktop (только для поведения модалки)
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 520px)");
    const apply = () => setIsPhone(mql.matches);
    apply();
    mql.addEventListener?.("change", apply);
    return () => mql.removeEventListener?.("change", apply);
  }, []);

  // ===== Lock body scroll when modal open (чтобы не было ощущения “прилипла”/странного скролла)
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    // компенсация прыжка скроллбара на ПК
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  const backdropStyle: React.CSSProperties = {
    // ПК: центр (не “магнит” вниз)
    // Телефон: снизу как bottom-sheet
    alignItems: isPhone ? "flex-end" : "center",
    padding: isPhone ? 12 : 18,
  };

  const modalStyle: React.CSSProperties = {
    // чтобы не занимала весь экран и нормально скроллилась
    width: isPhone ? "100%" : undefined,
    maxHeight: isPhone ? "82vh" : "calc(100vh - 64px)",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    overscrollBehavior: "contain",
    // чуть более “sheet” ощущение на телефоне
    borderRadius: isPhone ? "22px 22px 16px 16px" : undefined,
  };

  const modalMotion = isPhone
    ? {
        initial: { y: 26, opacity: 0, scale: 1 },
        animate: { y: 0, opacity: 1, scale: 1 },
        exit: { y: 26, opacity: 0, scale: 1 },
      }
    : {
        initial: { y: 18, opacity: 0, scale: 0.98 },
        animate: { y: 0, opacity: 1, scale: 1 },
        exit: { y: 18, opacity: 0, scale: 0.98 },
      };

  return (
    <AnimatePresence>
      {open && service ? (
        <motion.div
          className="backdrop"
          style={backdropStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="modal"
            style={modalStyle}
            role="dialog"
            aria-modal="true"
            initial={modalMotion.initial}
            animate={modalMotion.animate}
            exit={modalMotion.exit}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <div className="modalHeader">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div className="iconWrap" aria-hidden>
                  <service.Icon size={20} />
                </div>
                <div>
                  <h3 className="modalTitle">{service.title}</h3>
                  <p className="modalSub">{service.short}</p>
                </div>
              </div>

              <button className="btn" onClick={onClose} aria-label="Закрыть">
                <X size={16} />
                Закрыть
              </button>
            </div>

            <div className="modalBody">
              <div className="panel">
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <span className="badge" style={{ background: "rgba(255,255,255,.04)" }}>
                    Цена: <strong style={{ color: "var(--text)" }}>{service.price}</strong>
                  </span>
                  <span className="badge"> {service.delivery} </span>
                  <span className="badge"> {service.support} </span>
                </div>

                <div className="hr" />

                <div className="sectionTitle">Что входит</div>
                <ul className="list">
                  {service.includes.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>

                <div className="hr" />

                <div className="sectionTitle">Подойдёт для</div>
                <ul className="list">
                  {service.goodFor.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>

              <div className="panel">
                <div className="sectionTitle">Контакты</div>
                <div className="small">Кнопки связи ниже — просто нажми на них.</div>

                <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                  <a
                    className="btn btnPrimary"
                    href={telegramHref}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => copy(CONTACT.telegram)}
                  >
                    <Copy size={16} />
                    Telegram: <strong style={{ marginLeft: 4 }}>{CONTACT.telegram}</strong>
                  </a>

                  <a className="btn" href={emailHref} onClick={() => copy(CONTACT.email)}>
                    <Mail size={16} />
                    Email: <strong style={{ marginLeft: 4 }}>{CONTACT.email}</strong>
                  </a>
                </div>

                <div className="hr" />

                <div className="sectionTitle">Технологии</div>
                <ul className="list">
                  {service.stack.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>

                <div className="hr" />

                <div className="sectionTitle">Как работаем</div>
                <ul className="list">
                  <li>Ты кидаешь пример таблицы/письма/сценария и что должно получиться.</li>
                  <li>Я делаю MVP и показываю демо (скрин/видео/доступ).</li>
                  <li>Довожу до результата и отдаю инструкцию.</li>
                </ul>

                <div style={{ marginTop: 12 }} className="small">
                  * Указанная цена — за типовой объём. Если нужно несколько таблиц/систем/сложные интеграции — обсудим,
                  но без сюрпризов.
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
