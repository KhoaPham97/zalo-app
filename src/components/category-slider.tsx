import { categoriesState } from "@/state";
import { useAtomValue } from "jotai";
import { useParams } from "react-router-dom";
import TransitionLink from "./transition-link";
import { resolveImageUrl } from "@/utils/image";

export default function CategorySlider() {
  const { id } = useParams();
  const categories = useAtomValue(categoriesState);

  return (
    <div className="px-3 py-2 overflow-x-auto flex space-x-2">
      {categories.map((category: any) => (
        <TransitionLink
          to={`/category/${category._id}`}
          key={category._id}
          className={"h-8 flex-none rounded-full p-1 pr-2 flex items-center space-x-1 border border-black/15 ".concat(
            String(category._id) === id
              ? "bg-primary text-primaryForeground"
              : "bg-section"
          )}
        >
          <img
            src={resolveImageUrl(category.image)}
            className="w-6 h-6 rounded-full bg-skeleton"
          />
          <p className="text-xs whitespace-nowrap">{category.name}</p>
        </TransitionLink>
      ))}
    </div>
  );
}
