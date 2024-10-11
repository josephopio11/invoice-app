import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import Container from "./Container";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="border-b shadow-lg absolute top-0 w-full">
      <Container className="flex justify-between items-center py-4 max-w-5xl mx-auto">
        <div className="flex flex-row items-center gap-2">
          <Link href={"/dashboard"} className="font-bold">
            Invoice App
          </Link>
          <span className="text-slate-300">/</span>
          <SignedIn>
            <span className="-ml-2">
              <OrganizationSwitcher
                afterCreateOrganizationUrl={"/dashboard"}
                afterSelectOrganizationUrl={"/dashboard"}
              />
            </span>
          </SignedIn>
        </div>
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
