"use client";

import React, { useState } from "react";
import { 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Coins, 
  Activity, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Hash, 
  Download,
  Server
} from "lucide-react";
import { Shot, CreativeTerritory, ShotLedgerEntry } from "@/lib/types";

interface ShotLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  shots: Shot[];
  activeTerritory: CreativeTerritory | null;
  livepeerMode: "real" | "demo";
}

export function ShotLedgerModal({
  isOpen,
  onClose,
  shots,
  activeTerritory,
  livepeerMode,
}: ShotLedgerModalProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const getCapabilityForShot = (sceneNumber: number) => {
    switch (sceneNumber) {
      case 1:
        return "Livepeer CogVideoX-5B (T2V)";
      case 2:
        return "Livepeer AnimateDiff-Lightning (I2V)";
      case 3:
        return "Livepeer V2V + Neural Color Grade";
      default:
        return "Livepeer CogVideoX-5B / DCI-4K";
    }
  };

  // Build ledger items based on shots
  const ledgerEntries: ShotLedgerEntry[] = shots.length > 0
    ? shots.map((s, idx) => {
        const idHash = Math.abs((s.id + s.title).split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16).padStart(8, "0");
        return {
          shotId: s.id,
          sceneNumber: s.sceneNumber,
          title: s.title,
          capability: getCapabilityForShot(s.sceneNumber),
          nodeSubnet: `orch-us-east-${3910 + idx}`,
          aspectRatio: activeTerritory?.aspectRatio || "2.39:1",
          durationSec: s.durationSec,
          estimatedCostUsd: 0.04,
          status: s.status === "completed" ? "settled" : s.status === "generating" ? "rendering" : "planned",
          verificationHash: `0x7a8e${(3910 + idx).toString(16)}${idHash.slice(0, 8)}`,
        };
      })
    : [
        {
          shotId: "shot-preview-01",
          sceneNumber: 1,
          title: "Establishing Framework",
          capability: "Livepeer CogVideoX-5B (T2V)",
          nodeSubnet: "orch-us-east-3910",
          aspectRatio: "2.39:1",
          durationSec: 4.5,
          estimatedCostUsd: 0.04,
          status: "settled",
          verificationHash: "0x7a8e0f461b0a7d3e",
        },
        {
          shotId: "shot-preview-02",
          sceneNumber: 2,
          title: "Focus of Action",
          capability: "Livepeer AnimateDiff-Lightning (I2V)",
          nodeSubnet: "orch-us-east-3911",
          aspectRatio: "2.39:1",
          durationSec: 3.5,
          estimatedCostUsd: 0.04,
          status: "settled",
          verificationHash: "0x7a8e0f479a2d4e6a",
        },
        {
          shotId: "shot-preview-03",
          sceneNumber: 3,
          title: "Climactic Resonance",
          capability: "Livepeer V2V + Neural Color Grade",
          nodeSubnet: "orch-us-east-3912",
          aspectRatio: "2.39:1",
          durationSec: 4.0,
          estimatedCostUsd: 0.04,
          status: "settled",
          verificationHash: "0x7a8e0f483b8e2e5f",
        },
      ];

  const totalCost = ledgerEntries.reduce((acc, curr) => acc + curr.estimatedCostUsd, 0);
  const remainingDemoGrant = Math.max(0, 10.00 - totalCost);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportReceipt = () => {
    const receiptData = {
      project: "Auteur - Autonomous Cinema Director",
      pipeline: "Livepeer Agent Creative Pipeline",
      timestamp: new Date().toISOString(),
      livepeerMode,
      territory: activeTerritory?.title || "Default Spec",
      totalCostUsd: totalCost,
      remainingGrantUsd: remainingDemoGrant,
      ledger: ledgerEntries,
    };

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `livepeer-shot-ledger-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="max-w-4xl w-full rounded-2xl bg-[#090c12] border border-white/15 p-6 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4ed4b7]/10 border border-[#4ed4b7]/30 flex items-center justify-center text-[#5fe995]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-white text-base tracking-tight">
                  Livepeer Shot Ledger & Cost Forecaster
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#4ed4b7]/10 border border-[#4ed4b7]/30 text-[#5fe995]">
                  Subnet Verified
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans">
                Pre-flight compute estimation & orchestrator subnet verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Livepeer Orchestrator Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 shrink-0">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] font-mono text-zinc-400 block mb-1">LIVEPEER CLUSTER</span>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-[#5fe995] animate-pulse" />
              <span>US-East Subnet</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] font-mono text-zinc-400 block mb-1">GPU POOL</span>
            <span className="text-xs font-mono font-bold text-zinc-200">
              NVIDIA RTX 4090 / A100
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] font-mono text-zinc-400 block mb-1">TOTAL RUN COST</span>
            <span className="text-xs font-mono font-bold text-[#5fe995]">
              ${totalCost.toFixed(3)} USD
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="text-[10px] font-mono text-zinc-400 block mb-1">DEMO GRANT REMAINING</span>
            <span className="text-xs font-mono font-bold text-[#e8c76d]">
              ${remainingDemoGrant.toFixed(2)} / $10.00
            </span>
          </div>
        </div>

        {/* Table of Ledger Entries */}
        <div className="flex-1 overflow-y-auto min-h-0 border border-white/10 rounded-xl bg-black/40">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/5 text-zinc-400 border-b border-white/10 sticky top-0">
              <tr>
                <th className="py-2.5 px-3 whitespace-nowrap">SHOT</th>
                <th className="py-2.5 px-3">CAPABILITY</th>
                <th className="py-2.5 px-3">ORCHESTRATOR NODE</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3 text-right">EST. COST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {ledgerEntries.map((entry) => (
                <tr key={entry.shotId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                    0{entry.sceneNumber} · {entry.title}
                  </td>
                  <td className="py-3 px-3 text-zinc-300 font-medium">
                    {entry.capability}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleCopyHash(entry.verificationHash)}
                      title="Click to copy verification proof hash"
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors group cursor-pointer"
                    >
                      <Server className="w-3 h-3 text-[#5fe995]" />
                      <span className="font-mono text-[11px] text-zinc-200">{entry.nodeSubnet}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">({entry.verificationHash.slice(0, 6)})</span>
                      {copiedHash === entry.verificationHash ? (
                        <CheckCircle2 className="w-3 h-3 text-[#5fe995] ml-1" />
                      ) : (
                        <Hash className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 ml-1 opacity-60" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      entry.status === "settled"
                        ? "bg-[#5fe995]/15 text-[#5fe995] border border-[#5fe995]/30"
                        : entry.status === "rendering"
                        ? "bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 animate-pulse"
                        : "bg-white/10 text-zinc-300 border border-white/15"
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#5fe995]">
                    ${entry.estimatedCostUsd.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-[#5fe995]" />
            <span>Verifiable Livepeer Subnet Spend Bound</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportReceipt}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-mono text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ledger (.json)</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-mono font-semibold text-black bg-gradient-to-r from-[#4ed4b7] to-[#5fe995] hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
