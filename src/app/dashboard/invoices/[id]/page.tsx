import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function SingleInvoicePage({ params }: Props) {
  const { id } = await params;
  const invoiceId = parseInt(id);

  if (isNaN(invoiceId)) {
    throw new Error("Invalid invoice id");
  }
  const [invoice] = await db
    .select()
    .from(Invoices)
    .where(eq(Invoices.id, invoiceId))
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
          <Button variant={"ghost"} className="inline-flex gap-2" asChild>
            <Link href="/dashboard/invoices/create">Add Invoice</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Back</Link>
          </Button>
        </p>
      </div>
      <pre>{JSON.stringify(invoice, null, 2)}</pre>
    </>
  );
}
