interface IProps {
  activeView: "traditional" | "organized";
  setActiveView: (view: "traditional" | "organized") => void;
}

export function UserExperienceViewSelector({ activeView, setActiveView }: IProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-surface rounded-lg p-1 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveView("traditional")}
          className={`px-6 py-3 rounded-md font-semibold transition-all duration-250 ${
            activeView === "traditional" ? "bg-error text-white shadow-md" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Traditional Way
        </button>
        <button
          type="button"
          onClick={() => setActiveView("organized")}
          className={`px-6 py-3 rounded-md font-semibold transition-all duration-250 ${
            activeView === "organized" ? "bg-success text-white shadow-md" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Organized System
        </button>
      </div>
    </div>
  );
}
