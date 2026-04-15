import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { useApplicationStore } from "../../store/applicationStore";
import { ALL_STATUSES, ALL_SOURCES, ALL_PRIORITIES } from "../../utils/statusColors";
import toast from "react-hot-toast";

/* ✅ FIX: MOVE OUTSIDE */
function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

const EMPTY = {
  company: "", role: "", jobUrl: "", location: "",
  appliedDate: new Date().toISOString().split("T")[0],
  status: "Applied", source: "LinkedIn", priority: "Medium",
  salaryExpected: "", notes: "", followUpDate: "", followUpDone: false,
};

export default function ApplicationModal({ isOpen, onClose, editData = null }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const { addApplication, updateApplication } = useApplicationStore();

  useEffect(() => {
    if (editData) {
      setForm({
        ...EMPTY,
        ...editData,
        appliedDate: editData.appliedDate ? editData.appliedDate.split("T")[0] : EMPTY.appliedDate,
        followUpDate: editData.followUpDate ? editData.followUpDate.split("T")[0] : "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [editData, isOpen]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) return toast.error("Company and role required");
    setLoading(true);
    try {
      if (editData) {
        await updateApplication(editData._id, form);
      } else {
        await addApplication(form);
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? "Edit Application" : "Add Application"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Company *">
            <input className="input" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Google, Meta..." required />
          </Field>
          <Field label="Role *">
            <input className="input" value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Software Engineer" required />
          </Field>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Location">
            <input className="input" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Bangalore, Remote..." />
          </Field>
          <Field label="Job URL">
            <input className="input" value={form.jobUrl} onChange={(e) => set("jobUrl", e.target.value)} placeholder="https://..." />
          </Field>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Status">
            <select className="input" value={form.status} onChange={(e) => set("status", e.target.value)}>
              {ALL_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Source">
            <select className="input" value={form.source} onChange={(e) => set("source", e.target.value)}>
              {ALL_SOURCES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Priority">
            <select className="input" value={form.priority} onChange={(e) => set("priority", e.target.value)}>
              {ALL_PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Applied Date">
            <input type="date" className="input" value={form.appliedDate} onChange={(e) => set("appliedDate", e.target.value)} />
          </Field>
          <Field label="Expected Salary">
            <input className="input" value={form.salaryExpected} onChange={(e) => set("salaryExpected", e.target.value)} placeholder="₹12 LPA, $80k..." />
          </Field>
        </div>

        {/* Row 5 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Follow-up Date">
            <input type="date" className="input" value={form.followUpDate} onChange={(e) => set("followUpDate", e.target.value)} />
          </Field>

          <Field label="Follow-up Done">
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => set("followUpDone", !form.followUpDone)}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.followUpDone ? "bg-brand-600" : "bg-gray-300"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.followUpDone ? "translate-x-5" : ""}`} />
              </button>
              <span className="text-sm">{form.followUpDone ? "Done" : "Pending"}</span>
            </div>
          </Field>
        </div>

        {/* Notes */}
        <Field label="Notes">
          <textarea className="input resize-none" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : editData ? "Save Changes" : "Add Application"}
          </button>
        </div>

      </form>
    </Modal>
  );
}