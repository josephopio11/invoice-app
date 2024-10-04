"use server";

import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { redirect } from "next/navigation";

export async function createAction(formData: FormData) {
  const value = Math.floor(parseFloat(formData.get("value") as string) * 100);
  // if (isNaN(value)) {
  //   return { error: "Invalid value" };
  // }
  const description = formData.get("description") as string;

  const invoice = await db
    .insert(Invoices)
    .values({
      value,
      description,
      status: "open",
    })
    .returning({
      id: Invoices.id,
    });

  console.log(invoice);

  redirect(`/dashboard/invoices/${invoice[0].id}`);
}
