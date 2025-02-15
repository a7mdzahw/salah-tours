"use client";
import { TopBar, BottomBar, MiddleHero, BottomPlaceholder } from "./styled";
import Image from "next/image";
import useNavbarPosition from "@salah-tours/hooks/useNavbarPosition";
// Icons
import { Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";

// images
import Logo from "@salah-tours/assets/images/logo.png";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Info } from "@entities/Info";
import { client } from "@salah-tours/helpers/client";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const path = usePathname();
  const { fixed, placeholderRef } = useNavbarPosition();

  const { data: info } = useQuery<Info>({
    queryKey: ["info"],
    queryFn: () => client("/info"),
  });

  return (
    <header className="w-full z-50">
      <TopBar className="bg-primary-700 h-12 flex gap-3 items-center px-8 text-primary-100 shadow-lg w-full md:justify-between justify-center">
        <div className="hidden md:flex gap-4 items-center">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact US</Link>
        </div>

        <div className="flex gap-8 items-center">
          <Link href="/fb/salah-tours">
            <Facebook />
          </Link>
          <Link href="/ig/salah-tours">
            <Instagram />
          </Link>
          <Link href="/twitter/salah-tours">
            <Twitter />
          </Link>
          <Link href="/message/salah-tours">
            <MessageCircle />
          </Link>
        </div>
      </TopBar>

      {path === "/" && (
        <MiddleHero className="bg-primary-500 h-24 flex items-center  relative justify-center">
          <div className="bg-primary-800 absolute inset-0 opacity-30" />
          <img
            src={info?.heroImage?.url}
            alt="hero"
            className="w-full h-full object-cover"
          />
        </MiddleHero>
      )}

      <BottomPlaceholder ref={placeholderRef} className="placeholder">
        <BottomBar
          className={clsx("shadow-lg px-8 flex items-center z-50", {
            "fixed top-0 left-0 right-0 z-50 bg-white": fixed,
          })}
        >
          <div className="flex justify-between w-full items-center py-1">
            <div>
              <Image src={Logo} alt="logo" width={100} height={50} />
            </div>

            <div className="text-primary-700 flex gap-4 items-center">
              <Link href="/">Home</Link>
              <Link href="/services">Services</Link>
              <Link href="/products">Products</Link>
              <Link href="/blog">Blog</Link>
            </div>
          </div>
        </BottomBar>
      </BottomPlaceholder>
    </header>
  );
};

export default Header;
