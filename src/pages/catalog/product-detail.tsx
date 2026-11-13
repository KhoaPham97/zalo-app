import HorizontalDivider from "@/components/horizontal-divider";
import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { productState } from "@/state";
import ShareButton from "./share-buttont";
import RelatedProducts from "./related-products";
import { useAddToCart } from "@/hooks";
import { Button } from "zmp-ui";
import { useMemo, useState } from "react";

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
  const [activeImage, setActiveImage] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const selectedVariant = variants.length
    ? variants[Math.min(selectedVariantIndex, variants.length - 1)]
    : undefined;
  const { addToCart } = useAddToCart(product!, selectedVariant);

  const images = useMemo(() => {
    if (!product) return [];
    return Array.from(new Set([product.thumbnail, ...(product.images || [])].filter(Boolean)));
  }, [product]);

  if (!product) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 p-6 text-center bg-background">
        <div className="w-16 h-16 rounded-2xl bg-section flex items-center justify-center text-3xl">📦</div>
        <div className="text-base font-semibold">Không tìm thấy sản phẩm</div>
        <p className="text-sm text-subtitle">Sản phẩm có thể đã được cập nhật hoặc không còn khả dụng.</p>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </div>
    );
  }

  const currentImage = activeImage || images[0] || product.thumbnail;
  const totalQty = Number(product.qty ?? variants.reduce(
    (sum, variant) => sum + (Number(variant.qty) || 0), 0
  ));
  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "";
  const inStock = totalQty > 0;

  return (
    <div className="w-full h-full flex flex-col bg-[#F5F7FB]">
      <div className="flex-1 overflow-y-auto pb-3">
        <div className="p-3">
          <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-600 px-3 py-1.5 text-2xs font-semibold text-white shadow-sm">
                {productTypeLabel(product.type)}
              </span>
              <span className={`rounded-full px-3 py-1.5 text-2xs font-semibold shadow-sm ${inStock ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                {inStock ? "● Còn hàng" : "● Tạm hết hàng"}
              </span>
            </div>
            {currentImage ? (
              <img
                key={currentImage}
                src={currentImage}
                alt={product.title || "Sản phẩm"}
                className="w-full aspect-square object-contain bg-white p-5"
                style={{ viewTransitionName: `product-image-${product._id}` }}
              />
            ) : (
              <div className="w-full aspect-square flex flex-col items-center justify-center gap-2 text-subtitle bg-gray-50">
                <span className="text-4xl">📷</span>
                <span className="text-sm">Chưa có hình ảnh</span>
              </div>
            )}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 px-3 pb-4 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    className={`w-14 h-14 flex-none rounded-xl overflow-hidden border-2 bg-white ${currentImage === image ? "border-blue-600" : "border-gray-100"}`}
                    aria-label={`Xem hình ${index + 1}`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mx-3 mb-3 rounded-3xl bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {categoryName && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{categoryName}</span>
            )}
            {product.brand && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">{product.brand}</span>
            )}
          </div>
          <h1 className="text-xl font-bold leading-snug text-gray-900">{product.title || product.name}</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Liên hệ Nhật Khang Bike để được tư vấn và báo giá tốt nhất.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-amber-50 p-3">
              <div className="text-xs text-amber-700">Đánh giá</div>
              <div className="mt-1 text-base font-bold text-gray-900">★ {Number(product.rating || 0).toFixed(1)}<span className="text-xs font-normal text-gray-500"> / 5</span></div>
            </div>
            <div className="rounded-2xl bg-blue-50 p-3">
              <div className="text-xs text-blue-700">Số lượng còn</div>
              <div className="mt-1 text-base font-bold text-gray-900">{Math.max(0, totalQty)}<span className="ml-1 text-xs font-normal text-gray-500">sản phẩm</span></div>
            </div>
          </div>
          {Number(product.soldQty) > 0 && (
            <div className="mt-3 text-xs text-gray-400">Đã bán {product.soldQty} sản phẩm</div>
          )}
          <div className="mt-3 flex justify-end">
            <ShareButton product={product} />
          </div>
        </div>

        {variants.length > 0 && (
          <div className="mx-3 mb-3 rounded-3xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h2 className="font-bold text-base text-gray-900">Chọn phân loại</h2>
                <p className="mt-0.5 text-xs text-gray-500">{variants.length} phiên bản có sẵn</p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {selectedVariantIndex + 1}/{variants.length}
              </span>
            </div>
            <div className="space-y-2">
              {variants.map((variant, index) => {
                const selected = selectedVariantIndex === index;
                const qty = Number(variant.qty) || 0;
                return (
                  <button
                    key={variant._id || variant.variantCode || variant.sku || index}
                    type="button"
                    onClick={() => setSelectedVariantIndex(index)}
                    className={`w-full flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${selected ? "border-blue-500 bg-blue-50/70" : "border-gray-100 bg-white"}`}
                  >
                    {(variant.thumbnail || variant.image) ? (
                      <img
                        src={variant.thumbnail || variant.image}
                        alt={variant.name || "Phân loại"}
                        className="w-16 h-16 flex-none rounded-xl object-cover bg-white"
                      />
                    ) : (
                      <div className="w-16 h-16 flex-none rounded-xl bg-gray-100 flex items-center justify-center text-2xl">🔧</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm font-semibold ${selected ? "text-blue-700" : "text-gray-800"}`}>
                        {variant.name || `Phiên bản ${index + 1}`}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {qty > 0 ? `Còn ${qty} sản phẩm` : "Tạm hết hàng"}
                      </div>
                      {(Number(variant.weight) > 0 || Number(variant.packageQuantity) > 1) && (
                        <div className="mt-1 flex flex-wrap gap-x-3 text-2xs text-gray-400">
                          {Number(variant.weight) > 0 && <span>Khối lượng: {variant.weight} g</span>}
                          {Number(variant.packageQuantity) > 1 && <span>{variant.packageQuantity} sản phẩm/kiện</span>}
                        </div>
                      )}
                    </div>
                    <span className={`w-5 h-5 flex-none rounded-full border flex items-center justify-center text-xs ${selected ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 text-transparent"}`}>✓</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {(product.compatibleVehicles || []).length > 0 && (
          <div className="mx-3 mb-3 rounded-3xl bg-white p-4 shadow-sm">
            <h2 className="font-bold text-base text-gray-900">Dòng xe tương thích</h2>
            <p className="mt-1 text-xs text-gray-500">Sản phẩm phù hợp với các dòng xe sau</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.compatibleVehicles.map((vehicle) => (
                <span key={vehicle} className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
                  {vehicle}
                </span>
              ))}
            </div>
          </div>
        )}

        {(product.description || product.detail) && (
          <div className="mx-3 mb-3 rounded-3xl bg-white p-4 shadow-sm">
            <h2 className="font-bold text-base text-gray-900">Mô tả sản phẩm</h2>
            {product.description && (
              <div className="mt-3 text-sm whitespace-pre-wrap leading-7 text-gray-700">{product.description}</div>
            )}
            {product.detail && (
              <div className="mt-3 border-t border-gray-100 pt-3 text-sm whitespace-pre-wrap leading-7 text-gray-500">{product.detail}</div>
            )}
          </div>
        )}

        <div className="mx-3 mb-3 rounded-3xl bg-white p-4 shadow-sm">
          <h2 className="font-bold text-base text-gray-900">Thông tin sản phẩm</h2>
          <div className="mt-3 divide-y divide-gray-100 text-sm">
            {product.brand && (
              <div className="flex justify-between gap-4 py-3"><span className="text-gray-500">Thương hiệu</span><span className="text-right font-medium text-gray-800">{product.brand}</span></div>
            )}
            {categoryName && (
              <div className="flex justify-between gap-4 py-3"><span className="text-gray-500">Danh mục</span><span className="text-right font-medium text-gray-800">{categoryName}</span></div>
            )}
            <div className="flex justify-between gap-4 py-3"><span className="text-gray-500">Tình trạng</span><span className={`text-right font-semibold ${inStock ? "text-emerald-600" : "text-gray-500"}`}>{inStock ? "Còn hàng" : "Tạm hết hàng"}</span></div>
            {product.created_at && (
              <div className="flex justify-between gap-4 py-3"><span className="text-gray-500">Ngày đăng</span><span className="text-right font-medium text-gray-800">{formatDate(product.created_at)}</span></div>
            )}
            {product.updated_at && (
              <div className="flex justify-between gap-4 py-3"><span className="text-gray-500">Cập nhật</span><span className="text-right font-medium text-gray-800">{formatDate(product.updated_at)}</span></div>
            )}
          </div>
        </div>

        <div className="mx-3 mb-4 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="px-4 pt-4">
            <h2 className="font-bold text-base text-gray-900">Có thể bạn cũng thích</h2>
            <p className="mt-1 text-xs text-gray-500">Khám phá thêm phụ tùng tại Nhật Khang Bike</p>
          </div>
          <RelatedProducts currentProductId={product._id} />
        </div>
      </div>

      <HorizontalDivider />
      <div className="flex-none grid grid-cols-2 gap-2 px-3 py-3 bg-white safe-area-bottom">
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
