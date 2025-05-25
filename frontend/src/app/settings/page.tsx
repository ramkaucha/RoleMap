'use client';

import EnhancedInput from "@/components/enhanced-input";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useGetUser } from "@/routes/user";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  /**
   * email
   * first_name
   * last_name
   * id
   * is_active
   * is_verified
   * profile_picture
   * profile_picture_type
  */
  const [user, setUser] = useState({});
  const getUser = useGetUser();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser.mutateAsync();
        console.log(response);
        setUser(response);
      } catch (err: any) {
        console.error(err);
      }
    }
    fetchUser();
  }, []);

  const handleSubmit = () => {
    console.log('submit');
  }

  return (
    <PageWrapper className="w-full p-4 flex-col space-y-8 overflow-auto h-full">
      <div className="flex flex-col space-y-5 w-full px-44" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <h1 className="w-full text-xl">Profile</h1>
          <p className="text-gray-500 text-sm">Change your profile settings here</p>
          <hr/>
        </div>
        <div className="space-y-1 w-full">
          <Label htmlFor="First Name" className="font-bold">First Name:</Label>
          <EnhancedInput
            id="first-name"
            name="first_name"
            type="text"
            placeholder={user.first_name}
            className="w-full"
          />
        </div>
        <div className="space-y-1 w-full">
          <Label htmlFor="Last Name" className="font-bold">Last Name:</Label>
          <EnhancedInput 
            id="last-name"
            name="last_name"
            type="text"
            placeholder={user.last_name}
            className="w-full"
          />
        </div>
        <div className="space-y-1 w-full">
          <Label htmlFor="email" className="font-bold">Email:</Label>
          <EnhancedInput 
            id="email"
            name="email"
            type="text"
            placeholder={user.email}
            className="w-full"
            disabled
          />
        </div>
      </div>
      <div className="flex flex-col space-y-5 w-full px-44">
        <div className="flex flex-col space-y-2">
          <h1 className="w-full text-xl">Password</h1>
          <p className="text-gray-500 text-sm">Change your password here</p>
          <hr/>
        </div>
        <div className="space-y-1 w-full">
          <Label htmlFor="First Name" className="font-bold">Current Password:</Label>
          <EnhancedInput
            type="password"
            id="current-password"
            name="current-password"
            className="w-full text-2xl"
          />
        </div>
        <div className="space-y-1 w-full">
          <Label htmlFor="Last Name" className="font-bold">New Password:</Label>
          <EnhancedInput
            type="password"
            id="new-password"
            name="new-password"
            className="w-full text-3xl"
          />
        </div>
        <div className="justify-end flex">
          <Button type="submit" variant="outline">Save Changes</Button>
        </div>
      </div>
    </PageWrapper>
  )
}