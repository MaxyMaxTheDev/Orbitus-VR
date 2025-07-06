
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

const galleryItems = [
  { id: 1, src: 'https://placehold.co/800x600.png', title: 'Cybernetic Metropolis', hint: 'cyberpunk city' },
  { id: 2, src: 'https://placehold.co/800x600.png', title: 'Nebula Nursery', hint: 'space nebula' },
  { id: 3, src: 'https://placehold.co/800x600.png', title: 'Floating Islands of Aethel', hint: 'floating islands' },
  { id: 4, src: 'https://placehold.co/800x600.png', title: 'Abyssal Trench', hint: 'underwater trench' },
  { id: 5, src: 'https://placehold.co/800x600.png', title: 'Android Dreams', hint: 'futuristic android' },
  { id: 6, src: 'https://placehold.co/800x600.png', title: 'Solar Flare', hint: 'solar flare' },
  { id: 7, src: 'https://placehold.co/800x600.png', title: 'Virtual Zen Garden', hint: 'zen garden' },
  { id: 8, src: 'https://placehold.co/800x600.png', title: 'Glitching Reality', hint: 'glitch art' },
];

export function Gallery360() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="h-full w-full p-4 overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryItems.map((item, index) => (
          <Card
            key={item.id}
            className="overflow-hidden cursor-pointer group bg-transparent border-primary/20 hover:border-accent transition-all duration-300"
            onClick={() => setSelectedIndex(index)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={item.hint}
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(isOpen) => !isOpen && setSelectedIndex(null)}
      >
        <DialogContent className="max-w-[90vw] max-h-[90vh] h-[90vh] w-[90vw] p-0 border-primary/30 bg-background/80 backdrop-blur-xl flex items-center justify-center">
            <DialogHeader className="sr-only">
              <DialogTitle>Image Gallery</DialogTitle>
            </DialogHeader>
            {selectedIndex !== null && (
                <Carousel
                    opts={{ loop: true, startIndex: selectedIndex }}
                    className="w-full h-full"
                >
                    <CarouselContent className="h-full">
                    {galleryItems.map((item) => (
                        <CarouselItem key={item.id} className="flex flex-col items-center justify-center p-8">
                            <div className="relative w-full h-[80%]">
                                <Image
                                src={item.src}
                                alt={item.title}
                                fill
                                className="object-contain"
                                data-ai-hint={item.hint}
                                />
                            </div>
                            <p className="mt-4 text-lg font-semibold text-accent">{item.title}</p>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4 text-foreground bg-black/50 hover:bg-accent hover:text-accent-foreground" />
                    <CarouselNext className="right-4 text-foreground bg-black/50 hover:bg-accent hover:text-accent-foreground" />
                </Carousel>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
