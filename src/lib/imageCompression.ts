/**
 * Image compression utility
 * Compresses images client-side before uploading to reduce storage usage
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
  /** Preserve transparency by encoding as PNG instead of JPEG. Auto-enabled for PNG/WebP/SVG inputs. */
  preserveTransparency?: boolean;
}

const defaultOptions: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  maxSizeKB: 500,
};

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const opts = { ...defaultOptions, ...options };

  // Auto-detect transparency-needing formats
  const isTransparentFormat =
    opts.preserveTransparency ||
    file.type === "image/png" ||
    file.type === "image/webp" ||
    file.type === "image/svg+xml" ||
    /\.(png|webp|svg)$/i.test(file.name);
  const outputType = isTransparentFormat ? "image/png" : "image/jpeg";
  const outputExt = isTransparentFormat ? "png" : "jpg";

  // Skip compression for small files (but still re-encode if format conversion would change extension)
  if (file.size < (opts.maxSizeKB! * 1024)) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > opts.maxWidth! || height > opts.maxHeight!) {
          const ratio = Math.min(opts.maxWidth! / width, opts.maxHeight! / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        // For JPEG (no alpha), fill white so transparent areas don't go black
        if (outputType === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
        }
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }

            const baseName = file.name.replace(/\.[^.]+$/, "");
            const compressedFile = new File([blob], `${baseName}.${outputExt}`, {
              type: outputType,
              lastModified: Date.now(),
            });

            console.log(`Image compressed: ${(file.size / 1024).toFixed(1)}KB → ${(compressedFile.size / 1024).toFixed(1)}KB (${outputType})`);
            resolve(compressedFile);
          },
          outputType,
          opts.quality
        );
      };
      
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
