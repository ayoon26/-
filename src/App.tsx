import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/nav/AppShell";
import { Welcome } from "@/screens/onboarding/Welcome";
import { SignIn } from "@/screens/onboarding/SignIn";
import { GoalSelection } from "@/screens/onboarding/GoalSelection";
import { Trust } from "@/screens/onboarding/Trust";
import { Connect } from "@/screens/onboarding/Connect";
import { Analysis } from "@/screens/onboarding/Analysis";
import { FirstOpportunity } from "@/screens/onboarding/FirstOpportunity";
import { Today } from "@/screens/today/Today";
import { OpportunityDetail } from "@/screens/today/OpportunityDetail";
import { MissionCompletion } from "@/screens/today/MissionCompletion";
import { MoneyOverview } from "@/screens/money/MoneyOverview";
import { AccountDetail } from "@/screens/money/AccountDetail";
import { TransactionList } from "@/screens/money/TransactionList";
import { TransactionDetail } from "@/screens/money/TransactionDetail";
import { RecurringPayments } from "@/screens/money/RecurringPayments";
import { CashFlowProjection } from "@/screens/money/CashFlowProjection";
import { Goals } from "@/screens/goals/Goals";
import { GoalDetail } from "@/screens/goals/GoalDetail";
import { Progress } from "@/screens/progress/Progress";
import { WeeklyReflection } from "@/screens/progress/WeeklyReflection";
import { FinancialGarden } from "@/screens/progress/FinancialGarden";
import { Profile } from "@/screens/profile/Profile";
import { Notifications } from "@/screens/profile/Notifications";
import { ConnectedInstitutions } from "@/screens/profile/ConnectedInstitutions";
import { PrivacyControls } from "@/screens/profile/PrivacyControls";
import { RecommendationPreferences } from "@/screens/profile/RecommendationPreferences";
import { DemoReset } from "@/screens/profile/DemoReset";
import { NotFound } from "@/screens/misc/NotFound";
import { useAppStore } from "@/lib/store";

function RequireApp({ children }: { children: React.ReactNode }) {
  const mode = useAppStore((s) => s.mode);
  if (mode === "none") return <Navigate to="/" replace />;
  return <AppShell>{children}</AppShell>;
}

export default function App() {
  const setOffline = useAppStore((s) => s.setOffline);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    setOffline(!navigator.onLine);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, [setOffline]);

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/onboarding/goals" element={<GoalSelection />} />
      <Route path="/onboarding/trust" element={<Trust />} />
      <Route path="/onboarding/connect" element={<Connect />} />
      <Route path="/onboarding/analysis" element={<Analysis />} />
      <Route path="/onboarding/first-opportunity" element={<FirstOpportunity />} />

      <Route path="/today" element={<RequireApp><Today /></RequireApp>} />
      <Route path="/today/opportunity/:id" element={<RequireApp><OpportunityDetail /></RequireApp>} />
      <Route path="/today/mission/:missionId" element={<RequireApp><MissionCompletion /></RequireApp>} />

      <Route path="/money" element={<RequireApp><MoneyOverview /></RequireApp>} />
      <Route path="/money/accounts/:accountId" element={<RequireApp><AccountDetail /></RequireApp>} />
      <Route path="/money/transactions" element={<RequireApp><TransactionList /></RequireApp>} />
      <Route path="/money/transactions/:transactionId" element={<RequireApp><TransactionDetail /></RequireApp>} />
      <Route path="/money/recurring" element={<RequireApp><RecurringPayments /></RequireApp>} />
      <Route path="/money/cashflow" element={<RequireApp><CashFlowProjection /></RequireApp>} />

      <Route path="/goals" element={<RequireApp><Goals /></RequireApp>} />
      <Route path="/goals/:goalId" element={<RequireApp><GoalDetail /></RequireApp>} />

      <Route path="/progress" element={<RequireApp><Progress /></RequireApp>} />
      <Route path="/progress/weekly" element={<RequireApp><WeeklyReflection /></RequireApp>} />
      <Route path="/progress/garden" element={<RequireApp><FinancialGarden /></RequireApp>} />

      <Route path="/profile" element={<RequireApp><Profile /></RequireApp>} />
      <Route path="/profile/notifications" element={<RequireApp><Notifications /></RequireApp>} />
      <Route path="/profile/institutions" element={<RequireApp><ConnectedInstitutions /></RequireApp>} />
      <Route path="/profile/privacy" element={<RequireApp><PrivacyControls /></RequireApp>} />
      <Route path="/profile/preferences" element={<RequireApp><RecommendationPreferences /></RequireApp>} />
      <Route path="/profile/demo-reset" element={<RequireApp><DemoReset /></RequireApp>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
