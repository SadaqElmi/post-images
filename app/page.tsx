import { Button } from "@/components/ui/button";
import Link from "next/link";
import Login from "./login/page";

export default function Home() {
  return (
    <div className="px-20 py-5">
      {/*<Button className="mr-10">
        <Link href="dashboard/user">Users</Link>
      </Button>
      <Button>
        <Link href="dashboard/admin">Admin</Link>
      </Button>*/}
      <Login />
    </div>
  );
}
