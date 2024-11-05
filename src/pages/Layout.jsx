console.log('Layout.jsx - Start of file');
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
console.log('Imported NavBar:', NavBar);

const Layout = () => {
  console.log('Layout component rendering, NavBar:', NavBar);
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

console.log('Layout component:', Layout);
export default Layout;