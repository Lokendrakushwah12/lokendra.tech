import { Work, type WorkItem } from "@/components/sections/work";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Human Behavior",
  description: "Design engineering work revamping the Human Behavior dashboard.",
};

const images = [
  "https://utfs.io/f/d6hbOsQeI0BH9x9YJt7Nf6GBmIrYqKWXyVCHewvxFMtQJiZk",
  "https://utfs.io/f/d6hbOsQeI0BHxnn3KC2vR1XpWsV4ehqOwfuF5I0PzoGKE9LU",
  "https://utfs.io/f/d6hbOsQeI0BHQlbVLDFxYeqwhEJgoHLskzf5j1AavdtP9GbD",
  "https://utfs.io/f/d6hbOsQeI0BHEgAzPGxfOpVWmAals04LzBYREJPGitNjxSkF",
  "https://utfs.io/f/d6hbOsQeI0BH7RgpofhiDFe01CwNpLvXt3HTj2EVrBJxYRa4",
  "https://utfs.io/f/d6hbOsQeI0BHHkAkDolRyc1ql7wTuQmbPe3Sf0NBrFnK2U9W",
  "https://utfs.io/f/d6hbOsQeI0BHSyNfEvob58u7CBmOenMgQG6yDko3pNYsfRti",
  "https://utfs.io/f/d6hbOsQeI0BHqQPt4cD4jlbQDAWMP1dpTC6tcSi3gLyfHX8Y",
  "https://utfs.io/f/d6hbOsQeI0BHNFBMGZv5JmkHOG98YMCdKuLRrcAqaXB0l4FQ",
  "https://utfs.io/f/d6hbOsQeI0BHGsY2cLwutldOqgcI7KST3RaUjx0NbXvwVkWh",
  "https://utfs.io/f/d6hbOsQeI0BHnjRgH2sNwGP6u2V7yMxZOFcneY4CdT3A8zva",
  "https://utfs.io/f/d6hbOsQeI0BHwdTkIO8FWtzV7ysTK5dC8iM4hrSUlnDELYJp",
  "https://utfs.io/f/d6hbOsQeI0BHFsccHr6k6s5nh2JmNZLVYyag01IeqAdp4zUc",
  "https://utfs.io/f/d6hbOsQeI0BHok5Trs1Bcg5lhfGPsJdKZarTeAkQz4Y19IvH",
  "https://utfs.io/f/d6hbOsQeI0BHPXB3iDHijwU0kEvXDo4azbTh37O6spN1IKn2",
  "https://utfs.io/f/d6hbOsQeI0BHkJQOan5QZS7Mrjequt53cbDAKgvNaniTpwH1",
  "https://utfs.io/f/d6hbOsQeI0BHhbSv9LO9xF3LcTkvDSoQnzUBEXWmr2Nas01w",
  "https://utfs.io/f/d6hbOsQeI0BH7aR5UShiDFe01CwNpLvXt3HTj2EVrBJxYRa4",
  "https://utfs.io/f/d6hbOsQeI0BHJGu2xAKBhVqWEBiPUyYl51A3fDjTHsgN4IRw",
  "https://utfs.io/f/d6hbOsQeI0BHTz78LxGGSNWC8p7PYsDow39F5OQqHJgzMUXy",
  "https://utfs.io/f/d6hbOsQeI0BH9obSUA7Nf6GBmIrYqKWXyVCHewvxFMtQJiZk",
  "https://utfs.io/f/d6hbOsQeI0BH5ZwmoLYeuAJIFOXMYR4hsxvS7DzPqWrC2yVL",
  "https://utfs.io/f/d6hbOsQeI0BHTyR0FHGGSNWC8p7PYsDow39F5OQqHJgzMUXy",
  "https://utfs.io/f/d6hbOsQeI0BHWaOlAdZ8Ea1GA2YQPlJm9CjozLBcqxXDpS4f",
  "https://utfs.io/f/d6hbOsQeI0BHhPp62KO9xF3LcTkvDSoQnzUBEXWmr2Nas01w",
];

const data: WorkItem[] = images.map((src, index) => ({
  src,
  alt: `Human Behavior dashboard design ${index + 1}`,
}));

export default function HumanBehaviorWorkPage() {
  return <Work title="Human Behavior Design Engineering Work" data={data} />;
}
