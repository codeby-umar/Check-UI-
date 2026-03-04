import art from "../assets/art.svg";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Alert } from "@mui/material"; 
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { auth } from "../firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setError("");
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/home"); 
    } catch (err) {
      setError("Email yoki parol noto'g'ri!");
    }
  };

  // MUI TextField uchun umumiy dizayn sozlamalari
  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      color: "white",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
      "&:hover fieldset": { borderColor: "rgba(178, 61, 235, 0.5)" },
      "&.Mui-focused fieldset": { borderColor: "#B23DEB" },
    },
    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.5)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#B23DEB" },
    mb: 2,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center px-6">
      
      {/* Background Orqa fon bezaklari */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#B23DEB]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[0%] right-[-5%] w-[400px] h-[400px] bg-[#B23DEB]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 xl:gap-32 w-full">
          
          {/* Chap tomon: Illustration (Faqat katta ekranlarda) */}
          <div className="hidden lg:block flex-1 max-w-xl animate-float">
            <img src={art} alt="AI Illustration" className="w-full h-auto drop-shadow-[0_0_50px_rgba(178,61,235,0.2)]" />
          </div>

          {/* O'ng tomon: Login Form */}
          <div className="w-full max-w-md">
            <form 
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
            >
              {/* Form ichidagi kichik effekt */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B23DEB]/10 blur-3xl rounded-full"></div>

              <div className="text-center mb-10">
                <Link to="/" className="text-4xl font-black tracking-tighter text-white inline-block mb-2">
                  Check <span className="text-[#B23DEB] drop-shadow-[0_0_10px_rgba(178,61,235,0.5)]">UI</span>
                </Link>
                <p className="text-gray-500 text-sm font-light">Xush kelibsiz! Tizimga kiring.</p>
              </div>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    borderRadius: "12px", 
                    bgcolor: "rgba(211, 47, 47, 0.1)", 
                    color: "#ff5252",
                    border: "1px solid rgba(211, 47, 47, 0.2)",
                    mb: 3 
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <TextField
                  {...register("email", {
                    required: "Emailni kiriting...",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "To'g'ri email kiriting"
                    }
                  })}
                  label="Email"
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={textFieldStyles}
                />

                <TextField
                  {...register("password", {
                    required: "Parolni kiriting",
                    minLength: {
                      value: 6,
                      message: "Kamida 6 ta belgi",
                    },
                  })}
                  type="password"
                  label="Password"
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={textFieldStyles}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 1.8,
                    borderRadius: "16px",
                    background: "linear-gradient(45deg, #B23DEB, #8e2dbd)",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "none",
                    boxShadow: "0 10px 25px rgba(178, 61, 235, 0.3)",
                    "&:hover": { 
                      background: "linear-gradient(45deg, #9a32cc, #7a28a3)",
                      boxShadow: "0 15px 30px rgba(178, 61, 235, 0.5)",
                    }
                  }}
                >
                  Kirish
                </Button>
              </Box>
              
              <div className="flex items-center justify-between mt-8 px-2 text-sm">
                <p className="text-gray-500 hover:text-[#B23DEB] cursor-pointer transition-colors">
                  Parolni unutdingizmi?
                </p>
                <Link to="/register" className="text-[#B23DEB] font-bold hover:underline underline-offset-4">
                  Ro'yxatdan o'tish
                </Link>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5">
                <p className="text-center text-gray-600 text-[11px] leading-relaxed uppercase tracking-widest">
                  Secure Login with reCAPTCHA
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;