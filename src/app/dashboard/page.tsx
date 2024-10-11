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
import { Customers, Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { PlusCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
};

const DashboardPage = async () => {
  const { userId, orgId } = auth();
  if (!userId) return;
  let results;

  if (orgId) {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(eq(Invoices.organisationId, orgId));
  } else {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.userId, userId), isNull(Invoices.organisationId)));
  }

  const invoices = results?.map((invoice) => ({
    ...invoice.invoices,
    customer: invoice.customers,
  }));
  console.log(invoices);

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
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="p-0 text-left ">
                <Link
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="font-semibold block p-4"
                >
                  {new Date(invoice.createTs).toLocaleDateString("en-GB", {
                    // weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "2-digit",
                  })}
                </Link>
              </TableCell>
              <TableCell className="p-0 text-left">
                <Link
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="font-semibold block p-4"
                >
                  {invoice.customer.name}
                </Link>
              </TableCell>
              <TableCell className="p-0 text-left">
                <Link
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="block p-4"
                >
                  {invoice.customer.email}
                </Link>
              </TableCell>
              <TableCell className="p-0 text-center">
                <Link
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="block p-4"
                >
                  <Badge
                    className={cn(
                      "rounded-full capitalize",
                      invoice.status === "open" && "bg-blue-500",
                      invoice.status === "paid" && "bg-green-700",
                      invoice.status === "void" && "bg-zinc-700",
                      invoice.status === "uncollectable" && "bg-red-500"
                    )}
                  >
                    {invoice.status}
                  </Badge>
                </Link>
              </TableCell>
              <TableCell className="p-0 text-right">
                <Link
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="font-semibold block p-4"
                >
                  ${(invoice.value / 100).toFixed(2)}
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
