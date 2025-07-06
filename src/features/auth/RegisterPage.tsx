import { useState } from "react";
import { Link } from "react-router-dom";
import signUpVector from "../../assets/img.jpg";
import { User, Mail, Lock } from "lucide-react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Input } from "../../components/ui/input";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    const dados = `Nome: ${name}\nEmail: ${email}\nSenha: ${password}`;
    alert(dados);
  };

  return (
    <AuthLayout
      imageUrl={signUpVector}
      imageAlt="Ilustração de cadastro"
      imagePosition="left"
    >
      <h2 className="text-3xl font-bold text-gray-900">Cadastre-se</h2>
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
          placeholder="Crie uma senha"
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

        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 block text-sm text-gray-700"
          >
            Lembre de mim
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Cadastrar
          </button>
        </div>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">ou</span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">
        Já possui uma conta?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
