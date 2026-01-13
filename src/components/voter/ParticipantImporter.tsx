"use client";

import React, { useState, useRef } from "react";
import { parseEmailFile, ParseResult, mergeEmails } from "@/lib/emailParser";

interface ParticipantImporterProps {
  onEmailsChange: (emails: string[]) => void;
  initialEmails?: string[];
}

export function ParticipantImporter({
  onEmailsChange,
  initialEmails = [],
}: ParticipantImporterProps) {
  const [emails, setEmails] = useState<string[]>(initialEmails);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setParseResult(null);
    setShowPreview(false);

    try {
      // Validate file type
      const validTypes = ["text/plain", "text/csv", "application/vnd.ms-excel"];
      const filename = file.name.toLowerCase();
      if (
        !validTypes.includes(file.type) &&
        !filename.endsWith(".csv") &&
        !filename.endsWith(".txt")
      ) {
        throw new Error(
          "Format non supporté. Utilisez CSV ou TXT (max 5MB)."
        );
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Le fichier est trop volumineux (max 5MB).");
      }

      const result = await parseEmailFile(file);
      setParseResult(result);
      setShowPreview(true);
    } catch (err: any) {
      setError(err.message || "Erreur lors du traitement du fichier");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmails = () => {
    if (!parseResult || parseResult.emails.length === 0) return;

    const merged = mergeEmails(emails, parseResult.emails);
    setEmails(merged);
    onEmailsChange(merged);
    setParseResult(null);
    setShowPreview(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    const filtered = emails.filter(
      (e) => e.toLowerCase() !== emailToRemove.toLowerCase()
    );
    setEmails(filtered);
    onEmailsChange(filtered);
  };

  const handleClearAll = () => {
    if (window.confirm("Êtes-vous sûr de vouloir effacer tous les emails ?")) {
      setEmails([]);
      onEmailsChange([]);
    }
  };

  const handleManualAdd = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    const lines = text
      .split(/[\n,;]/)
      .map((line) => line.trim().toLowerCase())
      .filter((line) => line.includes("@") && line.includes("."));

    const merged = mergeEmails(emails, lines);
    setEmails(merged);
    onEmailsChange(merged);
  };

  return (
    <div className="space-y-4">
      {/* File Upload */}
      <div className="rounded-lg border-2 border-dashed border-slate-700 hover:border-cyan-400/50 transition-colors p-6 text-center cursor-pointer"
           onClick={() => fileInputRef.current?.click()}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileSelect}
          disabled={loading}
          className="hidden"
        />
        <div className="space-y-2">
          <div className="text-3xl">📁</div>
          <p className="text-sm font-medium text-slate-300">
            Glissez un fichier CSV ou TXT
          </p>
          <p className="text-xs text-slate-500">
            ou cliquez pour sélectionner (max 5MB)
          </p>
          {loading && <p className="text-xs text-cyan-400">Traitement...</p>}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 flex items-start gap-2">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div className="flex-1">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Parse Result Preview */}
      {showPreview && parseResult && (
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-200">
                {parseResult.format.toUpperCase()} détecté
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {parseResult.validCount} email(s) valide(s)
                {parseResult.invalidCount > 0
                  ? ` • ${parseResult.invalidCount} invalide(s)`
                  : ""}
              </p>
              {parseResult.delimiter && (
                <p className="text-xs text-slate-500 mt-1">
                  Délimiteur: "{parseResult.delimiter}"
                  {parseResult.emailColumnIndex !== undefined &&
                    ` • Colonne: ${parseResult.emailColumnIndex + 1}`}
                </p>
              )}
            </div>
            <span className="text-2xl flex-shrink-0">✅</span>
          </div>

          {parseResult.emails.length > 0 && (
            <div className="max-h-40 overflow-y-auto bg-slate-950 rounded p-2 space-y-1">
              {parseResult.emails.slice(0, 10).map((email) => (
                <div
                  key={email}
                  className="text-xs text-slate-300 font-mono truncate"
                >
                  ✓ {email}
                </div>
              ))}
              {parseResult.emails.length > 10 && (
                <div className="text-xs text-slate-500 py-1">
                  +{parseResult.emails.length - 10} autres...
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleAddEmails}
            disabled={parseResult.emails.length === 0}
            className="w-full rounded-lg bg-green-600 hover:bg-green-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 transition-colors"
          >
            ➕ Ajouter {parseResult.emails.length} email(s)
          </button>
        </div>
      )}

      {/* Manual Entry */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Ou entrez les emails manuellement
        </label>
        <textarea
          onChange={handleManualAdd}
          placeholder="email1@example.com&#10;email2@example.com&#10;&#10;Ou séparés par des virgules: email1@example.com, email2@example.com"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 font-mono resize-none h-24"
        />
      </div>

      {/* Email List */}
      {emails.length > 0 && (
        <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-200">
              {emails.length} participant(s)
            </p>
            {emails.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Effacer tout
              </button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2">
            {emails.map((email) => (
              <div
                key={email}
                className="flex items-center justify-between gap-2 bg-slate-950 rounded px-3 py-2 text-sm"
              >
                <span className="text-slate-300 font-mono truncate flex-1">
                  {email}
                </span>
                <button
                  onClick={() => handleRemoveEmail(email)}
                  className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                  title="Supprimer"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
