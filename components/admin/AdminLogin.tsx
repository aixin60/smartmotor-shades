"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/admin/orders/actions";

export default function AdminLogin({ hint }: { hint: string | null }) {
  const [state, formAction, pending] = useActionState(loginAdmin, null);

  return (
    <form
      action={formAction}
      className="mx-auto w-full max-w-md rounded-sm border border-border bg-cream-dark px-6 py-8"
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone">
        Internal
      </p>
      <h1 className="mt-2 font-serif text-4xl font-medium text-charcoal">
        Orders
      </h1>
      <p className="mt-2 text-sm text-charcoal-light">
        Sign in to view the manufacturing queue.
      </p>
      <label className="mt-6 block text-xs font-medium uppercase tracking-wider text-stone">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-sm border border-border bg-cream px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-charcoal outline-none focus:border-stone"
        />
      </label>
      {state?.error ? (
        <p role="alert" className="mt-3 text-sm text-charcoal">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-sm bg-charcoal py-3 text-sm font-medium uppercase tracking-wider text-cream transition-colors hover:bg-charcoal-light disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
      {hint ? (
        <p className="mt-4 text-center text-xs text-stone">{hint}</p>
      ) : null}
    </form>
  );
}
