"use client";

import { motion } from "framer-motion";
import { EXPERIENCE } from "@/lib/services";

export function Experience() {
  return (
    <div className="kpiRow">
      {EXPERIENCE.map((x, idx) => (
        <motion.div
          key={x.title}
          className="kpi"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ delay: idx * 0.05 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="iconWrap" aria-hidden>
              <x.Icon size={18} />
            </div>
            <div>
              <p className="kpiVal">{x.title}</p>
              <p className="kpiLbl">{x.text}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
