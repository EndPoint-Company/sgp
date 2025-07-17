import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, AlertTriangle } from "lucide-react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Input } from "../../components/ui/input";
import loginVector from "../../assets/img.jpg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (email === "ester@gmail.com") {
        navigate("/psychologist/home");
      } else {
        navigate("/student/home");
      }
    } catch (error: any) {
      const errorMessage = "Email ou senha inválidos. Tente novamente.";
      setError(errorMessage);

      setTimeout(() => {
        setError(null);
      }, 4000);

      console.error("Erro no login:", error);
    }
  };

  return (
    <AuthLayout
      imageUrl={loginVector}
      imageAlt="Ilustração de login"
      imagePosition="right"
    >
      {error && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-red-100 text-red-800 p-4 rounded-lg shadow-lg">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <h2 className="text-3xl font-bold text-gray-900">Entre na sua conta</h2>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Entrar
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Não possui uma conta?{" "}
        <Link
          to="/register"
          className="font-medium text-blue-600 hover:underline"
        >
          Se cadastrar
        </Link>
      </p>
    </AuthLayout>
  );
}
