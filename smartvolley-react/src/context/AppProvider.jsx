import { useEffect, useState } from "react";
import { AppContext } from "./AppContext";

export default function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(()=>{

    async function getUser (){
      const id = localStorage.getItem("userId");

      const res = await fetch(`/api/users/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      const data = await res.json();

      if(res.ok){
        setUser(data);
      }
    }

    if(token){
      getUser();
    }

  }, [token]);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser}}>
      {children}
    </AppContext.Provider>
  );
}
