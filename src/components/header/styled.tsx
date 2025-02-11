import styled from "styled-components";

const middleHero = {
  image:
    "https://plus.unsplash.com/premium_photo-1661956893568-a6e305457ea9?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export const TopBar = styled.div`
  height: 5vh;
`;
export const BottomPlaceholder = styled.div``;
export const BottomBar = styled.div`
  height: 6vh;
`;
export const MiddleHero = styled.div`
  background: url(${middleHero.image}) no-repeat center center/cover;
  min-height: 60vh;

  @media screen and (max-width: 768px) {
    min-height: 50vh;
  }
`;
