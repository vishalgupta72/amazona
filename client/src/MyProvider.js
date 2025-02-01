import MyContext from "./MyContext";
import { useState } from "react";

export default function MyProvider({ children }) {

  const [state, setState] = useState({ user: null, cart: [] });

  return (
    <MyContext.Provider
      value={{
        state,
        dispatchCart: (cart) => {
          if (typeof cart === "function") cart = cart();
          setState((s) => ({ ...s, cart }));
        },
        dispatchUser: (user) => {
          if (typeof user === "function") user = user();
          setState((s) => ({ ...s, user }));
        },
      }}
    >
      {children}
    </MyContext.Provider>
  );
}
