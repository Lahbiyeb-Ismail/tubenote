export function HeroRightSide() {
  return (
    <div className="relative hidden lg:block">
      <div className="relative z-10 bg-white/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <div className="ml-auto">
            <div className="w-6 h-6 text-gray-400">✏️</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-gradient-to-r from-purple-200 to-transparent rounded"></div>
          <div className="h-4 bg-gradient-to-r from-pink-200 to-transparent rounded w-4/5"></div>
          <div className="h-4 bg-gradient-to-r from-blue-200 to-transparent rounded w-3/5"></div>
          <div className="h-4 bg-gradient-to-r from-purple-200 to-transparent rounded w-4/5"></div>
          <div className="h-4 bg-gradient-to-r from-pink-200 to-transparent rounded w-2/3"></div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-60 animate-pulse delay-1000"></div>
    </div>
  );
}
