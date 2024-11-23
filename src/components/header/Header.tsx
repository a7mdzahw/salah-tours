"use client";
import React from "react";
import styled from "styled-components";

const TopBar = styled.div``

const Header = () => {
  return (
    <header className="w-full"> 
       <TopBar className="bg-primary-500 h-12 flex gap-3 items-center px-8 text-forground">
        <p className="uppercase">About</p>
        <p className="uppercase">Contact US</p>
      </TopBar>
    </header>
  );
};

export default Header;
