import { isMouseOutside } from '../src/utils';

describe('isMouseOutside', () => {
  const mouseEvent = (x: number, y: number) =>
    (({ clientX: x, clientY: y, pageX: x, pageY: y } as unknown) as MouseEvent);
  const element = (x: number, y: number, width: number, height: number) =>
    (({
      getBoundingClientRect: () => ({
        bottom: y + height,
        height,
        left: x,
        right: x + width,
        top: y,
        width,
        x,
        y,
      }),
    } as unknown) as HTMLElement);
  it('should detect mouse inside Trigger', () => {
    const event = mouseEvent(20, 20);
    const trigger = element(0, 0, 40, 40);
    expect(isMouseOutside(event, trigger)).toBe(false);
  });
  it('should detect mouse outside Trigger', () => {
    const trigger = element(0, 0, 40, 40);
    expect(isMouseOutside(mouseEvent(60, 20), trigger)).toBe(true);
    expect(isMouseOutside(mouseEvent(20, 60), trigger)).toBe(true);
  });
  it('should detect mouse at the edge as _inside_ the Trigger', () => {
    const trigger = element(0, 0, 40, 40);
    expect(isMouseOutside(mouseEvent(40, 20), trigger)).toBe(false);
    expect(isMouseOutside(mouseEvent(20, 40), trigger)).toBe(false);
    expect(isMouseOutside(mouseEvent(40, 40), trigger)).toBe(false);
    expect(isMouseOutside(mouseEvent(0, 0), trigger)).toBe(false);
  });
  it('should round the size of the Trigger up (expand) for mouse event does not support fractional pixels', () => {
    const trigger = element(0.1, 0.1, 39.1, 39.1);
    expect(isMouseOutside(mouseEvent(40, 20), trigger)).toBe(false);
    expect(isMouseOutside(mouseEvent(0, 20), trigger)).toBe(false);
    expect(isMouseOutside(mouseEvent(20, 40), trigger)).toBe(false);
    expect(isMouseOutside(mouseEvent(20, 0), trigger)).toBe(false);
    expect(isMouseOutside(mouseEvent(0, 0), trigger)).toBe(false);
  });
  it('should detect mouse inside the tooltip, when provided', () => {
    const trigger = element(100, 100, 40, 40);
    const tooltipAbove = element(100, 50, 40, 40);
    // inside the Tooltip
    expect(isMouseOutside(mouseEvent(120, 80), trigger, tooltipAbove)).toBe(
      false
    );
    // insite the Trigger
    expect(isMouseOutside(mouseEvent(120, 120), trigger, tooltipAbove)).toBe(
      false
    );
    // at the edge of the Tooltip
    expect(isMouseOutside(mouseEvent(100, 50), trigger, tooltipAbove)).toBe(
      false
    );
    // at the edge of the Trigger
    expect(isMouseOutside(mouseEvent(100, 100), trigger, tooltipAbove)).toBe(
      false
    );
  });
  it('should detect mouse outside the tooltip, when provided', () => {
    const trigger = element(100, 100, 40, 40);
    const tooltipAbove = element(100, 50, 40, 40);
    expect(isMouseOutside(mouseEvent(0, 0), trigger, tooltipAbove)).toBe(true);
    expect(isMouseOutside(mouseEvent(98, 70), trigger, tooltipAbove)).toBe(
      true
    );
    expect(isMouseOutside(mouseEvent(120, 48), trigger, tooltipAbove)).toBe(
      true
    );
  });
  it('should detect mouse in the gap between Tooltip and the Trigger', () => {
    const trigger = element(100, 100, 40, 40);
    const tooltipAbove = element(100, 50, 40, 40);
    expect(isMouseOutside(mouseEvent(120, 95), trigger, tooltipAbove)).toBe(
      false
    );
    const tooltipRight = element(150, 110, 40, 20);
    expect(isMouseOutside(mouseEvent(145, 120), trigger, tooltipRight)).toBe(
      false
    );
    const tooltipBottom = element(100, 150, 40, 20);
    expect(isMouseOutside(mouseEvent(120, 145), trigger, tooltipBottom)).toBe(
      false
    );
    const tooltipLeft = element(50, 110, 40, 20);
    expect(isMouseOutside(mouseEvent(95, 120), trigger, tooltipLeft)).toBe(
      false
    );
  });
});
