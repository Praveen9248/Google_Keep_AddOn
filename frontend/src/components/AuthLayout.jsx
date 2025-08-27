import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts";

const AuthLayout = ({ children, authentication = true }) => {
  const navigate = useNavigate();
  const { status } = useAuth();
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    if (authentication && status !== authentication) {
      navigate("/login");
    } else if (!authentication && status !== authentication) {
      navigate("/");
    }
    setLoader(false);
  }, [status, navigate, authentication]);
  return loader ? <>Loading</> : <>{children}</>;
};

export default AuthLayout;
