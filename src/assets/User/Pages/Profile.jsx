import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../../ContextAPI/AuthContext";
import { useApp } from "../../../ContextAPI/AppContext";

export default function Profile() {
  const { user } = useAuth();
  const { updateProfile } = useApp();
  const [form, setForm] = useState({ name: user.name, email: user.email, city: "", occupation: "", lifestyle: "Clean and quiet" });

  const save = e => {
    e.preventDefault();
    updateProfile(form);
    Swal.fire("Saved", "Your profile settings were updated.", "success");
  };

  return (
    <div className="container-page py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-widest text-teal-700">Account</p>
        <h1 className="mt-2 text-4xl font-black">My Profile</h1>
        <p className="mt-3 text-slate-500">Update your profile and lifestyle preferences for better roommate matching.</p>

        <form onSubmit={save} className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              ["name", "Full name", "text"],
              ["email", "Email", "email"],
              ["city", "Preferred city", "text"],
              ["occupation", "Occupation", "text"]
            ].map(([key, label, type]) => (
              <div key={key}>
                <label className="mb-1 block text-sm font-bold">{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-950" />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold">Lifestyle preference</label>
              <select value={form.lifestyle} onChange={e => setForm({...form,lifestyle:e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                <option>Clean and quiet</option><option>Social and flexible</option><option>Student friendly</option><option>Working professional</option>
              </select>
            </div>
          </div>
          <button className="mt-6 rounded-xl bg-teal-700 px-6 py-3 font-black text-white">Save Profile</button>
        </form>
      </div>
    </div>
  );
}
