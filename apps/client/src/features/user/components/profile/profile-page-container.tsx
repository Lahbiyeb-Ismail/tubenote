interface IProps {
  children: React.ReactNode;
}

export function ProfilePageContainer({ children }: IProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-8">
        {children}
      </div>
    </div>
  );
}
