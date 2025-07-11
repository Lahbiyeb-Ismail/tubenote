import Image from "next/image";

import { learningScenarios } from "../data";

export function UserLearningScenarios() {
  return (
    <div className="mb-16">
      <h3 className="text-3xl font-bold text-text-primary text-center mb-12">
        Sound Familiar?
      </h3>

      <div className="grid lg:grid-cols-3 gap-8">
        {learningScenarios.map(scenario => (
          <div
            key={scenario.title}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-250"
          >
            <div className="h-48 overflow-hidden">
              <Image
                src={scenario.image}
                alt={scenario.title}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h4 className="text-xl font-semibold text-text-primary mb-3">{scenario.title}</h4>
              <p className="text-text-secondary leading-relaxed">{scenario.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
