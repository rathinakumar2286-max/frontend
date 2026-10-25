import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format";
import ProductImage from "./ProductImage";
import CartControl from "./CartControl";

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPercent > 0;
  return (
    <article className="pcard">
      <Link to={`/products/${product.id}`} className="pcard-media" aria-label={`View ${product.name}`}>
        <ProductImage imageUrl={product.imageUrl} name={product.name} category={product.category} />
        {hasDiscount && <span className="tag">{Math.round(product.discountPercent)}% off</span>}
      </Link>
      <div className="pcard-body">
        <Link to={`/products/${product.id}`} className="pcard-name">
          {product.name}
        </Link>
        <p className="pcard-unit">
          {product.unit}
          {product.brand ? `, ${product.brand}` : ""}
        </p>
        <div className="price-row">
          <span className="price">{formatPrice(product.sellingPrice)}</span>
          {hasDiscount && <s className="mrp">{formatPrice(product.price)}</s>}
        </div>
        <CartControl product={product} />
      </div>
    </article>
  );
}
