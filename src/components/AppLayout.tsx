function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh w-full flex justify-center items-center relative">
      {children}
    </main>
  );
}

export default AppLayout;
