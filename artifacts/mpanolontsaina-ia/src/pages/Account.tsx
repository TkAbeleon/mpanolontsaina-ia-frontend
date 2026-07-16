import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/hooks/use-auth";
import { useTheme, hexToHslParts, hslPartsToHex } from "@/hooks/use-theme";
import { usersApi } from "@/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User, AlertTriangle, Loader2, Palette, RefreshCcw, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

const CURATED_COLORS = [
  { name: "Violet (Défaut)", hex: "#5B2C9E" },
  { name: "Sarcelle", hex: "#0D9488" },
  { name: "Rose", hex: "#E11D48" },
  { name: "Forêt", hex: "#16A34A" },
  { name: "Indigo", hex: "#4F46E5" },
  { name: "Rouge chaud", hex: "#DC2626" },
];

export default function Account() {
  const { t } = useI18n();
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const { customColor, setCustomColor } = useTheme();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deletionStrategy, setDeletionStrategy] = useState<"hard_delete" | "anonymize">("anonymize");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  useEffect(() => {
    if (user) setFullName(user.full_name || "");
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (data: { full_name: string }) => usersApi.updateMe(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data);
      toast({ title: t("account.save") + " ✅" });
    },
    onError: () => {
      toast({ variant: "destructive", title: t("chat.errorGeneric") });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => usersApi.deleteMe(deletePassword, deletionStrategy, deleteConfirmation),
    onSuccess: () => {
      logout();
      toast({ title: "Compte supprimé avec succès." });
    },
    onError: (err: any) => {
      if (err.status === 401) {
        toast({ variant: "destructive", title: t("auth.invalidCredentials") });
      } else {
        toast({ variant: "destructive", title: t("chat.errorGeneric") });
      }
    }
  });

  if (authLoading || !user) return null;

  return (
    <div className="flex-1 max-w-2xl w-full mx-auto p-6 md:py-12">
      <div className="flex items-center gap-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">{t("account.title")}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Profile Info Form */}
        <div className="stagger-item bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4 transition-all duration-200 hover:shadow-md">
          <div className="space-y-2">
            <Label htmlFor="fullName">{t("auth.fullName")}</Label>
            <Input 
              id="fullName" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              disabled={updateMutation.isPending}
              className="transition-all duration-200 focus-visible:shadow-sm"
            />
          </div>
          <Button 
            onClick={() => updateMutation.mutate({ full_name: fullName })}
            disabled={updateMutation.isPending || fullName === user.full_name}
            className="transition-all duration-200 hover:shadow-md hover:shadow-primary/20"
          >
            {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t("account.save")}
          </Button>
        </div>

        {/* Customization */}
        <div className="stagger-item bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Personnalisation</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Choisissez une couleur d'accentuation pour personnaliser votre interface.
          </p>
          
          <div className="flex flex-wrap items-center gap-3">
            {CURATED_COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => setCustomColor(hexToHslParts(c.hex))}
                className="w-10 h-10 rounded-full border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 hover:scale-125 active:scale-95"
                style={{ 
                  backgroundColor: c.hex, 
                  borderColor: hslPartsToHex(customColor).toLowerCase() === c.hex.toLowerCase() || (!customColor && c.hex.toUpperCase() === "#5B2C9E") 
                    ? 'var(--color-foreground)' 
                    : 'transparent' 
                }}
                title={c.name}
              />
            ))}
            
            <div className="flex items-center gap-2 ml-4 pl-4 border-l">
              <Input
                type="color"
                value={customColor ? hslPartsToHex(customColor) : "#5b2c9e"}
                onChange={(e) => setCustomColor(hexToHslParts(e.target.value))}
                className="w-10 h-10 p-1 cursor-pointer rounded-lg border-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 hover:scale-110"
                title="Couleur personnalisée"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCustomColor(null)}
                className="gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
                disabled={!customColor}
              >
                <RefreshCcw className="w-4 h-4" />
                Réinitialiser
              </Button>
            </div>
          </div>
        </div>

        {/* Session */}
        <div className="stagger-item bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center justify-between gap-4 transition-all duration-200 hover:shadow-md">
          <div>
            <h2 className="text-lg font-semibold">{t("account.sessionTitle")}</h2>
            <p className="text-sm text-muted-foreground">{t("account.sessionDescription")}</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2 transition-all duration-200 hover:bg-muted hover:scale-105" 
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4" />
            {t("nav.logout")}
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="stagger-item border border-destructive/20 bg-destructive/5 p-6 rounded-2xl space-y-4 transition-all duration-200 hover:shadow-md hover:shadow-destructive/10">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-semibold">{t("account.dangerZone")}</h2>
          </div>
          
          <p className="text-sm text-destructive/80">
            {t("account.deleteWarning")}
          </p>
          
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="destructive"
                className="transition-all duration-200 hover:shadow-md hover:shadow-destructive/20"
              >
                {t("account.deleteAccount")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("account.deleteAccount")}</DialogTitle>
                <DialogDescription className="pt-2">
                  {t("account.deleteWarning")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Méthode de suppression</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        checked={deletionStrategy === 'anonymize'} 
                        onChange={() => setDeletionStrategy('anonymize')} 
                        className="accent-destructive" 
                      />
                      Anonymiser mes données (recommandé)
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        checked={deletionStrategy === 'hard_delete'} 
                        onChange={() => setDeletionStrategy('hard_delete')} 
                        className="accent-destructive" 
                      />
                      Suppression totale
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("auth.password")}</Label>
                  <Input 
                    type="password" 
                    value={deletePassword} 
                    onChange={(e) => setDeletePassword(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-destructive font-semibold">
                    {t("account.confirmationLabel")}
                  </Label>
                  <Input 
                    value={deleteConfirmation} 
                    onChange={(e) => setDeleteConfirmation(e.target.value)} 
                    placeholder="SUPPRIMER MON COMPTE"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="transition-all duration-200 hover:scale-105"
                >
                  {t("common.cancel")}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteConfirmation !== "SUPPRIMER MON COMPTE" || !deletePassword || deleteMutation.isPending}
                  className="transition-all duration-200 hover:shadow-md hover:shadow-destructive/20"
                >
                  {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t("common.confirm")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
