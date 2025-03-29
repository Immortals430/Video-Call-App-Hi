import { memo } from "react";
import "./header.scss"

function Header() {
  return (
      <header className="header ">
      <h1 >Video Call App Hi</h1>
      <p>Start Video Call by clicking on active user</p>
    </header>

  );
}

export default memo(Header);