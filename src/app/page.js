import Footer from "@/components/Footer";
import HomeBanner from "@/components/HomeBanner";
import Navbar from "@/components/Navbar";
import Section1 from "@/components/Section1";
import Premium from "@/components/Premium";
import Image from "next/image";
import Newsection from "@/components/Newsection";
import Products from "@/components/Product";
import CategoryWiseDist from "@/components/CategoryWiseDist";

export default function Home() {
  return (
  <>
 
  <HomeBanner />
  <Section1 />
  <Premium />
  <Products />
  <Newsection />
  <CategoryWiseDist />

  </>
  );
}
