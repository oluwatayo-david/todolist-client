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
import {FaCamera, FaRegUser} from "react-icons/fa";
import {useState} from "react";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "password must be at least 6 characters.",
    }),
    confirm_password: z.string().min(6, {
        message: "password must be at least 6 characters.",
    }),
    profileImage: z.any().refine((file) => file instanceof File, {
        message: "Please select an image file.",
    }).refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Image must be smaller than 5MB.",
    }),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
});

function SignUpPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirm_password:"",
            name:"",
        },
    })
    const { signup } = useAuth()
    const[loading , setLoading ]= useState(false)
    const navigate = useNavigate();
    const [image , setImage] = useState<string | null>(null)

    const compressAndConvertImage = (file: File, quality = 0.7, maxWidth = 400): Promise<string> => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;

                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    };



    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const imageBase64 = await compressAndConvertImage(values.profileImage, 0.6, 300);


            setImage(imageBase64);

            const data = {
                name: values.name,
                email: values.email,
                password: values.password,
                profileImage: values.profileImage
            }

setLoading(true)
            await signup(data)
            navigate("/dashboard" , {replace:true})
            toast.success('Account created successfully')
        } catch (e: any) {
            toast.error(e.message || 'An error occurred')
        }finally {
            setLoading(false)
        }
    }

    return (
        <div className={'h-screen flex-col flex items-center justify-center p-2'}>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 shadow-sm rounded-lg p-4 w-full lg:w-[400px]">
                    <h1 className={'font-semibold text-gray-700 text-center text-lg'}>Sign Up</h1>

                    <FormField
                        disabled={loading}
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Name"
                                        {...field}
                                        icon={<FaRegUser />}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        disabled={loading}
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Email"
                                        {...field}
                                        icon={<FaEnvelope/>}
                                        type={'email'}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        disabled={loading}
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Password"
                                        {...field}
                                        icon={<FaEye/>}
                                        type={'password'}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        disabled={loading}
                        control={form.control}
                        name="confirm_password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Confirm Password"
                                        {...field}
                                        icon={<FaEye/>}
                                        type={'password'}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        disabled={loading}
                        control={form.control}
                        name="profileImage"
                        render={({ field: { onChange, value, ...field } }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="file"
                                        accept="image/*"
                                        icon={<FaCamera />}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                onChange(file);
                                                compressAndConvertImage(file, 0.6, 300)
                                                    .then(setImage)
                                                    .catch(() => toast.error('Failed to process image'));
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Preview the selected image */}
                    {image && (
                        <div className="flex justify-center">
                            <img
                                src={image}
                                alt="Profile preview"
                                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                            />
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant={'default'}
                        className={'bg-green-700 w-full'}
                        disabled={loading}
                    >
                        {loading ?  'loading..' : "Sign Up"}
                    </Button>
                </form>
            </Form>

            <h2 className="mt-4">
                Already have an account?
                <Link to={'/'} className={'text-green-700 font-bold ml-1'}>
                    Sign In
                </Link>
            </h2>
        </div>
    )
}

export default SignUpPage;