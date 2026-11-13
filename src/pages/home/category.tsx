import TransitionLink from "@/components/transition-link";
import { useAtomValue } from "jotai";
import { categoriesState } from "@/state";

const groups = [
  { type: "1", title: "Phụ tùng xe đạp", subtitle: "Linh kiện và phụ kiện xe đạp", tone: "bg-blue-50 text-blue-700" },
  { type: "2", title: "Phụ tùng xe điện", subtitle: "Linh kiện xe điện các dòng", tone: "bg-sky-50 text-sky-700" },
  { type: "3", title: "Phụ tùng xe ba gác", subtitle: "Phụ tùng và linh kiện xe ba gác", tone: "bg-indigo-50 text-indigo-700" },
];

export default function Category() {
  const categories = useAtomValue(categoriesState);

  return (
    <div className="space-y-3 px-3">
      {groups.map((group) => {
        const items = categories
          .filter((item: any) => String(item.type) === group.type)
          .sort((a: any, b: any) => String(a.name).localeCompare(String(b.name), "vi"));
        if (!items.length) return null;

        return (
          <section key={group.type} className="overflow-hidden rounded-2xl bg-section border border-black/5">
            <div className="flex items-center justify-between px-3 pt-3 pb-2">
              <div className="min-w-0">
                <h2 className="text-sm font-bold">{group.title}</h2>
                <p className="text-2xs text-subtitle mt-0.5">{group.subtitle}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-3xs font-semibold ${group.tone}`}>{items.length} nhóm</span>
            </div>
            <div className="flex gap-3 overflow-x-auto px-3 pb-3">
              {items.map((category: any) => (
                <TransitionLink
                  key={category._id || category.id}
                  className="w-[76px] flex-none flex flex-col items-center gap-1.5"
                  to={`/category/${category._id || category.id}`}
                >
                  <img
                    src={category.image}
                    className="h-14 w-14 rounded-2xl object-cover bg-skeleton border border-black/5"
                    alt={category.name}
                    loading="lazy"
                  />
                  <span className="w-full text-center text-2xs leading-tight line-clamp-2">{category.name}</span>
                </TransitionLink>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
