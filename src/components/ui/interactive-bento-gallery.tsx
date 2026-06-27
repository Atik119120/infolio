"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface MediaItemType {
  id: number;
  type: string;
  title: string;
  desc: string;
  url: string;
  span: string;
}

const MediaItem = ({
  item,
  className,
  onClick,
}: {
  item: MediaItemType;
  className?: string;
  onClick?: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsInView(entry.isIntersecting));
      },
      { root: null, rootMargin: "50px", threshold: 0.1 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const play = async () => {
      if (!videoRef.current || !isInView || !mounted) return;
      try {
        if (videoRef.current.readyState >= 3) {
          setIsBuffering(false);
          await videoRef.current.play();
        } else {
          setIsBuffering(true);
          await new Promise((resolve) => {
            if (videoRef.current) videoRef.current.oncanplay = resolve;
          });
          if (mounted) {
            setIsBuffering(false);
            await videoRef.current.play();
          }
        }
      } catch (e) {
        console.warn("Video playback failed:", e);
      }
    };
    if (isInView) play();
    else if (videoRef.current) videoRef.current.pause();
    return () => {
      mounted = false;
      if (videoRef.current) videoRef.current.pause();
    };
  }, [isInView]);

  if (item.type === "video") {
    return (
      <div className={`${className} relative overflow-hidden`} onClick={onClick}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          loop
          preload="auto"
          src={item.url}
        />
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={item.url}
      alt={item.title}
      className={`${className} object-cover cursor-pointer`}
      onClick={onClick}
      loading="lazy"
    />
  );
};

interface GalleryModalProps {
  selectedItem: MediaItemType;
  isOpen: boolean;
  onClose: () => void;
  setSelectedItem: (item: MediaItemType | null) => void;
  mediaItems: MediaItemType[];
}

const GalleryModal = ({
  selectedItem,
  isOpen,
  onClose,
  setSelectedItem,
  mediaItems,
}: GalleryModalProps) => {
  if (!isOpen) return null;
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-5xl max-h-[85vh] bg-neutral-950 rounded-2xl overflow-hidden border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full h-[60vh] bg-black">
            <MediaItem item={selectedItem} className="w-full h-full" />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white">{selectedItem.title}</h3>
            <p className="text-white/60 mt-2">{selectedItem.desc}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black flex items-center justify-center text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        drag
        dragMomentum={false}
        className="fixed z-[60] left-1/2 bottom-4 -translate-x-1/2 touch-none"
      >
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10">
          {mediaItems.map((item, index) => (
            <motion.div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(item);
              }}
              className={`relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer ${
                selectedItem.id === item.id
                  ? "ring-2 ring-white/70"
                  : "hover:ring-2 hover:ring-white/30"
              }`}
              initial={{ rotate: index % 2 === 0 ? -10 : 10 }}
              animate={{
                scale: selectedItem.id === item.id ? 1.15 : 1,
                rotate: selectedItem.id === item.id ? 0 : index % 2 === 0 ? -10 : 10,
              }}
              whileHover={{ scale: 1.25, rotate: 0 }}
            >
              <MediaItem item={item} className="w-full h-full" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

interface InteractiveBentoGalleryProps {
  mediaItems: MediaItemType[];
  title?: string;
  description?: string;
}

const InteractiveBentoGallery: React.FC<InteractiveBentoGalleryProps> = ({
  mediaItems,
  title,
  description,
}) => {
  const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);
  const [items, setItems] = useState(mediaItems);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => setItems(mediaItems), [mediaItems]);

  return (
    <div className="w-full">
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-4xl md:text-6xl font-bold text-white">{title}</h2>
          )}
          {description && (
            <p className="mt-3 text-white/60">{description}</p>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {selectedItem ? (
          <GalleryModal
            selectedItem={selectedItem}
            isOpen={true}
            onClose={() => setSelectedItem(null)}
            setSelectedItem={setSelectedItem}
            mediaItems={items}
          />
        ) : null}
      </AnimatePresence>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 auto-rows-[120px] md:auto-rows-[140px]"
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layoutId={`media-${item.id}`}
            className={`relative overflow-hidden rounded-xl cursor-move border border-white/10 group ${item.span}`}
            onClick={() => !isDragging && setSelectedItem(item)}
            variants={{
              hidden: { y: 40, scale: 0.9, opacity: 0 },
              visible: {
                y: 0,
                scale: 1,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                  delay: index * 0.05,
                },
              },
            }}
            whileHover={{ scale: 1.02 }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(_, info) => {
              setIsDragging(false);
              const moveDistance = info.offset.x + info.offset.y;
              if (Math.abs(moveDistance) > 50) {
                const newItems = [...items];
                const dragged = newItems[index];
                const targetIndex =
                  moveDistance > 0
                    ? Math.min(index + 1, items.length - 1)
                    : Math.max(index - 1, 0);
                newItems.splice(index, 1);
                newItems.splice(targetIndex, 0, dragged);
                setItems(newItems);
              }
            }}
          >
            <MediaItem item={item} className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-x-0 bottom-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
              <p className="text-white font-semibold text-sm">{item.title}</p>
              <p className="text-white/70 text-xs">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default InteractiveBentoGallery;
