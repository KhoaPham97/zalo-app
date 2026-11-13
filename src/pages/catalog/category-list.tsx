import TransitionLink from "@/components/transition-link";
import { useAtomValue } from "jotai";
import { categoriesState } from "@/state";

const groups = [
  { type: "1", title: "Phụ tùng xe đạp", description: "Danh mục dành cho xe đạp" },
  { type: "2", title: "Phụ tùng xe điện", description: "Danh mục dành cho xe điện" },
  { type: "3", title: "Phụ tùng xe ba gác", description: "Danh mục dành cho xe ba gác" },
];

export default function CategoryListPage() {
  const categories = useAtomValue(categoriesState);

  return (
    <div className="space-y-4 p-3">
      {groups.map((group) => {
        const items = categories
          .filter((item: any) => String(item.type) === group.type)
          .sort((a: any, b: any) => String(a.name).localeCompare(String(b.name), "vi"));
        if (!items.length) return null;

        return (
          <section key={group.type} className="rounded-2xl bg-section p-3 border border-black/5">
            <div className="mb-3">
              <h2 className="font-bold text-sm">{group.title}</h2>
              <p className="text-2xs text-subtitle mt-0.5">{group.description}</p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-4">
              {items.map((category: any) => (
                <TransitionLink
                  key={category._id || category.id}
                  className="flex min-w-0 flex-col items-center gap-2"
                  to={`/category/${category._id || category.id}`}
                >
                  <img
                    src={category.image}
                    className="w-full aspect-square rounded-xl object-cover bg-skeleton"
                    alt={category.name}
                    loading="lazy"
                  />
                  <span className="w-full text-center text-xs leading-snug line-clamp-2">{category.name}</span>
                </TransitionLink>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
