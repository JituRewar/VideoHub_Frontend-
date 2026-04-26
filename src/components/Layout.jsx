import SideBar1 from "./SideBar1";

function Layout({ children }) {
  return (
<div className="flex">
  <SideBar1 />
  <main className="flex-1 ml-64 p-6">
    {/* content */}
  </main>
</div>
  );
}

export default Layout;