import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col justify-center bg-red-200 gap-6 text-center h-screen max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold">Invoicing App</h1>
      <p>
        <Button asChild>
          <Link href="/dashboard">Sign In</Link>
        </Button>
      </p>
    </main>
  );
}
