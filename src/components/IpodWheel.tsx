import React, { useState, useRef } from "react";

type WheelArea = "top" | "right" | "bottom" | "left" | "center";
type RotationDirection = "clockwise" | "counterclockwise";

interface IpodWheelProps {
  onWheelClick: (area: WheelArea) => void;
  onWheelRotation: (direction: RotationDirection) => void;
  onMenuButton: () => void;
  isWheelMode: boolean;
}

// How many degrees of wheel rotation should equal one scroll step
const rotationStepDeg = 15; // increase this value to reduce sensitivity

export function IpodWheel({
  onWheelClick,
  onWheelRotation,
  onMenuButton,
  isWheelMode,
}: IpodWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  // Accumulated mouse wheel delta (for desktop scrolling)
  const [wheelDelta, setWheelDelta] = useState(0);

  // Refs for tracking continuous touch rotation
  const lastAngleRef = useRef<number | null>(null); // Last touch angle in radians
  const rotationAccumulatorRef = useRef(0); // Accumulated rotation in radians

  // Track whether the user is currently dragging (mouse down + move)
  const isDraggingRef = useRef(false);

  // Refs for tracking touch state
  const isTouchDraggingRef = useRef(false); // Whether significant touch rotation occurred
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null); // Starting touch position
  const recentTouchRef = useRef(false); // Track if we just handled a touch event to prevent double firing

  // Track if the current interaction started on the "MENU" label so we can suppress duplicate click handling
  const fromMenuLabelRef = useRef(false);

  // Track if we're currently in a touch drag to prevent button clicks
  const isInTouchDragRef = useRef(false);

  // Calculate angle (in degrees) from the center of the wheel – used for click areas
  const getAngleFromCenterDeg = (x: number, y: number): number => {
    if (!wheelRef.current) return 0;

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    return (Math.atan2(y - centerY, x - centerX) * 180) / Math.PI;
  };

  // Same as above but returns radians – used for rotation calculation
  const getAngleFromCenterRad = (x: number, y: number): number => {
    if (!wheelRef.current) return 0;

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    return Math.atan2(y - centerY, x - centerX);
  };

  // Determine wheel section from angle
  const getWheelSection = (angleDeg: number): WheelArea => {
    const angle = (angleDeg * Math.PI) / 180; // Convert degrees to radians
    if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
      return "right";
    } else if (angle >= Math.PI / 4 && angle < (3 * Math.PI) / 4) {
      return "bottom";
    } else if (angle >= (3 * Math.PI) / 4 || angle < (-3 * Math.PI) / 4) {
      return "left";
    } else {
      return "top";
    }
  };

  // Check if touch point is in center button area
  const isTouchInCenter = (x: number, y: number): boolean => {
    if (!wheelRef.current) return false;

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    return distance <= 32;
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();

    const touch = e.touches[0];

    if (isTouchInCenter(touch.clientX, touch.clientY)) {
      return;
    }

    const angleRad = getAngleFromCenterRad(touch.clientX, touch.clientY);
    lastAngleRef.current = angleRad;
    rotationAccumulatorRef.current = 0;
    isTouchDraggingRef.current = false;
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();

    if (lastAngleRef.current === null) return;

    const touch = e.touches[0];
    const currentAngleRad = getAngleFromCenterRad(touch.clientX, touch.clientY);

    let delta = currentAngleRad - lastAngleRef.current;
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;

    rotationAccumulatorRef.current += delta;
    lastAngleRef.current = currentAngleRad;

    const threshold = (rotationStepDeg * Math.PI) / 180;

    if (
      !isTouchDraggingRef.current &&
      Math.abs(rotationAccumulatorRef.current) > threshold
    ) {
      isTouchDraggingRef.current = true;
      isInTouchDragRef.current = true;
    }

    while (rotationAccumulatorRef.current > threshold) {
      onWheelRotation("clockwise");
      rotationAccumulatorRef.current -= threshold;
    }

    while (rotationAccumulatorRef.current < -threshold) {
      onWheelRotation("counterclockwise");
      rotationAccumulatorRef.current += threshold;
    }
  };

  // Handle touch end
  const handleTouchEnd = (_e: React.TouchEvent) => {
    if (!isTouchDraggingRef.current && touchStartPosRef.current) {
      const angleDeg = getAngleFromCenterDeg(
        touchStartPosRef.current.x,
        touchStartPosRef.current.y
      );
      const section = getWheelSection(angleDeg);
      onWheelClick(section);

      recentTouchRef.current = true;
      setTimeout(() => {
        recentTouchRef.current = false;
      }, 500);
    }

    lastAngleRef.current = null;
    rotationAccumulatorRef.current = 0;
    isTouchDraggingRef.current = false;
    touchStartPosRef.current = null;

    if (isInTouchDragRef.current) {
      setTimeout(() => {
        isInTouchDragRef.current = false;
      }, 100);
    }
  };

  // Handle mouse wheel scroll for rotation
  const handleMouseWheel = (e: React.WheelEvent) => {
    const newDelta = wheelDelta + Math.abs(e.deltaY);
    setWheelDelta(newDelta);

    if (newDelta >= 50) {
      if (e.deltaY < 0) {
        onWheelRotation("counterclockwise");
      } else {
        onWheelRotation("clockwise");
      }
      setWheelDelta(0);
    }
  };

  // Handle mouse interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    if (recentTouchRef.current) {
      return;
    }

    fromMenuLabelRef.current =
      e.target && (e.target as HTMLElement).classList.contains("menu-button");

    e.preventDefault();

    const startAngleRad = getAngleFromCenterRad(e.clientX, e.clientY);
    lastAngleRef.current = startAngleRad;
    rotationAccumulatorRef.current = 0;
    isDraggingRef.current = false;

    const threshold = (rotationStepDeg * Math.PI) / 180;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (lastAngleRef.current === null) return;

      const currentAngleRad = getAngleFromCenterRad(
        moveEvent.clientX,
        moveEvent.clientY
      );

      let delta = currentAngleRad - lastAngleRef.current;
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;

      rotationAccumulatorRef.current += delta;
      lastAngleRef.current = currentAngleRad;

      if (
        !isDraggingRef.current &&
        Math.abs(rotationAccumulatorRef.current) > threshold
      ) {
        isDraggingRef.current = true;
      }

      while (rotationAccumulatorRef.current > threshold) {
        onWheelRotation("clockwise");
        rotationAccumulatorRef.current -= threshold;
      }

      while (rotationAccumulatorRef.current < -threshold) {
        onWheelRotation("counterclockwise");
        rotationAccumulatorRef.current += threshold;
      }
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      if (!isDraggingRef.current) {
        if (!fromMenuLabelRef.current) {
          const angleDeg = getAngleFromCenterDeg(
            upEvent.clientX,
            upEvent.clientY
          );
          const section = getWheelSection(angleDeg);
          onWheelClick(section);
        }
      }

      lastAngleRef.current = null;
      rotationAccumulatorRef.current = 0;
      isDraggingRef.current = false;
      fromMenuLabelRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="w-[200px] h-[200px] rounded-full bg-gray-300 relative pixel-border mt-2">
      {/* Center button */}
      <button
        onClick={() => {
          if (recentTouchRef.current || isInTouchDragRef.current) return;
          onWheelClick("center");
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-inner"
      />
      
      {/* Wheel sections */}
      <div
        ref={wheelRef}
        className="absolute w-full h-full rounded-full touch-none select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleMouseWheel}
      >
        {/* Wheel labels */}
        <div
          className="absolute top-4 left-1/2 transform -translate-x-1/2 text-sm font-bold menu-button cursor-default select-none"
          onClick={(e) => {
            if (recentTouchRef.current || isInTouchDragRef.current) return;
            e.stopPropagation();
            onMenuButton();
          }}
        >
          MENU
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-sm cursor-default select-none">
          ⏭
        </div>
        <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm ${
          !isWheelMode ? 'text-[#0c5a79]' : ''
        } cursor-default select-none`}>
          {isWheelMode ? '⏯' : '⇅'}
        </div>
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-sm cursor-default select-none">
          ⏮
        </div>
      </div>
    </div>
  );
} 