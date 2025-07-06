import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, LayoutDashboard, Calendar, HelpCircle, Settings, Menu } from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Início", icon: Home, to: "/student/home" },
    { label: "Atendimentos", icon: LayoutDashboard, to: "/student/appointments" },
    { label: "Agenda", icon: Calendar, to: "/student/schedule" },
  ];

  const bottomItems = [
    { label: "Ajuda", icon: HelpCircle, to: "/student/help" },
    { label: "Configurações", icon: Settings, to: "/student/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-white">
      <aside className={`bg-white flex flex-col transition-all duration-200 ${collapsed ? "w-20" : "w-64"}`}>
        <div className="px-4 pt-4 pb-2 flex flex-col gap-3">
          {collapsed ? (
            <div className="flex justify-center">
              <button onClick={() => setCollapsed(false)} className="text-gray-500"> <Menu size={18} /> </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="https://i.pravatar.cc/40?u=ester" alt="Avatar" className="w-8 h-8 rounded-full" />
                <div className="leading-tight">
                  <h2 className="font-semibold text-sm">Larissa Manoela</h2>
                  <p className="text-xs text-gray-500">Aluno</p>
                </div>
              </div>
              <button onClick={() => setCollapsed(true)} className="text-gray-500"> <Menu size={18} /> </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <nav className="flex flex-col gap-1">
            {navItems.map(({ label, icon: Icon, to }) => {
              const active = isActive(to);
              return (
                <Link key={label} to={to} className={`flex items-center px-3 py-2 rounded-md text-sm transition-all ${active ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"} ${collapsed ? "justify-center" : "gap-3"}`}>
                  <Icon size={18} className={active ? "text-blue-600" : "text-gray-500"} />
                  {!collapsed && label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-4 py-4">
          <nav className="flex flex-col gap-2 text-sm text-gray-500">
            {bottomItems.map(({ label, icon: Icon, to }) => (
              <Link key={label} to={to} className={`flex items-center ${collapsed ? "justify-center" : "gap-2"} hover:text-gray-700`}>
                <Icon size={16} />
                {!collapsed && label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 bg-gray-50 p-8 overflow-y-auto rounded-tl-2xl">
        {children}
      </main>
    </div>
  );
}