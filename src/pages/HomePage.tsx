import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import { Header } from '@/components/layout/Header';

export default function HomePage() {
  const { products, isLoading, fetchProducts } = useProductStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchProducts(8); // Fetch only 8 featured products for homepage
  }, [fetchProducts]);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Amazing Products
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
              Shop the latest trends and find everything you need in one place
            </p>
            <Link to="/products">
              <Button size="lg" variant="secondary" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Check out our most popular items, carefully selected just for you
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="h-96">
                  <CardContent className="p-4">
                    <Skeleton className="h-48 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-6 w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
                  <CardContent className="p-4">
                    <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <Badge variant="secondary" className="mb-2 capitalize">
                      {product.category}
                    </Badge>
                    
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 leading-tight">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {product.rating.rate}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({product.rating.count})
                      </span>
                    </div>
                    
                    <p className="text-xl font-bold text-price mb-3">
                      ${product.price.toFixed(2)}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Link to={`/product/${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      onClick={() => addItem(product)}
                      className="bg-gradient-primary hover:bg-gradient-primary/90"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" className="bg-gradient-primary hover:bg-gradient-primary/90">
                View All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover your new favorite products today
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-gradient-primary hover:bg-gradient-primary/90">
              Browse All Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}