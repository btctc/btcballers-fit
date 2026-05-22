import Hero from "@/components/Hero";
import BiggerThanBasketball from "@/components/BiggerThanBasketball";
import DatesTicker from "@/components/DatesTicker";
import Soundtrack from "@/components/Soundtrack";
import OpenGymCallout from "@/components/OpenGymCallout";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BiggerThanBasketball />
      <DatesTicker />
      <Soundtrack />
      <OpenGymCallout />
    </>
  );
}
