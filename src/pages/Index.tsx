import { AuthForm } from '@/components/AuthForm';
import { Dashboard } from '@/pages/Dashboard';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, isLoading, isAuthenticated, login, signup, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center animate-pulse">
            <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm onLogin={login} onSignup={signup} />;
  }

  return <Dashboard userName={user?.name || 'User'} onLogout={logout} />;
};

export default Index;
