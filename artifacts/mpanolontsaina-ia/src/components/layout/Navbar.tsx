import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Link, useLocation } from "wouter";
import { Scale, Globe, User, LogIn, MessageSquare, Menu, X, LogOut, History, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { t, lang, setLang } = useI18n();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLang = () => {
    setLang(lang === "fr" ? "mg" : "fr");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navLinks = [
    { href: "/chat", label: t("nav.chat"), icon: MessageSquare },
  ];

  if (isAuthenticated) {
    navLinks.push({ href: "/history", label: t("nav.history"), icon: History });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-1.5 rounded-lg transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/25 group-hover:scale-105">
            <img src="/logo.png" alt="Mpanolontsaina IA" className="w-6 h-6 object-contain" />
          </div>
          <span className="font-serif font-semibold text-lg hidden sm:inline-block text-primary transition-colors">
            {t("app.name")}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`transition-all duration-200 flex items-center gap-2 hover:text-primary hover:translate-y-[-1px] ${
                  location.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-3 pl-6 border-l">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleLang} 
              className="gap-2 text-xs uppercase font-semibold transition-all duration-200 hover:bg-accent/10 hover:text-accent hover:scale-105"
            >
              <Globe className="w-4 h-4" />
              {lang === "fr" ? "FR" : "MG"}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              aria-label={t("common.themeToggle")}
              className="transition-all duration-200 hover:scale-105 hover:bg-muted"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            
            {isAuthenticated ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 transition-all duration-200 hover:bg-primary/5 hover:border-primary/30 hover:shadow-sm" 
                asChild
              >
                <Link href="/account">
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">{user?.full_name || user?.email}</span>
                </Link>
              </Button>
            ) : (
              <Button 
                size="sm" 
                className="gap-2 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-primary/20 hover:scale-105" 
                asChild
              >
                <Link href="/login">
                  <LogIn className="w-4 h-4" />
                  {t("nav.login")}
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            aria-label={t("common.themeToggle")}
            className="transition-all duration-200 hover:scale-105"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLang}
            className="transition-all duration-200 hover:scale-105"
          >
            <Globe className="w-4 h-4" />
            <span className="sr-only">Toggle language</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="transition-all duration-200 hover:scale-105"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted text-sm font-medium transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            
            <div className="h-px bg-border my-2" />
            
            {isAuthenticated ? (
              <>
                <Link 
                  href="/account" 
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted text-sm font-medium transition-colors duration-200" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  {t("nav.account")}
                </Link>
                <button 
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-destructive/10 text-destructive text-sm font-medium text-left w-full transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Button className="w-full justify-start gap-2" variant="outline" asChild>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn className="w-4 h-4" />
                    {t("nav.login")}
                  </Link>
                </Button>
                <Button className="w-full justify-start gap-2" asChild>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    {t("nav.register")}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
