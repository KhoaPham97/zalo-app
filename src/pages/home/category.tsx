import TransitionLink from "@/components/transition-link";
import { useAtomValue } from "jotai";
import { categoriesState } from "@/state";

const groups = [
  { type: "1", title: "Xe đạp", subtitle: "Phụ tùng và phụ kiện xe đạp", emoji: "🚲", tone: "from-blue-600 to-cyan-500" },
  { type: "2", title: "Xe điện", subtitle: "Linh kiện các dòng xe điện", emoji: "🛵", tone: "from-sky-600 to-blue-500" },
  { type: "3", title: "Xe ba gác", subtitle: "Phụ tùng xe ba gác", emoji: "🛺", tone: "from-indigo-600 to-blue-600" },
];

export default function Category() {
  const categories = useAtomValue(categoriesState);

  return (
    <div className="grid grid-cols-1 gap-3 px-3">
      {groups.map((group) => {
        const items = categories
          .filter((item: any) => String(item.type) === group.type)
          .sort((a: any, b: any) => String(a.name).localeCompare(String(b.name), "vi"));
        const cover = items.find((item: any) => item.image)?.image;

        return (
          <TransitionLink
            key={group.type}
            to={`/categories?type=${group.type}`}
            className="relative min-h-[112px] overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-sky-50" />
            {cover ? (
              <img src={cover} alt="" className="absolute right-0 top-0 h-full w-32 object-cover opacity-20" loading="lazy" />
            ) : null}
            <div className="relative flex min-h-[112px] items-center gap-4 p-4">
              <div className={`flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-gradient-to-br ${group.tone} text-3xl text-white shadow-md`}>
                {group.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-base font-bold text-slate-900">{group.title}</div>
                <div className="mt-1 text-xs text-slate-500">{group.subtitle}</div>
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                  {items.length} nhóm phụ tùng <span aria-hidden="true">›</span>
                </div>
              </div>
              <span className="relative text-2xl font-light text-blue-500">›</span>
            </div>
          </TransitionLink>
        );
      })}
    </div>
  );
}
