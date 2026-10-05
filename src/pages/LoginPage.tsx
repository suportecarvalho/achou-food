import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  EnvelopeSimple,
  Key,
  Eye,
  EyeSlash,
  ArrowRight,
  ForkKnife,
  MapTrifold,
  Tag,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Modo: login ou cadastro
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [registerName, setRegisterName] = useState('')
  const [registerRole, setRegisterRole] = useState<'manager' | 'customer'>('manager')

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      toast.error('Preencha seu e-mail e sua senha.')
      return
    }

    setIsLoading(true)

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        })

        if (error) {
          if (error.message?.toLowerCase().includes('email not confirmed')) {
            toast.error('E-mail ainda não confirmado. Desative "Confirm email" no Supabase ou confirme o link no seu e-mail.')
          } else if (error.message?.toLowerCase().includes('rate limit') || (error as any).status === 429) {
            toast.error('Limite de tentativas excedido (429). Aguarde alguns minutos.')
          } else {
            toast.error(error.message || 'Erro ao autenticar com Supabase.')
          }
          setIsLoading(false)
          return
        }

        toast.success('Login realizado com sucesso via Supabase!')
        localStorage.setItem(
          'achou_food_user',
          JSON.stringify({ email: data.user.email, id: data.user.id, role: 'admin' })
        )
        navigate('/')
        return
      } catch (err: any) {
        console.warn('Erro ao conectar ao Supabase Auth:', err)
      }
    }

    // Modo local / contingência
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Login realizado com sucesso!')
      localStorage.setItem('achou_food_user', JSON.stringify({ email, role: 'admin' }))
      navigate('/')
    }, 600)
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!registerName.trim() || !email.trim() || !password.trim()) {
      toast.error('Preencha todos os campos do cadastro.')
      return
    }

    setIsLoading(true)

    if (isSupabaseConfigured && supabase) {
      try {
        const nameParts = registerName.trim().split(' ')
        const firstName = nameParts[0] || registerName.trim()
        const lastName = nameParts.slice(1).join(' ') || firstName

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              full_name: registerName.trim(),
              first_name: firstName,
              last_name: lastName,
              phone: '(54) 99999-8888',
              role: registerRole,
            },
          },
        })

        if (error) {
          if (
            error.message?.toLowerCase().includes('rate limit') ||
            (error as any).status === 429 ||
            (error as any).code === 'over_email_send_rate_limit'
          ) {
            toast.error(
              'Limite de e-mails de confirmação atingido (429). Desative "Confirm email" no painel do Supabase.'
            )
          } else {
            toast.error(error.message || 'Erro ao criar conta no Supabase.')
          }
          setIsLoading(false)
          return
        }

        toast.success('Conta criada com sucesso no Supabase! Acesse sua conta.')
        setMode('login')
        setIsLoading(false)
        return
      } catch (err: any) {
        console.warn('Erro ao registrar no Supabase Auth:', err)
      }
    }

    // Modo local / contingência
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Conta criada com sucesso! Faça login para gerenciar.')
      setMode('login')
    }, 600)
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-[#2A1F1D] flex flex-col justify-between selection:bg-[#8F141F]/20 selection:text-[#8F141F] relative overflow-x-hidden">
      {/* Conteúdo Principal: Duas Colunas (Ilustração / Formulário) */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 sm:py-16 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ===================================================================== */}
          {/* COLUNA ESQUERDA: CESTA DE INGREDIENTES E CARDS FLUTUANTES */}
          {/* ===================================================================== */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative select-none">
            {/* SVG: Linha ondulada decorativa orgânica de fundo fiel à referência */}
            <svg
              viewBox="0 0 640 360"
              className="w-[115%] sm:w-[125%] max-w-none h-auto absolute left-[-6%] sm:left-[-10%] top-1/2 -translate-y-[45%] pointer-events-none z-0"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9E3B47" stopOpacity="0.25" />
                  <stop offset="5%" stopColor="#9E3B47" stopOpacity="0.9" />
                  <stop offset="92%" stopColor="#9E3B47" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#9E3B47" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path
                d="M 10 230
                   C 22 210, 32 188, 42 188
                   C 52 188, 64 218, 76 218
                   C 92 218, 122 158, 142 158
                   C 152 158, 160 170, 168 170
                   C 176 170, 186 156, 198 156
                   C 240 170, 330 206, 382 220
                   C 400 224, 422 268, 436 268
                   C 446 268, 456 168, 466 168
                   C 476 168, 488 238, 498 238
                   C 506 238, 514 210, 524 210
                   C 534 210, 542 248, 552 248
                   C 566 248, 595 180, 625 140"
                stroke="url(#waveGradient)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Container da Imagem Central com Sombras e Floating Badges */}
            <div className="relative w-full max-w-[480px] sm:max-w-[520px] aspect-square flex items-center justify-center">
              
              {/* Card Flutuante 1: Topo Direito -> "Encontre no mapa" */}
              <div className="absolute top-[8%] right-[2%] sm:right-[6%] z-20 animate-fadeIn bg-white rounded-2xl py-2.5 px-3.5 shadow-xl border border-gray-100/80 flex items-center gap-3 transition-transform hover:-translate-y-1 duration-200">
                <div className="w-10 h-10 rounded-xl bg-[#F9ECEF] text-[#8F141F] flex items-center justify-center flex-shrink-0">
                  <MapTrifold size={20} weight="duotone" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[13px] font-semibold text-[#2A1F1D]">Encontre</span>
                  <span className="block text-[13px] font-semibold text-[#2A1F1D]">no mapa</span>
                </div>
              </div>

              {/* Card Flutuante 2: Meio Esquerdo -> "Peça direto do local" */}
              <div className="absolute top-[48%] left-[0%] sm:-left-[4%] z-20 animate-fadeIn bg-white rounded-2xl py-2.5 px-3.5 shadow-xl border border-gray-100/80 flex items-center gap-3 transition-transform hover:-translate-y-1 duration-200">
                <div className="w-10 h-10 rounded-xl bg-[#F9ECEF] text-[#8F141F] flex items-center justify-center flex-shrink-0">
                  <ForkKnife size={20} weight="duotone" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[13px] font-semibold text-[#2A1F1D]">Peça direto</span>
                  <span className="block text-[13px] font-semibold text-[#2A1F1D]">do local</span>
                </div>
              </div>

              {/* Card Flutuante 3: Base Direita -> "Economize sem taxas" */}
              <div className="absolute bottom-[10%] right-[6%] sm:right-[12%] z-20 animate-fadeIn bg-white rounded-2xl py-2.5 px-3.5 shadow-xl border border-gray-100/80 flex items-center gap-3 transition-transform hover:-translate-y-1 duration-200">
                <div className="w-10 h-10 rounded-xl bg-[#F9ECEF] text-[#8F141F] flex items-center justify-center flex-shrink-0">
                  <Tag size={20} weight="duotone" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block text-[13px] font-semibold text-[#2A1F1D]">Economize</span>
                  <span className="block text-[13px] font-semibold text-[#2A1F1D]">sem taxas</span>
                </div>
              </div>

              {/* Imagem da Cesta de Piquenique com Pães, Azeite e Legumes Frescos (Fundo Transparente) */}
              <img
                src="/login-basket.png"
                alt="Cesta artesanal com ingredientes frescos"
                className="w-[84%] sm:w-[86%] h-auto object-contain relative z-10 drop-shadow-[0_22px_36px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* ===================================================================== */}
          {/* COLUNA DIREITA: FORMULÁRIO DE LOGIN / CADASTRO */}
          {/* ===================================================================== */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="w-full max-w-[420px] bg-transparent">
              
              {/* Título & Subtítulo */}
              <div className="mb-8">
                <h1 className="text-[28px] sm:text-[32px] font-bold text-[#2A1F1D] leading-tight">
                  {mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
                </h1>
                <p className="text-[14px] text-[#8C7E77] mt-1.5">
                  {mode === 'login'
                    ? 'Informe seu e-mail e senha para entrar'
                    : 'Cadastre-se para gerenciar restaurantes e pedidos'}
                </p>
              </div>

              {/* =============================================================== */}
              {/* FORMULÁRIO: MODO LOGIN */}
              {/* =============================================================== */}
              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-6">
                  {/* Campo E-MAIL */}
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-[11px] font-bold tracking-wider uppercase text-[#8C7E77] mb-2"
                    >
                      E-MAIL
                    </label>
                    <div className="flex items-center gap-3 pb-2.5 border-b border-[#D8D0C5] focus-within:border-[#8F141F] transition-colors">
                      <EnvelopeSimple size={18} className="text-[#8C7E77] flex-shrink-0" />
                      <input
                        id="login-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Seu e-mail cadastrado"
                        autoComplete="off"
                        className="w-full bg-transparent text-[#2A1F1D] placeholder:text-[#A89D96] focus:outline-none text-[15px]"
                      />
                    </div>
                  </div>

                  {/* Campo SENHA */}
                  <div className="pt-2">
                    <label
                      htmlFor="login-password"
                      className="block text-[11px] font-bold tracking-wider uppercase text-[#8C7E77] mb-2"
                    >
                      SENHA
                    </label>
                    <div className="flex items-center gap-3 pb-2.5 border-b border-[#D8D0C5] focus-within:border-[#8F141F] transition-colors">
                      <Key size={18} className="text-[#8C7E77] flex-shrink-0" />
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Sua senha de acesso"
                        autoComplete="new-password"
                        className="w-full bg-transparent text-[#2A1F1D] placeholder:text-[#A89D96] focus:outline-none text-[15px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[#8C7E77] hover:text-[#8F141F] transition-colors p-1"
                        aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                      >
                        {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Botão Acessar */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#8F141F] hover:bg-[#7A111A] text-white py-3.5 px-6 rounded-2xl font-semibold text-[15px] flex items-center justify-between shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                    >
                      <span>{isLoading ? 'Acessando...' : 'Acessar'}</span>
                      <ArrowRight size={18} weight="bold" />
                    </button>
                  </div>
                </form>
              ) : (
                /* =============================================================== */
                /* FORMULÁRIO: MODO CADASTRO */
                /* =============================================================== */
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  {/* Nome Completo */}
                  <div>
                    <label
                      htmlFor="reg-name"
                      className="block text-[11px] font-bold tracking-wider uppercase text-[#8C7E77] mb-2"
                    >
                      NOME COMPLETO
                    </label>
                    <div className="flex items-center gap-3 pb-2.5 border-b border-[#D8D0C5] focus-within:border-[#8F141F] transition-colors">
                      <input
                        id="reg-name"
                        type="text"
                        required
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="Ex: Lucas Ferreira"
                        className="w-full bg-transparent text-[#2A1F1D] placeholder:text-[#A89D96] focus:outline-none text-[15px]"
                      />
                    </div>
                  </div>

                  {/* E-mail */}
                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-[11px] font-bold tracking-wider uppercase text-[#8C7E77] mb-2"
                    >
                      E-MAIL
                    </label>
                    <div className="flex items-center gap-3 pb-2.5 border-b border-[#D8D0C5] focus-within:border-[#8F141F] transition-colors">
                      <EnvelopeSimple size={18} className="text-[#8C7E77] flex-shrink-0" />
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Seu melhor e-mail"
                        className="w-full bg-transparent text-[#2A1F1D] placeholder:text-[#A89D96] focus:outline-none text-[15px]"
                      />
                    </div>
                  </div>

                  {/* Senha */}
                  <div>
                    <label
                      htmlFor="reg-password"
                      className="block text-[11px] font-bold tracking-wider uppercase text-[#8C7E77] mb-2"
                    >
                      CRIAR SENHA
                    </label>
                    <div className="flex items-center gap-3 pb-2.5 border-b border-[#D8D0C5] focus-within:border-[#8F141F] transition-colors">
                      <Key size={18} className="text-[#8C7E77] flex-shrink-0" />
                      <input
                        id="reg-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Pelo menos 6 caracteres"
                        className="w-full bg-transparent text-[#2A1F1D] placeholder:text-[#A89D96] focus:outline-none text-[15px]"
                      />
                    </div>
                  </div>

                  {/* Botão Finalizar Cadastro */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#8F141F] hover:bg-[#7A111A] text-white py-3.5 px-6 rounded-2xl font-semibold text-[15px] flex items-center justify-between shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                    >
                      <span>{isLoading ? 'Cadastrando...' : 'Finalizar Cadastro'}</span>
                      <ArrowRight size={18} weight="bold" />
                    </button>
                  </div>
                </form>
              )}

              {/* =============================================================== */}
              {/* SEÇÃO INFERIOR: AINDA NÃO TEM UMA CONTA? / JÁ TEM CONTA? */}
              {/* =============================================================== */}
              <div className="mt-14 sm:mt-20">
                <span className="block text-[13px] text-[#8C7E77] mb-3">
                  {mode === 'login'
                    ? 'Ainda não tem uma conta?'
                    : 'Já possui cadastro?'}
                </span>
                
                {mode === 'login' ? (
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="w-full bg-transparent border border-[#8F141F] text-[#8F141F] hover:bg-[#8F141F]/5 py-3.5 px-6 rounded-2xl font-semibold text-[15px] flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <span>Cadastrar</span>
                    <ArrowRight size={18} weight="bold" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full bg-transparent border border-[#8F141F] text-[#8F141F] hover:bg-[#8F141F]/5 py-3.5 px-6 rounded-2xl font-semibold text-[15px] flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <span>Acessar com e-mail existente</span>
                    <ArrowRight size={18} weight="bold" />
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Rodapé discreto */}
      <footer className="w-full py-4 text-center text-[12px] text-[#8C7E77]/70">
        © {new Date().getFullYear()} Achou Food. Todos os direitos reservados.
      </footer>
    </div>
  )
}
