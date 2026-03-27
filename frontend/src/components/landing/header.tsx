"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"

interface NavLink {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [expandedParent, setExpandedParent] = useState<string | null>(null)

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await api.get('/categories/tree')
        // Filter visible root nodes
        const visibleRoots = res.data.filter((c: any) => c.isVisible)
        setCategories(visibleRoots)
      } catch (err) {
        console.error("Error fetching menu tree:", err)
      }
    }
    fetchTree()
  }, [])

  const navLinks: NavLink[] = [
    { href: "/", label: "Trang chủ" },
    // Map database categories to menu items
    ...categories.map(cat => ({
      href: `/category/${cat.slug}`,
      label: cat.name,
      children: cat.children?.filter((child: any) => child.isVisible).map((child: any) => ({
        href: `/category/${child.slug}`,
        label: child.name
      }))
    })),
    { href: "/#about", label: "Về NV Home" },
    { href: "/#contact", label: "Liên hệ" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-serif text-xl font-bold">N</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-xl font-semibold tracking-tight">NV Homes</span>
              <p className="text-xs text-muted-foreground tracking-widest uppercase">Nội thất cao cấp</p>
            </div>
          </Link>
 
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.label} className="group relative">
                <Link
                  href={link.href}
                  className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1"
                >
                  {link.label}
                  {link.children && link.children.length > 0 && (
                    <span className="text-[10px] opacity-50 group-hover:rotate-180 transition-transform">▼</span>
                  )}
                </Link>
                
                {link.children && link.children.length > 0 && (
                  <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-white border border-border/50 shadow-xl p-4 min-w-[200px] grid gap-2">
                       {link.children.map(child => (
                         <Link 
                           key={child.label} 
                           href={child.href}
                           className="text-xs py-2 px-3 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                         >
                           {child.label}
                         </Link>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center gap-4">
            <a href="tel:0966245396" className="hidden md:flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4" />
              <span className="font-medium">0966.245.396</span>
            </a>
            <Link href="#contact">
              <Button className="hidden sm:flex rounded-none px-6" size="sm">
                Nhận báo giá
              </Button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
 
        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-6 border-t border-border bg-background">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <div key={link.label} className="flex flex-col px-2">
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={() => !link.children && setIsOpen(false)}
                      className="text-lg py-3 text-foreground/80 hover:text-primary transition-colors font-bold flex-1"
                    >
                      {link.label}
                    </Link>
                    {link.children && link.children.length > 0 && (
                      <button 
                        onClick={() => setExpandedParent(expandedParent === link.label ? null : link.label)}
                        className="p-3 text-muted-foreground hover:text-primary transition-all rounded-full hover:bg-secondary"
                      >
                        <span className={`inline-block transition-transform duration-300 ${expandedParent === link.label ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                    )}
                  </div>
                  
                  {link.children && link.children.length > 0 && expandedParent === link.label && (
                    <div className="pl-6 flex flex-col gap-3 border-l-2 border-primary/20 mt-1 mb-4 animate-in slide-in-from-top-2 duration-300">
                      {link.children.map(child => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className="text-sm py-2 text-muted-foreground hover:text-primary font-medium border-b border-border/30 last:border-0"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="px-2 mt-6">
                <Link href="#contact" onClick={() => setIsOpen(false)}>
                  <Button className="rounded-none w-full py-6 text-lg font-black uppercase tracking-widest">
                    Nhận báo giá ngay
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
