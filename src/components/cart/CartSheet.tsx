import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/stores/cartStore';
import { CheckoutModal } from './CheckoutModal';
import { useState } from 'react';

export function CartSheet() {
  const { 
    items, 
    isOpen, 
    setIsOpen, 
    updateQuantity, 
    removeItem, 
    getTotalPrice 
  } = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);
  
  const totalPrice = getTotalPrice();
  const itemCount = items.length;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </SheetTitle>
            <SheetDescription>
              Review your items before checkout
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">
                  Add some products to get started
                </p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4 p-4 border rounded-lg">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="h-16 w-16 object-cover rounded-md"
                      />
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium text-sm leading-tight">
                          {item.product.title}
                        </h4>
                        <p className="text-lg font-semibold text-price">
                          ${item.product.price.toFixed(2)}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.productId)}
                            className="h-8 w-8 p-0 ml-auto text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Cart Summary */}
                <div className="space-y-4 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-price">${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-primary hover:bg-gradient-primary/90"
                    onClick={() => setShowCheckout(true)}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <CheckoutModal 
        open={showCheckout} 
        onOpenChange={setShowCheckout}
      />
    </>
  );
}