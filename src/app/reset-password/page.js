import ResetPasswordForm from '../../components/resetpassword';


import { Suspense } from "react";
import TopMenu from "../../components/topmenu";


export default function ResetPasswordPage() {


  return (
    <>
      <TopMenu  />
      <Suspense fallback={<div>Загрузка формы сброса пароля...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </>
  );
}


export const dynamic = "force-dynamic";