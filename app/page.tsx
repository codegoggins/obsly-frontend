import { Logo } from "@/components/logo";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8">
      <Logo size="lg" />
      <Logo size="md" />
      <Logo size="sm" showText={false} />
    </main>
  );
}
