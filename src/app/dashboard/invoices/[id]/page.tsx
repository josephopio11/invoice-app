import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Invoice from "./Invoice";

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
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)))
    .limit(1);

  if (!invoice) notFound();

  const openedInvoice = {
    ...invoice.invoices,
    customer: invoice.customers,
  };

  console.log(openedInvoice);

  return <Invoice invoice={openedInvoice} />;
}
