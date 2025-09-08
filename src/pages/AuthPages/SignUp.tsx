import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Adonai CCS - Dashboard"
        description="Este dashboard oferece uma visão geral das métricas e estatísticas principais, ajudando você a monitorar o desempenho e tomar decisões informadas."
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
