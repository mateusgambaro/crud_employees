import { Container } from "@mui/material";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { supabase } from "../../api";

export default function Pessoa({ employee }) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <Container>
      <h1>{employee.pes_nome}</h1>
      <h2>Profissão: {employee.profissao.prof_name}</h2>
      <span>Criado por: {employee.pes_id}</span>
    </Container>
  );
}

export async function getStaticPaths() {
  const { data, error } = await supabase
    .from("pessoa")
    .select("*, profissao: prof_id (prof_name)");
  const paths = data?.map((employee) => ({
    params: { pes_id: JSON.stringify(employee.pes_id) },
  }));
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { pes_id } = params;
  const { data } = await supabase
    .from("pessoa")
    .select("*, profissao: prof_id (prof_name)")
    .filter("pes_id", "eq", pes_id)
    .single();
  return {
    props: {
      employee: data,
    },
  };
}
