import { CircleArrowRight } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center gap-3 bg-appBg">
      <div className="flex items-center space-x-3">
        {/* First Circle */}
        <span className="relative flex size-7">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex size-7 rounded-full bg-sky-500">
            <CircleArrowRight className="size-full text-white" />
          </span>
        </span>

        {/* Second Circle */}
        <span className="relative flex size-6">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex size-6 rounded-full bg-sky-500">
            <CircleArrowRight className="size-full text-white" />
          </span>
        </span>

        {/* Third Circle */}
        <span className="relative flex size-5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex size-5 rounded-full bg-sky-500">
            <CircleArrowRight className="size-full text-white" />
          </span>
        </span>
      </div>

      <p className="ml-4 animate-bounce text-lg font-semibold text-sky-600">
        Loading...
      </p>
    </div>
  );
}
