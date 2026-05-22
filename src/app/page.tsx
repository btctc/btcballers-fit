import Hero from "@/components/Hero";
import BiggerThanBasketball from "@/components/BiggerThanBasketball";
import TrainingFilm from "@/components/TrainingFilm";
import DatesTicker from "@/components/DatesTicker";
import PlayerDevelopmentStory from "@/components/PlayerDevelopmentStory";
import Soundtrack from "@/components/Soundtrack";
import OpenGymCallout from "@/components/OpenGymCallout";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BiggerThanBasketball />
      <TrainingFilm />
      <PlayerDevelopmentStory />
      <DatesTicker />
      <Soundtrack />
      <OpenGymCallout />
    </>
  );
}
