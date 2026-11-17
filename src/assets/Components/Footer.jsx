
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 py-10 text-slate-300 dark:border-slate-800">
      <div className="container-page grid gap-8 md:grid-cols-3">

        {/* Brand */}
        <div>
          <div className="text-xl font-black text-white">
            RoomMate <span className="text-teal-400">Radar</span>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Find the right room and connect with compatible roommates
            for a better shared living experience.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-white">Quick Links</h3>

          <div className="mt-3 space-y-2 text-sm text-slate-400">
            <p className="cursor-pointer hover:text-teal-400">Home</p>
            <p className="cursor-pointer hover:text-teal-400">Find Rooms</p>
            <p className="cursor-pointer hover:text-teal-400">Find Roommates</p>
            <p className="cursor-pointer hover:text-teal-400">About Us</p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-white">Contact Us</h3>

          <div className="mt-3 space-y-2 text-sm text-slate-400">
            <p>📧 support@roommateradar.com</p>
            <p>📞 +91 98765 43210</p>
            <p>📍 Kerala, India</p>
          </div>
        </div>

      </div>

      <div className="container-page mt-8 border-t border-slate-800 pt-5 text-xs text-slate-500">
        © 2026 RoomMate Radar. All rights reserved.
      </div>
    </footer>
  );
}
