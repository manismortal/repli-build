import { Switch, Route, Redirect, Router as Wouter } from "wouter";
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
import WalletManagement from "@/pages/wallet-management";
import Notifications from "@/pages/notifications";
import Terms from "@/pages/terms";
import Withdraw from "@/pages/withdraw";
import Support from "@/pages/support";
import About from "@/pages/about";
import PaymentTimeout from "@/pages/payment-timeout";

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
import AdminTasks from "@/pages/admin/tasks";
import { useActivityTracker } from "@/hooks/use-activity-tracker";

function Router() {
  const { user } = useAuth();
  useActivityTracker();

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
      {/* Admin Routes - Flattened for Reliability */}
      <Route path="/admin">
        {user?.isAdmin ? <AdminLayout><AdminDashboard /></AdminLayout> : <Redirect to="/dashboard" />}
      </Route>
      <Route path="/admin/users">
        {user?.isAdmin ? <AdminLayout><AdminUsers /></AdminLayout> : <Redirect to="/dashboard" />}
      </Route>
      <Route path="/admin/deposits">
        {user?.isAdmin ? <AdminLayout><AdminDeposits /></AdminLayout> : <Redirect to="/dashboard" />}
      </Route>
      <Route path="/admin/withdrawals">
        {user?.isAdmin ? <AdminLayout><AdminWithdrawals /></AdminLayout> : <Redirect to="/dashboard" />}
      </Route>
      <Route path="/admin/packages">
        {user?.isAdmin ? <AdminLayout><AdminPackages /></AdminLayout> : <Redirect to="/dashboard" />}
      </Route>
      <Route path="/admin/tasks">
        {user?.isAdmin ? <AdminLayout><AdminTasks /></AdminLayout> : <Redirect to="/dashboard" />}
      </Route>
      <Route path="/admin/notifications">
        {user?.isAdmin ? <AdminLayout><AdminNotifications /></AdminLayout> : <Redirect to="/dashboard" />}
      </Route>
      <Route path="/admin/settings">
        {user?.isAdmin ? <AdminLayout><AdminSettings /></AdminLayout> : <Redirect to="/dashboard" />}
      </Route>
      <Route path="/admin/agents">
        {user?.isAdmin ? <AdminLayout><AdminAgents /></AdminLayout> : <Redirect to="/dashboard" />}
      </Route>
      <Route path="/admin/reports">
        {user?.isAdmin ? <AdminLayout><AdminReports /></AdminLayout> : <Redirect to="/dashboard" />}
      </Route>

      {/* User Routes */}
      <Route path="/payment/methods" component={PaymentMethods} />
      <Route path="/payment/bkash" component={BkashPayment} />
      <Route path="/payment/nagad" component={NagadPayment} />
      <Route path="/payment/binance" component={BinancePayment} />
      <Route path="/payment-timeout" component={PaymentTimeout} />
      <Route path="/withdraw" component={Withdraw} />
      <Route path="/support" component={Support} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/about" component={About} />
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/products">
              {(params) => <Products />}
            </Route>
            <Route path="/tasks" component={Tasks} />
            <Route path="/wallet" component={Wallet} />
            <Route path="/team" component={Team} />
            <Route path="/referral"><Redirect to="/team" /></Route>
            <Route path="/referrel"><Redirect to="/team" /></Route>
                  <Route path="/settings" component={Settings} />
                  <Route path="/wallet-management" component={WalletManagement} />
                  <Route path="/profile" component={Profile} />            <Route path="/notifications" component={Notifications} />
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
