'use client';

import { useState } from 'react';
import { Loader2, Plus, Trash2, Save } from 'lucide-react';
import type {
  BrandProfileRow,
  BrandPaletteSwatch,
  BrandFontEntry,
  UpsertBrandProfile,
} from '@/types/portal';

interface BrandProfileEditorsProps {
  initialProfile: BrandProfileRow;
  clientId: string;
  canEdit: boolean;
}

const FONT_ROLES = ['display', 'body', 'accent'] as const;

function parseBannedWordsInput(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((w) => w.trim())
    .filter(Boolean);
}

export function BrandProfileEditors({
  initialProfile,
  clientId,
  canEdit,
}: BrandProfileEditorsProps) {
  const [palette, setPalette] = useState<BrandPaletteSwatch[]>(initialProfile.palette);
  const [fonts, setFonts] = useState<BrandFontEntry[]>(initialProfile.fonts);
  const [toneVoice, setToneVoice] = useState(initialProfile.tone_voice ?? '');
  const [bannedWordsText, setBannedWordsText] = useState(
    (initialProfile.banned_words ?? []).join(', ')
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const query = clientId ? `?clientId=${encodeURIComponent(clientId)}` : '';

  const handleSave = async () => {
    if (!canEdit) return;
    setIsSaving(true);
    setError(null);
    setMessage(null);

    const patch: UpsertBrandProfile = {
      palette,
      fonts,
      tone_voice: toneVoice.trim() || null,
      banned_words: parseBannedWordsInput(bannedWordsText),
    };

    try {
      const res = await fetch(`/api/portal/brand${query}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save');
      }
      setMessage('Brand details saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const addSwatch = () => {
    setPalette((prev) => [...prev, { name: 'New colour', hex: '#000000' }]);
  };

  const addFont = () => {
    setFonts((prev) => [...prev, { name: '', role: 'body' }]);
  };

  return (
    <div className="space-y-6">
      {/* Colour palette */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-brand-navy">Colour palette</h2>
          <p className="text-sm text-brand-navy/50">Named HEX swatches for your brand</p>
        </div>
        <div className="p-6 space-y-3">
          {palette.length === 0 && (
            <p className="text-sm text-gray-400">No colours added yet</p>
          )}
          {palette.map((swatch, index) => (
            <div key={index} className="flex flex-wrap items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border border-gray-200 shrink-0"
                style={{ backgroundColor: swatch.hex }}
                aria-hidden
              />
              <input
                type="text"
                value={swatch.name}
                onChange={(e) =>
                  setPalette((prev) =>
                    prev.map((s, i) => (i === index ? { ...s, name: e.target.value } : s))
                  )
                }
                disabled={!canEdit}
                placeholder="Colour name"
                className="input-brand flex-1 min-w-[120px]"
              />
              <input
                type="text"
                value={swatch.hex}
                onChange={(e) =>
                  setPalette((prev) =>
                    prev.map((s, i) => (i === index ? { ...s, hex: e.target.value } : s))
                  )
                }
                disabled={!canEdit}
                placeholder="#000000"
                className="input-brand w-28 font-mono text-sm"
              />
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setPalette((prev) => prev.filter((_, i) => i !== index))}
                  className="p-2 text-red-400 hover:text-red-600 rounded-lg"
                  aria-label="Remove colour"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          {canEdit && (
            <button
              type="button"
              onClick={addSwatch}
              className="inline-flex items-center gap-2 text-sm text-brand-gold-accessible hover:text-brand-orange-accessible font-medium"
            >
              <Plus size={16} /> Add colour
            </button>
          )}
        </div>
      </section>

      {/* Font stack */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-brand-navy">Font stack</h2>
          <p className="text-sm text-brand-navy/50">Typography roles and font names</p>
        </div>
        <div className="p-6 space-y-3">
          {fonts.length === 0 && <p className="text-sm text-gray-400">No fonts listed yet</p>}
          {fonts.map((font, index) => (
            <div key={index} className="flex flex-wrap items-center gap-3">
              <select
                value={font.role}
                onChange={(e) =>
                  setFonts((prev) =>
                    prev.map((f, i) => (i === index ? { ...f, role: e.target.value } : f))
                  )
                }
                disabled={!canEdit}
                className="input-brand w-32"
              >
                {FONT_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={font.name}
                onChange={(e) =>
                  setFonts((prev) =>
                    prev.map((f, i) => (i === index ? { ...f, name: e.target.value } : f))
                  )
                }
                disabled={!canEdit}
                placeholder="Font family name"
                className="input-brand flex-1 min-w-[160px]"
              />
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setFonts((prev) => prev.filter((_, i) => i !== index))}
                  className="p-2 text-red-400 hover:text-red-600 rounded-lg"
                  aria-label="Remove font"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          {canEdit && (
            <button
              type="button"
              onClick={addFont}
              className="inline-flex items-center gap-2 text-sm text-brand-gold-accessible hover:text-brand-orange-accessible font-medium"
            >
              <Plus size={16} /> Add font
            </button>
          )}
        </div>
      </section>

      {/* Tone + banned words */}
      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-brand-navy">Voice and words</h2>
          <p className="text-sm text-brand-navy/50">Tone-of-voice notes and words to avoid</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="tone-voice" className="block text-sm font-medium text-brand-navy mb-2">
              Tone of voice
            </label>
            <textarea
              id="tone-voice"
              rows={5}
              value={toneVoice}
              onChange={(e) => setToneVoice(e.target.value)}
              disabled={!canEdit}
              placeholder="How should copy sound? Formal, friendly, veteran-owned, no jargon..."
              className="input-brand resize-none w-full"
            />
          </div>
          <div>
            <label htmlFor="banned-words" className="block text-sm font-medium text-brand-navy mb-2">
              Banned words
            </label>
            <textarea
              id="banned-words"
              rows={3}
              value={bannedWordsText}
              onChange={(e) => setBannedWordsText(e.target.value)}
              disabled={!canEdit}
              placeholder="Comma or newline separated, e.g. synergy, leverage, cheap"
              className="input-brand resize-none w-full"
            />
          </div>
        </div>
      </section>

      {canEdit && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save brand details
              </>
            )}
          </button>
          {message && <p className="text-sm text-green-700">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}
