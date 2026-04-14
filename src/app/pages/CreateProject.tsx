import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Permission } from "@/types";
import { createProject as apiCreateProject } from "@/lib/api";
import { cn } from "@/lib/utils";
import { StepIndicator } from "@/app/components/auth/StepIndicator";
import { toast } from "sonner";
import type { QualityLevel, Contact, Room, Phase } from "@/types";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  Star,
} from "lucide-react";

const STEPS = ["Details", "Location", "Rooms & Phases", "Review"];

const QUALITY_OPTIONS: { value: QualityLevel; label: string }[] = [
  { value: "quality", label: "Quality" },
  { value: "premium", label: "Premium" },
  { value: "luxury", label: "Luxury" },
  { value: "ultra_lux", label: "Ultra Lux" },
];

interface FormData {
  projectName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  contacts: Contact[];
  rooms: Room[];
  phases: Phase[];
  defaultQuality: QualityLevel;
  defaultMarkup: number;
  defaultShipping: number;
  defaultOther: number;
}

function emptyContact(): Contact {
  return { name: "", email: "", phone: "", isPrimary: false };
}

function emptyRoom(): Room {
  return { id: `room-${++idCounter}-${Math.random().toString(36).slice(2, 8)}`, name: "", floor: "", squareFootage: 0 };
}

function emptyPhase(): Phase {
  return { id: `phase-${++idCounter}-${Math.random().toString(36).slice(2, 8)}`, name: "" };
}

let idCounter = 0;

export function CreateProject() {
  const navigate = useNavigate();
  const { user, agency, hasPermission } = useAuth();
  const [step, setStep] = useState(1);

  // Permission guard
  useEffect(() => {
    if (user && !hasPermission(Permission.CREATE_PROJECT)) {
      navigate("/projects", { replace: true });
    }
  }, [user, hasPermission, navigate]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<FormData>({
    projectName: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    contacts: [{ name: "", email: "", phone: "", isPrimary: true }],
    rooms: [emptyRoom()],
    phases: [emptyPhase()],
    defaultQuality: "premium",
    defaultMarkup: agency?.defaults.product_markup ?? 30,
    defaultShipping: agency?.defaults.shipping_percentage ?? 8,
    defaultOther: agency?.defaults.other_cost_percentage ?? 5,
  });

  const update = (fields: Partial<FormData>) => setForm((f) => ({ ...f, ...fields }));

  // Contact helpers
  const updateContact = (index: number, fields: Partial<Contact>) => {
    const contacts = [...form.contacts];
    contacts[index] = { ...contacts[index], ...fields };
    update({ contacts });
  };
  const addContact = () => update({ contacts: [...form.contacts, emptyContact()] });
  const removeContact = (index: number) => {
    if (form.contacts.length <= 1) return;
    update({ contacts: form.contacts.filter((_, i) => i !== index) });
  };
  const setPrimaryContact = (index: number) => {
    update({ contacts: form.contacts.map((c, i) => ({ ...c, isPrimary: i === index })) });
  };

  // Room helpers
  const updateRoom = (index: number, fields: Partial<Room>) => {
    const rooms = [...form.rooms];
    rooms[index] = { ...rooms[index], ...fields };
    update({ rooms });
  };
  const addRoom = () => update({ rooms: [...form.rooms, emptyRoom()] });
  const removeRoom = (index: number) => {
    if (form.rooms.length <= 1) return;
    update({ rooms: form.rooms.filter((_, i) => i !== index) });
  };

  // Phase helpers
  const updatePhase = (index: number, name: string) => {
    const phases = [...form.phases];
    phases[index] = { ...phases[index], name };
    update({ phases });
  };
  const addPhase = () => update({ phases: [...form.phases, emptyPhase()] });
  const removePhase = (index: number) => {
    if (form.phases.length <= 1) return;
    update({ phases: form.phases.filter((_, i) => i !== index) });
  };

  const canAdvance1 = form.projectName.trim() && form.clientName.trim();
  const canAdvance3 = form.rooms.some((r) => r.name.trim()) && form.phases.some((p) => p.name.trim());

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const res = await apiCreateProject({
      agency_id: user?.agency_id ?? "",
      projectName: form.projectName,
      clientName: form.clientName,
      clientEmail: form.clientEmail,
      clientPhone: form.clientPhone,
      description: form.description,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
      contacts: form.contacts,
      rooms: form.rooms,
      phases: form.phases,
      defaultQuality: form.defaultQuality,
      defaultMarkup: form.defaultMarkup,
      defaultShipping: form.defaultShipping,
      defaultOther: form.defaultOther,
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Project created successfully");
      navigate("/projects");
    } else {
      toast.error(res.error || "Failed to create project");
    }
  };

  const inputClass = "h-12 w-full rounded-xl border border-border bg-white px-4 text-sm shadow-xs outline-none transition-all placeholder:text-muted-foreground/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : navigate("/projects"))}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1>Create Project</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Step {step} of 4</p>
        </div>
      </div>

      <StepIndicator steps={STEPS} currentStep={step} />

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* ====== STEP 1: Details ====== */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium">Project name *</label>
              <input type="text" value={form.projectName} onChange={(e) => update({ projectName: e.target.value })} placeholder="Beverly Hills Residence" className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium">Client name *</label>
              <input type="text" value={form.clientName} onChange={(e) => update({ clientName: e.target.value })} placeholder="Anderson Family" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium">Client email</label>
                <input type="email" value={form.clientEmail} onChange={(e) => update({ clientEmail: e.target.value })} placeholder="client@email.com" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium">Client phone</label>
                <input type="tel" value={form.clientPhone} onChange={(e) => update({ clientPhone: e.target.value })} placeholder="(555) 000-0000" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium">Description</label>
              <textarea value={form.description} onChange={(e) => update({ description: e.target.value })} placeholder="Brief project description..." rows={3} className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm shadow-xs outline-none transition-all placeholder:text-muted-foreground/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20 resize-none" />
            </div>

            {/* Defaults */}
            <div className="border-t border-border pt-4">
              <p className="mb-3 text-[13px] font-medium">Project Defaults</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <label className="mb-1 block text-[11px] text-muted-foreground">Quality</label>
                  <select value={form.defaultQuality} onChange={(e) => update({ defaultQuality: e.target.value as QualityLevel })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-xs shadow-xs outline-none">
                    {QUALITY_OPTIONS.map((q) => (
                      <option key={q.value} value={q.value}>{q.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-muted-foreground">Markup %</label>
                  <input type="number" value={form.defaultMarkup} onChange={(e) => update({ defaultMarkup: Number(e.target.value) })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-xs text-right shadow-xs outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-muted-foreground">Shipping %</label>
                  <input type="number" value={form.defaultShipping} onChange={(e) => update({ defaultShipping: Number(e.target.value) })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-xs text-right shadow-xs outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-muted-foreground">Other %</label>
                  <input type="number" value={form.defaultOther} onChange={(e) => update({ defaultOther: Number(e.target.value) })} className="h-10 w-full rounded-lg border border-border bg-white px-3 text-xs text-right shadow-xs outline-none" />
                </div>
              </div>
            </div>

            <button onClick={() => setStep(2)} disabled={!canAdvance1} className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60">
              Continue
            </button>
          </div>
        )}

        {/* ====== STEP 2: Location & Contacts ====== */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-400 space-y-5">
            <div>
              <p className="mb-3 text-[13px] font-medium">Project Address</p>
              <div className="space-y-3">
                <input type="text" value={form.address} onChange={(e) => update({ address: e.target.value })} placeholder="Street address" className={inputClass} />
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" value={form.city} onChange={(e) => update({ city: e.target.value })} placeholder="City" className={inputClass} />
                  <input type="text" value={form.state} onChange={(e) => update({ state: e.target.value })} placeholder="State" className={inputClass} />
                  <input type="text" value={form.zip} onChange={(e) => update({ zip: e.target.value })} placeholder="ZIP" className={inputClass} />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[13px] font-medium">Contacts</p>
                <button onClick={addContact} className="flex items-center gap-1 text-xs font-medium text-secondary hover:text-secondary/80">
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              <div className="space-y-3">
                {form.contacts.map((c, i) => (
                  <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <button onClick={() => setPrimaryContact(i)} className={cn("flex items-center gap-1 text-xs font-medium transition-colors", c.isPrimary ? "text-warning-dark" : "text-muted-foreground hover:text-foreground")}>
                        <Star className={cn("h-3 w-3", c.isPrimary && "fill-warning-dark")} />
                        {c.isPrimary ? "Primary" : "Set primary"}
                      </button>
                      {form.contacts.length > 1 && (
                        <button onClick={() => removeContact(i)} className="text-muted-foreground hover:text-error transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" value={c.name} onChange={(e) => updateContact(i, { name: e.target.value })} placeholder="Name" className="h-10 rounded-lg border border-border bg-white px-3 text-xs shadow-xs outline-none focus:border-secondary" />
                      <input type="email" value={c.email} onChange={(e) => updateContact(i, { email: e.target.value })} placeholder="Email" className="h-10 rounded-lg border border-border bg-white px-3 text-xs shadow-xs outline-none focus:border-secondary" />
                      <input type="tel" value={c.phone} onChange={(e) => updateContact(i, { phone: e.target.value })} placeholder="Phone" className="h-10 rounded-lg border border-border bg-white px-3 text-xs shadow-xs outline-none focus:border-secondary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(3)} className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99]">
              Continue
            </button>
          </div>
        )}

        {/* ====== STEP 3: Rooms & Phases ====== */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-400 space-y-5">
            {/* Rooms */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[13px] font-medium">Rooms *</p>
                <button onClick={addRoom} className="flex items-center gap-1 text-xs font-medium text-secondary hover:text-secondary/80">
                  <Plus className="h-3.5 w-3.5" /> Add Room
                </button>
              </div>
              <div className="space-y-2">
                {form.rooms.map((r, i) => (
                  <div key={r.id} className="flex items-center gap-2">
                    <input type="text" value={r.name} onChange={(e) => updateRoom(i, { name: e.target.value })} placeholder="Room name" className="h-10 flex-1 rounded-lg border border-border bg-white px-3 text-xs shadow-xs outline-none focus:border-secondary" />
                    <input type="text" value={r.floor ?? ""} onChange={(e) => updateRoom(i, { floor: e.target.value })} placeholder="Floor" className="h-10 w-20 rounded-lg border border-border bg-white px-3 text-xs shadow-xs outline-none focus:border-secondary" />
                    <input type="number" value={r.squareFootage || ""} onChange={(e) => updateRoom(i, { squareFootage: Number(e.target.value) })} placeholder="Sq ft" className="h-10 w-20 rounded-lg border border-border bg-white px-3 text-xs text-right shadow-xs outline-none focus:border-secondary" />
                    {form.rooms.length > 1 && (
                      <button onClick={() => removeRoom(i)} className="text-muted-foreground hover:text-error transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Phases */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[13px] font-medium">Phases *</p>
                <button onClick={addPhase} className="flex items-center gap-1 text-xs font-medium text-secondary hover:text-secondary/80">
                  <Plus className="h-3.5 w-3.5" /> Add Phase
                </button>
              </div>
              <div className="space-y-2">
                {form.phases.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <input type="text" value={p.name} onChange={(e) => updatePhase(i, e.target.value)} placeholder="Phase name" className="h-10 flex-1 rounded-lg border border-border bg-white px-3 text-xs shadow-xs outline-none focus:border-secondary" />
                    {form.phases.length > 1 && (
                      <button onClick={() => removePhase(i)} className="text-muted-foreground hover:text-error transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(4)} disabled={!canAdvance3} className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60">
              Review
            </button>
          </div>
        )}

        {/* ====== STEP 4: Review ====== */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-400 space-y-5">
            {/* Project summary */}
            {[
              {
                title: "Project Details",
                editStep: 1,
                items: [
                  ["Project", form.projectName],
                  ["Client", form.clientName],
                  ["Quality", form.defaultQuality],
                  ["Markup", `${form.defaultMarkup}%`],
                ],
              },
              {
                title: "Location",
                editStep: 2,
                items: [
                  ["Address", [form.address, form.city, form.state, form.zip].filter(Boolean).join(", ") || "Not set"],
                  ["Contacts", `${form.contacts.filter((c) => c.name.trim()).length} contact(s)`],
                ],
              },
              {
                title: "Rooms & Phases",
                editStep: 3,
                items: [
                  ["Rooms", form.rooms.filter((r) => r.name.trim()).map((r) => r.name).join(", ")],
                  ["Phases", form.phases.filter((p) => p.name.trim()).map((p) => p.name).join(", ")],
                ],
              },
            ].map((section) => (
              <div key={section.title} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{section.title}</p>
                  <button onClick={() => setStep(section.editStep)} className="text-xs font-medium text-secondary hover:underline">
                    Edit
                  </button>
                </div>
                <dl className="space-y-1.5">
                  {section.items.map(([label, value]) => (
                    <div key={label as string} className="flex justify-between text-sm">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium text-foreground text-right max-w-[60%] truncate">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Create Project
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
