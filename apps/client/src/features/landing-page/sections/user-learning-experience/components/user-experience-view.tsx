import { organizedUserExperience, traditionalUserExperience } from "../data";

interface IProps {
  variant: "traditional" | "organized";
}

export function UserExperienceView({ variant }: IProps) {
  const userExperience = variant === "traditional" ? traditionalUserExperience : organizedUserExperience;

  return (
    <div className="grid lg:grid-cols-2">
      <div className={`p-8 lg:p-12 ${userExperience.bgImage}`}>
        <div className="flex items-center mb-6">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${userExperience.bgColor}`}>
            <userExperience.viewIcon size={24} color="white" />
          </div>
          <h3 className={`text-2xl font-bold  ${userExperience.textColor}`}>{userExperience.title}</h3>
        </div>

        <div className="space-y-4">
          {userExperience.checkList.map(item => (
            <div key={item} className="flex items-start space-x-3">
              <userExperience.checkListIcon size={20} color={userExperience.checkListIconColor} className="mt-1 flex-shrink-0" />
              <p className="text-text-secondary">{item}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={`p-8 lg:p-12 flex items-center justify-center ${userExperience.feedbackSection.bgColor}`}>
        <div className="text-center">
          <userExperience.feedbackSection.icon size={64} color={userExperience.feedbackSection.iconColor} className="mx-auto mb-4" />
          <p className={`font-medium ${userExperience.textColor}`}>{userExperience.feedbackSection.text}</p>
        </div>
      </div>
    </div>
  );
}
