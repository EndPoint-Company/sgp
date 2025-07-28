import React, { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { User, Mail, Lock } from "lucide-react";

// Define a forma dos dados que o formulário irá submeter
type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

// Define as props que o componente aceita
interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  // Estado para os campos do formulário e erros locais
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Validação local antes de submeter
    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    // Chama a função de submissão do componente pai
    onSubmit({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}
      
      <Input
        icon={<User className="h-5 w-5 text-gray-400" />}
        type="text"
        placeholder="Digite seu nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        disabled={isLoading}
      />
      <Input
        icon={<Mail className="h-5 w-5 text-gray-400" />}
        type="email"
        placeholder="Digite seu email institucional"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />
      <Input
        icon={<Lock className="h-5 w-5 text-gray-400" />}
        type="password"
        placeholder="Crie uma senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />
      <Input
        icon={<Lock className="h-5 w-5 text-gray-400" />}
        type="password"
        placeholder="Confirmar senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        disabled={isLoading}
      />
      
      <div>
        <Button
          type="submit"
          className="w-full justify-center py-3"
          disabled={isLoading}
        >
          {isLoading ? "Aguarde..." : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
}
