import art from "../assets/art.svg";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <form
      onSubmit={handleSubmit()}
      className="container flex items-center justify-center h-screen"
    >
      <div className="flex items-center gap-20 justify-center">
        <div className="bg-white rounded-4xl w-1/3 p-10 ">
          <h1 className="text-4xl text-[#B23DEB] text-center font-semibold p-4">
            Check <span className="text-[#DADADA]">UI</span>
          </h1>
          <Box
            className="mb-4"
            component="form"
            sx={{ "& > :not(style)": { mt: 3, width: "100%" } }}
            noValidate
          >
            <TextField
              {...register("email", {
                required: { value: true, message: "Enter your email ..." },
                maxLength: {
                  value: 40,
                  message: "You can enter a maximum of 40 arguments.",
                },
              })}
              type="email"
              label="Email"
              required
              variant="outlined"
              error={errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...register("password", {
                required: { value: true, message: "Enter your password" },
                maxLength: {
                  value: 6,
                  message: "You can enter a maximum of 6",
                },
              })}
              required
              type="password"
              label="Password"
              variant="outlined"
              error={errors.password}
              helperText={errors.password?.message}
            />
            <Button sx={{background : "#B23DEB" , padding : "13px" , borderRadius : "45px"}} type="submit" variant="contained" size="large">
              LogIn
            </Button>
          </Box>
          <div className="flex p-3 items-center mb-5 justify-between">
            <p className="text-gray-400 text-sm">Forget Password ?</p>
            <Link to={"/login"} className="text-gray-400 text-sm">
              Sign In
            </Link>
          </div>
          <p className="text-center text-gray-400  text-sm">
            This site is protected by reCAPTCHA and Google Privacy Policy and
            Terms of Service apply.
          </p>
        </div>
        <div>
          <img src={art} alt="Suniy intelekt img" />
        </div>
      </div>
    </form>
  );
}

export default Login;
