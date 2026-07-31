import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";

const DATA_CATEGORIES = [
  { label: "Account balances", reason: "To show your net position and detect idle cash." },
  { label: "Transaction history", reason: "To find recurring charges, duplicates, and spending changes." },
  { label: "Recurring payments", reason: "To flag price increases and estimate cash flow." },
  { label: "Goals you create", reason: "To calculate pace and suggest manageable next steps." },
];

export function PrivacyControls() {
  const navigate = useNavigate();
  const institutions = useAppStore((s) => s.institutions);
  const goals = useAppStore((s) => s.goals);
  const preferences = useAppStore((s) => s.preferences);
  const transactions = useAppStore((s) => s.transactions);
  const deleteImportedData = useAppStore((s) => s.deleteImportedData);
  const deleteAccountData = useAppStore((s) => s.deleteAccountData);
  const [confirmingDeleteData, setConfirmingDeleteData] = useState(false);
  const [confirmingDeleteAccount, setConfirmingDeleteAccount] = useState(false);

  function exportData() {
    const userGeneratedNotes = transactions
      .filter((t) => t.note || t.userCategory || t.userMerchantName)
      .map((t) => ({ id: t.id, note: t.note, userCategory: t.userCategory, userMerchantName: t.userMerchantName }));
    const payload = { goals, preferences, userGeneratedTransactionEdits: userGeneratedNotes, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sprout-data-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="pt-4">
      <PageHeader title="Privacy & data controls" back />

      <Card>
        <p className="text-sm font-medium text-ink">Connected institutions</p>
        <p className="mt-1 text-sm text-ink-soft">{institutions.filter((i) => i.status === "connected").length} connected</p>
        <Button size="sm" variant="secondary" className="mt-2" onClick={() => navigate("/profile/institutions")}>
          Manage
        </Button>
      </Card>

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-ink-soft">Data categories we use</p>
        <Card className="divide-y divide-line py-0">
          {DATA_CATEGORIES.map((c) => (
            <div key={c.label} className="py-3">
              <p className="text-[15px] font-medium text-ink">{c.label}</p>
              <p className="text-sm text-ink-soft">{c.reason}</p>
            </div>
          ))}
        </Card>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <Button variant="secondary" onClick={exportData}>
          Export my data
        </Button>

        {confirmingDeleteData ? (
          <div className="flex flex-col gap-2 rounded-xl2 border border-alert/30 bg-alert/5 p-3">
            <p className="text-sm text-ink">This removes imported transactions, recurring payments, and insight history from this device. Goals and preferences stay.</p>
            <div className="flex gap-2">
              <Button
                variant="danger"
                onClick={() => {
                  deleteImportedData();
                  setConfirmingDeleteData(false);
                }}
              >
                Confirm delete
              </Button>
              <Button variant="ghost" onClick={() => setConfirmingDeleteData(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setConfirmingDeleteData(true)}>
            Delete imported data
          </Button>
        )}

        {confirmingDeleteAccount ? (
          <div className="flex flex-col gap-2 rounded-xl2 border border-alert/30 bg-alert/5 p-3">
            <p className="text-sm text-ink">This permanently deletes your account and everything stored on this device. This can't be undone.</p>
            <div className="flex gap-2">
              <Button
                variant="danger"
                onClick={() => {
                  deleteAccountData();
                  navigate("/");
                }}
              >
                Permanently delete account
              </Button>
              <Button variant="ghost" onClick={() => setConfirmingDeleteAccount(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setConfirmingDeleteAccount(true)}>
            Delete account
          </Button>
        )}
      </div>
    </div>
  );
}
