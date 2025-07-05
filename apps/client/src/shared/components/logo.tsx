interface IProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: IProps) {
  return (
    <div className={`flex items-center justify-center ${size === "md" ? "space-x-2" : "space-x-3"}`}>
      <div className={`${size === "md" ? "size-8 rounded-lg" : "size-12 rounded-2xl"} bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300`}>
        <span className={`text-white font-bold ${size === "md" ? "text-sm" : "text-xl"}`}>T</span>
      </div>
      <span className={`${size === "md" ? "text-xl" : "text-2xl"} font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent`}>
        TUBENOTE
      </span>
    </div>
  );
}
