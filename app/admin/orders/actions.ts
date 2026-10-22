"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  adminPasswordsMatch,
  clearAdminCookie,
  isAdminRequest,
  setAdminCookie,
} from "@/lib/admin-auth";
import { FULFILLMENT_STATUSES, type FulfillmentStatus } from "@/lib/order-model";
import { updateOrderFulfillment } from "@/lib/orders";

export async function loginAdmin(
  _previous: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const password = String(formData.get("password") ?? "");
  if (!adminPasswordsMatch(password)) {
    return { error: "That password is incorrect." };
  }

  await setAdminCookie();
  redirect("/admin/orders");
}

export async function signOutAdmin(): Promise<void> {
  await clearAdminCookie();
  redirect("/admin/orders");
}

export async function setOrderFulfillment(
  sessionId: string,
  status: FulfillmentStatus
): Promise<{ ok: true } | { error: string }> {
  if (!(await isAdminRequest())) {
    return { error: "Sign in required." };
  }
  if (
    typeof sessionId !== "string" ||
    !/^[A-Za-z0-9_]{8,255}$/.test(sessionId)
  ) {
    return { error: "Unknown order." };
  }
  if (!FULFILLMENT_STATUSES.includes(status)) {
    return { error: "Unknown fulfillment status." };
  }

  try {
    const updated = await updateOrderFulfillment(sessionId, status);
    if (!updated) return { error: "Order not found." };
  } catch {
    return { error: "Could not save the fulfillment status." };
  }

  revalidatePath("/admin/orders");
  return { ok: true };
}
