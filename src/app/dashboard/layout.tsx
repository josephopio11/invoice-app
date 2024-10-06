import Container from "@/components/Container";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main

    // className="flex flex-col justify-center gap-6 h-full max-w-5xl mx-auto mt-24 mb-12"
    >
      <Container className="flex flex-col justify-center gap-6 h-full mt-24 mb-12">
        {children}
      </Container>
      {/* {children} */}
    </main>
  );
};

export default DashboardLayout;
