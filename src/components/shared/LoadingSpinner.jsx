export default function LoadingSpinner({ size = "md", color = "indigo" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4"
  }

  const colors = {
    indigo: "border-indigo-600 border-t-transparent",
    white: "border-white border-t-transparent",
    slate: "border-slate-600 border-t-transparent"
  }

  return (
    <div className={`animate-spin rounded-full ${sizes[size]} ${colors[color]}`}></div>
  )
}
