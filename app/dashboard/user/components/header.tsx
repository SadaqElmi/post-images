"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";

const Header = () => {
  const [userName, setUserName] = useState("");

  return (
    <>
      <div className="flex justify-around items-center px-25 py-4">
        <Link href="/dashboard/user">
          <h1>Posts</h1>
        </Link>
        <div className="">
          <Link href="/dashboard/user/createpost">
            <Button>Create Post </Button>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {!userName ? <span></span> : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Change The Profile</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <input type="file" />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>LogOut</Button>
        </div>
      </div>
    </>
  );
};

export default Header;
