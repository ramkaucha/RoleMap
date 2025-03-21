import React from "react";
import { useRouter } from "next/navigation";

const Logo: React.FC = () => {
  const router = useRouter();

  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 512 512"
      className="fill-black dark:fill-white hover:cursor-pointer"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => router.push("/")}
    >
      <g
        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
        // fill="#000000"
        stroke="none"
      >
        <path
          d="M2269 4035 c-48 -8 -129 -24 -180 -36 -84 -20 -91 -23 -62 -29 20 -5
72 1 135 13 149 30 522 30 651 0 95 -22 107 -15 17 10 -195 55 -385 69 -561
42z"
        />
        <path
          d="M2915 3960 c3 -5 8 -10 11 -10 2 0 4 5 4 10 0 6 -5 10 -11 10 -5 0
-7 -4 -4 -10z"
        />
        <path
          d="M2300 3706 c-7 -9 -10 -23 -6 -31 5 -13 43 -15 270 -15 248 0 265 -1
287 -20 24 -19 24 -19 -226 -20 -278 0 -300 -4 -300 -55 l0 -30 345 -5 346 -5
39 -32 c22 -17 72 -64 112 -105 l71 -73 4 -69 c4 -59 8 -72 30 -91 14 -12 44
-25 67 -29 79 -12 76 14 76 -616 l0 -556 -27 -41 c-16 -24 -44 -49 -70 -62
-43 -20 -57 -21 -472 -21 -287 0 -434 4 -449 11 -12 6 -37 27 -54 47 -42 47
-44 21 -4 -35 54 -74 46 -73 525 -73 463 0 455 -1 539 57 21 15 50 47 65 72
l27 46 0 500 c0 275 -3 516 -7 535 -5 21 -4 29 1 22 16 -25 46 -10 46 23 0 39
-36 48 -52 13 -21 -46 -35 45 -31 205 2 102 0 147 -8 147 -21 0 -48 -41 -54
-83 -6 -40 -7 -39 -13 28 -13 120 -33 172 -91 230 -61 61 -104 75 -230 75 -80
0 -88 2 -132 33 l-46 32 -282 3 c-244 2 -285 1 -296 -12z m883 -130 c45 -19
83 -60 103 -113 17 -44 17 -46 -1 -59 -10 -8 -21 -14 -24 -14 -3 1 -53 45
-111 100 l-105 99 53 1 c29 0 67 -6 85 -14z m141 -242 c8 -21 8 -139 -1 -147
-3 -4 -12 -2 -20 4 -19 16 -18 159 1 159 8 0 17 -7 20 -16z"
        />
        <path
          d="M1672 3636 c-41 -22 -118 -104 -148 -158 -29 -53 -29 -54 -32 -249
-3 -174 -2 -198 13 -213 10 -9 25 -16 34 -14 14 3 17 29 21 203 6 237 13 260
109 353 58 55 60 60 44 75 -15 13 -22 13 -41 3z"
        />
        <path
          d="M1800 3621 c-50 -27 -73 -56 -74 -94 -1 -22 -11 -44 -33 -67 -59 -63
-63 -92 -63 -411 l0 -288 -37 -6 c-75 -13 -103 -27 -146 -75 -24 -26 -49 -66
-55 -88 -15 -50 -15 -163 0 -214 13 -46 77 -122 120 -144 71 -37 111 24 43 66
-68 42 -75 59 -75 189 0 138 14 173 77 190 57 16 60 15 67 -30 9 -57 33 -100
269 -494 116 -192 217 -362 225 -377 7 -16 18 -28 24 -28 6 0 9 -3 5 -6 -6 -6
72 -124 100 -153 8 -7 25 -35 38 -62 71 -139 213 -196 333 -135 27 13 78 56
114 95 l67 70 283 3 c282 3 283 3 338 29 119 57 180 134 299 378 75 155 76
157 76 236 0 71 -4 89 -33 147 -30 60 -127 168 -152 168 -5 0 -10 -136 -12
-302 -5 -332 -7 -344 -68 -434 -18 -25 -50 -58 -73 -75 -80 -58 -100 -60 -588
-57 -429 3 -446 4 -490 24 -72 33 -124 88 -185 193 -31 53 -127 211 -214 351
-219 355 -245 400 -258 439 l-12 34 85 -5 c97 -7 127 -21 197 -96 98 -104 118
-172 118 -393 0 -131 10 -189 32 -189 6 0 8 93 6 223 -3 219 -3 223 -30 278
-41 82 -127 172 -200 208 -53 27 -72 31 -140 31 l-78 0 0 304 0 304 28 53 c19
37 43 64 76 87 l48 32 143 0 c79 0 151 3 160 6 27 11 38 53 20 80 -15 24 -18
24 -178 24 -138 -1 -167 -4 -197 -19z m1900 -1414 c0 -24 -6 -52 -14 -62 -13
-18 -14 -13 -17 43 -4 54 -2 62 14 62 13 0 17 -9 17 -43z m-1177 -644 c-13 -2
-33 -2 -45 0 -13 2 -3 4 22 4 25 0 35 -2 23 -4z m148 -41 c-39 -72 -165 -105
-230 -60 -19 12 -41 33 -49 46 -16 25 -22 26 63 -12 50 -23 115 -15 165 19 44
30 65 33 51 7z"
        />
        <path
          d="M2300 3200 c0 -199 4 -320 10 -320 22 0 30 46 30 174 0 74 3 137 8
140 4 2 180 6 392 7 l385 3 3 -162 c2 -154 4 -162 22 -162 19 0 20 7 20 179 0
154 -2 180 -16 185 -9 3 -198 6 -420 6 l-404 0 0 135 c0 113 -2 135 -15 135
-13 0 -15 -42 -15 -320z"
        />
        <path
          d="M1896 3124 c-9 -23 2 -34 34 -34 l28 0 4 -104 c3 -100 4 -106 32
-135 29 -30 32 -31 124 -31 107 0 128 8 148 55 16 38 20 220 5 229 -21 13 -36
-30 -40 -113 -1 -47 -8 -92 -13 -98 -12 -15 -184 -18 -192 -4 -12 19 -14 159
-2 182 10 21 20 25 86 29 61 4 75 8 78 23 3 16 -9 17 -141 17 -123 0 -146 -2
-151 -16z"
        />
        <path
          d="M2604 3071 c-55 -25 -121 -85 -145 -134 -31 -60 -23 -67 81 -67 l90
0 0 -101 c0 -127 14 -159 72 -159 46 0 58 30 58 153 l0 109 108 -4 c119 -4
162 -20 186 -66 50 -96 14 -275 -75 -377 -53 -60 -117 -85 -219 -85 -106 0
-242 17 -286 35 -51 21 -64 57 -64 184 0 60 -4 112 -9 115 -17 11 -41 -6 -48
-33 -4 -14 -7 -65 -7 -112 2 -186 64 -228 364 -245 145 -8 205 6 274 67 89 79
139 178 152 304 12 116 -33 218 -110 246 -21 7 -40 25 -52 46 -26 49 -97 109
-151 127 -64 22 -168 20 -219 -3z m211 -60 c36 -17 95 -64 95 -76 0 -3 -87 -5
-192 -5 l-193 1 42 38 c23 21 57 43 75 48 53 17 129 14 173 -6z m-97 -238 c-3
-84 -6 -98 -20 -101 -16 -3 -18 7 -18 97 0 95 1 101 20 101 20 0 21 -5 18 -97z"
        />
        <path
          d="M3320 3047 c8 -7 27 -18 42 -25 22 -9 26 -9 22 2 -5 14 -46 36 -67
36 -7 0 -6 -5 3 -13z"
        />
        <path
          d="M3327 2789 c-45 -26 -47 -45 -47 -458 0 -214 3 -396 6 -405 8 -21 40
-21 48 0 3 9 6 192 6 408 l0 393 25 11 c26 12 29 20 19 46 -7 18 -31 20 -57 5z"
        />
        <path
          d="M2197 2703 c-9 -15 -9 -207 0 -508 7 -224 12 -296 23 -315 14 -23 15
-1 17 220 4 313 -8 602 -24 607 -6 2 -13 0 -16 -4z"
        />
        <path d="M1091 2184 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z" />
        <path
          d="M1105 2125 c16 -103 137 -346 246 -491 77 -103 245 -281 282 -300 18
-9 40 -23 50 -32 16 -14 57 -27 57 -18 0 1 -28 25 -61 51 -128 101 -289 286
-373 430 -17 28 -36 56 -43 64 -8 7 -30 45 -49 84 -19 39 -40 77 -46 85 -6 7
-24 48 -40 90 -21 58 -27 67 -23 37z"
        />
        <path
          d="M2460 1865 c0 -16 6 -25 15 -25 9 0 15 9 15 25 0 16 -6 25 -15 25 -9
0 -15 -9 -15 -25z"
        />
        <path
          d="M3719 1583 c-245 -263 -551 -440 -881 -512 -127 -27 -300 -43 -412
-36 l-91 5 65 -16 c144 -34 422 -3 650 72 177 59 402 203 560 356 92 90 179
188 167 188 -2 0 -28 -26 -58 -57z"
        />
        <path d="M2258 1053 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z" />
        <path d="M2308 1043 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z" />
        <path
          d="M3140 980 c-8 -5 -10 -10 -5 -10 6 0 17 5 25 10 8 5 11 10 5 10 -5 0
-17 -5 -25 -10z"
        />
        <path
          d="M3068 955 c-92 -34 -237 -57 -398 -64 l-165 -7 106 -8 c81 -6 130 -4
205 7 97 16 262 59 293 77 23 13 2 11 -41 -5z"
        />
        <path d="M2398 903 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z" />
        <path d="M2463 893 c9 -2 23 -2 30 0 6 3 -1 5 -18 5 -16 0 -22 -2 -12 -5z" />
      </g>
    </svg>
  );
};

export default Logo;
