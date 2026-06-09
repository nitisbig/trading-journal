"use client";

import { useActionState, useEffect, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { createTrade, type CreateTradeState } from "@/app/(dashboard)/trades/actions";

interface AddTradeModalProps {
  open: boolean;
  onClose: () => void;
}

const inputClass =
  "rounded-md border border-border bg-app px-3 py-2 text-sm text-ink outline-none focus:border-brand";
const labelClass =
  "text-xs font-semibold uppercase tracking-wide text-ink-muted";

export function AddTradeModal({ open, onClose }: AddTradeModalProps) {
  const [state, formAction, pending] = useActionState<CreateTradeState, FormData>(
    createTrade,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Close + reset once a trade saves successfully.
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      onClose();
    }
  }, [state.success, onClose]);

  return (
    <Modal open={open} onClose={onClose} title="Add Trade">
      <form ref={formRef} action={formAction} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Symbol</span>
            <input name="symbol" required placeholder="NVDA" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Direction</span>
            <select name="direction" defaultValue="long" className={inputClass}>
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Entry Price</span>
            <input
              name="entry_price"
              type="number"
              step="any"
              required
              placeholder="0.00"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Exit Price</span>
            <input
              name="exit_price"
              type="number"
              step="any"
              placeholder="optional"
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Quantity</span>
          <input
            name="quantity"
            type="number"
            step="any"
            required
            placeholder="100"
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Entry At</span>
            <input
              name="entry_at"
              type="datetime-local"
              required
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Exit At</span>
            <input name="exit_at" type="datetime-local" className={inputClass} />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Strategy</span>
          <input
            name="strategy"
            placeholder="Breakout, mean reversion…"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Tags</span>
          <input
            name="tags"
            placeholder="comma, separated"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Notes</span>
          <textarea
            name="notes"
            rows={3}
            placeholder="What was the setup and how did it play out?"
            className={inputClass}
          />
        </label>

        {state.error && (
          <p className="rounded-md bg-loss-soft px-3 py-2 text-sm text-loss">
            {state.error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save Trade"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
