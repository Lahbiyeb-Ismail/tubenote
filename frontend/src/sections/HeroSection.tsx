import React from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Video } from "lucide-react";

import { Button } from "@/components/global/Button";
import MaxWidthWrapper from "@/components/global/MaxWidthWrapper";

function HeroSection() {
  return (
    <MaxWidthWrapper className="mx-0">
      <section className="flex flex-col justify-center">
        <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-12 lg:py-16">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            Unlock the Power of{" "}
            <span className="text-primary">Video Learning</span>{" "}
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-500 dark:text-gray-400 sm:px-16 lg:text-xl xl:px-48">
            Unleash your inner note-taking powers with TubeNote - the ultimate
            sidekick for conquering knowledge from the video galaxies.
          </p>
          <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0 lg:mb-16">
            <Button href="/search">
              Get Started
              <ArrowRightIcon className="-mr-1 ml-2 size-5" />
            </Button>
            <Button variant="secondary" href="https://youtu.be/Q5LM985yUmQ">
              <Video className="-ml-1 mr-2 size-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>
    </MaxWidthWrapper>
  );
}

export default HeroSection;
