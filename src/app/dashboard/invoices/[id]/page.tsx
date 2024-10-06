import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";

const AVAILABLE_STATUSES = [
  { id: "open", label: "Open" },
  { id: "paid", label: "Paid" },
  { id: "void", label: "Void" },
  { id: "uncollectable", label: "Uncollectable" },
];

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
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-4">
          Invoice #{invoiceId}
          <Badge
            className={cn(
              "rounded-full capitalize",
              invoice.status === "open" && "bg-emerald-500",
              invoice.status === "paid" && "bg-green-700",
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
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {AVAILABLE_STATUSES.map((status) => (
                <DropdownMenuItem key={status.id}>
                  {status.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </p>
      </div>
      <pre>{JSON.stringify(invoice, null, 2)}</pre>
    </>
  );
}
