interface IProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function UserSettingsPanel({ title, description, children }: IProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      {children}
    </div>
  );
}
