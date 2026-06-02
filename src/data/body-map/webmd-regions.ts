export type BodyMapView = 'front' | 'back'

export type BodyMapRegionId =
  | 'head'
  | 'face'
  | 'neck'
  | 'chest'
  | 'upper-abdomen'
  | 'lower-abdomen'
  | 'pelvis'
  | 'left-shoulder'
  | 'right-shoulder'
  | 'left-upper-arm'
  | 'right-upper-arm'
  | 'left-forearm'
  | 'right-forearm'
  | 'left-hand'
  | 'right-hand'
  | 'left-thigh'
  | 'right-thigh'
  | 'left-knee'
  | 'right-knee'
  | 'left-calf'
  | 'right-calf'
  | 'left-foot'
  | 'right-foot'
  | 'head-back'
  | 'neck-back'
  | 'upper-back'
  | 'mid-back'
  | 'low-back'
  | 'left-scapula'
  | 'right-scapula'
  | 'left-shoulder-back'
  | 'right-shoulder-back'
  | 'left-arm-back'
  | 'right-arm-back'
  | 'left-glute'
  | 'right-glute'
  | 'left-hamstring'
  | 'right-hamstring'
  | 'left-calf-back'
  | 'right-calf-back'
  | 'left-foot-back'
  | 'right-foot-back'

export interface BodyMapSymptom {
  th: string
  en: string
  emergency?: boolean
}

export interface BodyMapZoom {
  cx: number
  cy: number
  scale: number
}

export interface BodyMapRegion {
  id: BodyMapRegionId
  thaiName: string
  englishName: string
  view: BodyMapView
  path: string
  zoom: BodyMapZoom
  commonSymptoms: BodyMapSymptom[]
  emergencyNote?: string
}

export const BODY_MAP_VIEWBOX = {
  width: 1024,
  height: 1536,
  value: '0 0 1024 1536',
}

export const BODY_MAP_ASSETS: Record<BodyMapView, string> = {
  front: '/body-map/human-front.png',
  back: '/body-map/human-back.png',
}

export const BODY_MAP_REGIONS: BodyMapRegion[] = [
  {
    id: 'head',
    thaiName: 'ศีรษะ',
    englishName: 'Head',
    view: 'front',
    path: 'M427 61 C455 29 504 19 550 32 C610 48 638 93 631 157 C624 221 591 266 541 285 C493 305 441 294 408 255 C376 217 374 122 427 61 Z',
    zoom: { cx: 512, cy: 162, scale: 2.55 },
    commonSymptoms: [
      { th: 'ปวดศีรษะ', en: 'Headache' },
      { th: 'เวียนศีรษะ', en: 'Dizziness' },
      { th: 'ปวดศีรษะรุนแรงเฉียบพลัน', en: 'Sudden severe headache', emergency: true },
    ],
  },
  {
    id: 'face',
    thaiName: 'ใบหน้า',
    englishName: 'Face',
    view: 'front',
    path: 'M431 143 C452 102 496 86 545 93 C590 103 611 135 607 185 C603 241 568 290 517 303 C468 313 424 288 406 241 C391 200 400 164 431 143 Z',
    zoom: { cx: 512, cy: 200, scale: 2.8 },
    emergencyNote: 'ใบหน้าตก ชาครึ่งหน้า หรือพูดไม่ชัด อาจเป็นสัญญาณ Stroke ควรโทร 1669',
    commonSymptoms: [
      { th: 'ปวดใบหน้า', en: 'Facial pain' },
      { th: 'ชาใบหน้า', en: 'Facial numbness', emergency: true },
      { th: 'ใบหน้าเบี้ยว', en: 'Facial droop', emergency: true },
    ],
  },
  {
    id: 'neck',
    thaiName: 'คอ',
    englishName: 'Neck',
    view: 'front',
    path: 'M453 297 C472 318 551 318 570 297 C567 354 585 389 621 417 C561 438 464 438 403 417 C439 389 457 354 453 297 Z',
    zoom: { cx: 512, cy: 365, scale: 2.45 },
    commonSymptoms: [
      { th: 'ปวดคอ', en: 'Neck pain' },
      { th: 'คอแข็ง', en: 'Neck stiffness' },
      { th: 'คอแข็งร่วมกับไข้', en: 'Stiff neck with fever', emergency: true },
    ],
  },
  {
    id: 'chest',
    thaiName: 'หน้าอก',
    englishName: 'Chest',
    view: 'front',
    path: 'M312 466 C359 405 420 396 512 424 C604 396 665 405 713 466 C739 514 730 604 688 670 C641 703 562 693 512 660 C462 693 383 703 336 670 C294 604 286 514 312 466 Z',
    zoom: { cx: 512, cy: 550, scale: 1.85 },
    emergencyNote: 'เจ็บแน่นหน้าอก หายใจลำบาก เหงื่อแตก หรือปวดร้าวแขน อาจเป็นภาวะฉุกเฉิน ควรโทร 1669',
    commonSymptoms: [
      { th: 'เจ็บหน้าอก', en: 'Chest pain', emergency: true },
      { th: 'แน่นหน้าอก', en: 'Chest tightness', emergency: true },
      { th: 'ใจสั่น', en: 'Palpitations' },
      { th: 'หายใจลำบาก', en: 'Shortness of breath', emergency: true },
    ],
  },
  {
    id: 'upper-abdomen',
    thaiName: 'ท้องส่วนบน',
    englishName: 'Upper Abdomen',
    view: 'front',
    path: 'M350 674 C401 705 463 711 512 686 C561 711 623 705 674 674 C687 732 678 808 640 858 C594 891 430 891 384 858 C346 808 337 732 350 674 Z',
    zoom: { cx: 512, cy: 770, scale: 1.9 },
    commonSymptoms: [
      { th: 'ปวดลิ้นปี่', en: 'Epigastric pain' },
      { th: 'คลื่นไส้', en: 'Nausea' },
      { th: 'แสบร้อนกลางอก', en: 'Heartburn' },
      { th: 'ท้องอืด', en: 'Bloating' },
    ],
  },
  {
    id: 'lower-abdomen',
    thaiName: 'ท้องส่วนล่าง',
    englishName: 'Lower Abdomen',
    view: 'front',
    path: 'M384 858 C430 891 594 891 640 858 C652 908 644 958 612 999 C566 1024 458 1024 412 999 C380 958 372 908 384 858 Z',
    zoom: { cx: 512, cy: 934, scale: 2.0 },
    commonSymptoms: [
      { th: 'ปวดท้องน้อย', en: 'Lower abdominal pain' },
      { th: 'ปวดเกร็ง', en: 'Cramping' },
      { th: 'ท้องเสีย', en: 'Diarrhea' },
      { th: 'ถ่ายเป็นเลือด', en: 'Blood in stool', emergency: true },
    ],
  },
  {
    id: 'pelvis',
    thaiName: 'เชิงกราน',
    englishName: 'Pelvis',
    view: 'front',
    path: 'M363 1001 C424 1025 600 1025 661 1001 C681 1044 682 1101 656 1143 C596 1165 428 1165 368 1143 C342 1101 343 1044 363 1001 Z',
    zoom: { cx: 512, cy: 1080, scale: 2.0 },
    commonSymptoms: [
      { th: 'ปวดเชิงกราน', en: 'Pelvic pain' },
      { th: 'ปวดขาหนีบ', en: 'Groin pain' },
      { th: 'ปัสสาวะแสบขัด', en: 'Painful urination' },
    ],
  },
  {
    id: 'left-shoulder',
    thaiName: 'ไหล่ซ้าย',
    englishName: 'Left Shoulder',
    view: 'front',
    path: 'M283 420 C321 389 383 385 430 417 C391 453 365 506 353 576 C299 568 264 535 255 491 C252 461 262 438 283 420 Z',
    zoom: { cx: 340, cy: 480, scale: 2.25 },
    commonSymptoms: [
      { th: 'ปวดไหล่', en: 'Shoulder pain' },
      { th: 'ยกแขนแล้วเจ็บ', en: 'Pain with lifting' },
      { th: 'ไหล่ติด', en: 'Shoulder stiffness' },
    ],
  },
  {
    id: 'right-shoulder',
    thaiName: 'ไหล่ขวา',
    englishName: 'Right Shoulder',
    view: 'front',
    path: 'M741 420 C703 389 641 385 594 417 C633 453 659 506 671 576 C725 568 760 535 769 491 C772 461 762 438 741 420 Z',
    zoom: { cx: 684, cy: 480, scale: 2.25 },
    commonSymptoms: [
      { th: 'ปวดไหล่', en: 'Shoulder pain' },
      { th: 'ยกแขนแล้วเจ็บ', en: 'Pain with lifting' },
      { th: 'ไหล่ติด', en: 'Shoulder stiffness' },
    ],
  },
  {
    id: 'left-upper-arm',
    thaiName: 'ต้นแขนซ้าย',
    englishName: 'Left Upper Arm',
    view: 'front',
    path: 'M255 499 C306 537 323 625 287 726 C255 816 217 882 174 889 C153 813 181 671 210 566 C219 534 234 511 255 499 Z',
    zoom: { cx: 236, cy: 682, scale: 2.05 },
    emergencyNote: 'แขนอ่อนแรงหรือชาครึ่งซีกเฉียบพลันอาจเป็นภาวะฉุกเฉิน ควรโทร 1669',
    commonSymptoms: [
      { th: 'ปวดต้นแขน', en: 'Upper arm pain' },
      { th: 'ชาแขน', en: 'Arm numbness', emergency: true },
      { th: 'อ่อนแรง', en: 'Weakness', emergency: true },
    ],
  },
  {
    id: 'right-upper-arm',
    thaiName: 'ต้นแขนขวา',
    englishName: 'Right Upper Arm',
    view: 'front',
    path: 'M769 499 C718 537 701 625 737 726 C769 816 807 882 850 889 C871 813 843 671 814 566 C805 534 790 511 769 499 Z',
    zoom: { cx: 788, cy: 682, scale: 2.05 },
    commonSymptoms: [
      { th: 'ปวดต้นแขน', en: 'Upper arm pain' },
      { th: 'ชาแขน', en: 'Arm numbness' },
      { th: 'อ่อนแรง', en: 'Weakness' },
    ],
  },
  {
    id: 'left-forearm',
    thaiName: 'แขนท่อนล่างซ้าย',
    englishName: 'Left Forearm',
    view: 'front',
    path: 'M174 889 C216 881 252 819 286 731 C300 791 257 987 209 1153 C173 1156 134 1129 115 1083 C131 1004 148 940 174 889 Z',
    zoom: { cx: 196, cy: 1000, scale: 2.05 },
    commonSymptoms: [
      { th: 'ปวดแขนท่อนล่าง', en: 'Forearm pain' },
      { th: 'ปวดข้อมือ', en: 'Wrist pain' },
      { th: 'ชาปลายนิ้ว', en: 'Finger numbness' },
    ],
  },
  {
    id: 'right-forearm',
    thaiName: 'แขนท่อนล่างขวา',
    englishName: 'Right Forearm',
    view: 'front',
    path: 'M850 889 C808 881 772 819 738 731 C724 791 767 987 815 1153 C851 1156 890 1129 909 1083 C893 1004 876 940 850 889 Z',
    zoom: { cx: 828, cy: 1000, scale: 2.05 },
    commonSymptoms: [
      { th: 'ปวดแขนท่อนล่าง', en: 'Forearm pain' },
      { th: 'ปวดข้อมือ', en: 'Wrist pain' },
      { th: 'ชาปลายนิ้ว', en: 'Finger numbness' },
    ],
  },
  {
    id: 'left-hand',
    thaiName: 'มือซ้าย',
    englishName: 'Left Hand',
    view: 'front',
    path: 'M111 1085 C143 1126 177 1154 213 1154 C238 1189 207 1297 156 1321 C94 1306 91 1222 76 1190 C50 1180 59 1149 85 1152 C66 1123 77 1088 111 1085 Z',
    zoom: { cx: 150, cy: 1205, scale: 2.7 },
    commonSymptoms: [
      { th: 'ปวดมือ', en: 'Hand pain' },
      { th: 'ชามือ', en: 'Hand numbness' },
      { th: 'นิ้วบวม/ปวด', en: 'Finger swelling or pain' },
    ],
  },
  {
    id: 'right-hand',
    thaiName: 'มือขวา',
    englishName: 'Right Hand',
    view: 'front',
    path: 'M913 1085 C881 1126 847 1154 811 1154 C786 1189 817 1297 868 1321 C930 1306 933 1222 948 1190 C974 1180 965 1149 939 1152 C958 1123 947 1088 913 1085 Z',
    zoom: { cx: 874, cy: 1205, scale: 2.7 },
    commonSymptoms: [
      { th: 'ปวดมือ', en: 'Hand pain' },
      { th: 'ชามือ', en: 'Hand numbness' },
      { th: 'นิ้วบวม/ปวด', en: 'Finger swelling or pain' },
    ],
  },
  {
    id: 'left-thigh',
    thaiName: 'ต้นขาซ้าย',
    englishName: 'Left Thigh',
    view: 'front',
    path: 'M339 960 C379 984 453 992 505 972 C488 1038 459 1128 423 1200 C363 1208 322 1136 315 1050 C311 1010 320 978 339 960 Z',
    zoom: { cx: 404, cy: 1078, scale: 1.85 },
    commonSymptoms: [
      { th: 'ปวดต้นขา', en: 'Thigh pain' },
      { th: 'ตึงกล้ามเนื้อ', en: 'Muscle tightness' },
      { th: 'ชาต้นขา', en: 'Thigh numbness' },
    ],
  },
  {
    id: 'right-thigh',
    thaiName: 'ต้นขาขวา',
    englishName: 'Right Thigh',
    view: 'front',
    path: 'M685 960 C645 984 571 992 519 972 C536 1038 565 1128 601 1200 C661 1208 702 1136 709 1050 C713 1010 704 978 685 960 Z',
    zoom: { cx: 620, cy: 1078, scale: 1.85 },
    commonSymptoms: [
      { th: 'ปวดต้นขา', en: 'Thigh pain' },
      { th: 'ตึงกล้ามเนื้อ', en: 'Muscle tightness' },
      { th: 'ชาต้นขา', en: 'Thigh numbness' },
    ],
  },
  {
    id: 'left-knee',
    thaiName: 'เข่าซ้าย',
    englishName: 'Left Knee',
    view: 'front',
    path: 'M346 1190 C370 1168 428 1168 452 1192 C472 1222 458 1268 416 1288 C374 1283 335 1238 346 1190 Z',
    zoom: { cx: 405, cy: 1224, scale: 2.4 },
    commonSymptoms: [
      { th: 'ปวดเข่า', en: 'Knee pain' },
      { th: 'เข่าบวม', en: 'Knee swelling' },
      { th: 'ข้อเข่าล็อค', en: 'Knee locking' },
    ],
  },
  {
    id: 'right-knee',
    thaiName: 'เข่าขวา',
    englishName: 'Right Knee',
    view: 'front',
    path: 'M678 1190 C654 1168 596 1168 572 1192 C552 1222 566 1268 608 1288 C650 1283 689 1238 678 1190 Z',
    zoom: { cx: 619, cy: 1224, scale: 2.4 },
    commonSymptoms: [
      { th: 'ปวดเข่า', en: 'Knee pain' },
      { th: 'เข่าบวม', en: 'Knee swelling' },
      { th: 'ข้อเข่าล็อค', en: 'Knee locking' },
    ],
  },
  {
    id: 'left-calf',
    thaiName: 'น่องซ้าย',
    englishName: 'Left Calf',
    view: 'front',
    path: 'M348 1284 C386 1304 430 1304 462 1278 C474 1360 462 1458 434 1516 C391 1531 354 1504 346 1450 C329 1380 324 1338 348 1284 Z',
    zoom: { cx: 402, cy: 1406, scale: 1.85 },
    emergencyNote: 'น่องบวมแดงร้อนข้างเดียวร่วมกับเจ็บมาก ควรพบแพทย์โดยเร็ว',
    commonSymptoms: [
      { th: 'ปวดน่อง', en: 'Calf pain' },
      { th: 'ตะคริว', en: 'Cramps' },
      { th: 'น่องบวมแดง', en: 'Calf swelling and redness', emergency: true },
    ],
  },
  {
    id: 'right-calf',
    thaiName: 'น่องขวา',
    englishName: 'Right Calf',
    view: 'front',
    path: 'M676 1284 C638 1304 594 1304 562 1278 C550 1360 562 1458 590 1516 C633 1531 670 1504 678 1450 C695 1380 700 1338 676 1284 Z',
    zoom: { cx: 622, cy: 1406, scale: 1.85 },
    commonSymptoms: [
      { th: 'ปวดน่อง', en: 'Calf pain' },
      { th: 'ตะคริว', en: 'Cramps' },
      { th: 'น่องบวมแดง', en: 'Calf swelling and redness', emergency: true },
    ],
  },
  {
    id: 'left-foot',
    thaiName: 'เท้าซ้าย',
    englishName: 'Left Foot',
    view: 'front',
    path: 'M338 1486 C378 1510 425 1505 454 1484 C470 1510 446 1530 378 1534 C318 1530 298 1510 338 1486 Z',
    zoom: { cx: 386, cy: 1512, scale: 2.35 },
    commonSymptoms: [
      { th: 'ปวดเท้า', en: 'Foot pain' },
      { th: 'ปวดส้นเท้า', en: 'Heel pain' },
      { th: 'ชาปลายเท้า', en: 'Toe numbness' },
    ],
  },
  {
    id: 'right-foot',
    thaiName: 'เท้าขวา',
    englishName: 'Right Foot',
    view: 'front',
    path: 'M686 1486 C646 1510 599 1505 570 1484 C554 1510 578 1530 646 1534 C706 1530 726 1510 686 1486 Z',
    zoom: { cx: 638, cy: 1512, scale: 2.35 },
    commonSymptoms: [
      { th: 'ปวดเท้า', en: 'Foot pain' },
      { th: 'ปวดส้นเท้า', en: 'Heel pain' },
      { th: 'ชาปลายเท้า', en: 'Toe numbness' },
    ],
  },

  {
    id: 'head-back',
    thaiName: 'ศีรษะด้านหลัง',
    englishName: 'Back of Head',
    view: 'back',
    path: 'M421 57 C464 12 546 9 600 54 C646 92 653 196 603 266 C559 316 467 318 421 270 C370 210 374 103 421 57 Z',
    zoom: { cx: 512, cy: 160, scale: 2.5 },
    commonSymptoms: [
      { th: 'ปวดท้ายทอย', en: 'Occipital headache' },
      { th: 'เวียนศีรษะ', en: 'Dizziness' },
      { th: 'บาดเจ็บศีรษะ', en: 'Head injury', emergency: true },
    ],
  },
  {
    id: 'neck-back',
    thaiName: 'คอด้านหลัง',
    englishName: 'Back of Neck',
    view: 'back',
    path: 'M438 282 C477 319 547 319 586 282 C571 355 596 402 649 438 C575 464 449 464 375 438 C428 402 453 355 438 282 Z',
    zoom: { cx: 512, cy: 365, scale: 2.4 },
    commonSymptoms: [
      { th: 'ปวดคอด้านหลัง', en: 'Posterior neck pain' },
      { th: 'คอตึง', en: 'Neck tightness' },
      { th: 'คอแข็งร่วมกับไข้', en: 'Stiff neck with fever', emergency: true },
    ],
  },
  {
    id: 'upper-back',
    thaiName: 'หลังส่วนบน',
    englishName: 'Upper Back',
    view: 'back',
    path: 'M292 456 C358 386 455 400 512 438 C569 400 666 386 732 456 C760 535 735 662 684 746 C604 776 420 776 340 746 C289 662 264 535 292 456 Z',
    zoom: { cx: 512, cy: 580, scale: 1.75 },
    commonSymptoms: [
      { th: 'ปวดหลังส่วนบน', en: 'Upper back pain' },
      { th: 'ตึงหลัง', en: 'Back tightness' },
      { th: 'ปวดรอบซี่โครง', en: 'Rib-area pain' },
    ],
  },
  {
    id: 'left-scapula',
    thaiName: 'สะบักซ้าย',
    englishName: 'Left Scapula',
    view: 'back',
    path: 'M304 468 C364 424 444 432 491 482 C476 567 440 645 374 693 C323 660 286 557 304 468 Z',
    zoom: { cx: 390, cy: 550, scale: 2.1 },
    commonSymptoms: [
      { th: 'ปวดสะบัก', en: 'Scapular pain' },
      { th: 'สะบักตึง', en: 'Scapular tightness' },
      { th: 'ปวดร้าวไปไหล่', en: 'Pain radiating to shoulder' },
    ],
  },
  {
    id: 'right-scapula',
    thaiName: 'สะบักขวา',
    englishName: 'Right Scapula',
    view: 'back',
    path: 'M720 468 C660 424 580 432 533 482 C548 567 584 645 650 693 C701 660 738 557 720 468 Z',
    zoom: { cx: 634, cy: 550, scale: 2.1 },
    commonSymptoms: [
      { th: 'ปวดสะบัก', en: 'Scapular pain' },
      { th: 'สะบักตึง', en: 'Scapular tightness' },
      { th: 'ปวดร้าวไปไหล่', en: 'Pain radiating to shoulder' },
    ],
  },
  {
    id: 'mid-back',
    thaiName: 'หลังส่วนกลาง',
    englishName: 'Mid Back',
    view: 'back',
    path: 'M340 746 C420 776 604 776 684 746 C692 832 674 925 636 1002 C580 1030 444 1030 388 1002 C350 925 332 832 340 746 Z',
    zoom: { cx: 512, cy: 875, scale: 1.85 },
    commonSymptoms: [
      { th: 'ปวดหลังส่วนกลาง', en: 'Mid-back pain' },
      { th: 'หลังแข็งตึง', en: 'Back stiffness' },
      { th: 'ปวดแสบ', en: 'Burning pain' },
    ],
  },
  {
    id: 'low-back',
    thaiName: 'หลังส่วนล่าง',
    englishName: 'Low Back',
    view: 'back',
    path: 'M388 1002 C444 1030 580 1030 636 1002 C649 1060 640 1113 605 1156 C554 1180 470 1180 419 1156 C384 1113 375 1060 388 1002 Z',
    zoom: { cx: 512, cy: 1080, scale: 2.0 },
    emergencyNote: 'ปวดหลังร่วมกับอ่อนแรงขา ชาบริเวณก้น หรือกลั้นปัสสาวะไม่ได้ ควรพบแพทย์ทันที',
    commonSymptoms: [
      { th: 'ปวดหลังส่วนล่าง', en: 'Low back pain' },
      { th: 'ปวดร้าวลงขา', en: 'Pain radiating to leg', emergency: true },
      { th: 'ชาขา', en: 'Leg numbness' },
    ],
  },
  {
    id: 'left-shoulder-back',
    thaiName: 'ไหล่ซ้ายด้านหลัง',
    englishName: 'Left Back Shoulder',
    view: 'back',
    path: 'M280 420 C323 386 392 393 434 430 C386 470 363 526 352 593 C300 579 263 540 254 491 C252 461 262 438 280 420 Z',
    zoom: { cx: 340, cy: 500, scale: 2.1 },
    commonSymptoms: [
      { th: 'ปวดไหล่ด้านหลัง', en: 'Posterior shoulder pain' },
      { th: 'ไหล่ตึง', en: 'Shoulder tightness' },
      { th: 'ขยับไหล่ลำบาก', en: 'Limited shoulder movement' },
    ],
  },
  {
    id: 'right-shoulder-back',
    thaiName: 'ไหล่ขวาด้านหลัง',
    englishName: 'Right Back Shoulder',
    view: 'back',
    path: 'M744 420 C701 386 632 393 590 430 C638 470 661 526 672 593 C724 579 761 540 770 491 C772 461 762 438 744 420 Z',
    zoom: { cx: 684, cy: 500, scale: 2.1 },
    commonSymptoms: [
      { th: 'ปวดไหล่ด้านหลัง', en: 'Posterior shoulder pain' },
      { th: 'ไหล่ตึง', en: 'Shoulder tightness' },
      { th: 'ขยับไหล่ลำบาก', en: 'Limited shoulder movement' },
    ],
  },
  {
    id: 'left-arm-back',
    thaiName: 'แขนซ้ายด้านหลัง',
    englishName: 'Left Back Arm',
    view: 'back',
    path: 'M254 504 C307 548 323 648 286 761 C253 862 217 1013 205 1191 C166 1197 127 1167 113 1110 C132 921 164 681 209 566 C219 536 234 513 254 504 Z',
    zoom: { cx: 212, cy: 820, scale: 1.8 },
    commonSymptoms: [
      { th: 'ปวดแขนด้านหลัง', en: 'Posterior arm pain' },
      { th: 'ชาแขน', en: 'Arm numbness' },
      { th: 'อ่อนแรง', en: 'Weakness', emergency: true },
    ],
  },
  {
    id: 'right-arm-back',
    thaiName: 'แขนขวาด้านหลัง',
    englishName: 'Right Back Arm',
    view: 'back',
    path: 'M770 504 C717 548 701 648 738 761 C771 862 807 1013 819 1191 C858 1197 897 1167 911 1110 C892 921 860 681 815 566 C805 536 790 513 770 504 Z',
    zoom: { cx: 812, cy: 820, scale: 1.8 },
    commonSymptoms: [
      { th: 'ปวดแขนด้านหลัง', en: 'Posterior arm pain' },
      { th: 'ชาแขน', en: 'Arm numbness' },
      { th: 'อ่อนแรง', en: 'Weakness' },
    ],
  },
  {
    id: 'left-glute',
    thaiName: 'ก้นซ้าย',
    englishName: 'Left Glute',
    view: 'back',
    path: 'M348 960 C412 986 471 994 512 970 C508 1030 482 1088 426 1120 C366 1108 328 1034 348 960 Z',
    zoom: { cx: 430, cy: 1042, scale: 2.0 },
    commonSymptoms: [
      { th: 'ปวดก้น', en: 'Gluteal pain' },
      { th: 'ปวดร้าวลงขา', en: 'Sciatica-like pain' },
      { th: 'ปวดขณะนั่ง', en: 'Pain while sitting' },
    ],
  },
  {
    id: 'right-glute',
    thaiName: 'ก้นขวา',
    englishName: 'Right Glute',
    view: 'back',
    path: 'M676 960 C612 986 553 994 512 970 C516 1030 542 1088 598 1120 C658 1108 696 1034 676 960 Z',
    zoom: { cx: 594, cy: 1042, scale: 2.0 },
    commonSymptoms: [
      { th: 'ปวดก้น', en: 'Gluteal pain' },
      { th: 'ปวดร้าวลงขา', en: 'Sciatica-like pain' },
      { th: 'ปวดขณะนั่ง', en: 'Pain while sitting' },
    ],
  },
  {
    id: 'left-hamstring',
    thaiName: 'ต้นขาหลังซ้าย',
    englishName: 'Left Hamstring',
    view: 'back',
    path: 'M339 1108 C383 1130 459 1133 512 1104 C499 1210 468 1304 420 1374 C360 1363 323 1260 318 1190 C316 1158 324 1124 339 1108 Z',
    zoom: { cx: 416, cy: 1240, scale: 1.85 },
    commonSymptoms: [
      { th: 'ปวดต้นขาหลัง', en: 'Hamstring pain' },
      { th: 'กล้ามเนื้อตึง', en: 'Muscle tightness' },
      { th: 'เจ็บขณะวิ่ง', en: 'Pain while running' },
    ],
  },
  {
    id: 'right-hamstring',
    thaiName: 'ต้นขาหลังขวา',
    englishName: 'Right Hamstring',
    view: 'back',
    path: 'M685 1108 C641 1130 565 1133 512 1104 C525 1210 556 1304 604 1374 C664 1363 701 1260 706 1190 C708 1158 700 1124 685 1108 Z',
    zoom: { cx: 608, cy: 1240, scale: 1.85 },
    commonSymptoms: [
      { th: 'ปวดต้นขาหลัง', en: 'Hamstring pain' },
      { th: 'กล้ามเนื้อตึง', en: 'Muscle tightness' },
      { th: 'เจ็บขณะวิ่ง', en: 'Pain while running' },
    ],
  },
  {
    id: 'left-calf-back',
    thaiName: 'น่องซ้ายด้านหลัง',
    englishName: 'Left Back Calf',
    view: 'back',
    path: 'M350 1368 C389 1392 437 1388 468 1360 C480 1438 456 1498 430 1518 C384 1534 350 1516 340 1484 C323 1430 324 1398 350 1368 Z',
    zoom: { cx: 402, cy: 1468, scale: 1.85 },
    commonSymptoms: [
      { th: 'ปวดน่อง', en: 'Calf pain' },
      { th: 'ตะคริว', en: 'Cramps' },
      { th: 'บวมแดงร้อน', en: 'Swelling, redness, warmth', emergency: true },
    ],
  },
  {
    id: 'right-calf-back',
    thaiName: 'น่องขวาด้านหลัง',
    englishName: 'Right Back Calf',
    view: 'back',
    path: 'M674 1368 C635 1392 587 1388 556 1360 C544 1438 568 1498 594 1518 C640 1534 674 1516 684 1484 C701 1430 700 1398 674 1368 Z',
    zoom: { cx: 622, cy: 1468, scale: 1.85 },
    commonSymptoms: [
      { th: 'ปวดน่อง', en: 'Calf pain' },
      { th: 'ตะคริว', en: 'Cramps' },
      { th: 'บวมแดงร้อน', en: 'Swelling, redness, warmth', emergency: true },
    ],
  },
  {
    id: 'left-foot-back',
    thaiName: 'เท้าซ้ายด้านหลัง',
    englishName: 'Left Back Foot',
    view: 'back',
    path: 'M342 1498 C380 1520 424 1518 452 1496 C472 1518 438 1534 374 1535 C316 1532 298 1518 342 1498 Z',
    zoom: { cx: 386, cy: 1518, scale: 2.4 },
    commonSymptoms: [
      { th: 'ปวดส้นเท้า', en: 'Heel pain' },
      { th: 'ปวดฝ่าเท้า', en: 'Sole pain' },
      { th: 'ชาปลายเท้า', en: 'Toe numbness' },
    ],
  },
  {
    id: 'right-foot-back',
    thaiName: 'เท้าขวาด้านหลัง',
    englishName: 'Right Back Foot',
    view: 'back',
    path: 'M682 1498 C644 1520 600 1518 572 1496 C552 1518 586 1534 650 1535 C708 1532 726 1518 682 1498 Z',
    zoom: { cx: 638, cy: 1518, scale: 2.4 },
    commonSymptoms: [
      { th: 'ปวดส้นเท้า', en: 'Heel pain' },
      { th: 'ปวดฝ่าเท้า', en: 'Sole pain' },
      { th: 'ชาปลายเท้า', en: 'Toe numbness' },
    ],
  },
]

export function getBodyMapRegions(view: BodyMapView) {
  return BODY_MAP_REGIONS.filter(region => region.view === view)
}

export function getBodyMapRegion(id: BodyMapRegionId) {
  return BODY_MAP_REGIONS.find(region => region.id === id)
}

export function searchBodyMapRegions(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return BODY_MAP_REGIONS.filter(region =>
    region.thaiName.includes(q) ||
    region.englishName.toLowerCase().includes(q) ||
    region.id.includes(q) ||
    region.commonSymptoms.some(symptom =>
      symptom.th.includes(q) || symptom.en.toLowerCase().includes(q)
    )
  )
}

export const BODY_MAP_SEARCH_SUGGESTIONS: Array<{ query: string; regionId: BodyMapRegionId }> = [
  { query: 'เจ็บหน้าอก', regionId: 'chest' },
  { query: 'ปวดท้อง', regionId: 'upper-abdomen' },
  { query: 'ปวดหลัง', regionId: 'low-back' },
  { query: 'ปวดสะบัก', regionId: 'left-scapula' },
  { query: 'ปวดเข่า', regionId: 'left-knee' },
  { query: 'ปวดน่อง', regionId: 'left-calf' },
  { query: 'ชาแขน', regionId: 'left-upper-arm' },
  { query: 'ปวดเท้า', regionId: 'left-foot' },
]
