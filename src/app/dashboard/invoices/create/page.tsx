"use client";

import { createAction } from "@/actions/invoice";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SyntheticEvent, useState } from "react";

const NewInvoicePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleOnSubmit(e: SyntheticEvent) {
    if (isSubmitting) {
      e.preventDefault();
      return;
    }
    setIsSubmitting(true);
  }

  return (
    <div className="flex flex-col gap-4 mb-auto">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Create New Invoice</h1>
      </div>

      <form
        onSubmit={handleOnSubmit}
        action={createAction}
        className="grid gap-4 max-w-xs"
        method="POST"
      >
        <div>
          <Label htmlFor="name" className="block font-semibold mb-2 text-sm">
            Billing Name
          </Label>
          <Input type="text" id="name" name="name" />
        </div>
        <div>
          <Label htmlFor="email" className="block font-semibold mb-2 text-sm">
            Billing Email
          </Label>
          <Input type="email" id="email" name="email" />
        </div>
        <div>
          <Label htmlFor="value" className="block font-semibold mb-2 text-sm">
            Value
          </Label>
          <Input type="text" id="value" name="value" />
        </div>
        <div>
          <Label
            htmlFor="description"
            className="block font-semibold mb-2 text-sm"
          >
            Description
          </Label>
          <Textarea id="description" name="description" />
        </div>
        <div>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
};

export default NewInvoicePage;
