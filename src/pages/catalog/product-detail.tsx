import HorizontalDivider from "@/components/horizontal-divider";
import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { productState } from "@/state";
import { formatPrice } from "@/utils/format";
import ShareButton from "./share-buttont";
import RelatedProducts from "./related-products";
import { useAddToCart } from "@/hooks";
import { Button } from "zmp-ui";
import Section from "@/components/section";
import { useMemo, useState } from "react";

const formatMoney = (value: unknown) => formatPrice(Number(value) || 0);
const formatDate = (value?: string | Date) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(date);
};

const productTypeLabel = (type?: string) => {
  const labels: Record<string, string> = {
    "1": "Phụ tùng xe đạp",
    "2": "Phụ tùng xe điện",
    "3": "Phụ tùng xe ba gác",
  };
  return labels[String(type || "")] || "Sản phẩm";
};

export default function ProductDetailPage() {
  const { id = "" } = useParams();
  const product = useAtomValue(productState(id));
  const navigate = useNavigate();
  const { addToCart } = useAddToCart(product);
  const [activeImage, setActiveImage] = useState("");

  const images = useMemo(() => {
    if (!product) return [];
    return Array.from(
      new Set([product.thumbnail, ...(product.images || [])].filter(Boolean))
    );
  }, [product]);

  if (!product) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="text-base font-semibold">Không tìm thấy sản phẩm</div>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </div>
    );
  }

  const currentImage = activeImage || images[0] || product.thumbnail;
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const totalQty = Number(product.qty ?? variants.reduce(
    (sum, variant) => sum + (Number(variant.qty) || 0), 0
  ));
  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "";

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full p-4 pb-3 space-y-4 bg-section">
          <div className="space-y-2">
            {currentImage ? (
              <img
                key={currentImage}
                src={currentImage}
                alt={product.title || "Sản phẩm"}
                className="w-full aspect-square object-contain rounded-xl bg-white"
                style={{ viewTransitionName: `product-image-${product._id}` }}
              />
            ) : (
              <div className="w-full aspect-square rounded-xl bg-background flex items-center justify-center text-subtitle">
                Chưa có hình ảnh
              </div>
            )}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    className={`w-16 h-16 flex-none rounded-lg overflow-hidden border-2 ${currentImage === image ? "border-primary" : "border-transparent"}`}
                    aria-label={`Xem hình ${index + 1}`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                {productTypeLabel(product.type)}
              </span>
              {categoryName && (
                <span className="text-xs px-2 py-1 rounded-full bg-background text-subtitle">
                  {categoryName}
                </span>
              )}
              {product.brand && (
                <span className="text-xs px-2 py-1 rounded-full bg-background text-subtitle">
                  {product.brand}
                </span>
              )}
            </div>
            <h1 className="text-lg font-bold leading-snug">{product.title || product.name}</h1>
            <div className="flex items-end flex-wrap gap-x-2 gap-y-1">
              <div className="text-xl font-bold text-primary">
                {formatMoney(product.price)}
              </div>
              {Number(product.originalPrice) > Number(product.price) && (
                <>
                  <span className="text-xs text-subtitle line-through">
                    {formatMoney(product.originalPrice)}
                  </span>
                  <span className="text-xs text-danger font-semibold">
                    -{Math.round(100 - (Number(product.price) * 100) / Number(product.originalPrice))}%
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-subtitle">
              <span>★ {Number(product.rating || 0).toFixed(1)} / 5</span>
              <span>Còn hàng: {Math.max(0, totalQty)}</span>
              {Number(product.soldQty) > 0 && <span>Đã bán: {product.soldQty}</span>}
            </div>
          </div>
          <ShareButton product={product} />
        </div>

        {variants.length > 0 && (
          <>
            <div className="bg-background h-2 w-full" />
            <Section title={`Phân loại / Phiên bản (${variants.length})`}>
              <div className="p-4 pt-2 space-y-3">
                {variants.map((variant, index) => (
                  <div key={variant._id || variant.variantCode || variant.sku || index} className="rounded-xl border border-[var(--zaui-light-border)] bg-section p-3 space-y-2">
                    <div className="flex gap-3">
                      {(variant.thumbnail || variant.image) && (
                        <img
                          src={variant.thumbnail || variant.image}
                          alt={variant.name}
                          className="w-16 h-16 rounded-lg object-cover bg-white flex-none"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm">{variant.name || `Phiên bản ${index + 1}`}</div>
                        <div className="text-primary font-bold mt-1">{formatMoney(variant.price)}</div>
                        <div className="text-xs text-subtitle mt-1">Tồn kho: {Number(variant.qty) || 0}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                      {variant.variantCode && <div><span className="text-subtitle">Mã biến thể: </span>{variant.variantCode}</div>}
                      {variant.sku && <div><span className="text-subtitle">SKU: </span>{variant.sku}</div>}
                      {Number(variant.weight) > 0 && <div><span className="text-subtitle">Khối lượng: </span>{variant.weight} g</div>}
                      {Number(variant.packageQuantity) > 1 && <div><span className="text-subtitle">Quy cách kiện: </span>{variant.packageQuantity} sản phẩm/kiện</div>}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {(product.compatibleVehicles || []).length > 0 && (
          <>
            <div className="bg-background h-2 w-full" />
            <Section title="Dòng xe tương thích">
              <div className="p-4 pt-2 flex flex-wrap gap-2">
                {product.compatibleVehicles.map((vehicle) => (
                  <span key={vehicle} className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs">
                    {vehicle}
                  </span>
                ))}
              </div>
            </Section>
          </>
        )}

        {(product.description || product.detail) && (
          <>
            <div className="bg-background h-2 w-full" />
            <Section title="Thông tin sản phẩm">
              <div className="p-4 pt-2 space-y-3">
                {product.description && (
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{product.description}</div>
                )}
                {product.detail && (
                  <div className="text-sm whitespace-pre-wrap leading-relaxed text-subtitle">{product.detail}</div>
                )}
              </div>
            </Section>
          </>
        )}

        <div className="bg-background h-2 w-full" />
        <Section title="Thông tin khác">
          <div className="p-4 pt-2 grid grid-cols-2 gap-3 text-xs">
            <div><div className="text-subtitle mb-1">Mã sản phẩm</div><div className="font-medium break-all">{String(product._id)}</div></div>
            {product.brand && <div><div className="text-subtitle mb-1">Thương hiệu</div><div className="font-medium">{product.brand}</div></div>}
            {categoryName && <div><div className="text-subtitle mb-1">Danh mục</div><div className="font-medium">{categoryName}</div></div>}
            <div><div className="text-subtitle mb-1">Tình trạng</div><div className="font-medium">{totalQty > 0 ? "Còn hàng" : "Tạm hết hàng"}</div></div>
            {product.created_at && <div><div className="text-subtitle mb-1">Ngày tạo</div><div className="font-medium">{formatDate(product.created_at)}</div></div>}
            {product.updated_at && <div><div className="text-subtitle mb-1">Cập nhật</div><div className="font-medium">{formatDate(product.updated_at)}</div></div>}
          </div>
        </Section>

        <div className="bg-background h-2 w-full" />
        <Section title="Sản phẩm khác">
          <RelatedProducts currentProductId={product._id} />
        </Section>
      </div>

      <HorizontalDivider />
      <div className="flex-none grid grid-cols-2 gap-2 py-3 px-4 bg-section">
        <Button
          variant="tertiary"
          onClick={() => addToCart(1, { toast: true })}
        >
          Thêm vào giỏ
        </Button>
        <Button
          onClick={() => {
            addToCart(1);
            navigate("/cart", { viewTransition: true });
          }}
        >
          Mua ngay
        </Button>
      </div>
    </div>
  );
}
