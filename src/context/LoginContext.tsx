import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

export type User = {
  username: string;
  role: string;
};

interface ILoginContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User>>;
  authToken: string;
  setAuthToken: Dispatch<SetStateAction<string>>;
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const defaultState = {
  user: null,
  setUser: () => {},
  authToken: "",
  setAuthToken: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
} as ILoginContext;

export const LoginContext = createContext(defaultState);

type LoginProviderProps = {
  children: ReactNode;
};

export default function LoginProvider({ children }: LoginProviderProps) {
  const [authToken, setAuthToken] = useState("");
  const [user, setUser] = useState<User>({
    username: "",
    role: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    const loggedIn = localStorage.getItem("isLoggedIn");

    if (token && user && loggedIn) {
      setAuthToken(token);
      setUser(JSON.parse(user));
      setIsLoggedIn(loggedIn === "true");
    }
  }, [])

  return (
    <LoginContext.Provider value={{ user, setUser, authToken, setAuthToken, isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );

}
