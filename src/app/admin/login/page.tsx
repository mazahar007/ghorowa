import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm">
        <p className="font-brand text-xl font-medium tracking-[0.2em]">GHOROWA</p>
        <h1 className="mb-6 mt-1 font-bangla text-2xl font-bold">অ্যাডমিন লগইন</h1>
        <LoginForm />
      </div>
    </div>
  );
}
