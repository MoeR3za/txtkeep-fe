import Header from "./components/header";

export default function DashboardLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="absolute inset-0 b-grid-black/[0.02] -z-10" />

      <Header />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {props.children}
      </main>
    </div>
  );
}
