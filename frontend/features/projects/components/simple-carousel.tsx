import React from 'react';
import { motion } from 'framer-motion';
import { projects } from '../projects';
import Image from 'next/image';

export function SimpleCarousel() {
  return (
    <div className="w-full">
      <div className="relative overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
        <div className="flex gap-4 p-4">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-64 bg-card rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Image src={project.imageUrl} alt={project.title} width={300} height={200} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg">{project.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
