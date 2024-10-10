"use client";

import { deleteInvoiceAction, updateStatusAction } from "@/actions/invoice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import { Customers, Invoices, Status } from "@/db/schema";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  CreditCard,
  Ellipsis,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useOptimistic } from "react";
import { toast } from "sonner";

interface InvoiceProps {
  invoice: typeof Invoices.$inferSelect & {
    customer: typeof Customers.$inferSelect;
  };
}

const Invoice = ({ invoice }: InvoiceProps) => {
  const [currentStatus, setCurrentStatus] = useOptimistic(
    invoice.status,
    (state, newStatus) => {
      return String(newStatus);
    }
  );

  async function handleOnUpdateStatus(formData: FormData) {
    const originalStatus = currentStatus;
    setCurrentStatus(formData.get("status") as Status);
    try {
      await updateStatusAction(formData);
      toast.success("Status updated successfully", {
        description: "Invoice status updated successfully",
      });
    } catch (error) {
      setCurrentStatus(originalStatus);
      toast.error("Error", { description: "Couldn't update status" + error });
    }
  }

  return (
    <div className="flex flex-col gap-4 mb-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-4">
          Invoice #{invoice.id}
          <Badge
            className={cn(
              "rounded-full capitalize",
              currentStatus === "open" && "bg-blue-500",
              currentStatus === "paid" && "bg-emerald-500",
              currentStatus === "void" && "bg-zinc-700",
              currentStatus === "uncollectable" && "bg-red-500"
            )}
          >
            {currentStatus}
          </Badge>
        </h1>
        <div className="flex gap-2 flex-row">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} className="inline-flex gap-2">
                <Pencil className="w-4 h-4" />
                Change Status
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {AVAILABLE_STATUSES.map((status) => (
                <DropdownMenuItem key={status.id}>
                  <form action={handleOnUpdateStatus}>
                    <input type="hidden" name="id" value={invoice.id} />
                    <input type="hidden" name="status" value={status.id} />
                    <button>{status.label}</button>
                  </form>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="flex items-center gap-2"
                  variant="outline"
                  type="button"
                >
                  <span className="sr-only">More Options</span>
                  <Ellipsis className="w-4 h-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2" type="submit">
                      <Trash2 className="w-4 h-auto" />
                      Delete Invoice
                    </button>
                  </DialogTrigger>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link
                    href={`/invoices/${invoice.id}/payment`}
                    className="flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-auto" />
                    Payment
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl">Delete Invoice?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your invoice and remove your data from our servers.
                </DialogDescription>
                <DialogFooter>
                  <form
                    className="flex justify-center"
                    action={deleteInvoiceAction}
                  >
                    <input type="hidden" name="id" value={invoice.id} />
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2"
                      type="submit"
                    >
                      <Trash2 className="w-4 h-auto" />
                      Delete Invoice
                    </Button>
                  </form>
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* <div className="flex flex-col gap-4 w-full">
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
      </div> */}
      <p className="text-3xl mb-3">${(invoice.value / 100).toFixed(2)}</p>

      <p className="text-lg mb-8">{invoice.description}</p>

      <h2 className="font-bold text-lg mb-4">Billing Details</h2>

      <ul className="grid gap-2">
        <li className="flex gap-4">
          <span className="block w-28 flex-shrink-0 font-bold text-sm">
            Invoice ID
          </span>
          <span>{invoice.id}</span>
        </li>
        <li className="flex gap-4">
          <span className="block w-28 flex-shrink-0 font-bold text-sm">
            Invoice Date
          </span>
          <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
        </li>
        <li className="flex gap-4">
          <span className="block w-28 flex-shrink-0 font-bold text-sm">
            Billing Name
          </span>
          <span>{invoice.customer.name}</span>
        </li>
        <li className="flex gap-4">
          <span className="block w-28 flex-shrink-0 font-bold text-sm">
            Billing Email
          </span>
          <span>{invoice.customer.email}</span>
        </li>
      </ul>
    </div>
  );
};

export default Invoice;
