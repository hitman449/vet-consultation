"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, Stethoscope, User, LogOut, Calendar } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const role = (session?.user as any)?.role;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Stethoscope className="text-green-600 w-7 h-7" />
            <span className="text-xl font-bold text-gray-800">
              Vet<span className="text-green-600">Care</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/doctors" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              Find Doctors
            </Link>
            {session ? (
              <>
                <Link
                  href={role === "DOCTOR" ? "/dashboard/doctor" : "/dashboard/patient"}
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors flex items-center gap-1"
                >
                  <Calendar className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {session.user?.name}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-3">
            <Link href="/doctors" className="text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>Find Doctors</Link>
            {session ? (
              <>
                <Link href={role === "DOCTOR" ? "/dashboard/doctor" : "/dashboard/patient"} className="text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-red-500 font-medium text-left">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/auth/register" className="text-green-600 font-medium" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
