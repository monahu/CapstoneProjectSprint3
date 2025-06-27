const PostImage = ({
  imageUrl,
  alt,
  className = "w-full h-64 object-cover",
}) => {
  return (
    <picture className="w-full h-full">
      {/* Mobile */}
      <source
        media="(max-width: 768px)"
        srcSet={`${imageUrl.replace(".webp", "_mobile.webp")} 1x, ${imageUrl.replace(".webp", "_mobile@2x.webp")} 2x`}
      />
      {/* Tablet */}
      <source
        media="(max-width: 1024px)"
        srcSet={imageUrl.replace(".webp", "_tablet.webp")}
      />
      {/* Desktop - fallback */}
      <img
        src={imageUrl}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}

export default PostImage
