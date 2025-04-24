import { Suspense } from "react";
import CreateResumeForm from "./resume-form";

export default function CreateResumePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <CreateResumeForm />
    </Suspense>
  );
}

const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("resumes")
      .select("count")
      .limit(1);
    if (error) {
      console.error("Supabase connection check failed:", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error("Supabase connection check exception:", err);
    return { success: false, error: err };
  }
};
