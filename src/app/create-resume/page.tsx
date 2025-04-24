import { Suspense } from "react";
import CreateResumeForm from "./resume-form";

export default function CreateResumePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <CreateResumeForm />
    </Suspense>
  );
}
