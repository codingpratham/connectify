import { Sparkles, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const OnboardingPage = () => {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isOnboarded = localStorage.getItem("isOnboarded") === "true";
    if (isOnboarded) navigate("/");

  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: fullName,
          bio,
          location,
          profilePic,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        throw new Error("Failed to complete onboarding");
      }

      localStorage.setItem("isOnboarded", "true");
      navigate("/");

      localStorage.setItem("profilePic", profilePic);
      localStorage.setItem("name", fullName);
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setProfilePic(randomAvatar);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] px-4">
      <div className="w-full max-w-md bg-black rounded-xl px-6 py-10 shadow-lg text-white">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Complete Your Profile
        </h2>
        <h3 className="text-lg text-center text-gray-400 mb-6">
          Welcome, {fullName} 👋
        </h3>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-3 mb-6">
            {/* Avatar Preview */}
            <div className="w-20 h-20 rounded-full bg-[#1a1a1a] overflow-hidden">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/30">
                  <span className="text-sm">No Avatar</span>
                </div>
              )}
            </div>

            {/* Generate Avatar Button */}
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-[#1DB853] text-black hover:bg-[#18a144] transition"
              onClick={handleRandomAvatar}
            >
              <Sparkles size={16} />
              Generate Random Avatar
            </button>
          </div>

          {/* Full Name (non-editable) */}
          <div>
            <label className="text-sm block mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-white/10 text-white rounded-full placeholder-white/40 opacity-70 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Bio</label>
            <textarea
              rows={3}
              placeholder="Tell others about yourself and your language learning goals"
              className="w-full px-4 py-2 bg-[#0D0D0D] border border-white/10 text-white rounded-2xl placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1DB853]"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Location</label>
            <input
              type="text"
              placeholder="City, Country"
              className="w-full px-4 py-2 bg-[#0D0D0D] border border-white/10 text-white rounded-full placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1DB853]"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
