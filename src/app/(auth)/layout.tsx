import Container from "@/components/Container";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className="flex justify-center my-32">{children}</Container>
  );
};

export default AuthLayout;
