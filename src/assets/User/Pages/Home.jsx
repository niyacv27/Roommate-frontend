import { Link } from "react-router-dom";
import { useApp } from "../../../ContextAPI/AppContext";
import RoomCard from "../../Components/RoomCard";

export default function Home() {
  const { rooms } = useApp();
  const approved = rooms.filter((r) => r.status === "approved").slice(0, 3);

  return (
    <>
      <section className="hero-grid relative overflow-hidden">
        <div className="container-page grid min-h-[650px] items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-teal-700 dark:border-teal-900 dark:bg-teal-950">
              Shared housing made simpler
            </span>
            <h1 className="mt-5 text-5xl font-black leading-tight text-slate-950 dark:text-white md:text-6xl">
              Find a room.
              <br />
              Find the <span className="gradient-text">right roommate.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">
              RoomMate Radar connects people looking for rooms with verified
              room listings and compatible roommates based on lifestyle
              preferences.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/rooms"
                className="rounded-xl bg-teal-700 px-6 py-3 font-bold text-white hover:bg-teal-800"
              >
                Explore Rooms
              </Link>
              <Link
                to="/register"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-800 hover:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                Create Account
              </Link>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-5">
              <div>
                <p className="text-2xl font-black">Easy</p>
                <p className="text-xs text-slate-500">Room Search</p>
              </div>

              <div>
                <p className="text-2xl font-black">Smart</p>
                <p className="text-xs text-slate-500">Roommate Matching</p>
              </div>

              <div>
                <p className="text-2xl font-black">Secure</p>
                <p className="text-xs text-slate-500">Online Deposits</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
            <div className="rounded-2xl bg-slate-950 p-6 text-white">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-teal-300">
                  Compatibility preview
                </span>
                <span className="text-xs text-slate-400">Lifestyle based</span>
              </div>
              <div className="mt-8 flex items-center gap-5">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-teal-700 text-2xl font-black">
                  A
                </div>
                <div className="flex-1">
                  <p className="font-bold">Anu + Meera</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Clean · Quiet · Vegetarian · Working
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-teal-300">92%</p>
                  <p className="text-xs text-slate-400">match</p>
                </div>
              </div>
              <div className="mt-7 h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[92%] rounded-full bg-teal-500"></div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-slate-400">Monthly rent</p>
                  <p className="mt-1 font-bold">₹8,500</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-slate-400">Token deposit</p>
                  <p className="mt-1 font-bold">₹2,500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

<section className="section-space">
  <div className="container-page">
    <div className="text-center">
      <p className="text-sm font-black uppercase tracking-widest text-teal-700">
        About RoomMate Radar
      </p>

      <h2 className="mt-3 text-3xl font-black">
        Find a place that feels right
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
        Finding a room and the right people to share it with should be simple.
        RoomMate Radar brings available rooms and compatible roommates together
        in one convenient platform.
      </p>
    </div>

    <div className="mt-10 grid gap-6 md:grid-cols-3">

      {/* Find Rooms */}
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="text-3xl">🏠</div>

        <h3 className="mt-4 text-xl font-black">
          Find Your Room
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          Explore available rooms based on your preferred location, budget,
          room type and amenities. Compare listings and find a space that
          matches your needs.
        </p>
      </div>

      {/* Find Roommates */}
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="text-3xl">🤝</div>

        <h3 className="mt-4 text-xl font-black">
          Meet Compatible Roommates
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          Discover people with similar lifestyle preferences, interests and
          living habits, helping you find a roommate who is a better fit.
        </p>
      </div>

      {/* List a Room */}
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="text-3xl">🔑</div>

        <h3 className="mt-4 text-xl font-black">
          List Your Room
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          Have an available room? Create a listing with your location, rent,
          amenities and preferred roommate details to reach people looking
          for a place to stay.
        </p>
      </div>

    </div>

    <div className="mt-8 rounded-2xl border border-teal-100 bg-teal-50 p-7 dark:border-teal-900 dark:bg-teal-950/30">
      <div className="grid gap-6 md:grid-cols-2 md:items-center">

        <div>
          <h3 className="text-xl font-black">
            A simpler way to find shared housing
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
            Whether you're moving to a new city, looking for an affordable
            room, or searching for someone to share your space with,
            RoomMate Radar helps make the process easier, more organized
            and more convenient.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900">
            <p className="text-xl font-black text-teal-600">Easy</p>
            <p className="mt-1 text-xs text-slate-500">
              Room Search
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900">
            <p className="text-xl font-black text-teal-600">Smart</p>
            <p className="mt-1 text-xs text-slate-500">
              Roommate Matching
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900">
            <p className="text-xl font-black text-teal-600">Flexible</p>
            <p className="mt-1 text-xs text-slate-500">
              Listing Options
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900">
            <p className="text-xl font-black text-teal-600">Secure</p>
            <p className="mt-1 text-xs text-slate-500">
              Online Payments
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>


      <section className="section-space bg-white dark:bg-slate-900/50">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-teal-700">
                Discover
              </p>
              <h2 className="mt-2 text-3xl font-black">
                Recently approved rooms
              </h2>
            </div>
            <Link to="/rooms" className="font-bold text-teal-700">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {approved.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
