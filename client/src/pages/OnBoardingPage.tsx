import { Sparkles, Globe } from "lucide-react";

const OnboardingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] px-4">
      <div className="w-full max-w-md bg-black rounded-xl px-6 py-10 shadow-lg text-white">
        <h2 className="text-2xl font-semibold text-center mb-6">Complete Your Profile</h2>

        <div className="flex flex-col items-center gap-3 mb-6">
          <img
            src="/avatar-placeholder.png" // Replace with your avatar state
            alt="Avatar"
            className="w-20 h-20 rounded-full bg-[#1a1a1a]"
          />
          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-[#1DB853] text-black hover:bg-[#18a144] transition">
            <Sparkles size={16} />
            Generate Random Avatar
          </button>
        </div>

        <form className="space-y-5">
          <div>
            <label className="text-sm block mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Beth Doe"
              className="w-full px-4 py-2 bg-[#0D0D0D] border border-white/10 text-white rounded-full placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1DB853]"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Bio</label>
            <textarea
              rows={3}
              placeholder="Tell others about yourself and your language learning goals"
              className="w-full px-4 py-2 bg-[#0D0D0D] border border-white/10 text-white rounded-2xl placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1DB853]"
            />
          </div>

          

          <div>
            <label className="text-sm block mb-1">Location</label>
            <input
              type="text"
              placeholder="City, Country"
              className="w-full px-4 py-2 bg-[#0D0D0D] border border-white/10 text-white rounded-full placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1DB853]"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full py-3 flex items-center justify-center gap-2 bg-[#1DB853] text-black font-semibold rounded-full hover:bg-[#18a144] transition"
          >
            <Globe size={18} />
            Complete Onboarding
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
