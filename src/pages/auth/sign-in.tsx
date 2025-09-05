import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FaEnvelope , FaEye  } from "react-icons/fa6";
import { Button } from "../../components/ui/button.tsx"
import {useNavigate , Link} from "react-router-dom";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import {useAuth} from "../../hooks/use-auth.ts";
import {toast} from "sonner";
import {useState} from "react";
const formSchema = z.object({
    email: z.string().min(2, {
        message: "email must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "password must be at least 2 characters.",
    }),
})

 function SignInPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })
     const { login  } = useAuth()
     const[loading , setLoading ]= useState(false)
   const navigate = useNavigate();
   async function onSubmit(values: z.infer<typeof formSchema>) {
       try {
           setLoading(true)
   await login(values)
           navigate("/dashboard" , {replace:true})
           toast.success('login successfully')
       }catch (e:any) {
    toast.error(e)
}finally {
           setLoading(false)
       }
    }

    return (
        <div className={'h-screen flex-col flex items-center justify-center p-2'}>
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4   shadow-sm  rounded-lg  p-4  w-full lg:w-[400px]"

            >
                <h1 className={'font-semibold text-gray-700 text-center text-lg'}>Sign in</h1>
                <FormField
                    disabled={loading}
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                   <Input placeholder="Email" {...field}
                       icon={<FaEnvelope/>}
                          type={'email'}
                   />


                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />





                {/* for password */}
                <FormField
                    disabled={loading}
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="*****" {...field}
                                       icon={<FaEye/>}
                                       type={'password'}
                                />


                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit"
                 variant={'default'}
                        className={'bg-green-700 w-full'}
                        disabled={loading}

                >{loading ?
                    'loading..'
                 : "Sign in"}</Button>
            </form>

        </Form>
            <h2>Don't have an account <Link to={'/sign-up'} className={'text-green-700 font-bold'}>Sign up</Link> </h2>

        </div>
    )
}


export default SignInPage;