const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatPrice = (n) => money.format(Number(n) || 0);

// Products without an uploaded photo get an emoji tile instead of a broken image.
const EMOJI_RULES = [
  [/banana/i, "🍌"],
  [/tomato/i, "🍅"],
  [/onion/i, "🧅"],
  [/potato/i, "🥔"],
  [/apple/i, "🍎"],
  [/milk/i, "🥛"],
  [/egg/i, "🥚"],
  [/curd|paneer|cheese|butter/i, "🧈"],
  [/rice/i, "🍚"],
  [/atta|flour|wheat/i, "🌾"],
  [/dal|pulse|lentil/i, "🫘"],
  [/tea|coffee/i, "☕"],
  [/juice/i, "🧃"],
  [/biscuit|snack/i, "🍪"],
  [/fruit/i, "🍉"],
  [/vegetable|leafy|greens/i, "🥬"],
  [/dairy/i, "🥛"],
  [/staple/i, "🌾"],
  [/beverage/i, "🥤"],
  [/clean|household/i, "🧴"],
  [/personal/i, "🧼"],
];

export const emojiFor = (text = "") => {
  const hit = EMOJI_RULES.find(([re]) => re.test(text));
  return hit ? hit[1] : "🛒";
};
