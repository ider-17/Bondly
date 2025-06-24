"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import SideBarMenu from "@/app/_components/SideBarMenu";
import EventsThisWeek from "@/app/_components/EventsThisWeek";
// import RotatingInternCard from "@/app/_components/RotatingInternCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import InternProgress from "../components/InternProgress";
import ApprovalCard from "../components/ApprovalCard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BuddyHomePage() {
  const [selectedSection, setSelectedSection] = useState("Home");
  const [challenges, setChallenges] = useState<any[]>([]);
  const [description, setDescription] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchChallenges();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  };

  const fetchChallenges = async () => {
    const { data, error } = await supabase.from("challenges").select("*");
    if (error) console.error(error);
    else setChallenges(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !description) return;

    const { error } = await supabase.from("submissions").insert([
      {
        user_id: userId,
        challenge_id: selectedId,
        description,
        status: "pending",
      },
    ]);

    if (error) {
      console.error(error);
      setMessage("Алдаа гарлаа");
    } else {
      setMessage("Амжилттай илгээгдлээ!");
      setDescription("");
      setSelectedId(null);
    }
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "Home":
        return (
          <div className="flex gap-5 p-5 mt-21">
            <div className="w-1/2 space-y-5">
              {/* <RotatingInternCard /> */}
              <EventsThisWeek />
            </div>
            <div className="w-1/2 space-y-5">
              <InternProgress />
              <ApprovalCard />
            </div>
          </div>
        );
      case "Challenges":
        return <div className="p-6 mt-100 max-w-2xl">Challenge section</div>;
      case "Advice":
        return <div className="p-6 mt-100">Advice section</div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen bg-white flex text-black overflow-scroll">
      <SideBarMenu
        onSelectSection={(section) => setSelectedSection(section)}
        selectedSection={selectedSection}
      />
      <div className="w-full ml-[264px]">
        <header className="fixed top-0 right-0 w-full pl-[284px] header p-5 pr-20 flex justify-between bg-slate-50 items-center border-b border-neutral-300">
          <div className="flex gap-3 items-center">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h6 className="text-base font-medium">Welcome, Taivanbat</h6>
              <div className="flex">
                <p className="text-[#525252] font-medium text-sm">
                  UX/UI Designer • Design
                </p>
              </div>
            </div>
          </div>
          <div>
            <Bell size={18} />
          </div>
        </header>
        {renderContent()}
      </div>
    </div>
  );
}
