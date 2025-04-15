
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Chyba při získávání session:", sessionError);
          setError(sessionError.message);
          toast({
            title: "Chyba přihlášení",
            description: sessionError.message,
            variant: "destructive"
          });
          return;
        }
        
        // Dáme malou prodlevu pro zajištění správného nastavení session
        setTimeout(() => {
          navigate("/");
        }, 500);
      } catch (err: any) {
        console.error("Neočekávaná chyba:", err);
        setError(err.message || "Došlo k neočekávané chybě");
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-md bg-white p-8 shadow-md max-w-md w-full">
        {error ? (
          <>
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Chyba přihlášení</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4 flex justify-center">
              <Button onClick={() => navigate("/auth")}>
                Zpět na přihlášení
              </Button>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Příčiny této chyby mohou být:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Nesprávná konfigurace Google OAuth v Supabase</li>
                <li>Dočasné problémy s připojením k autentizačním serverům</li>
                <li>Vypršení nebo neplatnost přihlašovacích údajů</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="text-center">
            <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-upkeep-600" />
            <p>Dokončujeme přihlášení, prosím čekejte...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
