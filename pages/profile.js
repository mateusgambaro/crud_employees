import { Container } from "@mui/material";
import { Auth, Typography, Button } from "@supabase/ui";
const { Text } = Typography;
import { supabase } from "../api";

function Profile(props) {
  const { user } = Auth.useUser();
  if (user)
    return (
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "50%",
          marginTop: "50px",
        }}
      >
        <Text style={{ marginBottom: "20px" }}>Signed in: {user.email}</Text>
        <Button block onClick={() => props.supabaseClient.auth.signOut()}>
          Sair
        </Button>
      </Container>
    );
  return props.children;
}

export default function AuthProfile() {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Profile supabaseClient={supabase}>
        <Auth
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
          }}
          supabaseClient={supabase}
        />
      </Profile>
    </Auth.UserContextProvider>
  );
}
