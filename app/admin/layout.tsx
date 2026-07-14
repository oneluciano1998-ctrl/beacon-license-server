import "@/app/styles/globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#071426",
      }}
    >
      {children}
    </div>
  );
}