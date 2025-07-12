import { NavigateBackButton } from "@/shared/components";
import { withAuth } from "@/shared/HOC/with-auth";

interface IProps {
  children: React.ReactNode;
}

function Layout({ children }: IProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-8">
        <NavigateBackButton href="/dashboard" btnText="Back To Dashboard" />
        {children}
      </div>
    </div>
  );
}

export default withAuth(Layout);
