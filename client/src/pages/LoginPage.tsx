import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";

const LoginPage = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-[#181212] p-4 sm:p-6 md:p-8 text-white">
      <div className="border border-[#1A2420] flex flex-col lg:flex-row w-full bg-[#181212] max-w-5xl mx-auto rounded-xl shadow-lg overflow-hidden">
        {/* LOGIN FORM SECTION */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col space-y-6">
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <ShipWheelIcon className="size-9 text-[#1DB853]" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-[#24B357] to-[#26B484] tracking-wider">
              Connectify
            </span>
          </div>

          <form className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Welcome Back</h2>
              <p className="text-sm text-white/70">
                Sign in to your account to continue your language journey
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  className="w-full px-4 py-2 bg-transparent border border-[#2D2727] text-white placeholder-gray rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#2D2727]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-transparent border border-[#2D2727] text-white placeholder-gray rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#2D2727]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-3xl bg-[#1DB853] text-black font-semibold hover:bg-[#17a347] transition"
              >
                Sign In
              </button>
            </div>

            <p className="text-center text-sm">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-[#1DB853] hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>

        {/* IMAGE SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-[#19271A] items-center justify-center border-l border-[#1A2420]">
          <div className="max-w-md p-8 text-center">
            <div className="aspect-square w-full max-w-sm mx-auto">
              <img
                src="/i.png"
                alt="Language connection illustration"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-6 space-y-2">
              <h2 className="text-xl font-semibold text-white">
                Connect with language partners worldwide
              </h2>
              <p className="text-sm text-white/70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
