// libraries
import React from "react";

//Componets
import Start from "../../screen-components/un-protected/Home/Start";
// import Cities from "../../screen-components/un-protected/Home/Cities";
import Info from "../../screen-components/un-protected/Home/Info";
import EnategaInfo from "../../screen-components/un-protected/Home/LifeWithEnatega";
import GrowBussiness from "../../screen-components/un-protected/Home/GrowBussiness";
import MiniCards from "../../screen-components/un-protected/Home/MiniCards";
import TinyTiles from "../../useable-components/tinyTiles";
import Couriers from "../../screen-components/un-protected/Home/ForCouriers";
import { PaddingContainer } from "../../useable-components/containers";

const Main = () => {
  return (
    <div className="w-screen">
      <Start />
      <PaddingContainer>
        <div className="w-full">
          {/* <Cities /> */}
          <Info />
          <EnategaInfo />
          <GrowBussiness />
          <MiniCards />
          <div className="grid grid-cols-1 md:grid-cols-2 my-[40px] gap-8">
            <TinyTiles
              image={
                "https://images.ctfassets.net/23u853certza/6kRVPn5kxEnlkgCYUTozhL/7846cf51b410e633a8c30a021ec00bde/Restaurant.png?w=200&q=90&fm=webp"
              }
              heading={"Reach new customers and get more orders"}
              buttonText={"For restaurants"}
              backColor={"#eaf7fc"}
              link={"/restaurantInfo"}
            />
            <TinyTiles
              image={
                "https://images.ctfassets.net/23u853certza/4arD8VZQybXkPfyJXchLat/7457eac1b8137a76b50ed70c20cc03b4/Store.png?w=200&q=90&fm=webp"
              }
              heading={"Become a store partner"}
              buttonText={"For stores"}
              backColor="#eaf7fc"
              link={"/restaurantInfo"}
            />
          </div>

          <Couriers />
        </div>
      </PaddingContainer>
    </div>
  );
};

export default Main;
