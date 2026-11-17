import { Link } from "react-router-dom";

export default function Unauthorized() {
  return <div className="container-page grid min-h-[65vh] place-items-center text-center"><div><div className="text-6xl">403</div><h1 className="mt-3 text-3xl font-black">Access denied</h1><p className="mt-2 text-slate-500">You do not have permission to access this module.</p><Link to="/" className="mt-6 inline-block rounded-xl bg-teal-700 px-5 py-3 font-bold text-white">Go Home</Link></div></div>;
}
