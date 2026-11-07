export const ARCADE_GAMES = [
  {
    slug: "moonpie-run",
    title: "MoonPie Run",
    marquee: ["MOONPIE", "RUN"],
    genre: "MAZE CHASE",
    number: "01",
    tagline: "Catch the throws. Outrun the trouble.",
    description: "Scoop up doubloons, grab a MoonPie, and give the carnival rascals a run for their money through downtown Mobile.",
    image: "/images/arcade/moonpie-run.webp",
    imageAlt: "MoonPie Run development preview with the masked gold player, a downtown Mobile maze, and purple and gold balconies",
    features: ["Three parade routes", "Username leaderboard", "12 Mardi Gras badges"],
    controls: "Arrow keys or WASD on a keyboard; directional controls on a phone.",
    theme: "maze"
  },
  {
    slug: "moonpie-motorway",
    title: "MoonPie Motorway",
    marquee: ["MOONPIE", "MOTORWAY"],
    genre: "ARCADE RACING",
    number: "02",
    tagline: "Chase the throws. Cruise the Port City.",
    description: "Take a purple and gold racer for a spin, collect throws, and discover Mobile’s parade lineup one roadside billboard at a time.",
    image: "/images/arcade/moonpie-motorway.webp",
    imageAlt: "MoonPie Motorway development preview with a purple race car, the Mobile skyline, and a Conde Cavaliers parade billboard",
    features: ["Carnival Cup", "Scenic Cruise", "MG251 parade billboards"],
    controls: "Arrow keys to steer, down arrow to brake, and Space to boost; touch controls on a phone.",
    theme: "racer"
  }
] as const;

export type ArcadeGame = (typeof ARCADE_GAMES)[number];
