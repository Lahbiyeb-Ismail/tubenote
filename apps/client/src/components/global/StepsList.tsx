import { howItWorksSteps } from "@/utils/constants";
import StepCard from "./StepCard";

function StepsList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
      {howItWorksSteps.map((step) => (
        <StepCard key={step.title} step={step} />
      ))}
    </div>
  );
}

export default StepsList;
