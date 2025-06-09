import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui";

interface IProps {
  isLoading: boolean;
  loadingLabel: string;
  buttonLabel: string;
}

export function AuthSubmitButton({ isLoading, loadingLabel, buttonLabel }: IProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] animate-fade-in animation-delay-1200"
    >
      {isLoading
        ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{loadingLabel}</span>
            </div>
          )
        : (
            buttonLabel
          )}
    </Button>
  );
}
