// src/features/auth/LoginPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Input } from "../../components/ui/input";
import loginVector from "../../assets/img.jpg";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      // 1. Tenta fazer o login com o Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);

      // 2. Redireciona para a página principal após o login
      navigate("/home"); 

    } catch (error: any) {
      // Trata erros comuns de login
      setError("Email ou senha inválidos. Por favor, tente novamente.");
      console.error("Erro no login:", error);
    }
  };

  return (
    <AuthLayout
      imageUrl={loginVector}
      imageAlt="Ilustração de login"
      imagePosition="right"
    >
      <h2 className="text-3xl font-bold text-gray-900">Entre na sua conta</h2>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* Seus Inputs permanecem os mesmos */}
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
        
        {/* O resto do seu formulário... */}
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
        <Link to="/register" className="font-medium text-blue-600 hover:underline">
          Se cadastrar
        </Link>
      </p>
    </AuthLayout>
  );
}