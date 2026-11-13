import TransitionLink from "@/components/transition-link";
import { useAtomValue } from "jotai";
import { categoriesState } from "@/state";
import { useSearchParams } from "react-router-dom";
import { resolveImageUrl } from "@/utils/image";

const groups = [
  { type: "1", title: "Xe đạp", description: "Phụ tùng và phụ kiện xe đạp", emoji: "🚲" },
  { type: "2", title: "Xe điện", description: "Linh kiện các dòng xe điện", emoji: "🛵" },
  { type: "3", title: "Xe ba gác", description: "Phụ tùng xe ba gác", emoji: "🛺" },
];

export default function CategoryListPage() {
  const categories = useAtomValue(categoriesState);
  const [searchParams] = useSearchParams();
  const selectedType = searchParams.get("type");
  const visibleGroups = groups.filter((group) => !selectedType || group.type === selectedType);

  return (
    <div className="space-y-4 p-3">
      {visibleGroups.map((group) => {
        const items = categories
          .filter((item: any) => String(item.type) === group.type)
          .sort((a: any, b: any) => String(a.name).localeCompare(String(b.name), "vi"));

        return (
          <section key={group.type} className="overflow-hidden rounded-2xl border border-blue-100 bg-section shadow-sm">
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-4 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl">{group.emoji}</div>
              <div className="min-w-0">
                <h2 className="text-base font-bold">{group.title}</h2>
                <p className="mt-0.5 text-xs text-white/80">{group.description}</p>
              </div>
              <span className="ml-auto rounded-full bg-white/15 px-2.5 py-1 text-2xs font-semibold">{items.length} nhóm</span>
            </div>
            {items.length ? (
              <div className="grid grid-cols-3 gap-x-2 gap-y-4 p-3 sm:grid-cols-4">
                {items.map((category: any) => (
                  <TransitionLink
                    key={category._id || category.id}
                    className="flex min-w-0 flex-col items-center gap-2 rounded-xl p-1 transition-colors active:bg-blue-50"
                    to={`/category/${category._id || category.id}`}
                  >
                    <img
                      src={resolveImageUrl(category.image)}
                      className="aspect-square w-full rounded-xl border border-black/5 bg-skeleton object-cover"
                      alt={category.name}
                      loading="lazy"
                    />
                    <span className="w-full text-center text-xs font-medium leading-snug line-clamp-2">{category.name}</span>
                  </TransitionLink>
                ))}
              </div>
            ) : (
              <div className="p-5 text-center text-xs text-subtitle">Chưa có nhóm phụ tùng trong danh mục này.</div>
            )}
          </section>
        );
      })}
    </div>
  );
}
