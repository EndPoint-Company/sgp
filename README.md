# SGP - Sistema de Gerência de Psicoterapia

> Sistema web voltado à gestão de atendimentos psicológicos para alunos e psicólogos da Universidade Federal do Ceará (UFC) - Campus Quixadá.

---

## Índice

* [Sobre o Projeto](#-sobre-o-projeto)
* [Objetivos](#-objetivos)
* [Público-Alvo](#-público-alvo)
* [Funcionalidades](#-funcionalidades)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Instalação e Execução](#-instalação-e-execução)
* [Variáveis de Ambiente](#-variáveis-de-ambiente)
* [Testes](#-testes)
* [Protótipo](#-protótipo)
* [Contribuindo](#-contribuindo)
* [Licença](#-licença)
* [Equipe](#-equipe)

---

## Sobre o Projeto

O **SGP** (Sistema de Gerência de Psicoterapia) é uma plataforma web que visa modernizar o processo de agendamento e gerenciamento de consultas psicológicas no campus da UFC Quixadá. O sistema busca reduzir conflitos de agenda, melhorar a organização do atendimento e promover o bem-estar mental da comunidade acadêmica.

---

## Objetivos

* Substituir o processo manual de agendamento por um sistema online acessível e prático.
* Permitir que alunos agendem, cancelem ou acompanhem suas consultas.
* Facilitar o controle de disponibilidade de agenda dos psicólogos.
* Gerenciar atendimentos individuais e coletivos.
* Promover comunicação entre psicólogos e pacientes.

---

## Público-Alvo

* **Estudantes da UFC Quixadá**: com idades entre 18 e 25 anos, buscando apoio psicológico durante sua jornada acadêmica.
* **Psicólogos da Instituição**: responsáveis por organizar e executar os atendimentos.
* **Docentes**: que também podem utilizar os serviços oferecidos.

---

## Funcionalidades

###  Usuários (Alunos/Docentes)

* Cadastro com e-mail institucional
* Login seguro
* Solicitação de atendimento individual
* Participação em atendimentos coletivos (públicos ou privados)
* Cancelamento de consultas (com prazo de antecedência)
* Notificações de consulta e confirmação por e-mail
* Visualização do histórico de atendimentos
* Chat integrado com psicólogo
* Dicas de saúde mental, FAQ e onboarding

### Psicólogos

* Gestão de agenda: bloquear e liberar datas
* Aprovação/Rejeição de solicitações de atendimento
* Registro de prontuários e evolução clínica
* Anotações por sessão
* Relatórios de atendimentos realizados
* Criação de atendimentos coletivos
* Publicação de eventos temáticos
* Notificações automáticas e e-mails aos alunos

### Outras funcionalidades

* Acessibilidade (modo de contraste, audiodescrição, teclado, leitores de tela)
* Upload de arquivos e anexos no perfil ou agendamentos
* Design responsivo e multiplataforma (PC, tablet, celular)

---

## Tecnologias Utilizadas

* **Frontend:** HTML, CSS, JavaScript
* **Framework:** *(ex: Vue.js ou React – confirmar no projeto)*
* **API Externa:** Comunicação via REST com backend feito em Golang
* **Firebase:** *(usado para autenticação ou notificações)*

---

## Instalação e Execução

### Pré-requisitos

* Node.js ≥ 16
* npm ou yarn

### Passos

```bash
# Clone o repositório
git clone https://github.com/EndPoint-Company/sgp.git
cd sgp

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em:
http://localhost:5173`

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
VITE_API_URL=https://sua-api-externa.com
```

Substitua pelo endereço real da API do sistema.

---

## Testes

Caso o projeto implemente testes:

```bash
# Executar testes
npm run test
```

---

## Protótipo

* 🔗 [Figma - SGP (v1)](https://www.figma.com/design/s1i3XnxhsLdoyz1VzUho37/Segunda-Vez?node-id=0-1&t=lHVNFKE2a0ySDlCp-1)

---

## Contribuindo

1. Fork este repositório
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: nova funcionalidade'`
4. Envie para o repositório remoto: `git push origin minha-feature`
5. Crie um Pull Request

---

## Licença

Distribuído sob a licença **MIT**.
Consulte o arquivo [`LICENSE`](LICENSE) para mais detalhes.

---

## Equipe

* [Henrique Lima Pires](https://github.com/Hexcold)
* [José Mykael Alves Nogueira](https://github.com/mykaelAlves)
* [Marcos Vitor Souza Freire](https://github.com/marquinvitor)
* [Ester Holanda Ravette](https://github.com/esterravette)
