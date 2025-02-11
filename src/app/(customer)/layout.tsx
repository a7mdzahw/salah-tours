import Header from "@salah-tours/components/header/Header";
import Footer from "@salah-tours/components/footer/Footer";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
