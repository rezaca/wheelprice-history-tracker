"use client";

import { useState } from "react";
import { Wheel } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

interface PriceAlertFormProps {
  wheel: Wheel;
  className?: string;
}

export function PriceAlertForm({ wheel, className }: PriceAlertFormProps) {
  const [targetPrice, setTargetPrice] = useState(wheel.currentPrice);
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Calculate min and max prices for the slider
  const minPrice = wheel.currentPrice * 0.7;
  const maxPrice = wheel.currentPrice * 1.3;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the alert data to the server
    console.log("Price alert set:", { wheelId: wheel.id, targetPrice, email });
    setIsDialogOpen(false);
  };

  return (
    <div className={`${className}`}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            Set Price Alert
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Price Alert</DialogTitle>
            <DialogDescription>
              We&apos;ll notify you when {wheel.name} reaches your target price.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Price</label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{formatPrice(minPrice)}</span>
                <span className="text-lg font-semibold">{formatPrice(targetPrice)}</span>
                <span className="text-sm text-gray-500">{formatPrice(maxPrice)}</span>
              </div>
              <Slider
                value={[targetPrice]}
                min={minPrice}
                max={maxPrice}
                step={1}
                onValueChange={(value) => setTargetPrice(value[0])}
                className="py-4"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="submit">Create Alert</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 