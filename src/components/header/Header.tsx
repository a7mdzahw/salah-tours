"use client";
import React, { useEffect } from "react";
import { TopBar, BottomBar, MiddleHero, BottomPlaceholder } from "./styled";
import { Box, Button, Stack, Typography } from "@mui/material";
import Image from "next/image";

// Icons
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

// images
import Logo from "@salah-tours/assets/images/logo.png";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const Header = () => {
  const [fixed, setFixed] = React.useState(false);
  const placeholderRef = React.useRef<HTMLDivElement>(null);
  const path = usePathname();

  console.log(path);

  useEffect(() => {
    const handleScroll = () => {
      if (placeholderRef.current) {
        const placeholderTop =
          placeholderRef.current!.getBoundingClientRect().top;

        // Toggle sticky class when bar reaches or leaves the top
        if (placeholderTop <= 0) {
          setFixed(true);
        } else {
          setFixed(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="w-full">
      <TopBar className="bg-primary-500 h-12 flex gap-3 items-center px-8 text-foreground shadow-lg w-full md:justify-between justify-center">
        <Box fontWeight="bold" component="div" className="hidden md:block">
          <Button variant="text" color="inherit" href="/">
            About
          </Button>
          <Button variant="text" color="inherit" href="/contact-us">
            Contact US
          </Button>
        </Box>

        <Box component="div">
          <Button variant="text" color="inherit" href="/">
            <FacebookIcon />
          </Button>
          <Button variant="text" color="inherit" href="/">
            <InstagramIcon />
          </Button>
          <Button variant="text" color="inherit" href="/">
            <TwitterIcon />
          </Button>
          <Button variant="text" color="inherit" href="/">
            <WhatsAppIcon />
          </Button>
        </Box>
      </TopBar>

      {path === "/" && (
        <MiddleHero className="bg-primary-500 h-24 flex items-end p-48">
          <Typography className="text-white !text-[100px] font-bold">
            Salah Tours
          </Typography>
        </MiddleHero>
      )}

      <BottomPlaceholder ref={placeholderRef} className="placeholder">
        <BottomBar
          className={clsx("shadow-lg px-8 flex items-center z-50", {
            "fixed top-0 left-0 right-0 z-50 bg-white": fixed,
          })}
        >
          <Stack
            direction="row"
            className="justify-between w-full items-center py-1"
          >
            <Box>
              <Image src={Logo} alt="logo" width={100} height={50} />
            </Box>

            <Box className="text-primary-700 flex gap-4 items-center">
              <Button variant="text" color="inherit" href="/">
                Home
              </Button>
              <Button variant="text" color="inherit" href="/services">
                Services
              </Button>
              <Button variant="text" color="inherit" href="/products">
                Products
              </Button>
              <Button variant="text" color="inherit" href="/blog">
                Blog
              </Button>
            </Box>
          </Stack>
        </BottomBar>
      </BottomPlaceholder>
    </header>
  );
};

export default Header;
