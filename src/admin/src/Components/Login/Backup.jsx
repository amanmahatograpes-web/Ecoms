// LoginPage.jsx (Updated with Two-Step Login + Token Set)
import { useState, useContext } from "react";
import { Lock, Mail } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../GlobalContext";

export default function LoginPage() {
  const [form, setForm] = useState({ mobile: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 const { setAccessToken,token } = useGlobalContext();


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

      const response = await axios.post("https://api.packky.com/api/Admin/v1.0/login", payload,{
  headers: { Authorization: `Basic ${token}` }
});
      const data = response.data;

      if (data.responseCode === "00") {
        if (step === 1) {
          setStep(2); // move to OTP step
        } else if (step === 2) {
          console.log(data.response);
          sessionStorage.setItem("admin", JSON.stringify(data.response));
          setAccessToken(data.response.accessToken); 
         navigate("/dashboard");
window.location.reload();
        }
      } else {
        alert(data.responseMessage);
      }
    } catch (err) {
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f1115] text-white px-4">
      <div className="w-full max-w-md p-8 bg-[#1b1d22] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Packky Admin Login</h1>
          <p className="text-sm text-gray-400 mt-1">Secure access to your dashboard</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-medium mb-1 block uppercase tracking-wide text-gray-400">Mobile</label>
            <div className="flex items-center bg-[#26292f] border border-gray-700 rounded px-3 py-2">
              <Mail size={16} className="mr-2 text-gray-400" />
              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className="w-full bg-transparent outline-none text-white placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium mb-1 block uppercase tracking-wide text-gray-400">Password</label>
            <div className="flex items-center bg-[#26292f] border border-gray-700 rounded px-3 py-2">
              <Lock size={16} className="mr-2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-white placeholder-gray-500"
              />
            </div>
          </div>

          {step === 2 && (
            <div>
              <label className="text-xs font-medium mb-1 block uppercase tracking-wide text-gray-400">OTP</label>
              <div className="flex items-center bg-[#26292f] border border-gray-700 rounded px-3 py-2">
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold tracking-wide shadow-md"
          >
            {loading ? "Processing..." : step === 1 ? "Next" : "Verify & Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
