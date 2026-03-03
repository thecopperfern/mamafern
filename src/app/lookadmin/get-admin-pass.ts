/**
 * Returns the lookbook admin password from environment variables.
 *
 * Checks both LOOK_ADMIN_PASS and NEXT_PUBLIC_LOOK_ADMIN_PASS to handle
 * cases where Hostinger has the var set under either name. Trims whitespace
 * to avoid invisible copy-paste issues from the hPanel env var editor.
 */
export function getAdminPass(): string | undefined {
  const raw =
    process.env.LOOK_ADMIN_PASS ||
    process.env.NEXT_PUBLIC_LOOK_ADMIN_PASS;
  return raw?.trim() || undefined;
}
