import { clsx } from "clsx";
import { useLanguage } from "./LanguageContext";

export const RiskBadge = ({ level }: { level: string }) => {
  const { t } = useLanguage();
  const styles = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-orange-100 text-orange-800",
    Critical: "bg-red-100 text-red-800",
  }[level] || "bg-gray-100 text-gray-800";

  return (
    <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium", styles)}>
      {t(`data.risks.${level}`)}
    </span>
  );
};
