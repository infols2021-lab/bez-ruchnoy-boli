"use client";

import { motion } from "framer-motion";
import type { Service } from "@/lib/services";

export function ServiceCard({
  service,
  onClick,
}: {
  service: Service;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="card"
      role="button"
      tabIndex={0}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" ? onClick() : null)}
    >
      <div className="cardTop">
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div className="iconWrap" aria-hidden>
            <service.Icon size={20} />
          </div>
          <div>
            <h3 className="cardTitle">{service.title}</h3>
            <p className="cardText">{service.short}</p>
          </div>
        </div>

        <div className="cardPrice">
          <div className="price">{service.price}</div>
          <div className="priceSub">{service.delivery}</div>
        </div>
      </div>

      <div className="badges">
        {service.highlights.slice(0, 2).map((b) => (
          <span key={b} className="badge">
            {b}
          </span>
        ))}
      </div>

      <div className="small" style={{ marginTop: 10 }}>
        {service.support}
      </div>
    </motion.div>
  );
}
