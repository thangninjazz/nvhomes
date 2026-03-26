"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token, user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Client-side Route Guard: Chỉ kiểm tra trên trình duyệt
    if (typeof window !== 'undefined') {
        const isLoginRoute = pathname === '/admin/login';
        
        if (!token && !isLoginRoute) {
            router.push('/admin/login');
        } else if (token && isLoginRoute) {
            router.push('/admin'); // Đã login rồi thì ko vào trang login nữa
        } else {
            setIsAuthorized(true);
        }
    }
  }, [token, pathname, router]);

  // Nếu đang ở trang login, render component bình thường (không có Sidebar của Admin)
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Nếu chưa xác thực xong, hiển thị màn hình chờ (tránh lọt nội dung)
  if (!isAuthorized) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100">
              <div className="w-12 h-12 border-4 border-stone-300 border-t-stone-900 rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-stone-500 uppercase tracking-widest text-xs">🛡 Kiểm Tra Hệ Thống Phân Quyền...</p>
          </div>
      );
  }

  // Render Admin Dashboard khi đã đăng nhập
  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden text-stone-900 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-stone-900 text-stone-300 flex flex-col shrink-0 shadow-2xl z-20">
        <div className="h-[72px] flex items-center justify-center border-b border-stone-800">
          <Link href="/admin" className="text-2xl font-black text-white tracking-widest uppercase">NV.CMS</Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-8 flex flex-col gap-2 px-5">
          <p className="text-xs font-bold tracking-widest uppercase text-stone-500 mb-2 pl-2">System Config</p>
          <Link href="/admin" className="px-5 py-3.5 rounded-xl hover:bg-stone-800 hover:text-white font-medium transition-colors">
            Tổng Quan (Dashboard)
          </Link>
          <Link href="/admin/menu" className="px-5 py-3.5 rounded-xl hover:bg-stone-800 hover:text-white font-medium transition-colors">
            Quản Lý Menu
          </Link>
          
          <p className="text-xs font-bold tracking-widest uppercase text-stone-500 mb-2 mt-6 pl-2">E-Commerce</p>
          <Link href="/admin/products" className="px-5 py-3.5 rounded-xl hover:bg-stone-800 hover:text-white font-medium transition-colors">
            Quản Lý Sản Phẩm
          </Link>
          <Link href="/admin/projects" className="px-5 py-3.5 rounded-xl hover:bg-stone-800 hover:text-white font-medium transition-colors">
            Portfolio Dự Án
          </Link>
          
          <p className="text-xs font-bold tracking-widest uppercase text-stone-500 mb-2 mt-6 pl-2">CRM</p>
          <Link href="/admin/customers" className="px-5 py-3.5 rounded-xl hover:bg-stone-800 hover:text-white font-medium transition-colors">
            CRM Khách Hàng
          </Link>
        </nav>
        <div className="p-6 border-t border-stone-800 bg-stone-950/50 flex flex-col gap-3">
          <button onClick={() => { logout(); router.push('/admin/login'); }} className="flex items-center justify-center gap-2 w-full py-3 bg-red-600/10 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors">
            Đăng Xuất
          </button>
          <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 bg-stone-800 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-700 transition-colors text-white">
            Trở Về Web Client
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-stone-50/50 z-10 relative">
        <header className="h-[72px] bg-white border-b border-stone-200 flex items-center justify-between px-10 shrink-0 shadow-sm">
          <h2 className="text-xl font-bold text-stone-800">Trình Quản Trị Hệ Sinh Thái</h2>
          <div className="flex items-center gap-5">
            <div className="text-right">
                <span className="text-[11px] font-black tracking-widest uppercase text-stone-400 block">{user?.role || 'Admin'}</span>
                <span className="text-sm font-bold text-stone-800">{user?.email || 'Administrator'}</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-tr from-stone-800 to-stone-400 rounded-full shadow-md border-2 border-white cursor-pointer hover:scale-105 transition-transform"></div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
