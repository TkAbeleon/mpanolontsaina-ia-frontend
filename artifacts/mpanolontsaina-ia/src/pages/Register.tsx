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
import { Scale, UserPlus, Loader2 } from "lucide-react";

export default function Register() {
  const { t, lang } = useI18n();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: t("auth.passwordTooShort") }),
    fullName: z.string().min(2)
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", fullName: "" },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      await authApi.register(data.email, data.password, data.fullName, lang);
      // Auto-login after register
      const res = await authApi.login(data.email, data.password);
      localStorage.setItem("mpanolontsaina_access_token", res.access_token);
      localStorage.setItem("mpanolontsaina_refresh_token", res.refresh_token);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      setLocation("/chat");
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 409) {
        toast({ variant: "destructive", title: t("auth.emailExists") });
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
          <h1 className="text-3xl font-serif font-bold tracking-tight">{t("auth.registerTitle")}</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.fullName")}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Jean Dupont" 
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
                    <Input 
                      type="password" 
                      {...field} 
                      className="transition-all duration-200 focus-visible:shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-12 text-md mt-2 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
              {t("auth.submitRegister")}
            </Button>
          </form>
        </Form>
        
        <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
          {t("auth.haveAccount")} <Link href="/login" className="text-primary font-medium hover:underline transition-all duration-200">{t("nav.login")}</Link>
        </div>
      </div>
    </div>
  );
}
