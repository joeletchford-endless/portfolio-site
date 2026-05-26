"use client";

export default function RichmondClock({ formattedTime }: { formattedTime: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center text-base">
        <div>Richmond, Virginia</div>
        <div>{formattedTime}</div>
      </div>
    </div>
  );
}
