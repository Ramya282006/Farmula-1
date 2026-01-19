interface AuthGuardProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
}

export function AuthGuard({ children, onNavigate }: AuthGuardProps) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    onNavigate("farmer-login");
    return null;
  }

  return <>{children}</>;
}
