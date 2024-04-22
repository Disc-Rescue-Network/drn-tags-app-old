import type { NextPage } from "next";
import Leaderboard from "./components/Leaderboard";
import { Scores } from "./types";
import Chris from "@/public/assets/chris dickerson.jpg";
import Philo from "@/public/assets/philo.jpg";
import Ricky from "@/public/assets/ricky_w.jpg";
import LiveStandings from "./components/LiveStandings";
import { ModeToggle } from "@/components/ui/modeToggle";

const Home: NextPage = () => {
  const scores: Scores = [
    {
      id: 1,
      name: "Trey",
      score: 78,
      roundsPlayed: 2,
      avatarUrl:
        "data:image/jpeg;base64,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",
    },
    {
      id: 2,
      name: "Josh",
      score: 81,
      roundsPlayed: 2,
      avatarUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCqtkTraygs0Fm2n_6TwVA_5vAoMlypSndscwmLtP-IQ&s",
    },
    {
      id: 3,
      name: "Jim",
      score: 99,
      roundsPlayed: 3,
      avatarUrl:
        "https://www.pdga.com/files/styles/large/public/pictures/picture-3488-1645648320.jpg",
    },
    {
      id: 4,
      name: "Dave",
      score: 85,
      roundsPlayed: 3,
      avatarUrl:
        "data:image/jpeg;base64,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",
    },
    {
      id: 5,
      name: "Zach",
      score: 89,
      roundsPlayed: 3,
      avatarUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCqtkTraygs0Fm2n_6TwVA_5vAoMlypSndscwmLtP-IQ&s",
    },
    {
      id: 6,
      name: "Lyle",
      score: 59,
      roundsPlayed: 2,
      avatarUrl:
        "https://www.pdga.com/files/styles/large/public/pictures/picture-3488-1645648320.jpg",
    },
    {
      id: 7,
      name: "Pat",
      score: 19,
      roundsPlayed: 1,
      avatarUrl:
        "data:image/jpeg;base64,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",
    },
    {
      id: 8,
      name: "Luke",
      score: 33,
      roundsPlayed: 1,
      avatarUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCqtkTraygs0Fm2n_6TwVA_5vAoMlypSndscwmLtP-IQ&s",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <ModeToggle />
      <Leaderboard scores={scores} />
      <LiveStandings />
    </div>
  );
};

export default Home;
