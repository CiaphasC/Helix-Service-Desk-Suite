import { AuthScreen } from "@/components/auth/auth-screen"

interface PageProps {
  searchParams?: { auth?: string }
}

export default function LoginPage({ searchParams }: PageProps) {
  const initialMode = searchParams?.auth === "register" ? "register" : "login"
  return <AuthScreen initialMode={initialMode} />
}
