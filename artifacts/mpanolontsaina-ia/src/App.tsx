import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { I18nProvider } from '@/i18n/I18nContext';
import { AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from '@/hooks/use-theme';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/layout/PageTransition';

import Home from '@/pages/Home';
import Chat from '@/pages/Chat';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import History from '@/pages/History';
import Account from '@/pages/Account';
import About from '@/pages/About';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-foreground">404</h1>
        <p className="text-muted-foreground mt-2">Page non trouvée</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <AppLayout>
      <PageTransition>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/chat" component={Chat} />
          <Route path="/chat/:id" component={Chat} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/history" component={History} />
          <Route path="/account" component={Account} />
          <Route path="/about" component={About} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route component={NotFound} />
        </Switch>
      </PageTransition>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
