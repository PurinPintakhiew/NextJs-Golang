import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session]);

  //   useForm
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      const result = await signIn("credentials", { redirect: false, email: data.email, password: data.password });
      if (result?.error) {
        console.error(result.error);
        return false;
      }

      // login successful
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center items-center h-screen">
          <div className="p-4 border-2 gird grid-cols-12 min-w-[500px]">
            <div className="col-span-12 text-center">
              <h1 className="text-2xl font-bold">Login</h1>
            </div>
            <div className="col-span-12">
              <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input {...register("email", { required: true })} className="border p-2" />
              </div>
              {errors.email && <span>This field is email</span>}
            </div>
            <div className="col-span-12">
              <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <input {...register("password", { required: true })} className="border p-2" />
              </div>
              {errors.password && <span>This field is password</span>}
            </div>
            <div className="col-span-12">
              <div className="flex justify-end items-center mt-2">
                <button type="submit" className="border border-1 p-2 rounded-md hover:bg-slate-500">
                  Loing
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};