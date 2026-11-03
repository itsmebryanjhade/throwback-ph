import React, { useState } from "react";
import type { PrintJob, Terminal } from "@/lib/apps/netcafe/types";
import styles from "./netcafe.module.css";

type PrintServicesPanelProps = {
  terminals: Terminal[];
  printJobs: PrintJob[];
  totalPrintRevenue: number;
  onQueuePrint: (
    terminalId: string,
    documentName: string,
    pageCount: number,
    isColor: boolean,
  ) => void;
  onProcessPrintJob: (jobId: string) => void;
  onClearCompleted: () => void;
};

const PRESET_DOCUMENTS = [
  { name: "Student_Biodata_Resume.doc", pages: 1, isColor: false, label: "Biodata / Resume (1 pg B&W)" },
  { name: "Philippine_History_Term_Paper.doc", pages: 5, isColor: false, label: "Term Paper (5 pgs B&W)" },
  { name: "Science_Fair_Project_Visuals.doc", pages: 4, isColor: true, label: "Science Project (4 pgs Color)" },
  { name: "Thesis_Chapter_1_Introduction.doc", pages: 12, isColor: false, label: "Thesis Draft (12 pgs B&W)" },
];

export function PrintServicesPanel({
  terminals,
  printJobs,
  totalPrintRevenue,
  onQueuePrint,
  onProcessPrintJob,
  onClearCompleted,
}: PrintServicesPanelProps) {
  const [docName, setDocName] = useState("Research_Paper.doc");
  const [pageCount, setPageCount] = useState(5);
  const [isColor, setIsColor] = useState(false);
  const [selectedTerminalId, setSelectedTerminalId] = useState(terminals[0]?.id || "pc-01");

  const costPerPage = isColor ? 5 : 2;
  const estimatedCost = pageCount * costPerPage;

  const handleApplyPreset = (preset: (typeof PRESET_DOCUMENTS)[0]) => {
    setDocName(preset.name);
    setPageCount(preset.pages);
    setIsColor(preset.isColor);
  };

  const handlePrintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQueuePrint(selectedTerminalId, docName, pageCount, isColor);
  };

  return (
    <div className={styles.panelCard} aria-label="Computer shop printing and scanning desk">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 className={styles.panelTitle}>
            🖨 Print & Services Desk
          </h3>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            Rates: ₱2.00 / page (Black & White text) · ₱5.00 / page (Colored document) — Fictional period-inspired simulation values
          </span>
        </div>
        <div className={styles.tillBadge}>
          <span>Print Revenue:</span>
          <span className={styles.cashAmount}>₱{totalPrintRevenue.toFixed(2)}</span>
        </div>
      </div>

      {/* Preset Documents Quick Bar */}
      <div>
        <label className={styles.formLabel}>Common Document Templates:</label>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
          {PRESET_DOCUMENTS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className={styles.secondaryActionBtn}
              onClick={() => handleApplyPreset(preset)}
              aria-label={`Select ${preset.label}`}
            >
              + {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Print Order Form */}
      <form onSubmit={handlePrintSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="doc-name-input">
              Document File Name:
            </label>
            <input
              id="doc-name-input"
              type="text"
              className={styles.formInput}
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. My_Project.doc"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="print-terminal-select">
              Sent From Terminal:
            </label>
            <select
              id="print-terminal-select"
              className={styles.formSelect}
              value={selectedTerminalId}
              onChange={(e) => setSelectedTerminalId(e.target.value)}
            >
              {terminals.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} {t.session ? `(${t.session.customerName})` : "(Walk-in)"}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="pages-input">
              Number of Pages:
            </label>
            <input
              id="pages-input"
              type="number"
              min="1"
              max="100"
              className={styles.formInput}
              value={pageCount}
              onChange={(e) => setPageCount(Math.max(1, parseInt(e.target.value) || 1))}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Color Mode:</label>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <button
                type="button"
                className={!isColor ? styles.actionBtn : styles.secondaryActionBtn}
                style={{ flex: 1 }}
                onClick={() => setIsColor(false)}
                aria-pressed={!isColor}
              >
                Black & White (₱2/pg)
              </button>
              <button
                type="button"
                className={isColor ? styles.actionBtn : styles.secondaryActionBtn}
                style={{ flex: 1 }}
                onClick={() => setIsColor(true)}
                aria-pressed={isColor}
              >
                Color Print (₱5/pg)
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#4ade80", fontFamily: "monospace" }}>
            Total Job Fee: ₱{estimatedCost.toFixed(2)} ({pageCount} pgs @ ₱{costPerPage}/pg)
          </span>

          <button
            type="submit"
            className={styles.actionBtn}
            style={{ padding: "8px 16px", fontSize: "13px" }}
            aria-label="Send document to network printer"
          >
            🖨 Send Document to Network Printer
          </button>
        </div>
      </form>

      {/* Print Queue Table */}
      <div style={{ marginTop: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#f1f5f9" }}>
            Network Print Queue ({printJobs.length} Jobs):
          </div>
          {printJobs.some((j) => j.status === "completed") && (
            <button
              type="button"
              className={styles.simBtn}
              onClick={onClearCompleted}
              aria-label="Clear finished print jobs"
            >
              Clear Finished
            </button>
          )}
        </div>

        {printJobs.length === 0 ? (
          <div style={{ padding: "16px", textAlign: "center", color: "#94a3b8", fontSize: "12px" }}>
            No print jobs in queue. Submit a document above to simulate network printing.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.dataTable} aria-label="Network print queue table">
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Terminal</th>
                  <th>Document Name</th>
                  <th>Pages</th>
                  <th>Mode</th>
                  <th>Cost</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {printJobs.map((job) => (
                  <tr key={job.id}>
                    <td style={{ fontFamily: "monospace", fontSize: "11px" }}>{job.id.slice(-7)}</td>
                    <td>{job.terminalId.toUpperCase()}</td>
                    <td style={{ fontWeight: "600" }}>{job.documentName}</td>
                    <td>{job.pageCount}</td>
                    <td>{job.isColor ? "🎨 Color" : "📄 B&W"}</td>
                    <td style={{ color: "#4ade80", fontWeight: "700", fontFamily: "monospace" }}>
                      ₱{job.costPesos.toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={styles.terminalStatusBadge}
                        style={{
                          background: job.status === "completed" ? "rgba(34, 197, 94, 0.2)" : "rgba(56, 189, 248, 0.2)",
                          color: job.status === "completed" ? "#4ade80" : "#38bdf8",
                        }}
                      >
                        {job.status === "completed" ? "Completed ✓" : "Printing…"}
                      </span>
                    </td>
                    <td>
                      {job.status !== "completed" && (
                        <button
                          type="button"
                          className={styles.simBtn}
                          style={{ padding: "2px 6px", fontSize: "10px" }}
                          onClick={() => onProcessPrintJob(job.id)}
                          aria-label={`Mark print job ${job.documentName} as completed`}
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
