import Link from "next/link";
import Container from "./Container";

const Footer = () => {
  return (
    <footer className="mt-6 mb-8">
      <Container className="flex flex-row justify-between items-center gap-2">
        <p className="text-sm">
          &copy; {new Date().getFullYear()}{" "}
          <Link href="/" className="font-bold hover:underline">
            Invoice App{" "}
          </Link>
        </p>
        <p className="text-sm">
          Created by{" "}
          <Link
            href="https://josephopio.com"
            className="font-bold hover:underline"
          >
            Joseph Opio
          </Link>{" "}
          of Uganda with{" "}
          <Link href="https://nextjs.org" className="font-bold hover:underline">
            NextJS
          </Link>
          ,{" "}
          <Link
            href="https://www.postgresql.org"
            className="font-bold hover:underline"
          >
            PostgreSQL
          </Link>{" "}
          and{" "}
          <Link href="https://clerk.com" className="font-bold hover:underline">
            Clerk
          </Link>
          .
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
