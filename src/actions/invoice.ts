"use server";

import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
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
