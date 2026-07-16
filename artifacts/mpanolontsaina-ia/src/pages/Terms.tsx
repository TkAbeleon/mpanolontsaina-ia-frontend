import { useI18n } from "@/i18n/I18nContext";
import { FileText } from "lucide-react";

export default function Terms() {
  const { t } = useI18n();
  
  return (
    <div className="flex-1 max-w-3xl w-full mx-auto p-6 md:py-12">
      <div className="flex items-center gap-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground">{t("terms.title")}</h1>
      </div>
      
      <div className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-serif max-w-none space-y-8">
        <p className="text-lg text-muted-foreground leading-relaxed stagger-item">{t("terms.intro")}</p>
        
        <section className="stagger-item">
          <h2>{t("terms.usageTitle")}</h2>
          <p>{t("terms.usageText")}</p>
        </section>
        
        <section className="stagger-item">
          <h2>{t("terms.liabilityTitle")}</h2>
          <p>{t("terms.liabilityText")}</p>
        </section>
        
        <section className="stagger-item">
          <h2>{t("terms.accountsTitle")}</h2>
          <p>{t("terms.accountsText")}</p>
        </section>
      </div>
    </div>
  );
}
