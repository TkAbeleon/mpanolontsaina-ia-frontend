import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useI18n } from "@/i18n/I18nContext";
import { authApi, ApiRequestError } from "@/api/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Scale, LogIn, Loader2, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data.email, data.password);
      localStorage.setItem("mpanolontsaina_access_token", res.access_token);
      localStorage.setItem("mpanolontsaina_refresh_token", res.refresh_token);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      setLocation("/chat");
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        toast({ variant: "destructive", title: t("auth.invalidCredentials") });
      } else {
        toast({ variant: "destructive", title: t("chat.errorGeneric") });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 py-12 md:py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="w-full max-w-md space-y-8 bg-card border border-border p-8 rounded-3xl shadow-xl shadow-primary/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">{t("auth.loginTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("app.name")}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.email")}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="email@example.com" 
                      {...field} 
                      className="transition-all duration-200 focus-visible:shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.password")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        {...field} 
                        className="transition-all duration-200 focus-visible:shadow-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                        tabIndex={-1}
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-12 text-md transition-all duration-200 hover:shadow-lg hover:shadow-primary/20" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
              {t("auth.submitLogin")}
            </Button>
          </form>
        </Form>
        
        <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
          {t("auth.noAccount")} <Link href="/register" className="text-primary font-medium hover:underline transition-all duration-200">{t("nav.register")}</Link>
        </div>
      </div>
    </div>
  );
}
