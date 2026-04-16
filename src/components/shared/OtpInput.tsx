// "use client";

// import React, { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";

// interface OtpInputProps {
//   length?: number;
//   value: string;
//   onChange: (value: string) => void;
// }

// export default function OtpInput({ length = 6, value, onChange }: OtpInputProps) {
//   const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const val = e.target.value;
//     if (isNaN(Number(val))) return;

//     const newOtp = [...otp];
//     // Allow only the last character entered
//     newOtp[index] = val.substring(val.length - 1);
//     setOtp(newOtp);
//     onChange(newOtp.join(""));

//     // Move to next input if value exists
//     if (val && index < length - 1 && inputRefs.current[index + 1]) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData("text/plain").slice(0, length);
//     if (!/^\d+$/.test(pastedData)) return;

//     const newOtp = [...otp];
//     pastedData.split("").forEach((char, i) => {
//       if (i < length) newOtp[i] = char;
//     });
//     setOtp(newOtp);
//     onChange(newOtp.join(""));

//     // Focus the last filled input
//     const focusIndex = Math.min(pastedData.length, length - 1);
//     inputRefs.current[focusIndex]?.focus();
//   };

//   return (
//     <div className="flex justify-between gap-2 sm:gap-3">
//       {otp.map((digit, index) => (
//         <input
//           key={index}
//           ref={(el) => { inputRefs.current[index] = el; }}
//           type="text"
//           inputMode="numeric"
//           value={digit}
//           onChange={(e) => handleChange(e, index)}
//           onKeyDown={(e) => handleKeyDown(e, index)}
//           onPaste={handlePaste}
//           className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold text-stone-800 bg-stone-50 border border-stone-200 rounded-xl shadow-sm transition-all duration-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none"
//         />
//       ))}
//     </div>
//   );
// }
// "use client";

// import React, { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";

// interface OtpInputProps {
//   length?: number;
//   value: string;
//   onChange: (value: string) => void;
// }

// export default function OtpInput({ length = 6, value, onChange }: OtpInputProps) {
//   const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const val = e.target.value;
//     if (isNaN(Number(val))) return;

//     const newOtp = [...otp];
//     // Allow only the last character entered
//     newOtp[index] = val.substring(val.length - 1);
//     setOtp(newOtp);
//     onChange(newOtp.join(""));

//     // Move to next input if value exists
//     if (val && index < length - 1 && inputRefs.current[index + 1]) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData("text/plain").slice(0, length);
//     if (!/^\d+$/.test(pastedData)) return;

//     const newOtp = [...otp];
//     pastedData.split("").forEach((char, i) => {
//       if (i < length) newOtp[i] = char;
//     });
//     setOtp(newOtp);
//     onChange(newOtp.join(""));

//     // Focus the last filled input
//     const focusIndex = Math.min(pastedData.length, length - 1);
//     inputRefs.current[focusIndex]?.focus();
//   };

//   return (
//     <div className="flex justify-between gap-2 sm:gap-3">
//       {otp.map((digit, index) => (
//         <input
//           key={index}
//           ref={(el) => { inputRefs.current[index] = el; }}
//           type="text"
//           inputMode="numeric"
//           value={digit}
//           onChange={(e) => handleChange(e, index)}
//           onKeyDown={(e) => handleKeyDown(e, index)}
//           onPaste={handlePaste}
//           className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold text-stone-800 bg-stone-50 border border-stone-200 rounded-xl shadow-sm transition-all duration-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none"
//         />
//       ))}
//     </div>
//   );
// }
'use client';

import { useRef, KeyboardEvent, ClipboardEvent } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export default function OtpInput({
  value,
  onChange,
  length = 6,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpArray = (value || '').split('').slice(0, length);
  while (otpArray.length < length) otpArray.push('');

  function handleChange(index: number, char: string) {
    if (!/^\d*$/.test(char)) return; // digits only
    const nextArray = [...otpArray];
    nextArray[index] = char.slice(-1); // only last digit if somehow multiple
    onChange(nextArray.join(''));
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (otpArray[index]) {
        const nextArray = [...otpArray];
        nextArray[index] = '';
        onChange(nextArray.join(''));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < length - 1)
      inputRefs.current[index + 1]?.focus();
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length);
    if (!pasted) return;
    const nextArray = [...otpArray];
    pasted.split('').forEach((char, i) => {
      nextArray[i] = char;
    });
    onChange(nextArray.join(''));
    const focusIdx = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIdx]?.focus();
  }

  return (
    <div className="flex justify-center gap-2.5">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otpArray[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`h-14 w-12 rounded-xl border-2 text-center text-xl font-semibold caret-transparent transition-all duration-150 outline-none ${
            otpArray[i]
              ? 'border-orange-400 bg-orange-50 text-orange-700'
              : 'border-stone-200 bg-stone-50 text-stone-800 focus:border-orange-400 focus:bg-orange-50/50'
          } `}
        />
      ))}
    </div>
  );
}
