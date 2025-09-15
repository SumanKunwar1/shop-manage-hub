import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, ShoppingCart, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Toggle } from '@/components/ui/toggle';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import { Header } from '@/components/layout/Header';
import { ProductFilters } from '@/types';

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const { 
    getFilteredProducts, 
    categories, 
    isLoading, 
    fetchProducts, 
    fetchCategories,
    setFilters,
    clearFilters,
    filters
  } = useProductStore();
  const { addItem } = useCartStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const products = getFilteredProducts();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    const newFilters: ProductFilters = {
      search: searchQuery || undefined,
      category: selectedCategory || undefined,
    };
    setFilters(newFilters);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, setFilters]);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating.rate - a.rating.rate;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Paginate products
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('');
    clearFilters();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-lg text-muted-foreground">
            Discover our full collection of amazing products
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="capitalize">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Default</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Toggle
              pressed={viewMode === 'grid'}
              onPressedChange={() => setViewMode('grid')}
              size="sm"
            >
              <Grid className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={viewMode === 'list'}
              onPressedChange={() => setViewMode('list')}
              size="sm"
            >
              <List className="h-4 w-4" />
            </Toggle>
          </div>

          {/* Clear Filters */}
          {(searchQuery || selectedCategory || sortBy) && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, sortedProducts.length)} of {sortedProducts.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {Array.from({ length: 12 }).map((_, i) => (
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
          <>
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {paginatedProducts.map((product) => (
                <Card key={product.id} className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0 ${viewMode === 'list' ? 'flex flex-row' : ''}`}>
                  <CardContent className={`p-4 ${viewMode === 'list' ? 'flex flex-row gap-4 flex-1' : ''}`}>
                    <div className={`overflow-hidden rounded-lg bg-muted ${viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-square mb-4'}`}>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className={viewMode === 'list' ? 'flex flex-col flex-1 justify-between' : ''}>
                      <div>
                        <Badge variant="secondary" className="mb-2 capitalize">
                          {product.category}
                        </Badge>
                        
                        <h3 className={`font-semibold mb-2 line-clamp-2 leading-tight ${viewMode === 'list' ? 'text-lg' : 'text-sm'}`}>
                          {product.title}
                        </h3>
                        
                        {viewMode === 'list' && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {product.description}
                          </p>
                        )}
                        
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
                      </div>
                      
                      <div className={`flex gap-2 ${viewMode === 'list' ? 'mt-auto' : ''}`}>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? "bg-gradient-primary hover:bg-gradient-primary/90" : ""}
                  >
                    {i + 1}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}