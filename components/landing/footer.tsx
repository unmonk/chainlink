import React from "react";

const Footer = () => (
  <footer className="w-full py-2 text-center text-sm text-muted-foreground border-t">
    <div className="flex flex-col items-center justify-center">
      <span>© {new Date().getFullYear()} Chainlink. All rights reserved.</span>
      <span className="text-xs">
        DISCLAIMER: This site is not affiliated, associated, authorized,
        endorsed by, or in any way officially connected with any network, team,
        league or its subsidiaries or its affiliates. All logos, brands, and
        other trademarks or images featured or referred to within this website
        are the property of their respective trademark holders.
      </span>
    </div>
  </footer>
);

export default Footer;
