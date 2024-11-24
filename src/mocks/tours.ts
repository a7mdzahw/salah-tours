// images
import Tour1 from "@salah-tours/assets/images/destination/d1.jpg";
import Tour2 from "@salah-tours/assets/images/destination/d2.jpg";
import Tour3 from "@salah-tours/assets/images/destination/d3.jpg";
import Tour4 from "@salah-tours/assets/images/destination/d4.jpg";

// some tours data with real name as pyrmaids and real image and real price
export const tours = [
  {
    id: "1",
    name: "pyramids",
    image: Tour1.src,
    price: 100,
    description: "this is a description",
    days: [
      {
        day: 1,
        title: "Paraohs",
        description:
          "Arrive in Cairo, where you are met Ramasside's Tour manager visa is included and transferred to your hotel. After settling in, depart with your Egyptologist for an afternoon visit to the Giza Plateau, site of the ancient pyramids of Mycerinus, Chefren and the Great Pyramid of Cheops. Explore the interior of one of these legendary pyramids. Ride Like a Local on camel back, continuing on to explore the funerary boat exhibit of the Solar Boat Museum. Then, view the Great Sphinx, the ancient world’s largest monumental sculpture, carved from a single ridge of limestone.",
      },
      {
        day: 2,
        title: "Old Cairo",
        description:
          "Arrive in Cairo, where you are met Ramasside's Tour manager visa is included and transferred to your hotel. After settling in, depart with your Egyptologist for an afternoon visit to the Giza Plateau, site of the ancient pyramids of Mycerinus, Chefren and the Great Pyramid of Cheops. Explore the interior of one of these legendary pyramids. Ride Like a Local on camel back, continuing on to explore the funerary boat exhibit of the Solar Boat Museum. Then, view the Great Sphinx, the ancient world’s largest monumental sculpture, carved from a single ridge of limestone.",
      },
    ],
  },
  {
    id: "2",
    name: "sphinx",
    image: Tour2.src,
    price: 200,
    description: "this is a description",
    days: [
      {
        day: 1,
        title: "Paraohs",
        description:
          "Arrive in Cairo, where you are met Ramasside's Tour manager visa is included and transferred to your hotel. After settling in, depart with your Egyptologist for an afternoon visit to the Giza Plateau, site of the ancient pyramids of Mycerinus, Chefren and the Great Pyramid of Cheops.",
      },
    ],
  },
  {
    id: "3",
    name: "nile",
    image: Tour3.src,
    price: 300,
    description: "this is a description",
    days: [
      {
        day: 1,
        title: "Paraohs",
        description:
          "Arrive in Cairo, where you are met Ramasside's Tour manager visa is included and transferred to your hotel. After settling in, depart, site of the ancient pyramids of Mycerinus, Chefren and the Great Pyramid of Cheops.",
      },
    ],
  },
  {
    id: "4",
    name: "luxor",
    image: Tour4.src,
    price: 400,
    description: "this is a description",
  },
];
