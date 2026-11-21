import Image, { type ImageProps } from "next/image";

/**
 * next/image wrapper that automatically disables optimization for external
 * URLs (Cloudinary, pasted links). Local /uploads paths stay optimized.
 */
export default function SmartImage(props: ImageProps) {
  const isExternal = typeof props.src === "string" && /^https?:\/\//.test(props.src);
  const { src, alt, fill, width, height, sizes, className, priority, quality, style, unoptimized } = props;
  return (
    <Image
      src={src}
      alt={alt}
      {...(fill ? { fill } : { width: width ?? 800, height: height ?? 600 })}
      {...(sizes ? { sizes } : {})}
      {...(className ? { className } : {})}
      {...(priority ? { priority } : {})}
      {...(quality ? { quality } : {})}
      {...(style ? { style } : {})}
      unoptimized={unoptimized ?? isExternal}
    />
  );
}
