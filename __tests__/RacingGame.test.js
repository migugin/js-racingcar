import CONSTANTS from '../src/constants/Constants.js';
import ERROR from '../src/constants/Error.js';
import Car from '../src/Domain/Car.js';
import RacingGame from '../src/Domain/RacingGame.js';
import Random from '../src/utils/Random.js';

/* 
경주 컨트롤러
- 자동차 경주는 5회로 고정하여 진행한다.
- 자동차 경주 게임을 완료한 후 우승자를 선별한다. (우승자는 한 명 이상일 수 있다.)
*/

describe('경주 게임 테스트', () => {
  describe('정상 케이스 테스트', () => {
    test(`자동차 경주는 ${CONSTANTS.racingGame.roundConfig}회 진행한다.`, () => {
      // given
      const cars = [new Car('pobi'), new Car('crong'), new Car('honux')];
      const racingGame = new RacingGame(cars);

      // when
      racingGame.startGame();

      // then
      expect(racingGame.round).toBe(CONSTANTS.racingGame.roundConfig);
    });

    test(`자동차는 ${CONSTANTS.car.move.minNumber} ~ ${CONSTANTS.car.move.maxNumber} 사이에서 무작위로 얻은 값이 ${CONSTANTS.car.move.threshold} 이상일 때 전진할 수 있다.`, () => {
      // given
      const car = new Car('pobi');
      const startPosition = car.position;

      // when
      RacingGame.moveCar(car, CONSTANTS.car.move.threshold);

      // then
      expect(car.position).toBe(startPosition + CONSTANTS.car.move.distance);
    });

    test(`자동차는 ${CONSTANTS.car.move.minNumber} ~ ${CONSTANTS.car.move.maxNumber} 사이에서 무작위로 얻은 값이 ${CONSTANTS.car.move.threshold} 미만일 때 전진할 수 없다.`, () => {
      // given
      const car = new Car('pobi');
      const startPosition = car.position;

      // when
      RacingGame.moveCar(car, CONSTANTS.car.move.threshold - 1);

      // then
      expect(car.position).toBe(startPosition);
    });

    test('자동차 경주 게임을 완료한 후 우승자를 선별한다.', () => {
      // given
      const cars = [new Car('pobi'), new Car('crong'), new Car('honux')];
      const racingGame = new RacingGame(cars);

      Random.generateRandomNumber = jest
        .fn()
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(1)
        .mockReturnValue(9);

      // when
      racingGame.startGame();
      const { winners } = racingGame.getGameResult();

      // then
      expect(winners).toEqual(['honux']);
    });
  });

  describe('예외 케이스 테스트', () => {
    test(`자동차 이름이 ${CONSTANTS.car.maxNameLength}자를 초과 할 경우 예외 처리한다.`, () => {
      // given
      const cars = [new Car('migugin')];

      // when + then
      expect(() => new RacingGame(cars)).toThrow(ERROR.invalidNameLength);
    });

    test.each([
      [[new Car('pobi'), new Car('cr ng')]],
      [[new Car(' pobi'), new Car('crong')]],
      [[new Car(' '), new Car('crong')]],
    ])('자동차 이름에 공백이 포함된 경우 예외 처리한다.', input => {
      // given
      const cars = input;

      // when + then
      expect(() => new RacingGame(cars)).toThrow(ERROR.invalidFormat);
    });

    test('빈 자동차 이름이 있는 경우 예외 처리한다.', () => {
      // given
      const cars = [new Car('')];

      // when + then
      expect(() => new RacingGame(cars)).toThrow(ERROR.invalidFormat);
    });

    test('중복된 자동차가 존재하는 경우 예외 처리한다.', () => {
      // given
      const cars = [new Car('pobi'), new Car('pobi')];

      // when + then
      expect(() => new RacingGame(cars)).toThrow(ERROR.duplicateValue);
    });
  });
});
