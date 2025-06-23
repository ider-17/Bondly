"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-neutral-200 backdrop-blur-md sticky top-0 z-50 bg-white/70">
        <h1 className="text-xl font-semibold tracking-tight">Bondly</h1>
      </nav>

      {/* Hero Section */}
      <section
        className="flex flex-col items-center justify-center text-center py-28 px-6 bg-gradient-to-b from-black/60 via-black/40 to-black/20 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('mentor.webp')`,
        }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-3xl flex flex-col items-center text-white">
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 leading-tight">
            Find Your Perfect Buddy.
          </h2>
          <p className="text-base max-w-md mb-8">
            Mentorship, support, and friendship in one smart system.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 text-white font-bold border-1 cursor-pointer rounded-full backdrop-blur-md text-sm hover:bg-neutral-100 hover:text-black transition shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 md:px-24 flex flex-col items-center bg-white">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-semibold mb-2">How It Works</h3>
          <p className="text-sm text-neutral-500">
            A simple journey to connection
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {["Sign In", "Set Goals", "Get Matched"].map((step, i) => (
            <div
              key={i}
              className="p-6 border flex flex-col items-center border-neutral-200 rounded-xl shadow-md hover:shadow-lg transition duration-200"
            >
              <h4 className="text-lg font-medium mb-2">{step}</h4>
              <p className="text-sm text-neutral-500">
                Simple steps to connect with the right person.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 px-6 md:px-24 bg-neutral-50">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-semibold mb-2">Contact Us</h3>
          <p className="text-sm text-neutral-500 mb-6">
            Have questions, feedback, or partnership ideas? We'd love to hear
            from you.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks for your message! We'll get back to you shortly.");
            }}
            className="space-y-4 text-left"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows={4}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black outline-none"
              ></textarea>
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="bg-black text-white text-sm px-6 py-2 rounded-full hover:bg-neutral-800 transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-xs text-neutral-400 border-t border-neutral-200">
        © 2025 Bondly. ZenSync.
      </footer>
    </div>
  );
}
