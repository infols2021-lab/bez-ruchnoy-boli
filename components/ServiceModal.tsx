"use client";

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

  return (
    <AnimatePresence>
      {open && service ? (
        <motion.div
          className="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className="modal"
            role="dialog"
            aria-modal="true"
            initial={{ y: 18, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 18, opacity: 0, scale: 0.98 }}
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
