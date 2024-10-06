import Container from "./Container";

const Footer = () => {
  return (
    <footer className="mt-6 mb-8">
      <Container className="flex flex-row justify-between items-center gap-2">
        <p className="text-sm">Invoice App &copy; {new Date().getFullYear()}</p>
        <p className="text-sm">
          Created by Joseph Opio of Uganda with NextJS, PostgreSQL and Clerk
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
