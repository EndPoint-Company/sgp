import { useState } from "react";
import { Link } from "react-router-dom";
import loginVector from "../../assets/img.jpg";
import { Mail, Lock } from 'lucide-react';
import { AuthLayout } from "../../layouts/AuthLayout"; 
import { Input } from "./components/Input"; 

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dados = `Email: ${email}\nSenha: ${password}`;
    alert(dados);
  };

  return (
    <AuthLayout imageUrl={loginVector} imageAlt="Ilustração de login" imagePosition="right">
      <h2 className="text-3xl font-bold text-gray-900">Entre na sua conta</h2>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input icon={Mail} type="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input icon={Lock} type="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input id="rememberMe" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">Lembre de mim</label>
          </div>
          <div className="text-sm"><a href="#" className="font-medium text-blue-600 hover:underline">Esqueceu a senha?</a></div>
        </div>

        <div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Entrar</button>
        </div>
      </form>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">ou</span></div>
      </div>
      
      <p className="text-center text-sm text-gray-600">
        Não possui uma conta?{" "}
        <Link to="/register" className="font-medium text-blue-600 hover:underline">Se cadastrar</Link>
      </p>
    </AuthLayout>
  );
}