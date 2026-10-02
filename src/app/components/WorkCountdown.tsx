import { useState, useEffect, useRef } from "react";
import { Settings, Clock, Heart, Sparkles } from "lucide-react";
import { BowTie20Regular, BowTie20Filled } from "@fluentui/react-icons";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const STORAGE_KEYS = {
  START_TIME: "workCountdown_startTime",
  WORK_HOURS: "workCountdown_workHours",
  IS_CLOCKED_IN: "workCountdown_isClockedIn",
};

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + (m || 0);
}

function formatCountdown(totalSeconds: number) {
  const abs = Math.max(0, totalSeconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

function getCurrentTimeStr(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function computeSecondsLeft(start: string, hours: number): number {
  const now = new Date();
  const startMinutes = parseTimeToMinutes(start);
  const endMinutes = startMinutes + hours * 60;
  const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  return endMinutes * 60 - nowSeconds;
}

export function WorkCountdown() {
  const [startTime, setStartTime] = useState(
    () => localStorage.getItem(STORAGE_KEYS.START_TIME) || "08:30"
  );
  const [workHours, setWorkHours] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORK_HOURS);
    return saved ? parseFloat(saved) : 9;
  });
  const [isClockedIn, setIsClockedIn] = useState(
    () => localStorage.getItem(STORAGE_KEYS.IS_CLOCKED_IN) === "true"
  );
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isClockedIn) return;

    setSecondsLeft(computeSecondsLeft(startTime, workHours));
    intervalRef.current = setInterval(() => {
      setSecondsLeft(computeSecondsLeft(startTime, workHours));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTime, workHours, isClockedIn]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.START_TIME, startTime);
  }, [startTime]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORK_HOURS, workHours.toString());
  }, [workHours]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_CLOCKED_IN, String(isClockedIn));
  }, [isClockedIn]);

  const handleClockIn = () => {
    const now = getCurrentTimeStr();
    localStorage.setItem(STORAGE_KEYS.START_TIME, now);
    localStorage.setItem(STORAGE_KEYS.IS_CLOCKED_IN, "true");
    setStartTime(now);
    setIsClockedIn(true);
  };

  const handleClockOut = () => {
    localStorage.setItem(STORAGE_KEYS.IS_CLOCKED_IN, "false");
    setIsClockedIn(false);
  };

  const handleSaveSettings = (newStart: string, newHours: number) => {
    setStartTime(newStart);
    setWorkHours(newHours);
    setSettingsOpen(false);
  };

  const isDone = isClockedIn && secondsLeft <= 0;
  const countdown = formatCountdown(secondsLeft);

  const endTimeStr = (() => {
    const startMins = parseTimeToMinutes(startTime);
    const endMins = startMins + workHours * 60;
    return `${String(Math.floor(endMins / 60) % 24).padStart(2, "0")}:${String(endMins % 60).padStart(2, "0")}`;
  })();

  const totalWorkSeconds = workHours * 3600;
  const progressPct = isClockedIn
    ? Math.min(100, Math.max(0, ((totalWorkSeconds - secondsLeft) / totalWorkSeconds) * 100))
    : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 p-4 pb-28 relative overflow-hidden">
      {/* Scattered decorations */}
      <div className="absolute top-8 left-8 opacity-30">
        <BowTie20Filled className="w-16 h-16 text-pink-400" />
      </div>
      <div className="absolute top-20 right-16 opacity-40">
        <Heart className="w-12 h-12 text-rose-400 fill-rose-400" />
      </div>
      <div className="absolute bottom-24 left-20 opacity-35">
        <BowTie20Regular className="w-14 h-14 text-pink-400" />
      </div>
      <div className="absolute bottom-32 right-12 opacity-30">
        <Heart className="w-10 h-10 text-rose-300" />
      </div>
      <div className="absolute top-1/2 left-12 opacity-25">
        <BowTie20Filled className="w-10 h-10 text-pink-300" />
      </div>
      <div className="absolute top-1/3 right-20 opacity-25">
        <Heart className="w-12 h-12 text-rose-300 fill-rose-300" />
      </div>
      <div className="absolute top-2/3 left-16 opacity-25">
        <BowTie20Filled className="w-12 h-12 text-rose-400" />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300 relative">
          <div className="absolute -top-3 -right-3">
            <BowTie20Filled className="w-12 h-12 text-pink-500" />
          </div>
          <div className="absolute -top-3 -left-3">
            <BowTie20Filled className="w-12 h-12 text-rose-500" />
          </div>

          {/* Header */}
          <div className="text-center mb-8 relative">
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 text-pink-400 hover:text-pink-600 hover:bg-pink-50 rounded-full"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-4 border-pink-300 rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-pink-600 flex items-center justify-center gap-2">
                    <BowTie20Regular className="w-6 h-6 text-pink-500" />
                    設定
                    <BowTie20Regular className="w-6 h-6 text-pink-500" />
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-sm text-pink-400">
                  手動調整上班時間和工時
                </DialogDescription>
                <WorkSettingsForm
                  startTime={startTime}
                  workHours={workHours}
                  onSave={handleSaveSettings}
                />
              </DialogContent>
            </Dialog>

            <h1 className="text-4xl font-bold text-pink-600 mb-2 flex items-center justify-center gap-2">
              <BowTie20Regular className="w-8 h-8 text-pink-500" />
              下班倒數
              <BowTie20Regular className="w-8 h-8 text-pink-500" />
            </h1>
            <p className="text-pink-400 text-sm flex items-center justify-center gap-1">
              <Clock className="w-4 h-4" />
              {isClockedIn
                ? `${startTime} 上班 · ${workHours}h · ${endTimeStr} 下班`
                : `預設 ${startTime} · ${workHours}h`}
            </p>
          </div>

          {/* Main display */}
          <AnimatePresence mode="wait">
            {!isClockedIn ? (
              /* Not clocked in */
              <motion.div
                key="not-clocked"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gradient-to-br from-pink-200 to-rose-200 rounded-2xl p-10 text-center relative overflow-hidden mb-6">
                  <div className="absolute top-2 right-2 w-12 h-12 bg-white/30 rounded-full" />
                  <div className="absolute bottom-2 left-2 w-8 h-8 bg-white/30 rounded-full" />
                  <div className="absolute top-4 left-4">
                    <BowTie20Filled className="w-6 h-6 text-white/40" />
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Heart className="w-8 h-8 text-white/30 fill-white/30" />
                  </div>
                  <div className="text-5xl mb-3">🌸</div>
                  <div className="text-pink-600 font-bold text-xl mb-1">還沒上班喔～</div>
                  <div className="text-pink-500 text-sm">按下「上班QQ」開始倒數</div>
                </div>

                <Button
                  onClick={handleClockIn}
                  className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white py-6 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  上班QQ
                </Button>
              </motion.div>
            ) : (
              /* Clocked in */
              <motion.div
                key="clocked-in"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Countdown display */}
                <div className="relative mb-6">
                  <div className="bg-gradient-to-br from-pink-200 to-rose-200 rounded-2xl p-8 text-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 w-12 h-12 bg-white/30 rounded-full" />
                    <div className="absolute bottom-2 left-2 w-8 h-8 bg-white/30 rounded-full" />
                    <div className="absolute top-4 left-4">
                      <BowTie20Filled className="w-6 h-6 text-white/40" />
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Heart className="w-8 h-8 text-white/30 fill-white/30" />
                    </div>

                    {isDone ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="relative z-10"
                      >
                        <div className="text-5xl font-bold text-pink-600 mb-2">🎉 下班囉！</div>
                        <div className="text-pink-500 text-lg">今天辛苦了！</div>
                      </motion.div>
                    ) : (
                      <div className="relative z-10">
                        <div className="text-xs text-pink-500 mb-3 font-medium tracking-widest uppercase">
                          距離下班還有
                        </div>
                        <div className="flex items-end justify-center gap-1 mb-2">
                          <div className="text-center">
                            <div className="text-6xl font-bold text-pink-600 tabular-nums leading-none">
                              {countdown.h}
                            </div>
                            <div className="text-xs text-pink-400 mt-1">時</div>
                          </div>
                          <div className="text-5xl font-bold text-pink-400 mb-1 leading-none">:</div>
                          <div className="text-center">
                            <div className="text-6xl font-bold text-pink-600 tabular-nums leading-none">
                              {countdown.m}
                            </div>
                            <div className="text-xs text-pink-400 mt-1">分</div>
                          </div>
                          <div className="text-5xl font-bold text-pink-400 mb-1 leading-none">:</div>
                          <div className="text-center">
                            <div className="text-6xl font-bold text-pink-600 tabular-nums leading-none">
                              {countdown.s}
                            </div>
                            <div className="text-xs text-pink-400 mt-1">秒</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-pink-600 font-medium flex items-center gap-1">
                      <BowTie20Regular className="w-4 h-4 text-pink-400" />
                      今日工作進度
                    </span>
                    <span className="text-sm text-pink-600 font-medium">
                      {Math.round(progressPct)}%
                    </span>
                  </div>
                  <div className="h-3 bg-pink-100 rounded-full overflow-hidden border border-pink-200">
                    <motion.div
                      className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Cute message */}
                <div className="mb-6 bg-pink-50 rounded-2xl p-4 border-2 border-pink-200 text-center">
                  {isDone && <p className="text-pink-500 text-sm">💖 今天辛苦了，好好休息吧！</p>}
                  {!isDone && progressPct < 25 && <p className="text-pink-500 text-sm">🌸 新的一天，加油喔！</p>}
                  {!isDone && progressPct >= 25 && progressPct < 50 && <p className="text-pink-500 text-sm">💪 繼續努力！快到一半了！</p>}
                  {!isDone && progressPct >= 50 && progressPct < 75 && <p className="text-pink-500 text-sm">⭐ 超過一半了，再撐一下！</p>}
                  {!isDone && progressPct >= 75 && <p className="text-pink-500 text-sm">🎀 快下班了！堅持住！</p>}
                </div>

                {/* Clock out button */}
                <Button
                  onClick={handleClockOut}
                  className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white py-6 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  <Sparkles className="w-6 h-6 mr-2" />
                  下班
                  <Sparkles className="w-6 h-6 ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom corner bow ties */}
          <div className="absolute -bottom-3 -right-3">
            <BowTie20Filled className="w-12 h-12 text-rose-500" />
          </div>
          <div className="absolute -bottom-3 -left-3">
            <BowTie20Filled className="w-12 h-12 text-pink-500" />
          </div>
          <div className="absolute top-1/2 -right-2">
            <Heart className="w-6 h-6 text-pink-300 fill-pink-300 opacity-40" />
          </div>
          <div className="absolute top-1/2 -left-2">
            <Heart className="w-6 h-6 text-rose-300 fill-rose-300 opacity-40" />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center flex items-center justify-center gap-2">
          <BowTie20Filled className="w-5 h-5 text-pink-500" />
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          <p className="text-pink-400 text-xs">每天都要平平安安下班喔</p>
          <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
          <BowTie20Filled className="w-5 h-5 text-rose-500" />
        </div>
      </motion.div>
    </div>
  );
}

function WorkSettingsForm({
  startTime,
  workHours,
  onSave,
}: {
  startTime: string;
  workHours: number;
  onSave: (newStart: string, newHours: number) => void;
}) {
  const [newStart, setNewStart] = useState(startTime);
  const [newHours, setNewHours] = useState(workHours);

  useEffect(() => {
    setNewStart(startTime);
    setNewHours(workHours);
  }, [startTime, workHours]);

  const endTimeStr = (() => {
    const startMins = parseTimeToMinutes(newStart);
    const endMins = startMins + newHours * 60;
    return `${String(Math.floor(endMins / 60) % 24).padStart(2, "0")}:${String(endMins % 60).padStart(2, "0")}`;
  })();

  return (
    <div className="space-y-6 py-4">
      <div>
        <Label htmlFor="startTime" className="text-pink-600 font-medium">
          上班時間
        </Label>
        <Input
          id="startTime"
          type="time"
          value={newStart}
          onChange={(e) => setNewStart(e.target.value)}
          className="mt-2 border-2 border-pink-200 focus:border-pink-400 rounded-xl"
        />
      </div>
      <div>
        <Label htmlFor="workHours" className="text-pink-600 font-medium">
          上班時數 (小時)
        </Label>
        <Input
          id="workHours"
          type="number"
          step="0.5"
          min="1"
          max="24"
          value={newHours}
          onChange={(e) => setNewHours(parseFloat(e.target.value) || 9)}
          className="mt-2 border-2 border-pink-200 focus:border-pink-400 rounded-xl"
        />
      </div>
      <div className="bg-pink-50 rounded-xl p-4 border-2 border-pink-200">
        <p className="text-sm text-pink-600 text-center">
          💡 下班時間：<span className="font-bold text-lg">{endTimeStr}</span>
        </p>
      </div>
      <Button
        onClick={() => onSave(newStart, newHours)}
        className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl"
      >
        完成
      </Button>
    </div>
  );
}
