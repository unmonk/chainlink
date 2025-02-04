import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImStarEmpty } from "react-icons/im";
import Link from "next/link";

export default function GithubButton() {
  //fetch star count
  const [starCount, setStarCount] = useState(0);

  useEffect(() => {
    fetch("https://api.github.com/repos/unmonk/chainlink")
      .then((res) => res.json())
      .then((data) => setStarCount(data.stargazers_count));
  }, []);

  return (
    <Link
      href="https://github.com/unmonk/chainlink"
      target="_blank"
      prefetch={false}
      passHref
    >
      <Button variant="outline" asChild>
        <ImStarEmpty className="h-4 w-4" />
        <span className="ml-2">{starCount} Stars</span>
      </Button>
    </Link>
  );
}
