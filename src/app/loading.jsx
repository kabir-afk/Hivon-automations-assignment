import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function RootLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <LoadingSpinner size="lg" color="indigo" />
      <p className="text-slate-500 font-bold animate-pulse">Loading AI Experiences...</p>
    </div>
  )
}
