"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { PasswordStrength } from "@/components/ui/password-strength";
import { Eye, EyeOff, Lock } from "lucide-react";
import { registerMedic } from "@/lib/actions";

const diasSemana = [
	{ id: 0, nome: "Domingo" },
	{ id: 1, nome: "Segunda-feira" },
	{ id: 2, nome: "Terça-feira" },
	{ id: 3, nome: "Quarta-feira" },
	{ id: 4, nome: "Quinta-feira" },
	{ id: 5, nome: "Sexta-feira" },
	{ id: 6, nome: "Sábado" },
];

const defaultDisponibilidade = () =>
	Object.fromEntries(
		diasSemana.map((d) => [
			d.id,
			{ ativa: false, horaInicio: "08:00", horaFim: "18:00" },
		])
	);

function formatPhone(value) {
	const numbers = value.replace(/\D/g, "");
	if (numbers.length <= 2) return `(${numbers}`;
	if (numbers.length <= 7)
		return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
	return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
		7,
		11
	)}`;
}

export function MedicRegisterForm({ specialties = [] }) {
	const [step, setStep] = useState(1);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordValue, setPasswordValue] = useState("");
	const [disponibilidades, setDisponibilidades] = useState(defaultDisponibilidade());
	const [step1Filled, setStep1Filled] = useState(false);
	const [step2Filled, setStep2Filled] = useState(false);
	const [step3Filled, setStep3Filled] = useState(false);
	const [step4Filled, setStep4Filled] = useState(false);
	const totalSteps = 4;

	const handleDisponibilidadeChange = (diaId, field, value) => {
		setDisponibilidades((prev) => ({
			...prev,
			[diaId]: { ...prev[diaId], [field]: value },
		}));
	};

	const validateForm = (data) => {
		const diasAtivos = Object.values(disponibilidades).filter((d) => d.ativa);
		if (!diasAtivos.length) return "Selecione pelo menos um dia.";
		for (const d of diasAtivos) {
			if (d.horaInicio >= d.horaFim) return "Horário de fim deve ser depois do início.";
		}
		if (data.crm.length < 5) return "CRM deve ter pelo menos 5 caracteres.";
		return null;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(""); setSuccess(""); setIsSubmitting(true);
		const data = Object.fromEntries(new FormData(e.currentTarget).entries());
		if (data.password !== data.confirmPassword) return setError("As senhas não coincidem.");
		const validationError = validateForm(data);
		if (validationError) return setError(validationError);
		data.disponibilidades = JSON.stringify(
			Object.entries(disponibilidades).map(([diaSemana, disp]) => ({
				...disp, diaSemana: Number(diaSemana),
			}))
		);
		const result = await registerMedic(data);
		if (result.success) {
			setSuccess(result.message);
			e.target.reset();
			setDisponibilidades(defaultDisponibilidade());
		} else setError(result.message);
		setIsSubmitting(false);
	};

	function isValidEmail(email) {
		// Regex simples para validar email
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	function checkStep1Filled() {
		const name = document.getElementById("name")?.value.trim();
		const crm = document.getElementById("crm")?.value.trim();
		const email = document.getElementById("email")?.value.trim();
		setStep1Filled(
			!!name &&
			name.length >= 3 &&
			!!crm &&
			crm.length >= 5 &&
			!!email &&
			isValidEmail(email)
		);
	}
	function checkStep2Filled() {
		const specialty = document.getElementById("specialtyId")?.value;
		setStep2Filled(!!specialty);
	}
	function checkStep3Filled() {
		const password = document.getElementById("password")?.value;
		const confirmPassword = document.getElementById("confirmPassword")?.value;
		setStep3Filled(password && confirmPassword && password === confirmPassword && password.length >= 6);
	}
	function checkStep4Filled() {
		setStep4Filled(Object.values(disponibilidades).some(d => d.ativa));
	}

	return (
		<div
			className="min-h-screen flex items-center justify-center px-1 py-8"
			style={{
				backgroundImage: "url('/login/Banner Médio Sejam Bem-Vindos Feira De Agronegócio Criativo Verde E Branco  (46).png')",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
		>
			<div className="flex w-full max-w-5xl md:h-[800px] rounded-3xl shadow-2xl overflow-hidden bg-transparent mx-auto">
				{/* LADO ESQUERDO: 50% */}
				<div
					className="hidden md:block w-1/2 h-full border-4 border-white rounded-l-3xl"
					style={{
						backgroundColor: "rgba(255,255,255,0.13)",
						backdropFilter: "blur(0px)",
					}}
				/>

				{/* LADO DIREITO: quadrado branco igual largura */}
				<div className="w-full md:w-1/2 h-full bg-white rounded-3xl md:rounded-l-none relative shadow-lg flex flex-col items-center justify-center px-6 py-8 md:px-10" style={{ fontFamily: "Poppins, sans-serif" }}>
    <div className="w-full max-w-md">
        {/* Logo acima do texto */}
        <div className="flex justify-center mb-4">
            <img
                src="/brailleway_logo.png"
                alt="Logo BrailleWay"
                className="h-180 w-auto"
                style={{ maxHeight: 100 }}
            />
        </div>
        <h1 className="text-2xl md:text-3xl font-medium mb-2 text-center" style={{ color: "rgb(52,52,52)", fontFamily: "Poppins, sans-serif" }}>
            Olá, doutor(a)! Tudo certo? 
        </h1>
        <p className="  text-center text-sm mb-6" style={{ color: "rgb(52,52,52)", fontFamily: "Poppins, sans-serif" }}>
            Informe seus dados pessoais, especialidade, defina uma senha e horários de atendimento.
        </p>
        {/* Barra de progresso acima do formulário */}
        <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2 relative">
                <div
                    className="bg-gradient-to-r from-blue-500 via-blue-400 to-teal-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(step - 1) / 3 * 100}%` }}
                />
            </div>
        </div>
        {error && <p className="text-red-500 text-center text-base md:text-lg">{error}</p>}
        {success && <p className="text-green-500 text-center text-base md:text-lg">{success}</p>}

        <form onSubmit={handleSubmit} className="w-full space-y-8" style={{ fontFamily: "Poppins, sans-serif" }}>
            {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm" style={{ color: "rgb(52,52,52)" }}>Nome Completo</Label>
                        <Input
                            name="name"
                            id="name"
                            type="text"
                            required
                            autoFocus
                            minLength={3}
                            placeholder="Informe seu nome completo"
                            className="bg-gray-100 text-gray-700 placeholder-gray-400"
                            onChange={checkStep1Filled}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="crm" className="text-sm" style={{ color: "rgb(52,52,52)" }}>CRM</Label>
                        <Input
                            name="crm"
                            id="crm"
                            type="text"
                            required
                            minLength={5}
                            placeholder="Ex: 12345-SP"
                            className="bg-gray-100 text-gray-700 placeholder-gray-400"
                            onChange={checkStep1Filled}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm" style={{ color: "rgb(52,52,52)" }}>Email</Label>
                        <Input
                            name="email"
                            id="email"
                            type="email"
                            required
                            placeholder="Informe seu email"
                            className="bg-gray-100 text-gray-700 placeholder-gray-400"
                            onChange={checkStep1Filled}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm" style={{ color: "rgb(52,52,52)" }}>Telefone</Label>
                        <Input
                            name="phone"
                            id="phone"
                            type="tel"
                            placeholder="(XX) XXXXX-XXXX"
                            maxLength={15}
                            onChange={e => { e.target.value = formatPhone(e.target.value); checkStep1Filled(); }}
                            className="bg-gray-100 text-gray-700 placeholder-gray-400"
                        />
                    </div>
                    <div className="flex justify-center">
                        <Button
                            type="button"
                            className="
                                group inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 shadow-md hover:shadow-lg active:scale-[0.97] transform hover:brightness-110 h-12 bg-gradient-to-r from-[#3E97F3] via-[#227CE7] to-[#47E0D0] text-white font-medium rounded-full px-6 py-2
                            "
                            style={{ fontFamily: "Poppins, sans-serif" }}
                            onClick={() => setStep(2)}
                            disabled={!step1Filled}
                        >
                            Próximo
                        </Button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                     
                   
                    <div className="space-y-2">
                        <Label htmlFor="specialtyId" className="text-sm" style={{ color: "rgb(52,52,52)" }}>Especialidade</Label>
                        <select
                            name="specialtyId"
                            id="specialtyId"
                            required
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-gray-100 text-gray-700 px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            onChange={checkStep2Filled}
                        >
                            <option value="">Selecione uma especialidade...</option>
                            {specialties.map(spec => (
                                <option key={spec.id} value={spec.id}>{spec.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2 justify-center">
                        <Button
                            type="button"
                            className="
                               group inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 shadow-md hover:shadow-lg active:scale-[0.97] transform hover:brightness-110 h-12 bg-gradient-to-r bg-gray-100 text-gray-700 placeholder-gray-400   font-medium rounded-full px-6 py-2
                            "
                            style={{ fontFamily: "Poppins, sans-serif" }}
                            onClick={() => setStep(1)}
                        >
                            Voltar
                        </Button>
                        <Button
                            type="button"
                            className="
                                group inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 shadow-md hover:shadow-lg active:scale-[0.97] transform hover:brightness-110 h-12 bg-gradient-to-r from-[#3E97F3] via-[#227CE7] to-[#47E0D0] text-white font-medium rounded-full px-6 py-2
                            "
                            style={{ fontFamily: "Poppins, sans-serif" }}
                            onClick={() => setStep(3)}
                            disabled={!step2Filled}
                        >
                            Próximo
                        </Button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                    
                    <div className="space-y-2">
                        <Label htmlFor="password" className="flex items-center gap-2 text-sm" style={{ color: "rgb(52,52,52)" }}><Lock className="h-4 w-4" />Senha</Label>
                        <div className="relative">
                            <Input
                                name="password"
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={6}
                                placeholder="Informe sua senha"
                                onChange={e => { setPasswordValue(e.target.value); checkStep3Filled(); }}
                                autoComplete="new-password"
                                className="bg-gray-100 text-gray-700 placeholder-gray-400"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <PasswordStrength password={passwordValue} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm" style={{ color: "rgb(52,52,52)" }}><Lock className="h-4 w-4" />Confirmar Senha</Label>
                        <div className="relative">
                            <Input
                                name="confirmPassword"
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                minLength={6}
                                placeholder="Repita sua senha"
                                onChange={checkStep3Filled}
                                autoComplete="new-password"
                                className="bg-gray-100 text-gray-700 placeholder-gray-400"
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-center">
                        <Button
                            type="button"
                            className="
                                 group inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 shadow-md hover:shadow-lg active:scale-[0.97] transform hover:brightness-110 h-12 bg-gradient-to-r bg-gray-100 text-gray-700 placeholder-gray-400   font-medium rounded-full px-6 py-2
                            "
                            style={{ fontFamily: "Poppins, sans-serif" }}
                            onClick={() => setStep(2)}
                        >
                            Voltar
                        </Button>
                        <Button
                            type="button"
                            className="
                                group inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 shadow-md hover:shadow-lg active:scale-[0.97] transform hover:brightness-110 h-12 bg-gradient-to-r from-[#3E97F3] via-[#227CE7] to-[#47E0D0] text-white font-medium rounded-full px-6 py-2
                            "
                            style={{ fontFamily: "Poppins, sans-serif" }}
                            onClick={() => setStep(4)}
                            disabled={!step3Filled}
                        >
                            Próximo
                        </Button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-4 animate-fade-in">
 
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border rounded-lg bg-white shadow-sm">
                            <thead>
                                <tr>
                                    <th className="px-2 py-2 text-left" style={{ color: "rgb(52,52,52)" }}>Dia</th>
                                    <th className="px-2 py-2 text-center" style={{ color: "rgb(52,52,52)" }}>Atende?</th>
                                    <th className="px-2 py-2 text-center" style={{ color: "rgb(52,52,52)" }}>Início</th>
                                    <th className="px-2 py-2 text-center" style={{ color: "rgb(52,52,52)" }}>Fim</th>
                                </tr>
                            </thead>
                            <tbody>
                                {diasSemana.map(dia => (
                                    <tr key={dia.id} className="border-t">
                                        <td className="px-2 py-2 font-medium" style={{ color: "rgb(52,52,52)" }}>{dia.nome}</td>
                                        <td className="px-2 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                id={`dia-${dia.id}`}
                                                checked={disponibilidades[dia.id].ativa}
                                                onChange={e => handleDisponibilidadeChange(dia.id, "ativa", e.target.checked)}
                                                className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                aria-label={`Atende ${dia.nome}`}
                                            />
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <Input
                                                type="time"
                                                id={`inicio-${dia.id}`}
                                                value={disponibilidades[dia.id].horaInicio}
                                                onChange={e => handleDisponibilidadeChange(dia.id, "horaInicio", e.target.value)}
                                                className="w-20 bg-gray-100 text-gray-700"
                                                disabled={!disponibilidades[dia.id].ativa}
                                                aria-label={`Início em ${dia.nome}`}
                                            />
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <Input
                                                type="time"
                                                id={`fim-${dia.id}`}
                                                value={disponibilidades[dia.id].horaFim}
                                                onChange={e => handleDisponibilidadeChange(dia.id, "horaFim", e.target.value)}
                                                className="w-20 bg-gray-100 text-gray-700"
                                                disabled={!disponibilidades[dia.id].ativa}
                                                aria-label={`Fim em ${dia.nome}`}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex gap-2 justify-center mt-4">
                        <Button
                            type="button"
                            className="
                                 group inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 shadow-md hover:shadow-lg active:scale-[0.97] transform hover:brightness-110 h-12 bg-gradient-to-r bg-gray-100 text-gray-700 placeholder-gray-400   font-medium rounded-full px-6 py-2
                            "
                            style={{ fontFamily: "Poppins, sans-serif" }}
                            onClick={() => setStep(3)}
                        >
                            Voltar
                        </Button>
                        <Button
                            type="submit"
                            className="
                                group inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 shadow-md hover:shadow-lg active:scale-[0.97] transform hover:brightness-110 h-12 bg-gradient-to-r from-[#3E97F3] via-[#227CE7] to-[#47E0D0] text-white font-medium rounded-full px-6 py-2
                            "
                            style={{ fontFamily: "Poppins, sans-serif" }}
                            disabled={!step4Filled || isSubmitting}
                        >
                            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                        </Button>
                    </div>
                </div>
            )}
        </form>

        <p className=" text-gray-500 text-center text-base md:text-l mt-8" style={{ fontFamily: "Poppins, sans-serif" }}>
            Já tem uma conta?{" "}
            <Link href="/login" className="font-semibold text-[#338DEF] underline">Entrar</Link>
        </p>
    </div>
</div>
			</div>
		</div>
	);
}
