type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="flex flex-col justify-center gap-6 h-full max-w-5xl mx-auto my-12">
      {children}
    </main>
  );
};

export default DashboardLayout;
