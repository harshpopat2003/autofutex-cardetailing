import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Protection from "@/components/Protection";
import Stack from "@/components/Stack";
import Compare from "@/components/Compare";
import Results from "@/components/Results";
import Branches from "@/components/Branches";
import Faq from "@/components/Faq";
import Book from "@/components/Book";
import Footer from "@/components/Footer";

/**
 * One page, ordered the way the decision actually gets made: what it
 * looks like, what the work is, what is physically on the paint, why
 * authorised costs more, who says so, where to go, what people ask,
 * and then — only then — how to book.
 */
export default function Page() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Protection />
        <Stack />
        <Compare />
        <Results />
        <Branches />
        <Faq />
        <Book />
      </main>
      <Footer />
    </>
  );
}
