"use client";

export default function RichmondClock({
  formattedTime,
  onCycle,
}: {
  formattedTime: string;
  onCycle: () => void;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className="text-center text-[16px] cursor-pointer pointer-events-auto"
        onClick={onCycle}
      >
        <div>Richmond, Virginia</div>
        <div>{formattedTime}</div>
      </div>
    </div>
  );
}
