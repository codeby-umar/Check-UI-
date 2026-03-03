import { CiSearch } from "react-icons/ci";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import ButtonBase from "@mui/material/ButtonBase";
import gr from "../assets/gr.svg";
import { useAuth } from "../context/AuthContext";

function Navbars() {
  const { user } = useAuth();
  const [avatarSrc, setAvatarSrc] = React.useState(undefined);
  const userName = user?.displayName || user?.email?.split("@")[0] || "Mehmon";

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex  items-center justify-between p-8 w-full px-12">
      <div className="min-w-0">
        <h1 className="text-[42px] font-semibold text-slate-900">
          Welcome{" "}
          <span className="text-[#B23DEB] capitalize">{userName}!</span>
        </h1>
        <p className="m-2 text-lg text-slate-500">
          Here is your Profile Dashboard
        </p>
      </div>
      <div className="flex items-center gap-9 shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="h-14 w-80  rounded-xl border border-slate-200 px-4 pr-10 text-sm outline-none transition focus:border-[#B23DEB] focus:ring-2 focus:ring-[#B23DEB]/30"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <CiSearch size={"26px"} />
          </span>
        </div>
        <div>
          <img src={gr} alt="massage" />
        </div>
        <div className="group relative">
          <ButtonBase
            component="label"
            role={undefined}
            tabIndex={-1}
            aria-label="Avatar image"
            sx={{
              height: "50px",
              borderRadius: "40px",
              "&:has(:focus-visible)": {
                outline: "2px solid",
                outlineOffset: "2px",
                border: "solid 1px",
              },
            }}
          >
            <div className="relative">
              <div className="rounded-full ring-2 ring-[#B23DEB]/60 shadow-[0_10px_25px_rgba(178,61,235,0.22)] transition group-hover:ring-[#B23DEB]">
                <Avatar
                  alt="Upload new avatar"
                  src={avatarSrc}
                  sx={{ width: 50, height: 50 }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border border-white text-[10px] shadow-sm ring-2 ring-[#B23DEB]/30 group-hover:ring-[#B23DEB]/60">
                ✎
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              style={{
                clip: "rect(0 0 0 0)",
                height: "1px",
                margin: "-1px",
                overflow: "hidden",
                padding: 0,
                position: "absolute",
                whiteSpace: "nowrap",
                width: "1px",
              }}
              onChange={handleAvatarChange}
            />
          </ButtonBase>
        </div>
      </div>
    </div>
  );
}

export default Navbars;
