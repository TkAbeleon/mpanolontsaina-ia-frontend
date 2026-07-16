import { useI18n } from "@/i18n/I18nContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Scale, ShieldCheck, MessageCircle, Map, Briefcase, Users } from "lucide-react";

export default function Home() {
  const { t } = useI18n();

  const domains = [
    { icon: Briefcase, label: t("chat.domainDroitTravail") },
    { icon: Map, label: t("chat.domainFoncier") },
    { icon: Users, label: t("chat.domainFamille") },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32 flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
        
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="mx-auto w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 mb-6 animate-in zoom-in duration-700">
            <Scale className="w-8 h-8" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground tracking-tight text-balance animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
            {t("app.name")}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-medium text-balance max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            {t("app.tagline")}
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95" 
              asChild
            >
              <Link href="/chat">
                <MessageCircle className="mr-2 w-5 h-5" />
                {t("nav.chat")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features/Domains Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-serif font-bold text-foreground">
              Des réponses fiables, sourcées et claires.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              L'assistant s'appuie sur la législation malgache pour vous orienter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {domains.map((domain, i) => (
              <div 
                key={i} 
                className="stagger-item bg-card border border-border p-8 rounded-2xl shadow-sm card-hover"
              >
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110">
                  <domain.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{domain.label}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Consultez les textes de loi et obtenez des informations générales sur ce domaine.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="mt-auto py-12 bg-muted/50 border-t transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4 animate-in fade-in duration-500">
          <ShieldCheck className="w-10 h-10 text-primary/60" />
          <p className="text-sm text-muted-foreground max-w-2xl">
            {t("chat.disclaimer")}
          </p>
        </div>
      </section>
    </div>
  );
}
