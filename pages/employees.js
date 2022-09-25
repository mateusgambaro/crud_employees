import { useState, useEffect } from "react";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import { supabase } from "../api";
import { Box, Button, Container, Grid } from "@mui/material";
import { Person } from "@mui/icons-material";
import { ButtonContainer, CardEmployee } from "../styles/employeeCard";

export default function Employees() {
  const [employee, setEmployee] = useState([]);
  useEffect(() => {
    fetchEmployes();
  }, []);

  function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
      width: 1200,
      height: 800,
    });

    function changeWindowSize() {
      if (!window) return;
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    useEffect(() => {
      window.addEventListener("resize", changeWindowSize);

      if (window) {
        setWindowSize({
          ...windowSize,
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      return () => {
        window.removeEventListener("resize", changeWindowSize);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return windowSize;
  }

  const windowSize = useWindowSize();
  const DESKTOP_WIDTH = 600;

  async function fetchEmployes() {
    const user = supabase.auth.user();
    const { data } = await supabase
      .from("pessoa")
      .select("*, profissao: prof_id (prof_name)");
    //   .filter('pes_id', 'eq', user.pes_id)
    setEmployee(data);
  }
  async function deleteEmployee(pes_id) {
    await supabase.from("pessoa").delete().match({ pes_id });
    fetchEmployes();
  }

  return (
    <Container>
      <h1 style={{ textAlign: "center" }}>Fucionários ativos</h1>
      <Grid
        container
        spacing={2}
        direction={windowSize.width >= DESKTOP_WIDTH ? "row" : "column"}
        justifyContent="space-around"
        alignItems="center"
        wrap="nowrap"
      >
        {employee.map((employee, index) => (
          <Grid item xs={4} wrap="wrap" key={index}>
            <CardEmployee>
              <h2>{employee.pes_nome}</h2>
              <h4>{employee.profissao.prof_name}</h4>
              <p style={{width: 'fill', textAlign: 'center'}}>Autor: {employee.pes_id}</p>
              <ButtonContainer>
                <Link href={`/edit-employee/${employee.pes_id}`}>
                  <Button variant="contained" size="small">
                    Editar
                  </Button>
                </Link>
                <Link href={`/employee/${employee.pes_id}`}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Person />}
                  >
                    Visualizar
                  </Button>
                </Link>
              </ButtonContainer>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => deleteEmployee(employee.pes_id)}
              >
                Deletar
              </Button>
            </CardEmployee>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
