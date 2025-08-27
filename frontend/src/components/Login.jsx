import { useState } from "react";
import { useAuth } from "../contexts";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const Login = () => {
  const { user, loginUser, loginUserOAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    const credentials = { email: email, password: password };
    try {
      const res = await loginUser(credentials);
      if (res) {
        alert("successfully logged-in");
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(error.message);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen text-black dark:bg-black dark:text-white">
        <div className="flex-col w-1/3 h-auto px-5 py-5 rounded-xl text-black bg-gray-300 dark:bg-gray-800 dark:text-white">
          <div className="text-red-500 font-bold">
            <p>{error}</p>
          </div>
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email">Email: </label>
              <br />
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="bg-gray-200 w-full rounded text-black mb-2 p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="password">Password: </label>
              <br />
              <input
                type="password"
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="bg-gray-200 w-full rounded text-black mb-2 p-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-1 py-2 rounded-xl bg-green-500 my-4"
            >
              Login
            </button>
            <br />
            <button
              onClick={() => {
                loginUserOAuth();
              }}
              className="text-2xl flex justify-center w-full mt-3"
              title="Sign in with Google"
            >
              <FcGoogle />
            </button>
          </form>
          <div className="text-center mt-4">
            <h1>
              Don't have an account?{" "}
              <span className="text-red-500 font-semibold">
                <Link to={"/register"}>Register</Link>
              </span>
            </h1>
          </div>
        </div>
      </div>
    );
  }
};

export default Login;
