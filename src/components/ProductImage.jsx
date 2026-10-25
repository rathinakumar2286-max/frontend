import { emojiFor } from "../utils/format";

// Shows the product photo, or an emoji tile when no photo has been uploaded.
export default function ProductImage({ imageUrl, name, category, className = "" }) {
  if (imageUrl) {
    return <img className={`pimg ${className}`} src={imageUrl} alt={name} loading="lazy" />;
  }
  return (
    <div className={`pimg pimg-fallback ${className}`} role="img" aria-label={name}>
      <span aria-hidden="true">{emojiFor(`${name} ${category || ""}`)}</span>
    </div>
  );
}
