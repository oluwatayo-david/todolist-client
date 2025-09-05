import { useAuth } from "../../hooks/use-auth.ts";
import { Button } from "../../components/ui/button.tsx";
import { Card, CardContent, CardHeader } from "../../components/ui/card.tsx";
import { Skeleton } from "../../components/ui/skeleton.tsx";
import { Input } from "../../components/ui/input.tsx";
import { FaUser, FaEdit, FaSignOutAlt, FaEnvelope, FaCamera } from "react-icons/fa";
import { useGetTasks } from "../../hooks/task/use-get-tasks.tsx";
import { useMediaQuery } from "../../hooks/use-media-query.ts";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../../components/ui/drawer.tsx";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog.tsx";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../components/ui/form.tsx";

import {useEditUser} from "../../hooks/use-edit-user.ts";
const editProfileSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    profileImage: z.any().optional().refine((file) => !file || file instanceof File, {
        message: "Please select a valid image file.",
    }).refine((file) => !file || file.size <= 5 * 1024 * 1024, {
        message: "Image must be smaller than 5MB.",
    }),
});

function UserPage() {
    const { user, loading, error, logout } = useAuth();
    const { task } = useGetTasks();
    const {edit} = useEditUser()
    const [editOpen, setEditOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const form = useForm<z.infer<typeof editProfileSchema>>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            profileImage: undefined,
        },
    });

    // Reset form when user data changes or modal opens
    const handleEditOpen = (open: boolean) => {
        if (open) {
            form.reset({
                name: user?.name || "",
                email: user?.email || "",
                profileImage: undefined,
            });
            setPreviewImage(null);
        }
        setEditOpen(open);
    };

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

    const onSubmit = async (values: z.infer<typeof editProfileSchema>) => {
        try {
            setUpdateLoading(true);

            if (values.profileImage) {
                await compressAndConvertImage(values.profileImage, 0.6, 300);
            }

            const data = {
                id: user?._id,
                name: values.name,
                email: values.email,
                ...(values.profileImage && { profileImage: values.profileImage })
            };


            await edit(data);
            setEditOpen(false);
            setPreviewImage(null);
            toast.success('Profile updated successfully');

        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setUpdateLoading(false);
        }
    };



    const EditProfileForm = ({ className }: { className?: string }) => {
        return (
            <div className={className}>
                <div className={'flex-row items-center gap-4 flex mb-6'}>
                    {/* Preview the current or selected image */}
                    {previewImage ? (
                        <div className="flex justify-center">
                            <img
                                src={previewImage}
                                alt="Profile preview"
                                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                            />
                        </div>
                    ) : user?.profileImage?.url ? (
                        <div className="flex justify-center">
                            <img
                                src={user.profileImage.url}
                                alt="Current profile"
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
                        disabled={updateLoading}
                        control={form.control}
                        name="profileImage"
                        render={({ field: { onChange,  ...field } }) => (
                            <FormItem className={'flex-1'}>
                                <FormLabel>Profile Image (optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                onChange(file);
                                                compressAndConvertImage(file, 0.6, 300)
                                                    .then(setPreviewImage)
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
                    disabled={updateLoading}
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your full name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    disabled={updateLoading}
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        );
    };

    const ProfileSkeleton = () => (
        <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-white">
            <CardHeader className="relative pb-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-t-lg"></div>
                <div className="relative z-10 flex flex-col items-center pt-8 pb-6">
                    <div className="relative mb-6">
                        <Skeleton className="w-32 h-32 rounded-full border-4 border-white shadow-lg" />
                    </div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-5 w-64 mb-6" />
                </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
                <div className="flex gap-4 justify-center">
                    <Skeleton className="h-11 w-32" />
                    <Skeleton className="h-11 w-32" />
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4 w-full">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>

                {/* Profile Content */}
                {loading ? (
                    <ProfileSkeleton />
                ) : error ? (
                    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-white">
                        <CardContent className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load profile</h3>
                                <p className="text-gray-500 mb-4">{error}</p>
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Try Again
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-white overflow-hidden">
                        <CardHeader className="relative pb-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
                            <div className="absolute inset-0 bg-black/10"></div>

                            <div className="relative z-10 flex flex-col items-center pt-8 pb-6">
                                <div className="relative mb-6 group">
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                                        {user?.profileImage?.url ? (
                                            <img
                                                src={user.profileImage.url}
                                                alt={`${user?.name || 'User'} profile`}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    if (e.currentTarget.nextElementSibling) {
                                                        (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                                    }
                                                }}
                                            />
                                        ) : null}

                                        <div
                                            className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-4xl font-bold"
                                            style={{ display: user?.profileImage?.url ? 'none' : 'flex' }}
                                        >
                                            {user?.name?.charAt(0).toUpperCase() || <FaUser className="text-3xl" />}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-3 border-white rounded-full shadow-md"></div>
                                </div>

                                <h2 className="text-3xl font-bold text-white mb-2 text-center drop-shadow-md">
                                    {user?.name || 'Anonymous User'}
                                </h2>

                                <div className="flex items-center gap-2 text-white/90 text-lg mb-6">
                                    <FaEnvelope className="text-sm" />
                                    <span>{user?.email || 'No email provided'}</span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="px-8 pb-8 pt-6">
                            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 mb-4">
                                <div className="text-2xl font-bold text-green-600 mb-1">{task.length}</div>
                                <div className="text-sm text-gray-600">Active Task</div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-center">
                                {/* Edit Profile - Conditional rendering: Dialog for desktop, Drawer for mobile */}
                                {isDesktop ? (
                                    <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                                                <FaEdit className="text-sm" />
                                                Edit Profile
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Edit Profile</DialogTitle>
                                                <DialogDescription>
                                                    Update your profile information. Click save when you're done.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                                    <EditProfileForm className="flex flex-col gap-4" />
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            disabled={updateLoading}
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => setEditOpen(false)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button type="submit" disabled={updateLoading}>
                                                            {updateLoading ? 'Updating...' : 'Save Changes'}
                                                        </Button>
                                                    </div>
                                                </form>
                                            </Form>
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <Drawer open={editOpen} onOpenChange={handleEditOpen}>
                                        <DrawerTrigger asChild>
                                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                                                <FaEdit className="text-sm" />
                                                Edit Profile
                                            </Button>
                                        </DrawerTrigger>
                                        <DrawerContent>
                                            <DrawerHeader className="text-left">
                                                <DrawerTitle>Edit Profile</DrawerTitle>
                                                <DrawerDescription>
                                                    Update your profile information. Click save when you're done.
                                                </DrawerDescription>
                                            </DrawerHeader>
                                            <Form {...form}>
                                                <form id="drawer-profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                                    <EditProfileForm className="flex flex-col gap-4 px-4" />
                                                </form>
                                            </Form>
                                            <DrawerFooter className="pt-2">
                                                <Button type="submit" form="drawer-profile-form" disabled={updateLoading}>
                                                    {updateLoading ? 'Updating...' : 'Save Changes'}
                                                </Button>
                                                <DrawerClose asChild>
                                                    <Button type="button" variant="outline" disabled={updateLoading}>
                                                        Cancel
                                                    </Button>
                                                </DrawerClose>
                                            </DrawerFooter>
                                        </DrawerContent>
                                    </Drawer>
                                )}

                                <Button
                                    onClick={logout}
                                    variant="outline"
                                    className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-8 py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                                >
                                    <FaSignOutAlt className="text-sm" />
                                    Logout
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm">
                        Member since {new Date().getFullYear()} • Last login: Today
                    </p>
                </div>
            </div>
        </div>
    );
}

export default UserPage;