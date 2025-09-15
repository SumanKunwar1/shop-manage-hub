import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { CartSheet } from '@/components/cart/CartSheet';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Header() {
  const location = useLocation();
  const { getTotalItems, toggleCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const isHomePage = location.pathname === '/';
  const isProductsPage = location.pathname === '/products';
  const totalItems = getTotalItems();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <span className="text-sm font-bold text-primary-foreground">E</span>
            </div>
            <span className="text-xl font-bold">EcomStore</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isHomePage ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isProductsPage ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Products
            </Link>
          </nav>

          {/* Search Bar (on products page) */}
          {isProductsPage && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleCart}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated() ? (
              <Link to="/dashboard/products">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {user?.email}
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <CartSheet />
    </>
  );
}