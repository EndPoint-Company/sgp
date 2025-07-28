import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from "../../layouts/AuthLayout";
import { RegisterForm } from '../../features/auth/components/RegisterForm';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from "../../services/firebase"; // Certifique-se de exportar 'db' do seu ficheiro firebase
import { doc, setDoc } from "firebase/firestore"; 
import signUpVector from '../../assets/img.jpg';
import { AlertTriangle } from 'lucide-react';

// Define a forma dos dados do formulário
type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Cria o utilizador no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // 2. Atualiza o perfil do utilizador no Auth (adiciona o nome de exibição)
      await updateProfile(user, {
        displayName: data.name,
      });
      
      // 3. Guarda os dados adicionais do utilizador (como o perfil) no Firestore
      // Esta etapa é crucial para a sua lógica de perfis (aluno/psicólogo)
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        name: data.name,
        email: data.email,
        role: 'student', // Define o perfil padrão para novos registos
        createdAt: new Date(),
      });
      
      console.log('Utilizador criado e dados guardados:', user.uid);
      navigate('/login'); // Redireciona para o login após o sucesso
    } catch (err: unknown) {
      let errorMessage = 'Ocorreu um erro ao criar a conta.';
      if (typeof err === 'object' && err !== null && 'code' in err) {
        const firebaseError = err as { code: string };
        if (firebaseError.code === 'auth/email-already-in-use') {
          errorMessage = 'Este email já está em uso.';
        } else if (firebaseError.code === 'auth/weak-password') {
          errorMessage = 'A senha é muito fraca. Utilize pelo menos 6 caracteres.';
        }
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      imageUrl={signUpVector}
      imageAlt="Ilustração de cadastro"
      imagePosition="left"
    >
      {error && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-red-100 text-red-800 p-4 rounded-lg shadow-lg z-10">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <h2 className="text-3xl font-bold text-gray-900">Cadastre-se</h2>
      
      <RegisterForm onSubmit={handleRegisterSubmit} isLoading={isLoading} />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">ou</span>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Já possui uma conta?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
