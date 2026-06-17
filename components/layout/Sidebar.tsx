"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  FiHome,
  FiFileText,
  FiUsers,
  FiMapPin,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");

  };

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <FiHome size={20} />,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: <FiFileText size={20} />,
    },
    {
      name: "Clients",
      href: "/clients",
      icon: <FiUsers size={20} />,
    },
    
    {
      name: "Profile",
      href: "/profile",
      icon: <FiUser size={20} />,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-20 left-0
          h-[calc(100vh-80px)]
          w-64
          bg-gradient-to-b
          from-[#07143A]
          via-[#061332]
          to-[#04102d]
          text-white
          z-50
          shadow-2xl
          transition-transform duration-300
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >

        <nav className="h-full flex flex-col px-4 pt-20 pb-5">

          <ul className="space-y-5 flex-1">

            {menuItems.map((item) => {

              const isActive =
                pathname === item.href;

              return (
                <li key={item.href}>

                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`
                      group
                      flex
                      items-center
                      gap-3
                      px-5
                    
                      py-3.5
                      rounded-xl
                      text-[18px]
                      font-semibold
                      tracking-[1px]
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? `
                            bg-blue-500/15
                            border-l-4
                            border-blue-400
                            text-blue-300
                            shadow-lg
                          `
                          : `
                            text-white
                            hover:bg-white/10
                            hover:text-blue-300
                            hover:translate-x-1
                            hover:shadow-lg
                          `
                      }
                    `}
                  >
                    {item.icon}

                    <span>
                      {item.name}
                    </span>

                  </Link>

                </li>
              );
            })}

          </ul>

          <div className="border-t border-white/10 my-5"></div>

          <button
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-gradient-to-r
              from-red-600
              to-red-500
              hover:from-red-700
              hover:to-red-600
              text-white
              font-semibold
              tracking-wide
              py-3.5
              text-[18px]
              rounded-xl
              shadow-lg
              transition-all
              duration-200
              hover:scale-[1.02]
            "
          >
            <FiLogOut size={18} />

            Logout
          </button>

        </nav>

      </aside>
    </>
  );
}