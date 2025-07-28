import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { LoginForm } from "../../features/auth/components/LoginForm";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import loginVector from "../../assets/img.jpg";
import { useAuth } from "../../features/auth/hooks/useAuth";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { checkUserRole } = useAuth();

  const handleLoginSubmit = async (data: LoginFormData) => {
  setIsLoading(true);
  setError(null);
  console.log("Iniciando login...");

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    console.log("Login bem-sucedido:", userCredential.user.uid);

    const role = await checkUserRole(userCredential.user.uid);
    console.log("Role do usuário:", role);

    if (!role) {
      setError("Complete seu cadastro para continuar");
      navigate("/complete-profile", { replace: true });
      return;
    }

    navigate("/after-login", { replace: true }); // Alterado aqui!
  } catch (error: unknown) {
    console.error("Erro ao fazer login:", error);

    let errorMessage = "Erro ao fazer login";
    if (error instanceof Error && "code" in error) {
      const firebaseError = error as { code: string };

      switch (firebaseError.code) {
        case "auth/invalid-email":
          errorMessage = "Email inválido";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Email ou senha incorretos";
          break;
        case "auth/too-many-requests":
          errorMessage = "Muitas tentativas. Tente mais tarde";
          break;
      }
    }

    setError(errorMessage);
  } finally {
    setIsLoading(false);
    console.log("Finalizou login");
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
      <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />

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
