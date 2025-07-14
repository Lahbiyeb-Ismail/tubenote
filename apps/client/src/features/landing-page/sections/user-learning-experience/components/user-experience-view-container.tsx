import { useState } from "react";

import { UserExperienceView } from "./user-experience-view";
import { UserExperienceViewSelector } from "./user-experience-view-selector";

export function UserExperienceViewContainer() {
  const [activeView, setActiveView] = useState<"traditional" | "organized">("traditional");

  return (
    <div className="mb-20">
      <UserExperienceViewSelector activeView={activeView} setActiveView={setActiveView} />

      <div
        key={activeView}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {activeView === "traditional"
          ? (
              <UserExperienceView variant="traditional" />
            )
          : (
              <UserExperienceView variant="organized" />
            )}
      </div>
    </div>
  );
}
