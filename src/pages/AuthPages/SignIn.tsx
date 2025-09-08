import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Adonai CCS - Dashboard"
        description="Este dashboard oferece uma visão geral das métricas e estatísticas principais, ajudando você a monitorar o desempenho e tomar decisões informadas."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
