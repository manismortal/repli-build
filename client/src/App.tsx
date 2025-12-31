import { Switch, Route } from "wouter";
import { AuthProvider, useAuth } from "@/lib/auth";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Products from "@/pages/products";
import Tasks from "@/pages/tasks";
import Wallet from "@/pages/wallet";
import Team from "@/pages/team";
import Lottery from "@/pages/lottery";
import BkashPayment from "@/pages/bkash-payment";
import Settings from "@/pages/settings";
import Profile from "@/pages/profile";
import Notifications from "@/pages/notifications";

function Router() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Switch>
        <Route path="/" component={AuthPage} />
        <Route path="/login" component={AuthPage} />
        <Route path="/register" component={AuthPage} />
        <Route component={AuthPage} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/payment/bkash" component={BkashPayment} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/products">
              {(params) => <Products />}
            </Route>
            <Route path="/tasks" component={Tasks} />
            <Route path="/wallet" component={Wallet} />
            <Route path="/team" component={Team} />
            <Route path="/lottery" component={Lottery} />
            <Route path="/settings" component={Settings} />
            <Route path="/profile" component={Profile} />
            <Route path="/notifications" component={Notifications} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
