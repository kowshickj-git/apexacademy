import LessonNav from "@/components/lessons/voltage/LessonNav";
import LessonHeader from "@/components/lessons/voltage/LessonHeader";
import WhatIsVoltage from "@/components/lessons/voltage/WhatIsVoltage";
import WaterAnalogy from "@/components/lessons/voltage/WaterAnalogy";
import InteractiveDemo from "@/components/lessons/voltage/InteractiveDemo";
import CommonVoltages from "@/components/lessons/voltage/CommonVoltages";
import KeyPoints from "@/components/lessons/voltage/KeyPoints";
import Quiz from "@/components/lessons/voltage/Quiz";
import Summary from "@/components/lessons/voltage/Summary";

export default function VoltagePage() {
  return (
    <div className="min-h-screen bg-background">
      <LessonNav />
      <main className="pt-14 pb-24">
        <LessonHeader />
        <WhatIsVoltage />
        <WaterAnalogy />
        <InteractiveDemo />
        <CommonVoltages />
        <KeyPoints />
        <Quiz />
        <Summary />
      </main>
    </div>
  );
}
