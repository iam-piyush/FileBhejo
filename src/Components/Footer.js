import React from "react";

export function Footer() {
  return (
    <footer className=" bg-orange-50 w-full py-5 mx-auto px-1 text-center border-t-0 border-b-0 border rounded border-dashed border-orange-500 max-[640px]:w-11/12">
      <p>© 2024 FileBhejo. All rights reserved.</p>
      <p className="mt-2">
        Designed by <a href="https://iamritika.vercel.app/" target="blank"><font className="font-medium">Ritika Bhatia</font></a> |
        Developed by <a href="https://iampiyush.vercel.app/" target="blank"><font className="font-medium">Piyush Kumar</font></a>
      </p>
    </footer>
  );
}
