import Banner from "../modules/Home/Banner/Banner";
import CollectionBox from "../modules/Home/Collection/CollectionBox";
import Services from "../modules/Home/Services/Services";
import Instagram from "../modules/Home/Instagram/Instagram";
import Trendy from "../modules/Home/Trendy/Trendy";
import DealTimer from "../modules/Home/Deal/DealTimer";
import HeroSection from "../modules/Home/Hero/HeroSection";
import Category from "@/modules/Home/Category/Category";

const Home = () => {
  return (
    <>
      <HeroSection />
      <Category />
      {/* <CollectionBox /> */}
      {/* <LimitedEdition/> */}
      <Trendy />
      <DealTimer />
      <Banner />
      <Instagram />
      <Services />
      
    </>
  );
};

export default Home;
