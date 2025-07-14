import { userPainPoints } from "../data";

export function UserPainPointsGrid() {
  return (
    <div
      className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
    >
      {userPainPoints.map((point, index) => (
        <div
          key={index}
          className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-250"
        >
          <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <point.icon size={32} color="#EF4444" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-3">{point.title}</h3>
          <p className="text-text-secondary">{point.description}</p>
        </div>
      ))}
    </div>
  );
}
