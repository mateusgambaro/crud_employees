import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../api";
import { Container, Grid } from "@mui/material";
import { CardEmployee } from "../styles/employeeCard";

export default function Home() {
  const [employees, setEmployee] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    const { data, error } = await supabase
      .from("pessoa")
      .select("*, profissao: prof_id (prof_name)");
    setEmployee(data);
    setLoading(false);
  }

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

  if (loading) return <p>Loading ...</p>;
  if (!employees.length) return <p>No employees.</p>;
  return (
    <Container>
      <h1 style={{ textAlign: "center" }}>Funcionários</h1>
      <Grid
        container
        spacing={2}
        direction={windowSize.width >= DESKTOP_WIDTH ? "row" : "column"}
        justifyContent="space-around"
        alignItems="center"
        wrap="nowrap"
      >
        {employees.map((employee, index) => (
          <Grid item xs={4} wrap="wrap" key={employee.pes_id}>
            <Link key={index} href={`/employee/${employee.pes_id}`}>
              <CardEmployee>
                <h2>{employee.pes_nome}</h2>
                <p> {employee.profissao.prof_name}</p>
                <p>CPF: {employee.pes_cpf}</p>
              </CardEmployee>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
