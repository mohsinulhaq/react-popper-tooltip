import { noop } from '../../src/utils';

// https://github.com/FezVrasta/popper.js/issues/478#issuecomment-341506071
export default class Popper {
  constructor() {
    return {
      destroy: noop,
      scheduleUpdate: noop,
    };
  }
}
