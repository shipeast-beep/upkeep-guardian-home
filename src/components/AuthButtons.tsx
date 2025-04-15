
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { LogIn, LogOut, User } from "lucide-react";

export const AuthButtons = () => {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:block text-sm text-muted-foreground">
          {user.email}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut()}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Odhlásit se</span>
        </Button>
      </div>
    );
  }

  return (
    <Link to="/auth">
      <Button variant="outline" size="sm" className="gap-2">
        <LogIn className="h-4 w-4" />
        <span className="hidden md:inline">Přihlásit se</span>
      </Button>
    </Link>
  );
};
