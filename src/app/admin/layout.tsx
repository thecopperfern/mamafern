import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/keystatic" className="text-sm font-medium text-fern hover:text-fern-dark transition-colors">
              &larr; Back to CMS
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/admin/schedule" className="text-sm text-charcoal/70 hover:text-charcoal transition-colors">
                Schedule
              </Link>
              <Link href="/admin/activity" className="text-sm text-charcoal/70 hover:text-charcoal transition-colors">
                Activity
              </Link>
              <Link href="/admin/media" className="text-sm text-charcoal/70 hover:text-charcoal transition-colors">
                Media
              </Link>
            </div>
          </div>
          <span className="text-xs text-charcoal/50">Mama Fern Admin</span>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
