import { createContext, useContext } from "react";

export interface LoginInfo {
    id: string;
}
interface LoginContextType {
    loginInfo: LoginInfo | false | undefined;
    setLoginInfo: (loginInfo: LoginInfo | false) => void
}

// export only for provider
export const LoginContext = createContext<LoginContextType>({} as LoginContextType);

// export for consumers
export const useLoginContext = () => useContext(LoginContext);

