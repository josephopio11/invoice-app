import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Container from "./Container";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="border-b shadow-lg absolute top-0 w-full">
      <Container className="flex justify-between items-center py-4 max-w-5xl mx-auto">
        <p className="font-bold">
          <Link href={"/dashboard"}>Invoice App</Link>
        </p>
        <div className="">
          <SignedOut>
            <Button asChild>
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Container>
    </header>
  );
};

export default Header;
