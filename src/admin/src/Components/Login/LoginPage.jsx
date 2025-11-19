// LoginPage.jsx
import { useState } from "react";
import { Lock, Mail, Smartphone, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../GlobalContext";
import Logo from "../../Images/Packky.svg";

export default function LoginPage() {
  const [form, setForm] = useState({ mobile: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setAccessToken, token } = useGlobalContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        mobile: form.mobile,
        password: form.password,
        step: step.toString(),
        otp: step === 2 ? otp : "",
        latitude: "0.0",
        longitude: "0.0",
      };

      const response = await axios.post("https://api.packky.com/api/Admin/v1.0/login", payload, {
        headers: { Authorization: `Basic ${token}` },
      });

      if (response.data.responseCode === "00") {
        if (step === 1) {
          setStep(2);
        } else if (step === 2) {
          sessionStorage.setItem("admin", JSON.stringify(response.data.response));
          setAccessToken(response.data.response.accessToken);
          navigate("/dashboard");
          window.location.reload();
        }
      } else {
        alert(response.data.responseMessage);
      }
    } catch (err) {
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(29, 78, 216, 0.4); }
          50% { box-shadow: 0 0 40px rgba(29, 78, 216, 0.7); }
        }
        @keyframes slide-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .gradient-bg {
          background: linear-gradient(-45deg, #0f172a, #1e293b, #334155, #0f172a, #1e40af, #1d4ed8);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        .glassmorphism {
          background: rgba(30, 41, 59, 0.3);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .float { animation: float 6s ease-in-out infinite; }
        .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .slide-up { animation: slide-up 0.8s ease-out; }
        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }
        .shimmer-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-900/20 rounded-full float" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-slate-700/20 rounded-full float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-blue-800/20 rounded-full float" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-slate-600/20 rounded-full float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <div className="hidden lg:block text-center slide-up">
            <div className="space-y-8">
          
              <div className="relative">
                <div className="absolute inset-0 bg-blue-800/30 blur-3xl rounded-full"></div>
                <div className="relative glassmorphism rounded-3xl p-12 pulse-glow">
                  <div className="text-8xl mb-6 float">🚀</div>
                  <h1 className="text-5xl font-bold text-slate-100 mb-4">
                    Welcome to <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Packky</span>
                  </h1>
                  <p className="text-xl text-slate-300 mb-8">
                    Next-generation logistics management platform
                  </p>
                  
                  
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="glassmorphism rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl mb-2">⚡</div>
                      <div className="text-sm text-white/90">Lightning Fast</div>
                    </div>
                    <div className="glassmorphism rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl mb-2">🔒</div>
                      <div className="text-sm text-white/90">Ultra Secure</div>
                    </div>
                    <div className="glassmorphism rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl mb-2">📊</div>
                      <div className="text-sm text-white/90">Smart Analytics</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto slide-up" style={{animationDelay: '0.2s'}}>
            <div className="glassmorphism rounded-3xl p-8 shadow-2xl">
              
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-block p-3 glassmorphism rounded-2xl mb-4">
                  <img src={Logo} alt="Packky Logo" className="h-10 w-auto" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Admin Portal</h2>
                <p className="text-slate-300">Secure access to your dashboard</p>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex space-x-2">
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Mobile Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-white/50 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Mobile number"
                    className="w-full pl-10 pr-4 py-3 glassmorphism rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/40 transition-all duration-300"
                  />
                </div>

                {/* Password Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/50 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-10 pr-12 py-3 glassmorphism rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/40 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* OTP Input */}
                {step === 2 && (
                  <div className="relative group slide-up">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white/50 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="w-full pl-10 pr-4 py-3 glassmorphism rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-700/40 transition-all duration-300"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-slate-100 font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shimmer-effect"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-100 mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    step === 1 ? "Continue" : "Verify & Access Dashboard"
                  )}
                </button>

                {/* Step 2 Info */}
                {step === 2 && (
                  <div className="text-center text-slate-300 text-sm slide-up">
                    We've sent a verification code to your mobile number
                  </div>
                )}

                {/* Footer */}
                <div className="text-center text-white/50 text-xs mt-6">
                  © {new Date().getFullYear()} Packky. All rights reserved.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}