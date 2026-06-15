import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold">
          Owl Security
        </h2>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">

          <li>
            <Link
              href="/dashboard"
              className="block rounded-lg px-4 py-3 hover:bg-slate-800"
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              href="/reports"
              className="block rounded-lg px-4 py-3 hover:bg-slate-800"
            >
              Reports
            </Link>
          </li>

          <li>
            <Link
              href="/clients"
              className="block rounded-lg px-4 py-3 hover:bg-slate-800"
            >
              Clients
            </Link>
          </li>

          <li>
            <Link
              href="/sites"
              className="block rounded-lg px-4 py-3 hover:bg-slate-800"
            >
              Sites
            </Link>
          </li>

          <li>
            <Link
              href="/profile"
              className="block rounded-lg px-4 py-3 hover:bg-slate-800"
            >
              Profile
            </Link>
          </li>

        </ul>
      </nav>
    </aside>
  );
}