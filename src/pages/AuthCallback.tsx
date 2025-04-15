
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Give a small delay to ensure session is properly set
      setTimeout(() => {
        navigate("/");
      }, 500);
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-md bg-white p-8 shadow-md">
        {error ? (
          <p className="text-destructive">Chyba: {error}</p>
        ) : (
          <p>Dokončování přihlášení, prosím čekejte...</p>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
