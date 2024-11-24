import styled from "styled-components";
import Hero from "@salah-tours/assets/images/bg.jpg";

export const TopBar = styled.div`
  height: 5vh;
`;
export const BottomPlaceholder = styled.div``;
export const BottomBar = styled.div`
  height: 6vh;
`;
export const MiddleHero = styled.div`
  background: url(${Hero.src}) no-repeat center center/cover;
  min-height: 60vh;


  @media screen and (max-width: 768px) {
    min-height: 50vh;
  }
`;
