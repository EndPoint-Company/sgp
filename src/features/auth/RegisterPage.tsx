// src/features/auth/RegisterPage.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Input } from "../../components/ui/input";
import signUpVector from "../../assets/img.jpg";

// MUDANÇAS: Importações do Firebase
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../services/firebase"; 

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // MUDANÇA: A função agora é assíncrona para esperar o Firebase
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Limpa erros anteriores

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      // 1. Cria o usuário com email e senha
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Atualiza o perfil do usuário recém-criado para adicionar o nome
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      console.log("Usuário cadastrado com sucesso:", userCredential.user);
      
      // 3. Redireciona para a home do aluno após o sucesso
      navigate("/student/home");

    } catch (error: any) {
      // Trata erros comuns de cadastro
      if (error.code === 'auth/email-already-in-use') {
        setError("Este email já está em uso.");
      } else if (error.code === 'auth/weak-password') {
        setError("A senha é muito fraca. Use pelo menos 6 caracteres.");
      } else {
        setError("Ocorreu um erro ao criar a conta. Tente novamente.");
      }
      console.error("Erro no cadastro:", error);
    }
  };

  return (
    <AuthLayout
      imageUrl={signUpVector}
      imageAlt="Ilustração de cadastro"
      imagePosition="left"
    >
      <h2 className="text-3xl font-bold text-gray-900">Cadastre-se</h2>
      {/* Exibe a mensagem de erro, se houver */}
      {error && <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
      
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input
          icon={<User className="h-5 w-5 text-gray-400" />}
          type="text"
          placeholder="Digite seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          type="email"
          placeholder="Digite seu email institucional"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          type="password"
          placeholder="Crie uma senha (mín. 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Cadastrar
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Já possui uma conta?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
