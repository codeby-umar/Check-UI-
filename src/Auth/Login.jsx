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
      console.log("Muvaffaqiyatli kirdingiz!");
      navigate("/home"); 
    } catch (err) {
      setError("Email yoki parol noto'g'ri!");
      console.error(err.message);
    }
  };

  return (
    <div className="bg-[#f3f4f6]"> 
      <form
        onSubmit={handleSubmit(onSubmit)} 
        className="container flex items-center justify-center h-screen mx-auto"
      >
        <div className="flex items-center gap-20 justify-center w-full">
          <div className="bg-white rounded-3xl w-full max-w-md p-10 shadow-lg">
            <h1 className="text-4xl text-[#B23DEB] text-center font-semibold p-4">
              Check <span className="text-[#DADADA]">UI</span>
            </h1>
            {error && <Alert severity="error" className="mb-4">{error}</Alert>}

            <Box
              className="mb-4"
              sx={{ "& > :not(style)": { mt: 3, width: "100%" } }}
            >
              <TextField
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
                {...register("email", {
                  required: "Emailni kiriting...",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "To'g'ri email kiriting"
                  }
                })}
                type="email"
                label="Email"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "15px" } }}
                {...register("password", {
                  required: "Parolni kiriting",
                  minLength: {
                    value: 6,
                    message: "Parol kamida 6 ta belgidan iborat bo'lsin",
                  },
                })}
                type="password"
                label="Password"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <Button
                sx={{
                  background: "#B23DEB",
                  padding: "13px",
                  borderRadius: "45px",
                  "&:hover": { background: "#9a32cc" }
                }}
                type="submit"
                variant="contained"
                size="large"
              >
                LogIn
              </Button>
            </Box>
            
            <div className="flex p-3 items-center mb-5 justify-between">
              <p className="text-gray-400 text-sm cursor-pointer hover:text-[#B23DEB]">Forget Password ?</p>
              <Link to={"/register"} className="text-[#B23DEB] font-bold text-sm">
                Sign Up
              </Link>
            </div>
            
            <p className="text-center text-gray-400 text-[10px] leading-tight">
              This site is protected by reCAPTCHA and Google Privacy Policy and
              Terms of Service apply.
            </p>
          </div>
          
          <div className="hidden lg:block">
            <img src={art} alt="AI Illustration" className="w-130" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;