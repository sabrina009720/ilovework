import { useState } from "react";
import { WaterCounter } from "./components/WaterCounter";
import { WorkCountdown } from "./components/WorkCountdown";
import { Droplet, Clock } from "lucide-react";
import { BowTie20Filled } from "@fluentui/react-icons";
import { motion } from "motion/react";

type Tab = "water" | "work";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("water");

  return (
    <div className="size-full relative">
      {activeTab === "water" ? <WaterCounter /> : <WorkCountdown />}

      {/* Tab bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white border-4 border-pink-300 rounded-full shadow-2xl px-2 py-2 flex items-center gap-1">
          <TabButton
            active={activeTab === "water"}
            onClick={() => setActiveTab("water")}
            icon={<Droplet className="w-5 h-5" />}
            label="喝水"
          />
          <div className="w-px h-6 bg-pink-200" />
          <TabButton
            active={activeTab === "work"}
            onClick={() => setActiveTab("work")}
            icon={<Clock className="w-5 h-5" />}
            label="下班"
          />
        </div>
        {/* Bow tie accents */}
        <div className="absolute -top-2 -left-3 pointer-events-none">
          <BowTie20Filled className="w-6 h-6 text-pink-400 opacity-70" />
        </div>
        <div className="absolute -top-2 -right-3 pointer-events-none">
          <BowTie20Filled className="w-6 h-6 text-rose-400 opacity-70" />
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="relative px-5 py-2.5 rounded-full transition-all duration-200 flex items-center gap-2 text-sm font-semibold"
    >
      {active && (
        <motion.div
          layoutId="tab-active"
          className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"
          transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
        />
      )}
      <span className={`relative z-10 ${active ? "text-white" : "text-pink-400"}`}>
        {icon}
      </span>
      <span className={`relative z-10 ${active ? "text-white" : "text-pink-500"}`}>
        {label}
      </span>
    </button>
  );
}