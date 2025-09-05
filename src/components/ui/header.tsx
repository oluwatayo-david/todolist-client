import { useNavigate , Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/use-auth.ts";
import { useMediaQuery } from "../../hooks/use-media-query.ts";
import { Input } from "./input.tsx";
import {FaCalendarDay, FaMagnifyingGlass, FaPlus} from "react-icons/fa6";
import { Button } from "./button.tsx";
import {Calendar} from "./calendar.tsx"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../ui/drawer.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog.tsx";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover"
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {FaCamera} from "react-icons/fa";
import {Textarea} from "./textarea.tsx";
import {formatDateDisplay, formatDateForBackend} from "../../lib/utils.ts";
import {useCreateTask} from "../../hooks/task/use-create-task.ts";
import {useGetTasks} from "../../hooks/task/use-get-tasks.tsx";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    details: z.string().min(2,{
        message: "Please enter details of the task.",
    }),
    startDate: z.date(),
    endDate: z.date(),
    taskImage: z.any().refine((file) => file instanceof File, {
        message: "Please select an image file.",
    }).refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Image must be smaller than 5MB.",
    }),
})

function Header() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            details: "",
            startDate: undefined,
            endDate: undefined,
        },
    })

    const navigate = useNavigate();
    const [image, setImage] = useState<string | null>(null)
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { user } = useAuth();
 const { loading , create   }= useCreateTask()
    const {refetchData} = useGetTasks()
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
            const imageBase64 = await compressAndConvertImage(values.taskImage, 0.6, 300);

            const data = {
                name: values.name,
                details: values.details,
                startDate: formatDateForBackend(values.startDate),
                endDate: formatDateForBackend(values.endDate),
                taskImage: values.taskImage
            }

            console.log(data)

            await create(data)
            await refetchData()
            setOpen(false);
            form.reset();
            setImage(null);
            toast.success('Task created successfully')
            navigate('/dashboard' , {replace: true})
        } catch (e: any) {
            toast.error(e.message || 'An error occurred')
        }
    }

    const TaskForm = ({ className }: { className?: string }) => {
        return (
            <div className={className}>
                <div className={'flex-row items-center gap-4 flex'}>
                    {/* Preview the selected image */}
                    {image ? (
                        <div className="flex justify-center">
                            <img
                                src={image}
                                alt="Task preview"
                                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                            />
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                                <FaCamera className="text-gray-400" />
                            </div>
                        </div>
                    )}

                    <FormField
                        disabled={loading}
                        control={form.control}
                        name="taskImage"
                        render={({ field: { onChange, value, ...field } }) => (
                            <FormItem className={'flex-1'}>
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
                </div>

                <FormField
                    disabled={loading}

                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="Task name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        disabled={loading}

                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={`w-full pl-3 text-left font-normal ${
                                                    !field.value && "text-muted-foreground"
                                                }`}
                                            >
                                                {field.value ? (
                                                    formatDateDisplay(field.value)
                                                ) : (
                                                    <span>Pick start date</span>
                                                )}
                                                <FaCalendarDay className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date() || date < new Date("1900-01-01")
                                            }
                                            className="rounded-md border shadow-sm"
                                            captionLayout="dropdown"
                                            autoFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        disabled={loading}

                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={`w-full pl-3 text-left font-normal ${
                                                    !field.value && "text-muted-foreground"
                                                }`}
                                            >
                                                {field.value ? (
                                                    formatDateDisplay(field.value)
                                                ) : (
                                                    <span>Pick end date</span>
                                                )}
                                                <FaCalendarDay className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date() || date < new Date("1900-01-01")
                                            }
                                            className="rounded-md border shadow-sm"
                                            captionLayout="dropdown"
                                            autoFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    disabled={loading}

                    control={form.control}
                    name="details"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea  placeholder="Task details"
                                           {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        );
    };

    return (
        <>
            <div className={'w-full flex lg:flex-row flex-col justify-between items-center'}>
                <div className={'flex flex-row gap-4'}>
                    <Link className={' w-9 h-9 border border-gray-500 rounded-full overflow-hidden'} to={'/dashboard/user'}>
                        <img src={user?.profileImage?.url} alt={'image'} className={'object-cover w-full h-full'} />
                    </Link>
                    <h1 className={'font-medium text-lg'}>Hi {user?.name}</h1>
                </div>

                <div className={'flex lg:flex-row flex-col gap-4'}>
                    <Input placeholder="Search here..."
                           icon={<FaMagnifyingGlass />}
                    />

                    {/* Conditional rendering: Dialog for desktop, Drawer for mobile */}
                    {isDesktop ? (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="default">
                                    <FaPlus className="mr-2 h-4 w-4" />
                                    Add Task
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Task</DialogTitle>
                                    <DialogDescription>
                                        Create a new task here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <TaskForm  className="flex flex-col gap-4 "/>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                disabled={loading}
                                                type="button"
                                                variant="outline"
                                                onClick={() => setOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={loading}>
                                                {loading ?'Saving..' : 'Save Task'}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <Drawer open={open} onOpenChange={setOpen}>
                            <DrawerTrigger asChild>
                                <Button variant="default">
                                    <FaPlus className="mr-2 h-4 w-4" />
                                    Add Task
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader className="text-left">
                                    <DrawerTitle>Add New Task</DrawerTitle>
                                    <DrawerDescription>
                                        Create a new task here. Click save when you're done.
                                    </DrawerDescription>
                                </DrawerHeader>
                                <Form {...form}>
                                    <form id="drawer-task-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <TaskForm className="flex flex-col gap-4 px-4" />
                                    </form>
                                </Form>
                                <DrawerFooter className="pt-2">
                                    <Button type="submit" form="drawer-task-form" disabled={loading}>
                                        {loading ?'Saving..' : 'Save Task'}
                                    </Button>
                                    <DrawerClose asChild>
                                        <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    )}
                </div>
            </div>
        </>
    )
}

export { Header }