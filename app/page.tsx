"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SERVICES, type Service, CONTACT } from "@/lib/services";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceModal } from "@/components/ServiceModal";
import { Experience } from "@/components/Experience";
import { Copy, Mail } from "lucide-react";

export default function Page() {
  const [selected, setSelected] = useState<Service | null>(null);

  const subtitle = useMemo(
    () =>
      "Автоматизация Google Таблиц, Apps Script и Telegram-боты под реальные процессы: заявки, рассылки, парсинг, отчёты, тесты и админки. " +
      "Делаю быстро: сначала рабочий MVP, потом - аккуратные правки.",
    []
  );

  const tgUser = (CONTACT.telegram || "").replace(/^@/, "").trim();
  const telegramHref = tgUser ? `https://t.me/${tgUser}` : "https://t.me/";
  const emailHref = `mailto:${CONTACT.email}`;

  return (
    <div className="container">
      <div className="nav">
        <div className="brand">
          <span className="brandDot" />
          Услуги: автоматизация • боты • AI
        </div>

        <div className="navRight">
          <a
            className="btn btnPrimary"
            href={telegramHref}
            target="_blank"
            rel="noreferrer"
            title="Открыть Telegram"
          >
            <Copy size={16} />
            Telegram
          </a>

          <a className="btn" href={emailHref} title="Написать на Email">
            <Mail size={16} />
            Email
          </a>
        </div>
      </div>

      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="hTitle">Сделаю скрипт или бота под вашу задачу</h1>
        <p className="hSub">{subtitle}</p>

        <div className="ctaRow">
          <div className="small">
            Опыт: автоматизация процессов около <strong>2 лет</strong>. Поддержка после сдачи -{" "}
            <strong>14 дней</strong>.
          </div>
        </div>

        <Experience />
      </motion.div>

      <div className="section" id="services">
        <h2 className="sectionTitle">Услуги и цены</h2>
        <div className="grid">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.id}
              className="col6"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.03 }}
            >
              <ServiceCard service={s} onClick={() => setSelected(s)} />
            </motion.div>
          ))}
        </div>

        <div className="small" style={{ marginTop: 12 }}>
          Нажмите на карточку - откроется подробное описание: что входит, сроки, для кого подходит и технологии.
        </div>
      </div>

      <ServiceModal service={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
