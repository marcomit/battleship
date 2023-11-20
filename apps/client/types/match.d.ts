type MatchType = {
  totalTime: 1 | 2 | 3;
  timePerMove: 5 | 10 | 20;
  incrementOnMove: 0 | 2 | 5;
} & (SizeAndShip5 | SizeAndShip10 | SizeAndShip15);

type SizeAndShip5 = {
  size: 5;
  ship: 7;
};
type SizeAndShip10 = {
  size: 10;
  ship: 16;
};
type SizeAndShip15 = {
  size: 15;
  ship: 30;
};
