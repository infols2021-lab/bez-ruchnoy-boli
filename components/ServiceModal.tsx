"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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

  // Phone detection (stable, no first-render jump)
  const [isPhone, setIsPhone] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 520px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 520px)");
    const onChange = () => setIsPhone(mql.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  // Lock page scroll while modal open (prevents weird page dragging)
  useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  // ===== Mobile: avoid address-bar jumps (visualViewport)
  const [vvHeight, setVvHeight] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const vv = (window as any).visualViewport as VisualViewport | undefined;
    if (!vv) {
      setVvHeight(null);
      return;
    }

    const update = () => {
      // vv.height is the реально видимая высота (без адресной строки)
      setVvHeight(Math.round(vv.height));
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [open]);

  // Focus/scroll to top inside sheet on open (so header always visible)
  const bodyRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    // next tick to ensure it exists
    const t = setTimeout(() => {
      bodyRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }, 0);
    return () => clearTimeout(t);
  }, [open, service?.id]);

  const backdropStyle: React.CSSProperties = useMemo(() => {
    if (isPhone) {
      return {
        alignItems: "flex-end",
        padding: 0, // sheet упирается в края
      };
    }
    return {
      alignItems: "center",
      padding: 18,
    };
  }, [isPhone]);

  const modalStyle: React.CSSProperties = useMemo(() => {
    if (isPhone) {
      const visibleH = vvHeight ?? window?.innerHeight ?? 700;
      // Делаем “выдроченную” высоту: почти экран, но оставляем верхний воздух.
      const sheetMax = Math.max(420, Math.min(visibleH - 12, Math.round(visibleH * 0.92)));

      return {
        width: "100%",
        maxHeight: sheetMax,
        height: sheetMax, // фиксируем, чтобы не прыгало
        overflow: "hidden", // скролл будет внутри body
        borderRadius: "22px 22px 0 0",
        willChange: "transform",
        // чуть тени сильнее на мобилке, чтобы читалось как слой
        boxShadow: "0 30px 90px rgba(10,18,34,.22)",
      };
    }
    return {
      width: "min(960px, 100%)",
      maxHeight: "calc(100vh - 64px)",
      overflow: "hidden",
      willChange: "transform",
    };
  }, [isPhone, vvHeight]);

  // Animations: on phone = smooth bottom sheet, on desktop = popup
  const modalMotion = useMemo(() => {
    if (isPhone) {
      return {
        initial: { y: 40, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 40, opacity: 0 },
        transition: { type: "tween", duration: 0.18, ease: "easeOut" as const },
      };
    }
    return {
      initial: { y: 18, opacity: 0, scale: 0.98 },
      animate: { y: 0, opacity: 1, scale: 1 },
      exit: { y: 18, opacity: 0, scale: 0.98 },
      transition: { type: "spring", stiffness: 260, damping: 24 },
    };
  }, [isPhone]);

  // Prevent “rubber-band” scroll from pulling the page behind on mobile
  const stopOverscroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    // no-op but keeps type; overscroll controlled via CSS too
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
            transition={(modalMotion as any).transition}
          >
            {/* Sticky header on phone so it never disappears */}
            <div
              className="modalHeader"
              style={
                isPhone
                  ? {
                      position: "sticky",
                      top: 0,
                      zIndex: 5,
                      background: "rgba(255,255,255,.96)",
                      backdropFilter: "blur(10px)",
                    }
                  : undefined
              }
            >
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

            {/* Scrollable body */}
            <div
              ref={bodyRef}
              onScroll={stopOverscroll}
              style={{
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
                // высота = вся модалка минус header
                height: isPhone ? "calc(100% - 72px)" : "auto",
              }}
            >
              <div className="modalBody" style={isPhone ? { padding: 12 } : undefined}>
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
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
