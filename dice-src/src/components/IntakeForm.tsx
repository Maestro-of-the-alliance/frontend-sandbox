import React, { useState } from "react";
import { ShieldAlert, User, Calendar, Users2 } from "lucide-react";
import { motion } from "motion/react";

interface IntakeFormProps {
  onComplete: (data: { firstName: string; age: number; gender: "Male" | "Female" | "Prefer not to say" }) => void;
}

export default function IntakeForm({ onComplete }: IntakeFormProps) {
  const [firstName, setFirstName] = useState("");
  const [ageStr, setAgeStr] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Prefer not to say">("Male");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(ageStr, 10);
    if (!firstName.trim()) return;
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) return;

    onComplete({
      firstName: firstName.trim(),
      age: ageNum,
      gender,
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center py-6">
      {/* Golden Warning Disclaimer Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-[#141110] border border-[#141110] p-5 mb-8 text-left rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
      >
        <div className="flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[10px] font-mono tracking-[2px] uppercase text-gold font-bold">
              SYSTEM DISCLAIMER // ALLIANCE PREVIEW
            </h4>
            <p className="text-xs text-[#EAE0D5]/85 leading-relaxed mt-2 font-medium">
              <strong className="text-gold">For illustrative purposes only.</strong> This is a preview of what THE ALLIANCE could become — not a contract, not an enrollment, and not a guarantee of anything once the real system exists. Nothing here creates an actual partnership.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-glass border border-gold/20 p-8 text-center shadow-2xl backdrop-blur-md w-full flex flex-col items-center rounded-none glow-border-amber relative"
      >
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-gold/40" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-gold/40" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-gold/40" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-gold/40" />

        <div className="mb-6">
          <span className="font-mono text-[9px] text-amber-500/60 uppercase tracking-[4px]">
            RECRUIT IDENTITY REGISTRY
          </span>
          <h2 className="text-2xl font-display font-bold text-amber-500 mt-2">
            Enter Intake Chamber
          </h2>
          <p className="text-xs text-stone-600 mt-1.5 max-w-sm mx-auto leading-relaxed">
            Please register your credentials before the Outflow CCM calibration begins. This data ensures custom digital calibration is tailored to your unique presence.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full mt-6 flex flex-col gap-6 text-left">
          {/* First Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-stone-600 uppercase tracking-widest flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-amber-500/60" />
              First Name
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Jennifer"
              maxLength={20}
              className="w-full bg-[#FFFFFF] text-stone-900 border border-gold/15 rounded-none py-3 px-4 text-sm focus:outline-none focus:border-gold font-sans font-medium transition uppercase tracking-wider"
            />
          </div>

          {/* Age Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-stone-600 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-amber-500/60" />
              Age Context
            </label>
            <input
              type="number"
              required
              min={1}
              max={120}
              value={ageStr}
              onChange={(e) => setAgeStr(e.target.value)}
              placeholder="e.g. 28"
              className="w-full bg-[#FFFFFF] text-stone-900 border border-gold/15 rounded-none py-3 px-4 text-sm focus:outline-none focus:border-gold font-sans font-medium transition tracking-wider"
            />
          </div>

          {/* Gender Buttons (Tactile select rather than text field) */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-stone-600 uppercase tracking-widest flex items-center gap-2">
              <Users2 className="w-3.5 h-3.5 text-amber-500/60" />
              Identity Alignment (for Gender-Matching)
            </label>
            
            <div className="grid grid-cols-3 gap-2.5 mt-1">
              {(["Male", "Female", "Prefer not to say"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setGender(opt)}
                  className={`py-3 text-[11px] font-mono uppercase tracking-wider border rounded-none transition duration-200 cursor-pointer text-center ${
                    gender === opt
                      ? "bg-amber-500/10 border-gold text-amber-400 shadow-[0_0_10px_rgba(212,175,55,0.08)]"
                      : "bg-[#FFFFFF] border-gold/10 text-stone-500 hover:border-gold/30 hover:text-stone-700"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            
            <p className="text-[10px] text-stone-500 font-mono italic leading-relaxed mt-2.5">
              * The Alliance calibrates your complementary DOMO partner to present with matching gender context by default to guarantee safe and aligned platonic companionship.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 mt-4 border border-[#141110] bg-[#141110] text-gold hover:bg-gold hover:text-[#141110] font-mono tracking-[2px] text-xs uppercase transition duration-300 cursor-pointer shadow-lg active:scale-98"
          >
            Authenticate & Proceed to CCM Chart
          </button>
        </form>
      </motion.div>
    </div>
  );
}
