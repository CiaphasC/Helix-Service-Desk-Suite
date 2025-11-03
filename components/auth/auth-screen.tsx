"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import gsap from "gsap"
import { useLightEffects } from "@/components/providers/light-effects-provider"
import { useAuthAnimation } from "@/hooks/use-auth-animation"

type AuthMode = "login" | "register"

interface AuthScreenProps {
  initialMode?: AuthMode
}

export function AuthScreen({ initialMode = "login" }: AuthScreenProps) {
  const router = useRouter()
  const { setEffect } = useLightEffects()

  const [mode, setMode] = useState<AuthMode>(initialMode)
  const modeRef = useRef<AuthMode>(initialMode)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: "devmaster.learning@gmail.com", password: "" })
  const [loginShowPassword, setLoginShowPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [registerShowPassword, setRegisterShowPassword] = useState(false)
  const [registerShowConfirmPassword, setRegisterShowConfirmPassword] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"admin" | "user">("user")

  const containerRef = useRef<HTMLDivElement>(null)
  const floatingElementsRef = useRef<HTMLDivElement>(null)

  const loginWrapperRef = useRef<HTMLDivElement>(null)
  const loginCardRef = useRef<HTMLDivElement>(null)
  const loginTitleRef = useRef<HTMLHeadingElement>(null)
  const loginSubtitleRef = useRef<HTMLParagraphElement>(null)
  const loginInputsRef = useRef<HTMLDivElement>(null)
  const loginButtonRef = useRef<HTMLButtonElement>(null)

  const registerWrapperRef = useRef<HTMLDivElement>(null)
  const registerCardRef = useRef<HTMLDivElement>(null)
  const registerTitleRef = useRef<HTMLHeadingElement>(null)
  const registerSubtitleRef = useRef<HTMLParagraphElement>(null)
  const registerInputsRef = useRef<HTMLDivElement>(null)
  const registerButtonRef = useRef<HTMLButtonElement>(null)
  const roleSelectionRef = useRef<HTMLDivElement>(null)

  const [stageHeight, setStageHeight] = useState<number | undefined>(undefined)
  const [shouldCenter, setShouldCenter] = useState(true)

  const transitionTimelineRef = useRef<gsap.core.Timeline | null>(null)

  const getCardHeight = useCallback((wrapper: React.RefObject<HTMLDivElement>) => {
    const wrapperEl = wrapper.current
    if (!wrapperEl) return 0
    const card = wrapperEl.querySelector<HTMLElement>("[data-auth-card]")
    return card?.offsetHeight ?? wrapperEl.offsetHeight ?? 0
  }, [])

  const updateStageLayout = useCallback(
    (forcedMode?: AuthMode) => {
      const activeMode = forcedMode ?? modeRef.current
      const activeHeight = activeMode === "login" ? getCardHeight(loginWrapperRef) : getCardHeight(registerWrapperRef)
      const viewportHeight = typeof window !== "undefined" ? window.innerHeight : undefined

      if (viewportHeight && activeHeight && activeHeight > viewportHeight - 96) {
        setShouldCenter(false)
        setStageHeight(undefined)
      } else {
        setShouldCenter(true)
        setStageHeight(activeHeight || undefined)
      }
    },
    [getCardHeight],
  )

  useEffect(() => {
    modeRef.current = mode
    updateStageLayout()
    const handleResize = () => updateStageLayout()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [mode, updateStageLayout])

  useEffect(() => {
    const raf = requestAnimationFrame(() => updateStageLayout())
    return () => cancelAnimationFrame(raf)
  }, [mode, loginForm, registerForm, updateStageLayout])

  useEffect(() => {
    const loginEl = loginWrapperRef.current
    const registerEl = registerWrapperRef.current
    if (!loginEl || !registerEl) return
    gsap.set(loginEl, { autoAlpha: mode === "login" ? 1 : 0, pointerEvents: mode === "login" ? "auto" : "none" })
    gsap.set(registerEl, {
      autoAlpha: mode === "register" ? 1 : 0,
      pointerEvents: mode === "register" ? "auto" : "none",
    })
  }, [])

  useEffect(
    () => () => {
      transitionTimelineRef.current?.kill()
      transitionTimelineRef.current = null
    },
    [],
  )

  const extendRegisterTimeline = useCallback(
    (timeline: gsap.core.Timeline) => {
      if (mode !== "register" || !roleSelectionRef.current) return
      const buttons = roleSelectionRef.current.querySelectorAll("button")
      if (buttons.length === 0) return
      timeline.from(
        buttons,
        {
          opacity: 0,
          scale: 0.8,
          stagger: 0.08,
          duration: 0.4,
          ease: "back.out",
        },
        0.7,
      )
    },
    [mode],
  )

  const activeRefs = useMemo(
    () =>
      mode === "login"
        ? {
            cardRef: loginCardRef,
            titleRef: loginTitleRef,
            subtitleRef: loginSubtitleRef,
            inputsRef: loginInputsRef,
            buttonRef: loginButtonRef,
          }
        : {
            cardRef: registerCardRef,
            titleRef: registerTitleRef,
            subtitleRef: registerSubtitleRef,
            inputsRef: registerInputsRef,
            buttonRef: registerButtonRef,
          },
    [mode],
  )

  const killBaseAnimations = useAuthAnimation({
    containerRef,
    cardRef: activeRefs.cardRef,
    titleRef: activeRefs.titleRef,
    subtitleRef: activeRefs.subtitleRef,
    inputsRef: activeRefs.inputsRef,
    buttonRef: activeRefs.buttonRef,
    floatingElementsRef,
    setEffect,
    withTimeline: mode === "register" ? extendRegisterTimeline : undefined,
    enableParallax: mode === "login",
  })

  const switchMode = useCallback(
    (nextMode: AuthMode) => {
      if (nextMode === mode || isTransitioning) return
      const currentWrapper = (mode === "login" ? loginWrapperRef : registerWrapperRef).current
      const targetWrapper = (nextMode === "login" ? loginWrapperRef : registerWrapperRef).current
      if (!currentWrapper || !targetWrapper) return

      killBaseAnimations()
      transitionTimelineRef.current?.kill()

      setIsTransitioning(true)
      transitionTimelineRef.current = gsap
        .timeline({
          defaults: { duration: 0.6, ease: "power2.inOut" },
          onComplete: () => {
            gsap.set(currentWrapper, { pointerEvents: "none" })
            gsap.set(targetWrapper, { pointerEvents: "auto" })
            modeRef.current = nextMode
            setMode(nextMode)
            setIsTransitioning(false)
            updateStageLayout(nextMode)
            transitionTimelineRef.current = null
          },
        })
        .to(currentWrapper, { autoAlpha: 0, y: 20 }, 0)
        .fromTo(targetWrapper, { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0 }, 0)
    },
    [killBaseAnimations, mode, isTransitioning, updateStageLayout],
  )

  const updateAuthQuery = useCallback(
    (nextMode: AuthMode) => {
      const url = nextMode === "login" ? "/?auth=login" : "/?auth=register"
      router.replace(url, { scroll: false })
    },
    [router],
  )

  const handleInputFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    gsap.to(event.currentTarget, {
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
      duration: 0.3,
      ease: "power2.out",
    })
  }, [])

  const handleInputBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    gsap.to(event.currentTarget, {
      boxShadow: "0 0 0px rgba(59, 130, 246, 0)",
      duration: 0.3,
      ease: "power2.out",
    })
  }, [])

  const handleLoginSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()
      killBaseAnimations()
      setLoginLoading(true)

      const buttonContent = loginButtonRef.current?.querySelector("span")
      if (buttonContent) {
        gsap.to(buttonContent, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: "power2.in",
        })
      }

      gsap.to(loginCardRef.current, {
        scale: 0.95,
        opacity: 0.8,
        duration: 0.4,
        ease: "power2.inOut",
      })

      setTimeout(() => {
        gsap.to(loginCardRef.current, {
          scale: 1.05,
          opacity: 0,
          y: -100,
          duration: 0.6,
          ease: "power3.in",
          onComplete: () => router.push("/panel"),
        })
      }, 800)
    },
    [killBaseAnimations, router],
  )

  const handleRegisterSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()

      if (registerForm.password !== registerForm.confirmPassword) {
        alert("Las contraseñas no coinciden")
        return
      }

      killBaseAnimations()
      setRegisterLoading(true)

      const buttonContent = registerButtonRef.current?.querySelector("span")
      if (buttonContent) {
        gsap.to(buttonContent, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: "power2.in",
        })
      }

      gsap.to(registerCardRef.current, {
        scale: 0.95,
        opacity: 0.8,
        duration: 0.4,
        ease: "power2.inOut",
      })

      setTimeout(() => {
        gsap.to(registerCardRef.current, {
          scale: 1.05,
          opacity: 0,
          y: -100,
          duration: 0.6,
          ease: "power3.in",
          onComplete: () => router.push("/panel"),
        })
      }, 800)
    },
    [killBaseAnimations, registerForm.confirmPassword, registerForm.password, router],
  )

  const handleRoleSelect = useCallback((role: "admin" | "user") => {
    setSelectedRole(role)
    const button = roleSelectionRef.current?.querySelector<HTMLButtonElement>(`[data-role="${role}"]`)
    if (button) {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.2,
        ease: "back.out",
        yoyo: true,
        repeat: 1,
      })
    }
  }, [])

  return (
    <main
      ref={containerRef}
      className={`relative flex min-h-screen justify-center overflow-hidden px-4 ${
        shouldCenter ? "items-center py-12" : "items-start py-8"
      } sm:py-12`}
    >
      <div ref={floatingElementsRef} className="pointer-events-none absolute inset-0">
        <div className="float-element absolute top-20 left-4 h-32 w-32 rounded-full bg-blue-500 blur-3xl sm:left-10 sm:h-40 sm:w-40" />
        <div className="float-element absolute bottom-10 right-4 h-44 w-44 rounded-full bg-purple-500 blur-3xl sm:bottom-20 sm:right-10 sm:h-60 sm:w-60" />
        <div className="float-element absolute top-1/2 right-1/8 h-28 w-28 rounded-full bg-indigo-500 blur-3xl sm:right-1/4 sm:h-32 sm:w-32" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-2 sm:px-0">
        <div
          ref={loginWrapperRef}
          className="absolute left-1/2 w-full px-0 sm:px-0"
          style={
            shouldCenter
              ? { top: "50%", transform: "translate(-50%, -50%)" }
              : { top: "1.5rem", transform: "translateX(-50%)" }
          }
        >
          <Card
            ref={loginCardRef}
            data-auth-card
            className="relative w-full max-w-md overflow-hidden border border-blue-500/20 bg-slate-950/40 p-0 shadow-2xl backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-blue-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative p-6 sm:p-8 md:p-10">
              <div className="mb-8 text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h1
                  ref={loginTitleRef}
                  className="mb-2 text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text md:text-4xl"
                >
                  CatáloGo
                </h1>
                <p ref={loginSubtitleRef} className="text-sm text-slate-400">
                  Gestión Inteligente de Servicios
                </p>
              </div>

              <form ref={loginInputsRef} onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-6">
                  <div className="group">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                      Correo Electrónico
                    </label>
                    <Input
                      type="email"
                      placeholder="tu@correo.com"
                      value={loginForm.email}
                      onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="h-11 rounded-lg border-blue-500/30 bg-slate-900/50 text-white backdrop-blur-sm transition-all focus:border-blue-500 placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div className="group">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Input
                        type={loginShowPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="h-11 rounded-lg border-blue-500/30 bg-slate-900/50 pr-11 text-white backdrop-blur-sm transition-all focus:border-blue-500 placeholder:text-slate-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setLoginShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 transition-colors hover:text-blue-400"
                      >
                        {loginShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  ref={loginButtonRef}
                  type="submit"
                  disabled={loginLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 font-semibold text-white shadow-lg shadow-blue-600/40 transition-all duration-300 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 focus-visible:ring-2 focus-visible:ring-blue-400/60"
                >
                  {loginLoading ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      Ingresar
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 border-t border-slate-700/50 pt-6 text-center text-xs text-slate-500">
                <p>
                  ¿No tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      switchMode("register")
                      updateAuthQuery("register")
                    }}
                    className="font-semibold text-blue-400 transition-colors hover:text-blue-300"
                  >
                    Regístrate aquí
                  </button>
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div
          ref={registerWrapperRef}
          className="absolute left-1/2 w-full px-0 sm:px-0"
          style={{
            top: shouldCenter ? "50%" : "1.5rem",
            transform: shouldCenter ? "translate(-50%, -50%)" : "translateX(-50%)",
          }}
        >
          <Card
            ref={registerCardRef}
            data-auth-card
            className="relative w-full max-w-md overflow-hidden border border-blue-500/20 bg-slate-950/40 p-0 shadow-2xl backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-blue-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative p-6 sm:p-8 md:p-10">
              <div className="mb-6 text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50">
                  <span className="text-2xl">✨</span>
                </div>
                <h1
                  ref={registerTitleRef}
                  className="mb-2 text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text md:text-4xl"
                >
                  Crea tu cuenta
                </h1>
                <p ref={registerSubtitleRef} className="text-sm text-slate-400">
                  Define tu rol y empieza a gestionar servicios
                </p>
              </div>

              <div ref={roleSelectionRef} className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    role: "user",
                    title: "Usuario",
                    description: "Solicita y da seguimiento a servicios.",
                  },
                  {
                    role: "admin",
                    title: "Administrador",
                    description: "Administra catálogos, usuarios y SLAs.",
                  },
                ].map((option) => (
                  <button
                    key={option.role}
                    type="button"
                    data-role={option.role}
                    onClick={() => handleRoleSelect(option.role as "admin" | "user")}
                    className={`rounded-lg border border-blue-500/20 bg-slate-900/50 p-4 text-left transition-all ${
                      selectedRole === option.role
                        ? "ring-2 ring-blue-500/60"
                        : "hover:border-blue-500/40 hover:bg-slate-900/70"
                    }`}
                  >
                    <p className="font-semibold text-slate-100">{option.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{option.description}</p>
                  </button>
                ))}
              </div>

              <form ref={registerInputsRef} onSubmit={handleRegisterSubmit} className="space-y-6">
                <div className="group">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                    Nombre completo
                  </label>
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    value={registerForm.name}
                    onChange={(event) => setRegisterForm((prev) => ({ ...prev, name: event.target.value }))}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="h-11 rounded-lg border-blue-500/30 bg-slate-900/50 text-white backdrop-blur-sm transition-all focus:border-blue-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <div className="group">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                    Correo Electrónico
                  </label>
                  <Input
                    type="email"
                    placeholder="tu@correo.com"
                    value={registerForm.email}
                    onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="h-11 rounded-lg border-blue-500/30 bg-slate-900/50 text-white backdrop-blur-sm transition-all focus:border-blue-500 placeholder:text-slate-500"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="group">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Input
                        type={registerShowPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerForm.password}
                        onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="h-11 rounded-lg border-blue-500/30 bg-slate-900/50 pr-11 text-white backdrop-blur-sm transition-all focus:border-blue-500 placeholder:text-slate-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setRegisterShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 transition-colors hover:text-blue-400"
                      >
                        {registerShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="group">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <Input
                        type={registerShowConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerForm.confirmPassword}
                        onChange={(event) =>
                          setRegisterForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                        }
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className="h-11 rounded-lg border-blue-500/30 bg-slate-900/50 pr-11 text-white backdrop-blur-sm transition-all focus:border-blue-500 placeholder:text-slate-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setRegisterShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 transition-colors hover:text-blue-400"
                      >
                        {registerShowConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  ref={registerButtonRef}
                  type="submit"
                  disabled={registerLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 font-semibold text-white shadow-lg shadow-blue-600/40 transition-all duration-300 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 focus-visible:ring-2 focus-visible:ring-blue-400/60"
                >
                  {registerLoading ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      Crear cuenta
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 border-t border-slate-700/50 pt-6 text-center text-xs text-slate-400">
                <p>
                  ¿Ya tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      switchMode("login")
                      updateAuthQuery("login")
                    }}
                    className="font-semibold text-blue-400 transition-colors hover:text-blue-300"
                  >
                    Inicia sesión
                  </button>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
