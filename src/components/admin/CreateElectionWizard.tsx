"use client";

import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ParticipantImporter } from "@/components/voter/ParticipantImporter";

const steps = ["Informations", "Questions", "Sécurité", "Accès", "Résumé"] as const;
type Step = (typeof steps)[number];

interface CreateElectionWizardProps {
  onComplete?: () => void;
}

export default function CreateElectionWizard({ onComplete }: CreateElectionWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>("Informations");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    questions: [{ label: "", options: ["", ""], type: "single" }],
    trustees: 3,
    threshold: 2,
    accessList: "",
  });

  const stepIndex = useMemo(() => steps.indexOf(currentStep), [currentStep]);

  const go = (delta: number) => {
    const nextIndex = Math.min(Math.max(stepIndex + delta, 0), steps.length - 1);
    setCurrentStep(steps[nextIndex]);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...form, [name]: value };
    let newErrors = { ...errors };

    if (name === "end" && newFormData.start) {
      if (new Date(value) <= new Date(newFormData.start)) {
        newErrors.date = "La fin doit être après le début";
      } else {
        delete newErrors.date;
      }
    } else if (name === "start" && newFormData.end) {
      if (new Date(newFormData.end) <= new Date(value)) {
        newErrors.date = "La fin doit être après le début";
      } else {
        delete newErrors.date;
      }
    }

    setErrors(newErrors);
    setForm(newFormData);
  };

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      go(1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!form.title.trim()) {
        toast.error("Le titre est requis");
        return;
      }
      if (!form.start || !form.end) {
        toast.error("Les dates sont requises");
        return;
      }
      if (new Date(form.start) >= new Date(form.end)) {
        toast.error("La date de fin doit être après le début");
        return;
      }
      if (form.questions.some((q) => !q.label.trim())) {
        toast.error("Toutes les questions doivent avoir un titre");
        return;
      }
      if (form.questions.some((q) => q.options.some((o) => !o.trim()))) {
        toast.error("Toutes les options doivent être remplies");
        return;
      }

      const electionData = {
        title: form.title,
        description: form.description,
        questions: form.questions.map((q) => ({
          question: q.label,
          options: q.options.filter((opt) => opt.trim()),
          type: q.type,
        })),
        start_date: form.start,
        end_date: form.end,
        num_trustees: form.trustees,
        threshold: form.threshold,
        voter_emails: form.accessList
          .split("\n")
          .map((email) => email.trim())
          .filter((email) => email && email.includes("@")),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/elections/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
          body: JSON.stringify(electionData),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'élection");
      }

      toast.success("✓ Élection créée avec succès!");
      setIsSuccess(true);
      setTimeout(() => {
        onComplete?.();
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la création";
      toast.error(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="card-glass w-full max-w-md p-10 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-50"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-5xl">✓</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight gradient-text">Élection créée!</h2>
            <p className="text-slate-400 mt-3 text-base font-medium">
              "{form.title}" est maintenant prête.
            </p>
          </div>
          <button
            onClick={onComplete}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-indigo-500/30"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl card-glass rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT SIDEBAR */}
        <div className="lg:w-64 bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-b lg:border-b-0 lg:border-r border-slate-700 p-6 flex flex-col">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-8">
            Étapes
          </h3>

          <div className="space-y-2 flex-1">
            {steps.map((step, i) => {
              const active = step === currentStep;
              const done = i < stepIndex;

              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => setCurrentStep(step)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-sm font-semibold ${
                    active
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                      : done
                        ? "bg-slate-700/50 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800/40 text-slate-300 hover:bg-slate-700/50 border border-transparent hover:border-indigo-500/30"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      active
                        ? "bg-white/20 text-white"
                        : done
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  <span className="font-medium">{step}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-700 text-xs text-slate-500">
            © 2026 NovaVote
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="max-w-2xl">
              <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight gradient-text">{currentStep}</h1>
                <p className="text-slate-400 mt-2 text-base font-medium">
                  Étape {stepIndex + 1} / {steps.length}
                </p>
              </div>

              <div className="space-y-6">
                {/* STEP 1 */}
                {currentStep === "Informations" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-100 uppercase tracking-wide mb-2">
                        Titre
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Élection du CA 2026"
                        className="input-modern"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-100 uppercase tracking-wide mb-2">
                        Description
                      </label>
                      <textarea
                        placeholder="Contexte..."
                        rows={4}
                        className="input-modern resize-none"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-bold text-slate-100 uppercase tracking-wide mb-2">
                          Début
                        </label>
                        <input
                          type="datetime-local"
                          name="start"
                          className="input-modern"
                          value={form.start}
                          onChange={handleDateChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-100 uppercase tracking-wide mb-2">
                          Fin
                        </label>
                        <input
                          type="datetime-local"
                          name="end"
                          className={errors.date ? "input-modern border-red-500/50 focus:ring-red-500/20" : "input-modern"}
                          value={form.end}
                          onChange={handleDateChange}
                        />
                      </div>
                    </div>
                    {errors.date && (
                      <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded-xl text-red-200 font-medium">
                        ⚠️ {errors.date}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2 */}
                {currentStep === "Questions" && (
                  <div className="space-y-6">
                    {form.questions.map((q, idx) => (
                      <div key={idx} className="space-y-4 p-6 card-glass">
                        <div className="flex items-center justify-between mb-4">
                          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="Question..."
                          className="input-modern text-lg font-semibold"
                          value={q.label}
                          onChange={(e) => {
                            const clone = [...form.questions];
                            clone[idx] = { ...clone[idx], label: e.target.value };
                            setForm({ ...form, questions: clone });
                          }}
                        />

                        <div className="flex gap-2">
                          {["single", "multiple", "ranking"].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                const clone = [...form.questions];
                                clone[idx] = { ...clone[idx], type };
                                setForm({ ...form, questions: clone });
                              }}
                              className={`flex-1 px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-xl transition-all ${
                                q.type === type
                                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700"
                              }`}
                            >
                              {type === "single" && "Unique"}
                              {type === "multiple" && "Multiple"}
                              {type === "ranking" && "Classement"}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-3">
                          {q.options.map((opt, o) => (
                            <input
                              key={o}
                              type="text"
                              placeholder={`Option ${o + 1}`}
                              className="input-modern"
                              value={opt}
                              onChange={(e) => {
                                const clone = [...form.questions];
                                const opts = [...clone[idx].options];
                                opts[o] = e.target.value;
                                clone[idx] = { ...clone[idx], options: opts };
                                setForm({ ...form, questions: clone });
                              }}
                            />
                          ))}
                        </div>

                        <button
                          type="button"
                          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                          onClick={() => {
                            const clone = [...form.questions];
                            clone[idx] = {
                              ...clone[idx],
                              options: [...clone[idx].options, ""],
                            };
                            setForm({ ...form, questions: clone });
                          }}
                        >
                          + Option
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="w-full px-4 py-2.5 border border-dashed border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded-lg font-medium text-sm transition-all"
                      onClick={() =>
                        setForm({
                          ...form,
                          questions: [
                            ...form.questions,
                            { label: "", options: ["", ""], type: "single" },
                          ],
                        })
                      }
                    >
                      + Question
                    </button>
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === "Sécurité" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-100 mb-2">
                        Trustees
                      </label>
                      <input
                        type="number"
                        min={3}
                        className="input-modern"
                        value={form.trustees}
                        onChange={(e) => setForm({ ...form, trustees: Number(e.target.value) })}
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Responsables
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-100 mb-2">
                        Seuil
                      </label>
                      <input
                        type="number"
                        min={2}
                        max={form.trustees}
                        className="input-modern"
                        value={form.threshold}
                        onChange={(e) =>
                          setForm({ ...form, threshold: Number(e.target.value) })
                        }
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Min: {form.threshold}/{form.trustees}
                      </p>
                    </div>

                    <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-3">
                      <p className="text-xs text-slate-400">
                        ℹ️ Clés privées côté client seulement.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {currentStep === "Accès" && (
                  <div className="space-y-4">
                    <ParticipantImporter
                      initialEmails={form.accessList
                        .split("\n")
                        .map((e) => e.trim())
                        .filter((e) => e.includes("@"))}
                      onEmailsChange={(emails) =>
                        setForm({ ...form, accessList: emails.join("\n") })
                      }
                    />

                    <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-3">
                      <p className="text-xs text-slate-400">
                        ✓ Tokens uniques générés automatiquement.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 5 */}
                {currentStep === "Résumé" && (
                  <div className="space-y-4">
                    <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Titre</p>
                        <p className="font-semibold text-slate-100">{form.title || "—"}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Début</p>
                          <p className="text-sm text-slate-300">
                            {form.start ? new Date(form.start).toLocaleDateString("fr-FR") : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Fin</p>
                          <p className="text-sm text-slate-300">
                            {form.end ? new Date(form.end).toLocaleDateString("fr-FR") : "—"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Q</p>
                          <p className="text-sm text-slate-300">{form.questions.length}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Votants</p>
                          <p className="text-sm text-slate-300">
                            {form.accessList.split("\n").filter((e) => e.includes("@")).length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER avec nouveau design */}
          <div className="border-t border-slate-700 bg-slate-800/30 backdrop-blur-sm p-6 flex justify-between items-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={stepIndex === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Précédent
            </button>

            <span className="text-sm font-bold text-slate-400">
              {stepIndex + 1} / {steps.length}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={loading || (stepIndex === 1 && !!errors.date)}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Création..." : stepIndex === steps.length - 1 ? "🚀 Créer" : "Suivant →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
