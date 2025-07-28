import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Mail, Lock } from "lucide-react";

type LoginFormInputs = {
  email: string;
  password: string;
};

interface LoginFormProps {
  onSubmit: (data: LoginFormInputs) => void;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const { 
    register, 
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInputs>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
      <Input
        icon={<Mail className="h-5 w-5 text-gray-400" />}
        type="email"
        placeholder="Digite seu email"
        {...register("email", { 
          required: "Email é obrigatório",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Email inválido"
          }
        })}
      />
      {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}

      <Input
        icon={<Lock className="h-5 w-5 text-gray-400" />}
        type="password"
        placeholder="Digite sua senha"
        {...register("password", { 
          required: "Senha é obrigatória",
          minLength: {
            value: 6,
            message: "Senha deve ter pelo menos 6 caracteres"
          }
        })}
      />
      {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}

      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </div>
    </form>
  );
};