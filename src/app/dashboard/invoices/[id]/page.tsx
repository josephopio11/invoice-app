import { updateStatusAction } from "@/actions/invoice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { ChevronDown, Pencil } from "lucide-react";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function SingleInvoicePage({ params }: Props) {
  const { userId } = auth();
  if (!userId) return;
  const { id } = await params;
  const invoiceId = parseInt(id);

  if (isNaN(invoiceId)) {
    throw new Error("Invalid invoice id");
  }
  const [invoice] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)))
    .limit(1);

  if (!invoice) notFound();

  return (
    <div className="flex flex-col gap-4 mb-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-4">
          Invoice #{invoiceId}
          <Badge
            className={cn(
              "rounded-full capitalize",
              invoice.status === "open" && "bg-blue-500",
              invoice.status === "paid" && "bg-emerald-500",
              invoice.status === "void" && "bg-zinc-700",
              invoice.status === "uncollectable" && "bg-red-500"
            )}
          >
            {invoice.status}
          </Badge>
        </h1>
        <p className="flex gap-2 flex-col">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} className="inline-flex gap-2">
                <Pencil className="w-4 h-4" />
                Change Status
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
              <DropdownMenuSeparator />
              {AVAILABLE_STATUSES.map((status) => (
                <DropdownMenuItem key={status.id}>
                  <form action={updateStatusAction}>
                    <input type="hidden" name="id" value={invoiceId} />
                    <input type="hidden" name="status" value={status.id} />
                    <button>{status.label}</button>
                  </form>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </p>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-3 w-full">
          <h2 className="text-xl font-bold">Invoice Details</h2>
          <div className="flex flex-row gap-4 w-full md:w-1/2 justify-between">
            <p>Invoice Date:</p>
            <p className="font-bold">{invoice.createTs.toLocaleDateString()}</p>
          </div>
          <div className="flex flex-row gap-4 w-full md:w-1/2 justify-between">
            <p>Amount:</p>
            <p className="font-bold">${invoice.value / 100}</p>
          </div>
          <div className="flex flex-row gap-4 w-full md:w-1/2 justify-between">
            <p>Description:</p>
            <p className="font-bold text-right">{invoice.description}</p>
          </div>
          <div className="flex flex-row gap-4 w-full md:w-1/2 justify-between">
            <p>User:</p>
            <p className="font-bold">{invoice.userId}</p>
          </div>
        </div>
        {/* <pre>{JSON.stringify(invoice, null, 2)}</pre> */}
      </div>
    </div>
  );
}
