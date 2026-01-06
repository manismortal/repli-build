import { Switch, Route, Redirect } from "wouter";
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
import BkashPayment from "@/pages/bkash-payment";
import NagadPayment from "@/pages/nagad-payment";
import BinancePayment from "@/pages/binance-payment";
import PaymentMethods from "@/pages/payment-methods";
import Settings from "@/pages/settings";
import Profile from "@/pages/profile";
import Notifications from "@/pages/notifications";
import Terms from "@/pages/terms";
import Withdraw from "@/pages/withdraw";
import Support from "@/pages/support";

// Admin Imports
import AdminLayout from "@/pages/admin/layout";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users";
import AdminWithdrawals from "@/pages/admin/withdrawals";
import AdminPackages from "@/pages/admin/packages";
import AdminDeposits from "@/pages/admin/deposits";
import AdminSettings from "@/pages/admin/settings";
import AdminNotifications from "@/pages/admin/notifications";
import AdminAgents from "@/pages/admin/agents";
import AdminReports from "@/pages/admin/reports";

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
      {/* Admin Routes */}
      <Route path="/admin*">
        {() => {
          if (!user?.isAdmin) return <Redirect to="/dashboard" />;
          return (
            <AdminLayout>
              <Switch>
                <Route path="/admin" component={AdminDashboard} />
                <Route path="/admin/users" component={AdminUsers} />
                <Route path="/admin/deposits" component={AdminDeposits} />
                <Route path="/admin/withdrawals" component={AdminWithdrawals} />
                <Route path="/admin/packages" component={AdminPackages} />
                <Route path="/admin/notifications" component={AdminNotifications} />
                <Route path="/admin/settings" component={AdminSettings} />
                <Route path="/admin/agents" component={AdminAgents} />
                <Route path="/admin/reports" component={AdminReports} />
                <Route component={NotFound} />
              </Switch>
            </AdminLayout>
          );
        }}
      </Route>

      {/* User Routes */}
      <Route path="/payment/methods" component={PaymentMethods} />
      <Route path="/payment/bkash" component={BkashPayment} />
      <Route path="/payment/nagad" component={NagadPayment} />
      <Route path="/payment/binance" component={BinancePayment} />
      <Route path="/withdraw" component={Withdraw} />
      <Route path="/support" component={Support} />
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
            <Route path="/settings" component={Settings} />
            <Route path="/profile" component={Profile} />
            <Route path="/notifications" component={Notifications} />
            <Route path="/terms" component={Terms} />
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
