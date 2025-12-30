"use client";

import BallPage from "./ball/page";
import PlanPage from "./plan/page";
function page() {
  return (
    <div className="w-full">
      <PlanPage />
      <BallPage />
    </div>
  );
}

export default page;
