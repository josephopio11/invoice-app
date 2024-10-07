"use server";

import { db } from "@/db";
import { Invoices, Status } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAction(formData: FormData) {
  const { userId } = auth();
  const value = Math.floor(parseFloat(formData.get("value") as string) * 100);
  const description = formData.get("description") as string;

  if (!userId) {
    return;
  }

  const invoice = await db
    .insert(Invoices)
    .values({
      value,
      description,
      userId,
      status: "open",
    })
    .returning({
      id: Invoices.id,
    });

  console.log(invoice);

  redirect(`/dashboard/invoices/${invoice[0].id}`);
}

export async function updateStatusAction(formData: FormData) {
  const { userId } = auth();

  if (!userId) return;

  const id = formData.get("id") as string;
  const status = formData.get("status") as Status;

  const results = await db
    .update(Invoices)
    .set({ status })
    .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)));

  console.log("Results:", results);
  revalidatePath(`/dashboard/invoices/${id}`, "page");
}
