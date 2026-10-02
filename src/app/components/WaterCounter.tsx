import { useState, useEffect } from "react";
import { Droplet, RotateCcw, Sparkles, Settings, Plus, Heart } from "lucide-react";
import { BowTie20Regular, BowTie20Filled } from "@fluentui/react-icons";
import { motion } from "motion/react";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

// LocalStorage keys
const STORAGE_KEYS = {
  WATER_AMOUNT: 'waterCounter_waterAmount',
  DAILY_GOAL: 'waterCounter_dailyGoal',
  CUP_SIZE: 'waterCounter_cupSize',
  LAST_RESET_DATE: 'waterCounter_lastResetDate',
};

export function WaterCounter() {
  // Initialize state from localStorage
  const [waterAmount, setWaterAmount] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WATER_AMOUNT);
    return saved ? parseInt(saved) : 0;
  });
  
  const [dailyGoalCc, setDailyGoalCc] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAILY_GOAL);
    return saved ? parseInt(saved) : 2000;
  });
  
  const [cupSizeCc, setCupSizeCc] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUP_SIZE);
    return saved ? parseInt(saved) : 300;
  });

  const [manualInput, setManualInput] = useState("");
  const [showSparkle, setShowSparkle] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Check if we need to reset daily water amount
  useEffect(() => {
    const checkAndResetDaily = () => {
      const today = new Date().toDateString();
      const lastResetDate = localStorage.getItem(STORAGE_KEYS.LAST_RESET_DATE);
      
      if (lastResetDate !== today) {
        // New day, reset water amount
        setWaterAmount(0);
        localStorage.setItem(STORAGE_KEYS.LAST_RESET_DATE, today);
      }
    };
    
    checkAndResetDaily();
  }, []);

  // Save waterAmount to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATER_AMOUNT, waterAmount.toString());
  }, [waterAmount]);

  // Save dailyGoalCc to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAILY_GOAL, dailyGoalCc.toString());
  }, [dailyGoalCc]);

  // Save cupSizeCc to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUP_SIZE, cupSizeCc.toString());
  }, [cupSizeCc]);

  const cupsNeeded = Math.ceil(dailyGoalCc / cupSizeCc);
  const cupsConsumed = Math.floor(waterAmount / cupSizeCc);

  const handleAddCup = () => {
    setWaterAmount((prev) => Math.min(prev + cupSizeCc, dailyGoalCc));
    setShowSparkle(true);
    setTimeout(() => setShowSparkle(false), 1000);
  };

  const handleManualAdd = () => {
    const amount = parseInt(manualInput);
    if (amount && amount > 0) {
      setWaterAmount((prev) => Math.min(prev + amount, dailyGoalCc));
      setManualInput("");
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 1000);
    }
  };

  const handleReset = () => {
    setWaterAmount(0);
  };

  const handleSaveSettings = (newGoal: number, newCupSize: number) => {
    setDailyGoalCc(newGoal);
    setCupSizeCc(newCupSize);
    setSettingsOpen(false);
  };

  const progress = (waterAmount / dailyGoalCc) * 100;
  const isGoalReached = waterAmount >= dailyGoalCc;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 p-4 pb-28 relative overflow-hidden">
      {/* Decorative bow ties and hearts scattered around */}
      <div className="absolute top-8 left-8 opacity-30">
        <BowTie20Filled className="w-16 h-16 text-pink-400" />
      </div>
      <div className="absolute top-20 right-16 opacity-40">
        <Heart className="w-12 h-12 text-rose-400 fill-rose-400" />
      </div>
      <div className="absolute bottom-16 left-20 opacity-35">
        <BowTie20Regular className="w-14 h-14 text-pink-400" />
      </div>
      <div className="absolute bottom-24 right-12 opacity-30">
        <Heart className="w-10 h-10 text-rose-300" />
      </div>
      <div className="absolute top-1/2 left-12 opacity-25">
        <BowTie20Filled className="w-10 h-10 text-pink-300" />
      </div>
      <div className="absolute top-1/3 right-20 opacity-25">
        <Heart className="w-12 h-12 text-rose-300 fill-rose-300" />
      </div>
      <div className="absolute top-1/4 left-1/4 opacity-20">
        <BowTie20Regular className="w-8 h-8 text-pink-400" />
      </div>
      <div className="absolute bottom-1/3 right-1/4 opacity-30">
        <Heart className="w-14 h-14 text-pink-400" />
      </div>
      <div className="absolute top-2/3 left-16 opacity-25">
        <BowTie20Filled className="w-12 h-12 text-rose-400" />
      </div>
      <div className="absolute bottom-1/4 left-1/3 opacity-20">
        <Heart className="w-10 h-10 text-pink-300 fill-pink-300" />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300 relative">
          {/* Corner bow ties and hearts */}
          <div className="absolute -top-3 -right-3">
            <BowTie20Filled className="w-12 h-12 text-pink-500" />
          </div>
          <div className="absolute -top-3 -left-3">
            <BowTie20Filled className="w-12 h-12 text-rose-500" />
          </div>

          {/* Header with Settings */}
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
                  調整你的喝水目標和杯子容量
                </DialogDescription>
                <SettingsForm
                  dailyGoalCc={dailyGoalCc}
                  cupSizeCc={cupSizeCc}
                  onSave={handleSaveSettings}
                />
              </DialogContent>
            </Dialog>

            <motion.div
              animate={{ rotate: showSparkle ? [0, -10, 10, -10, 0] : 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <h1 className="text-4xl font-bold text-pink-600 mb-2 flex items-center justify-center gap-2">
                <BowTie20Regular className="w-8 h-8 text-pink-500" />
                喝水小幫手
                <BowTie20Regular className="w-8 h-8 text-pink-500" />
              </h1>
            </motion.div>
            <p className="text-pink-400 text-sm">Keep yourself hydrated! ✨</p>
          </div>

          {/* Water Counter Display */}
          <div className="relative mb-8">
            <div className="bg-gradient-to-br from-pink-200 to-rose-200 rounded-2xl p-8 text-center relative overflow-hidden">
              {/* Decorative circles and bow ties */}
              <div className="absolute top-2 right-2 w-12 h-12 bg-white/30 rounded-full"></div>
              <div className="absolute bottom-2 left-2 w-8 h-8 bg-white/30 rounded-full"></div>
              <div className="absolute top-4 left-4">
                <BowTie20Filled className="w-6 h-6 text-white/40" />
              </div>
              <div className="absolute bottom-4 right-4">
                <Heart className="w-8 h-8 text-white/30 fill-white/30" />
              </div>
              <div className="absolute top-1/2 right-2">
                <BowTie20Regular className="w-5 h-5 text-white/30" />
              </div>

              <motion.div
                key={waterAmount}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <div className="text-5xl font-bold text-pink-600 mb-2">
                  {waterAmount} cc
                </div>
                <div className="text-pink-500 text-lg">
                  / {dailyGoalCc} cc
                </div>
                <div className="text-pink-500 text-sm mt-2">
                  🥤 {cupsConsumed} / {cupsNeeded} 杯
                </div>
              </motion.div>

              {showSparkle && (
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sparkles className="w-16 h-16 text-yellow-400" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-pink-600 font-medium flex items-center gap-1">
                <BowTie20Regular className="w-4 h-4 text-pink-400" />
                今日進度
              </span>
              <span className="text-sm text-pink-600 font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Goal Status */}
          {isGoalReached && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-xl p-4 text-center relative"
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <BowTie20Regular className="w-8 h-8 text-yellow-300" />
              </div>
              <div className="text-2xl mb-1">🎉 恭喜！🎉</div>
              <div className="text-sm">你已經完成今天的喝水目標囉！</div>
            </motion.div>
          )}

          {/* Manual Input */}
          <div className="mb-4 bg-pink-50 rounded-2xl p-4 border-2 border-pink-200">
            <Label className="text-pink-600 font-medium mb-2 block flex items-center gap-2">
              <BowTie20Regular className="w-5 h-5 text-pink-400" />
              手動輸入喝水量 (cc)
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="輸入 cc 數"
                className="border-2 border-pink-200 focus:border-pink-400 rounded-xl"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleManualAdd();
                  }
                }}
              />
              <Button
                onClick={handleManualAdd}
                disabled={!manualInput || waterAmount >= dailyGoalCc}
                className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl px-6 disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleAddCup}
              disabled={waterAmount >= dailyGoalCc}
              className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white py-6 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Droplet className="w-6 h-6 mr-2" />
              喝了一杯水！({cupSizeCc}cc)
            </Button>

            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full border-2 border-pink-300 text-pink-600 hover:bg-pink-50 py-4 rounded-2xl font-medium"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              重新開始
            </Button>
          </div>

          {/* Cute Messages */}
          <div className="mt-8 text-center">
            {waterAmount === 0 && (
              <p className="text-pink-400 text-sm flex items-center justify-center gap-1">
                🌸 開始記錄你的喝水習慣吧！
              </p>
            )}
            {waterAmount > 0 && waterAmount < dailyGoalCc / 2 && (
              <p className="text-pink-400 text-sm">💪 繼續加油！保持喝水喔～</p>
            )}
            {waterAmount >= dailyGoalCc / 2 && waterAmount < dailyGoalCc && (
              <p className="text-pink-400 text-sm">
                ⭐ 太棒了！你已經完成一半了！
              </p>
            )}
            {isGoalReached && (
              <p className="text-pink-400 text-sm">
                💖 記得明天也要繼續保持喔！
              </p>
            )}
          </div>

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
          <p className="text-pink-400 text-xs">
            每天喝足夠的水，身體更健康
          </p>
          <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
          <BowTie20Filled className="w-5 h-5 text-rose-500" />
        </div>
      </motion.div>
    </div>
  );
}

// SettingsForm component
function SettingsForm({
  dailyGoalCc,
  cupSizeCc,
  onSave,
}: {
  dailyGoalCc: number;
  cupSizeCc: number;
  onSave: (newGoal: number, newCupSize: number) => void;
}) {
  const [newDailyGoalCc, setNewDailyGoalCc] = useState(dailyGoalCc);
  const [newCupSizeCc, setNewCupSizeCc] = useState(cupSizeCc);

  // Update local state when props change (when dialog opens)
  useEffect(() => {
    setNewDailyGoalCc(dailyGoalCc);
    setNewCupSizeCc(cupSizeCc);
  }, [dailyGoalCc, cupSizeCc]);

  const handleSave = () => {
    onSave(newDailyGoalCc, newCupSizeCc);
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <Label htmlFor="dailyGoal" className="text-pink-600 font-medium">
          每日目標喝水量 (cc)
        </Label>
        <Input
          id="dailyGoal"
          type="number"
          value={newDailyGoalCc}
          onChange={(e) => setNewDailyGoalCc(parseInt(e.target.value) || 2000)}
          className="mt-2 border-2 border-pink-200 focus:border-pink-400 rounded-xl"
        />
      </div>
      <div>
        <Label htmlFor="cupSize" className="text-pink-600 font-medium">
          容器容量 (cc)
        </Label>
        <Input
          id="cupSize"
          type="number"
          value={newCupSizeCc}
          onChange={(e) => setNewCupSizeCc(parseInt(e.target.value) || 250)}
          className="mt-2 border-2 border-pink-200 focus:border-pink-400 rounded-xl"
        />
      </div>
      <div className="bg-pink-50 rounded-xl p-4 border-2 border-pink-200">
        <p className="text-sm text-pink-600 text-center">
          💡 你需要喝 <span className="font-bold text-lg">{Math.ceil(newDailyGoalCc / newCupSizeCc)}</span> 杯
        </p>
      </div>
      <Button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl"
      >
        完成
      </Button>
    </div>
  );
}