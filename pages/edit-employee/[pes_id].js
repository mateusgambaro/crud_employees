import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import { supabase } from "../../api";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Button } from "react-rainbow-components";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function EditPost() {
  const [employee, setEmployee] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { pes_id } = router.query;

  const handleChange = (event) => {
    setJob(event.target.value);
  };

  async function fetchJobs() {
    const user = supabase.auth.user();
    const { data } = await supabase.from("profissao").select("*");
    setJobs(data);
  }

  useEffect(() => {
    fetchEmployee();
    fetchJobs();
    async function fetchEmployee() {
      if (!pes_id) return;
      const { data } = await supabase
        .from("pessoa")
        .select("*, profissao: prof_id (prof_name)")
        .filter("pes_id", "eq", pes_id)
        .single();
      setEmployee(data);
    }
  }, [pes_id]);
  if (!employee) return null;
  function onChange(e) {
    setEmployee(() => ({ ...employee, [e.target.name]: e.target.value }));
  }
  const {
    pes_nome,
    pes_data_nascimento,
    pes_cpf,
    pes_telefone,
    pes_observacoes,
  } = employee;
  async function updateCurrentPost() {
    setIsLoading(true);

    await supabase
      .from("pessoa")
      .update([
        {
          pes_nome,
          pes_data_nascimento,
          prof_id: job,
          pes_cpf,
          pes_telefone,
          pes_observacoes,
        },
      ])
      .match({ pes_id });
    setIsLoading(false);

    await router.push("/employees");
  }
  return (
    <Container
      maxWidth="xl"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Editar {employee.pes_nome}</h1>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          width: "50%",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
        }}
      >
        <TextField
          onChange={onChange}
          value={employee.pes_nome}
          name="pes_nome"
          fullWidth
          label="Nome"
          variant="outlined"
        />
        <FormControl fullWidth>
          <InputLabel>Profissão</InputLabel>
          <Select
            id="demo-simple-select"
            value={job}
            label="Profissão"
            onChange={handleChange}
          >
            {jobs.map((job, index) => (
              <MenuItem key={index} value={job.prof_id}>
                {job.prof_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Data de Nascimento"
            value={employee.pes_data_nascimento}
            inputFormat="dd/MM/yyyy"
            onChange={(newValue) => {
              setEmployee(() => ({
                ...employee,
                pes_data_nascimento: newValue,
              }));
            }}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
        <TextField
          onChange={onChange}
          name="pes_cpf"
          fullWidth
          label="CPF"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]{1,11}" }}
          value={employee.pes_cpf}
          variant="outlined"
        />
        <TextField
          onChange={onChange}
          name="pes_telefone"
          fullWidth
          label="Telefone"
          value={employee.pes_telefone}
          variant="outlined"
        />
        <TextField
          onChange={onChange}
          name="pes_observacoes"
          label="Observações"
          fullWidth
          value={employee.pes_observacoes}
          multiline
          rows={4}
          defaultValue="Default Value"
        />
        <Button
          isLoading={isLoading}
          variant="brand"
          onClick={updateCurrentPost}
        >
          Editar
        </Button>
      </Box>
    </Container>
  );
}

export default EditPost;
