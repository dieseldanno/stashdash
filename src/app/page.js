import AuthForm from "@/components/AuthForm";

export default async function Home() {
  return (
    <main className="min-h-screen w-full">
      Stashdash Inventory Management
      <AuthForm />
    </main>
  );
}
