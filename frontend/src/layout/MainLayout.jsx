import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main >
        {children}
      </main>
      <footer className="text-center border-slate-200 shadow-[0_10px_80px_rgba(79,70,229,0.12)] py-6 border-t text-slate-500 text-sm">
        © 2026 | Online Title Verification System
      </footer>
    </>
  );
};

export default MainLayout;
