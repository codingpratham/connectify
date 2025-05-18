import { ShipWheelIcon } from "lucide-react";
import { useState } from "react";
import { Link, } from "react-router"; // Ensure it's 'react-router-dom'

const SignUpPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name :fullName,
        email,
        password,
      }),
    });

    const result = await response.json();
    localStorage.setItem("token", result.token);
    console.log("Token:", result.token);
    localStorage.setItem('isOnboarded', 'false');
    localStorage.setItem('userId', result.userId);
    localStorage.setItem("FullName", fullName);

    

    if (!response.ok) {
      throw new Error(result?.message || "Failed to create account");
    }

    console.log("Account created successfully:", result);

    alert("Account created successfully! Please check your email to verify your account.");

    
    window.location.href = "/onboarding"; // Use `navigate("/")` if using React Router
  } catch (error) {
    console.error("Error creating account:", error);
    
  }
};


  return (
    <div className="h-screen flex items-center justify-center bg-[#181212] text-white p-4 sm:p-6 md:p-8">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-[#181212] border border-[#1A2420] rounded-xl shadow-lg overflow-hidden">
        {/* Left Section - Form */}
        <div className="w-full lg:w-1/2 p-8 space-y-6">
          <div className="flex items-center gap-2">
            <ShipWheelIcon className="size-9 text-[#1DB853]" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-[#24B357] to-[#26B484] tracking-wider">
              Connectify
            </span>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Create an Account</h2>
            <p className="text-sm text-white/70">
              Join LangConnect and start your language learning journey
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 bg-transparent border border-[#2D2727] text-white placeholder-gray rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#2D2727]"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                placeholder="hello@example.com"
                className="w-full px-4 py-2 bg-transparent border border-[#2D2727] text-white placeholder-gray rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#2D2727]"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="********"
                className="w-full px-4 py-2 bg-transparent border border-[#2D2727] text-white placeholder-gray rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#2D2727]"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-white/70 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-success mt-1"
                required
              />
              <span className="text-xs text-white/70">
                I agree to the{" "}
                <span className="text-[#1DB853] hover:underline">
                  terms of service
                </span>{" "}
                and{" "}
                <span className="text-[#1DB853] hover:underline">
                  privacy policy
                </span>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-3xl bg-[#1DB853] text-black font-semibold hover:bg-[#17a347] transition"
            >
              Create Account
            </button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[#1DB853] hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* Right Section - Image and Description */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-[#19271A] items-center justify-center p-8 border-l border-[#1A2420]">
          <div className="max-w-md text-center">
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

export default SignUpPage;
