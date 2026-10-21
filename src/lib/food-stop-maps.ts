// Street addresses from the curated public/imports/food-drink-google-my-maps.csv.
// Keep each existing Google link so its specific business pin is preserved.
const foodStopAddresses: Record<string, string> = {
  "The Outsider": "522 Dauphin Street, Mobile, AL 36602",
  "Greer's Saint Louis Market": "260 Saint Louis Street, Mobile, AL 36602",
  "ellenJAY Bakery": "2158 Airport Boulevard, Mobile, AL 36606",
  "Bake My Day": "2407 Old Shell Road, Mobile, AL 36607",
  "Guncles Gluten Free": "1252 Government Street, Mobile, AL 36604",
  "Big Bad Breakfast": "1812 Old Shell Road Suite D, Mobile, AL 36607",
  "Serda's Coffee Co.": "3 South Royal Street, Mobile, AL 36602",
  "Knuckle Bones Elixir Co.": "202 Government Street, Mobile, AL 36602",
  "Great Day Latte": "10 South Conception Street, Mobile, AL 36602",
  "Moe's Original BBQ": "701 Spring Hill Avenue, Mobile, AL 36602",
  "Cammie's Old Dutch Ice Cream Shoppe": "2511 Old Shell Road, Mobile, AL 36607",
  "LODA Bier Garten": "251 Dauphin Street, Mobile, AL 36602",
  "POST": "571 Dauphin Street, Mobile, AL 36602",
  "Braided River Brewing Company": "420 Saint Louis Street, Mobile, AL 36602",
  "Joe Cain Cafe": "26 North Royal Street, Mobile, AL 36602",
  "Bob's Downtown Restaurant": "263 Saint Francis Street, Mobile, AL 36602"
};

export function getFoodStopMapLinks({ title, url }: { title: string; url: string }) {
  const address = foodStopAddresses[title];
  if (!address) return null;

  const appleMaps = new URL("https://maps.apple.com/place");
  appleMaps.searchParams.set("address", address);
  appleMaps.searchParams.set("name", title);

  return { appleMapsUrl: appleMaps.toString(), googleMapsUrl: url };
}
