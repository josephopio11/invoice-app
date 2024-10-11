"use server";

import { db } from "@/db";
import { Customers, Invoices, Status } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export async function createAction(formData: FormData) {
  const { userId, orgId } = auth();

  const value = Math.floor(parseFloat(formData.get("value") as string) * 100);
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!userId) {
    return;
  }

  const [customer] = await db
    .insert(Customers)
    .values({
      name,
      email,
      userId,
      organisationId: orgId || null,
    })
    .returning({
      id: Customers.id,
    });

  const [invoice] = await db
    .insert(Invoices)
    .values({
      value,
      description,
      userId,
      status: "open",
      customerId: customer.id,
      organisationId: orgId || null,
    })
    .returning({
      id: Invoices.id,
    });

  console.log(invoice);

  redirect(`/dashboard/invoices/${invoice.id}`);
}

export async function updateStatusAction(formData: FormData) {
  const { userId, orgId } = auth();

  if (!userId) return;

  const id = formData.get("id") as string;
  const status = formData.get("status") as Status;

  try {
    if (orgId) {
      await db
        .update(Invoices)
        .set({ status })
        .where(
          and(eq(Invoices.id, parseInt(id)), eq(Invoices.organisationId, orgId))
        );
    } else {
      await db
        .update(Invoices)
        .set({ status })
        .where(
          and(
            eq(Invoices.id, parseInt(id)),
            eq(Invoices.userId, userId),
            isNull(Invoices.organisationId)
          )
        );
    }
    toast.success("Success", { description: "Invoice updated successfully" });
  } catch (error) {
    console.log(error);
    toast.error("Error", { description: "Couldn't update invoice" + error });
  }

  revalidatePath(`/dashboard/invoices/${id}`, "page");
}

export async function deleteInvoiceAction(formData: FormData) {
  const { userId, orgId } = auth();
  if (!userId) return;

  const id = formData.get("id") as string;

  try {
    if (orgId) {
      await db
        .delete(Invoices)
        .where(
          and(eq(Invoices.id, parseInt(id)), eq(Invoices.organisationId, orgId))
        );
    } else {
      await db
        .delete(Invoices)
        .where(
          and(
            eq(Invoices.id, parseInt(id)),
            eq(Invoices.userId, userId),
            isNull(Invoices.organisationId)
          )
        );
    }
    toast.success("Success", { description: "Invoice deleted successfully" });
  } catch (error) {
    console.log(error);
    toast.error("Error", { description: "Couldn't delete invoice" });
  }

  redirect("/dashboard");
}
