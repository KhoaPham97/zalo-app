import ProductGrid from "@/components/product-grid";
import Section from "@/components/section";
import { useAtomValue } from "jotai";
import { flashSaleProductsState } from "@/state";

const groups = [
  { type: "1", title: "Phụ tùng xe đạp" },
  { type: "2", title: "Phụ tùng xe điện" },
  { type: "3", title: "Phụ tùng xe ba gác" },
];

export default function FlashSales() {
  const products = useAtomValue(flashSaleProductsState);

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const groupProducts = products.filter((product: any) => String(product.type) === group.type);
        if (!groupProducts.length) return null;
        return (
          <Section key={group.type} title={group.title}>
            <ProductGrid products={groupProducts} />
          </Section>
        );
      })}
    </div>
  );
}
