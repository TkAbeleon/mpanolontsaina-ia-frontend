import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/hooks/use-auth";
import { chatApi, Conversation } from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare, Plus, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

export default function History() {
  const { t, lang } = useI18n();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatApi.listConversations(1, 100),
    enabled: isAuthenticated
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => chatApi.deleteConversation(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['conversations'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((item: Conversation) => item.id !== id)
        };
      });
    },
    onError: () => {
      toast({ variant: "destructive", title: t("chat.errorGeneric") });
    }
  });

  if (authLoading || (isLoading && !data)) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const items = data?.items || [];

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto p-6 md:py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">{t("history.title")}</h1>
        </div>
        <Button 
          className="gap-2 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-primary/20 hover:scale-105" 
          asChild
        >
          <Link href="/chat">
            <Plus className="w-4 h-4" />
            {t("chat.newConversation")}
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-sm animate-in fade-in duration-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-lg">{t("history.empty")}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((conv, idx) => (
            <div 
              key={conv.id} 
              className="stagger-item group bg-card hover:bg-muted/50 border border-border p-4 rounded-2xl flex items-center justify-between transition-all duration-200 hover:shadow-md hover:border-primary/20"
            >
              <Link href={`/chat/${conv.id}`} className="flex-1 min-w-0 pr-4 block">
                <h3 className="font-medium text-foreground truncate transition-colors duration-200 group-hover:text-primary">
                  {conv.title || "Nouvelle conversation"}
                </h3>
                {conv.updated_at && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true, locale: lang === 'mg' ? undefined : fr })}
                  </p>
                )}
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                onClick={() => {
                  if (confirm(t("history.confirmDelete"))) {
                    deleteMutation.mutate(conv.id);
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
