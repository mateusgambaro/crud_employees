import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "easymde/dist/easymde.min.css";
import { supabase } from "../api";
import { Container } from "@mui/material";
import { Button } from "react-rainbow-components";

const initialState = {
  pes_nome: "",
  pes_data_nascimento: "",
  pes_observacoes: "",
  pes_cpf: "",
  pes_telefone: "",
};

function CreateEmployee() {
  const [employee, setEmployee] = useState(initialState);
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(0);
  const [disable, setDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const {
    pes_nome,
    pes_data_nascimento,
    pes_cpf,
    pes_telefone,
    pes_observacoes,
  } = employee;

  const router = useRouter();
  function onChange(e) {
    setEmployee(() => ({ ...employee, [e.target.name]: e.target.value }));

    const everyFieldIsFilled = Object.values(employee).every(
      (value) => value !== ""
    );

    if (everyFieldIsFilled) setDisable(false);
  }

  const handleChange = (event) => {
    setJob(event.target.value);
  };

  async function fetchJobs() {
    const user = supabase.auth.user();
    const { data } = await supabase.from("profissao").select("*");
    setJobs(data);
  }

  useEffect(() => {
    fetchJobs();
  }, []);
  async function createNewEmployee() {
    setIsLoading(true);
    const { data } = await supabase
      .from("pessoa")
      .insert([
        {
          pes_nome,
          pes_data_nascimento,
          //   pes_id: user.id,
          prof_id: job,
          pes_cpf,
          pes_telefone,
          pes_observacoes,
        },
      ])
      .single();

    if (data) {
      setIsLoading(false);
      await router.push(`/employee/${data.pes_id}`);
    }
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
      <h1>Adicionar novo funcionário</h1>
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
          label="CPF (Somente números)"
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
          onClick={createNewEmployee}
          disabled={disable}
        >
          Adicionar
        </Button>
      </Box>
    </Container>
  );
}

export default CreateEmployee;
