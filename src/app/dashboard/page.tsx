import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { PlusCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
};

const DashboardPage = async () => {
  const { userId } = auth();
  if (!userId) return;
  const results = await db
    .select()
    .from(Invoices)
    .where(eq(Invoices.userId, userId));

  return (
    <div className="flex flex-col gap-4 mb-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p>
          <Button variant={"ghost"} className="inline-flex gap-2" asChild>
            <Link href="/dashboard/invoices/create">
              <PlusCircle className="w-4 h-4" />
              Add Invoice
            </Link>
          </Button>
        </p>
      </div>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px] p-4">Date</TableHead>
            <TableHead className="p-4">Customer</TableHead>
            <TableHead className="p-4">Email</TableHead>
            <TableHead className="text-center p-4">Status</TableHead>
            <TableHead className="text-right p-4">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell className="p-0 text-left ">
                <Link
                  href={`/dashboard/invoices/${result.id}`}
                  className="font-semibold block p-4"
                >
                  {new Date(result.createTs).toLocaleDateString("en-GB", {
                    // weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "2-digit",
                  })}
                </Link>
              </TableCell>
              <TableCell className="p-0 text-left">
                <Link
                  href={`/dashboard/invoices/${result.id}`}
                  className="font-semibold block p-4"
                >
                  Philip J. Fry
                </Link>
              </TableCell>
              <TableCell className="p-0 text-left">
                <Link
                  href={`/dashboard/invoices/${result.id}`}
                  className="block p-4"
                >
                  philip@fryingpan.com
                </Link>
              </TableCell>
              <TableCell className="p-0 text-center">
                <Link
                  href={`/dashboard/invoices/${result.id}`}
                  className="block p-4"
                >
                  <Badge
                    className={cn(
                      "rounded-full capitalize",
                      result.status === "open" && "bg-emerald-500",
                      result.status === "paid" && "bg-green-700",
                      result.status === "void" && "bg-zinc-700",
                      result.status === "uncollectable" && "bg-red-500"
                    )}
                  >
                    {result.status}
                  </Badge>
                </Link>
              </TableCell>
              <TableCell className="p-0 text-right">
                <Link
                  href={`/dashboard/invoices/${result.id}`}
                  className="font-semibold block p-4"
                >
                  ${(result.value / 100).toFixed(2)}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DashboardPage;
