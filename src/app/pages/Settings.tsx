import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { updateAgencySettings } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2, Save, Building2, Palette, DollarSign, FileOutput, Users } from "lucide-react";

type Tab = "general" | "branding" | "defaults" | "export";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "general", label: "General", icon: Building2 },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "defaults", label: "Budget Defaults", icon: DollarSign },
  { id: "export", label: "Export", icon: FileOutput },
];

export function Settings() {
  const { user, agency, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [isSaving, setIsSaving] = useState(false);

  // General
  const [agencyName, setAgencyName] = useState(agency?.name ?? "");
  const [agencyType, setAgencyType] = useState(agency?.type ?? "company");
  const [address, setAddress] = useState(agency?.address ?? "");
  const [agencyPhone, setAgencyPhone] = useState(agency?.phone ?? "");
  const [website, setWebsite] = useState(agency?.website ?? "");

  // Branding
  const [primaryColor, setPrimaryColor] = useState(agency?.theme_colors.primary ?? "#1a365d");
  const [secondaryColor, setSecondaryColor] = useState(agency?.theme_colors.secondary ?? "#14b8a6");

  // Defaults
  const [markup, setMarkup] = useState(agency?.defaults.product_markup ?? 30);
  const [shipping, setShipping] = useState(agency?.defaults.shipping_percentage ?? 8);
  const [otherCost, setOtherCost] = useState(agency?.defaults.other_cost_percentage ?? 5);

  // Export prefs (controlled)
  const [exportPrefs, setExportPrefs] = useState([false, true, true, true]);

  const toggleExportPref = (index: number) => {
    setExportPrefs((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  // Redirect non-admins
  useEffect(() => {
    if (user && !isAdmin()) navigate("/", { replace: true });
  }, [user, isAdmin, navigate]);

  if (!user || !agency) return null;
  if (!isAdmin()) return null; // prevent flash

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateAgencySettings(agency.id, {
      name: agencyName,
      type: agencyType as "individual" | "company",
      address,
      phone: agencyPhone,
      website,
      theme_colors: { primary: primaryColor, secondary: secondaryColor },
      defaults: {
        product_markup: Math.max(0, Math.min(100, markup)),
        shipping_percentage: Math.max(0, Math.min(100, shipping)),
        other_cost_percentage: Math.max(0, Math.min(100, otherCost)),
      },
    });
    setIsSaving(false);

    if (res.success) {
      // Apply theme colors live
      document.documentElement.style.setProperty("--brand-primary", primaryColor);
      document.documentElement.style.setProperty("--brand-secondary", secondaryColor);
      toast.success("Settings saved");
    } else {
      toast.error(res.error || "Failed to save settings");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your agency configuration
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-muted p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* General */}
        {activeTab === "general" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-semibold">General Information</h3>
                <p className="text-sm text-muted-foreground">Basic details about your agency</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {agency.subscription.used_licenses} / {agency.subscription.total_licenses} licenses
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[13px] font-medium">Agency name</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm shadow-xs outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium">Type</label>
                <select
                  value={agencyType}
                  onChange={(e) => setAgencyType(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm shadow-xs outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                >
                  <option value="individual">Individual Designer</option>
                  <option value="company">Design Firm</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium">Phone</label>
                <input
                  type="tel"
                  value={agencyPhone}
                  onChange={(e) => setAgencyPhone(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm shadow-xs outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[13px] font-medium">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm shadow-xs outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[13px] font-medium">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://"
                  className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm shadow-xs outline-none transition-all placeholder:text-muted-foreground/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-medium text-foreground">Subscription</p>
              <p className="mt-1 text-sm text-muted-foreground capitalize">
                {agency.subscription.tier} plan — {agency.subscription.total_licenses} user licenses
              </p>
            </div>
          </div>
        )}

        {/* Branding */}
        {activeTab === "branding" && (
          <div className="space-y-5">
            <div className="border-b border-border pb-4">
              <h3 className="text-base font-semibold">Brand Colors</h3>
              <p className="text-sm text-muted-foreground">Customize the look and feel of your workspace</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13px] font-medium">Primary color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-12 w-12 cursor-pointer rounded-lg border border-border"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-12 flex-1 rounded-xl border border-border bg-white px-4 text-sm font-mono shadow-xs outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">Used for sidebar, buttons, headings</p>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-medium">Secondary color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-12 w-12 cursor-pointer rounded-lg border border-border"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-12 flex-1 rounded-xl border border-border bg-white px-4 text-sm font-mono shadow-xs outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">Used for accents, links, focus rings</p>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-xl border border-border p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Preview</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ backgroundColor: primaryColor }}>
                  S
                </div>
                <div className="flex-1">
                  <div className="h-2.5 w-24 rounded-full" style={{ backgroundColor: primaryColor }} />
                  <div className="mt-2 h-2 w-16 rounded-full" style={{ backgroundColor: secondaryColor }} />
                </div>
                <button className="rounded-lg px-4 py-2 text-xs font-medium text-white" style={{ backgroundColor: secondaryColor }}>
                  Action
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Budget Defaults */}
        {activeTab === "defaults" && (
          <div className="space-y-5">
            <div className="border-b border-border pb-4">
              <h3 className="text-base font-semibold">Budget Defaults</h3>
              <p className="text-sm text-muted-foreground">Default percentages applied to new projects</p>
            </div>

            <div className="space-y-4">
              {[
                { label: "Product Markup", value: markup, setter: setMarkup, desc: "Applied to net cost of each line item" },
                { label: "Shipping", value: shipping, setter: setShipping, desc: "Calculated on net cost" },
                { label: "Other Costs", value: otherCost, setter: setOtherCost, desc: "Additional fees (installation, handling, etc.)" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="mb-1.5 block text-[13px] font-medium">{field.label}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={field.value}
                      onChange={(e) => field.setter(Number(e.target.value))}
                      className="h-12 w-24 rounded-xl border border-border bg-white px-4 text-sm text-right shadow-xs outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    />
                    <span className="text-sm font-medium text-muted-foreground">%</span>
                    <span className="text-xs text-muted-foreground">{field.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Example: A $1,000 item with {markup}% markup = <strong className="text-foreground">${(1000 * (1 + markup / 100)).toLocaleString()}</strong> client cost
              </p>
            </div>
          </div>
        )}

        {/* Export */}
        {activeTab === "export" && (
          <div className="space-y-5">
            <div className="border-b border-border pb-4">
              <h3 className="text-base font-semibold">Export Preferences</h3>
              <p className="text-sm text-muted-foreground">Configure what clients see in exported budgets</p>
            </div>

            <div className="space-y-4">
              {[
                { label: "Show product markup", desc: "Display markup percentage on exported budgets" },
                { label: "Show shipping costs", desc: "Include shipping as a separate line" },
                { label: "Show individual line items", desc: "Show each item vs. category totals only" },
                { label: "Include tax breakdown", desc: "Show tax calculation details" },
              ].map((pref, i) => (
                <label key={i} className="flex items-start gap-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                  <input type="checkbox" checked={exportPrefs[i]} onChange={() => toggleExportPref(i)} className="mt-0.5 h-4 w-4 rounded border-border text-secondary accent-secondary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end border-t border-border pt-5">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
