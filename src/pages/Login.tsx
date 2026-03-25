import { useAuth } from "@/src/hooks/useAuth";
import { Button } from "@/src/components/ui/button";
import { Baby } from "lucide-react";

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-pink-400 to-blue-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <Baby className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">SmartBaby</h1>
        <p className="text-slate-500 mb-8">Your intelligent baby monitoring companion</p>
        
        <Button 
          onClick={login} 
          size="lg" 
          className="w-full rounded-2xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm flex items-center gap-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
