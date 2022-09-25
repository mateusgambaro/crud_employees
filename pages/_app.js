import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "react-rainbow-components";
import { supabase } from "../api";
import "../styles/globals.css";
import { Header } from "../styles/headerStyles";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async () =>
      checkUser()
    );
    checkUser();
    return () => {
      authListener?.unsubscribe();
    };
  }, []);
  async function checkUser() {
    const user = supabase.auth.user();
    setUser(user);
  }
  return (
    <div>
      <Header>
        <Link href="/">
          <Button>Home</Button>
        </Link>
        {user && (
          <>
            <Link href="/create-employee">
              <Button>Adicionar Funcionário</Button>
            </Link>
            <Link href="/employees">
              <Button>Editar Funcionários</Button>
            </Link>
          </>
        )}
        <Link href="/profile">
          <Button>Perfil</Button>
        </Link>
      </Header>
      <div>
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
