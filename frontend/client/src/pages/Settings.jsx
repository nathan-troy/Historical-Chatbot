import React from "react";
import "./Settings.css";

export default function Settings({ settings, updateSetting, messages, onClearChat }) {
  const handleDownloadTranscript = () => {
    const text = messages
      .map((m) => `${m.sender === "bot" ? "Emperor Norton I" : "Citizen"}: ${m.text}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "emperor-norton-transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="settings-page">
      <header className="chat-header">
        <h1>Imperial Settings</h1>
      </header>

      <div className="settings-body">
        <div className="setting-item">
          <div>
            <strong>Royal Night Mode</strong>
            <p>Switch the parchment court to a dark midnight palette.</p>
          </div>
          <input
            type="checkbox"
            checked={settings.darkMode}
            onChange={(e) => updateSetting("darkMode", e.target.checked)}
          />
        </div>

        <div className="setting-item">
          <div>
            <strong>Speak Decrees Aloud</strong>
            <p>Have Emperor Norton read his replies using browser voice narration.</p>
          </div>
          <input
            type="checkbox"
            checked={settings.voiceNarration}
            onChange={(e) => updateSetting("voiceNarration", e.target.checked)}
          />
        </div>

        <div className="setting-item">
          <div>
            <strong>Voice Volume ({Math.round((settings.voiceVolume ?? 1) * 100)}%)</strong>
            <p>Adjust how loudly Emperor Norton proclaims his decrees.</p>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.voiceVolume ?? 1}
            disabled={!settings.voiceNarration}
            onChange={(e) => updateSetting("voiceVolume", parseFloat(e.target.value))}
          />
        </div>

        <div className="setting-item">
          <div>
            <strong>Text Size</strong>
            <p>Scale text across the court for easier reading.</p>
          </div>
          <select
            value={settings.textScale}
            onChange={(e) => updateSetting("textScale", e.target.value)}
          >
            <option value="normal">Normal (100%)</option>
            <option value="large">Large (115%)</option>
            <option value="xlarge">Extra Large (130%)</option>
          </select>
        </div>

        <div className="setting-item">
  <div>
    <strong>Imperial Title Builder</strong>
    <p>
      {settings.titleRank && settings.titleDomain
        ? `Current: ${settings.titleRank} ${settings.titleDomain}`
        : "Combine a rank and domain for His Majesty to address you by."}
    </p>
  </div>
  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
    <select
      value={settings.titleRank}
      onChange={(e) => updateSetting("titleRank", e.target.value)}
    >
      <option value="">No Rank</option>
      <option value="Protector">Protector</option>
      <option value="Grand Inspector">Grand Inspector</option>
      <option value="Chief Surveyor">Chief Surveyor</option>
      <option value="Minister">Minister</option>
    </select>

    <select
      value={settings.titleDomain}
      onChange={(e) => updateSetting("titleDomain", e.target.value)}
    >
      <option value="">No Domain</option>
      <option value="of the Bay Bridge">of the Bay Bridge</option>
      <option value="of Commercial Street">of Commercial Street</option>
      <option value="of the Imperial Treasury">of the Imperial Treasury</option>
      <option value="of the Pacific Appeal">of the Pacific Appeal</option>
      <option value="of the Cable Cars">of the Cable Cars</option>
    </select>
  </div>
</div>

        <div className="settings-actions">
          <button type="button" className="imperial-btn" onClick={handleDownloadTranscript}>
            Save Transcript (.txt)
          </button>
          <button type="button" className="imperial-btn danger" onClick={onClearChat}>
            Reset Imperial Favour
          </button>
        </div>
      </div>
    </div>
  );
}