-- ============================================================
-- Health Compass — Clinical Seed Data
-- All content PENDING medical review before production use
-- Sources: ICD-11, Harrison's IM, Thai MoPH CPGs, WHO Guidelines
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- SYMPTOMS (50 อาการหลัก — ICD-11 coded)
-- ─────────────────────────────────────────────────────────────
insert into public.symptoms
  (code, name_th, name_en, body_region, system, severity_weight, is_emergency, follow_up_questions)
values

-- ── HEAD / NEUROLOGICAL ──────────────────────────────────────
('MG30.0','ปวดหัว','Headache','head','neurological',2,false,
'[{"key":"headache_type","q_th":"ลักษณะการปวดหัวเป็นแบบไหน?","type":"radio","options":["ตุบๆ ข้างเดียว","กดรัดรอบศีรษะ","ปวดท้ายทอย","ปวดทั้งหัว"]},{"key":"headache_worst","q_th":"นี่เป็นอาการปวดหัวที่รุนแรงที่สุดในชีวิตของคุณหรือไม่?","type":"boolean"},{"key":"fever_with_headache","q_th":"มีไข้ร่วมด้วยไหม?","type":"boolean"},{"key":"vision_change","q_th":"มีตามัวหรือเห็นแสงแฟลชร่วมด้วยไหม?","type":"boolean"},{"key":"aura","q_th":"ก่อนปวดหัวมีอาการแสงพริ้ว หรือชาตามร่างกายไหม? (Aura)","type":"boolean"}]'),

('MG30.1','ปวดหัวรุนแรงที่สุดในชีวิต (Thunderclap)','Thunderclap headache','head','neurological',4,true,
'[{"key":"onset_seconds","q_th":"อาการปวดหัวรุนแรงสูงสุดภายในกี่วินาที?","type":"radio","options":["ทันทีภายใน 1 นาที","ค่อยๆ รุนแรงขึ้นใน 1 ชั่วโมง"]},{"key":"neck_stiff","q_th":"มีคอแข็งหรือก้มคอไม่ได้ไหม?","type":"boolean"},{"key":"vomiting","q_th":"มีอาเจียนร่วมด้วยไหม?","type":"boolean"}]'),

('MB40.1','วิงเวียน บ้านหมุน','Vertigo / Dizziness','head','neurological',2,false,
'[{"key":"vertigo_type","q_th":"รู้สึกแบบไหน?","type":"radio","options":["โลกหมุนรอบตัว (True vertigo)","เซทรงตัวไม่ได้","เหมือนจะเป็นลม (Presyncope)","มึนงง"]},{"key":"nausea_vomit","q_th":"มีคลื่นไส้หรืออาเจียนร่วมด้วยไหม?","type":"boolean"},{"key":"position_change","q_th":"อาการแย่ลงเมื่อเปลี่ยนท่าทางไหม?","type":"boolean"},{"key":"hearing_loss","q_th":"มีการได้ยินลดลงหรือเสียงในหูร่วมด้วยไหม?","type":"boolean"}]'),

('9D90.0','ตามัว มองไม่ชัด','Blurred vision','head','neurological',3,false,
'[{"key":"vision_onset","q_th":"อาการตามัวเกิดขึ้นอย่างไร?","type":"radio","options":["ทันทีเฉียบพลัน","ค่อยๆ แย่ลงหลายสัปดาห์/เดือน","เป็นๆ หายๆ"]},{"key":"eye_pain","q_th":"มีอาการปวดตาร่วมด้วยไหม?","type":"boolean"},{"key":"double_vision","q_th":"เห็นภาพซ้อนไหม?","type":"boolean"},{"key":"one_or_both","q_th":"เกิดกับตาข้างเดียวหรือสองข้าง?","type":"radio","options":["ข้างเดียว","ทั้งสองข้าง"]}]'),

('MB48','ชาหรืออ่อนแรงครึ่งซีก','Unilateral weakness / Numbness','head','neurological',4,true,
'[{"key":"side_affected","q_th":"อาการเป็นข้างไหน?","type":"radio","options":["ข้างซ้าย","ข้างขวา","ทั้งสองข้าง"]},{"key":"face_droop","q_th":"มีปากเบี้ยวหรือใบหน้าตกด้านใดด้านหนึ่งไหม?","type":"boolean"},{"key":"sudden_onset_neuro","q_th":"อาการเกิดขึ้นทันทีหรือค่อยๆ เป็น?","type":"radio","options":["ทันทีภายในนาที","ค่อยๆ เป็นใน 1-24 ชั่วโมง","เป็นมาหลายวัน"]},{"key":"speech_affected","q_th":"มีปัญหาการพูดร่วมด้วยไหม?","type":"boolean"}]'),

('MC80','พูดไม่ชัด พูดไม่ออก','Speech difficulty / Aphasia','head','neurological',4,true,
'[{"key":"speech_type","q_th":"ปัญหาการพูดเป็นแบบไหน?","type":"radio","options":["พูดไม่ออกเลย","พูดได้แต่คนอื่นเข้าใจยาก","เข้าใจคนอื่นแต่พูดออกมาไม่ได้","พูดได้แต่สลับคำ"]},{"key":"onset_sudden_speech","q_th":"เกิดขึ้นทันทีไหม?","type":"boolean"}]'),

('MG44','คอแข็ง ก้มคอไม่ได้','Neck stiffness','head','neurological',4,true,
'[{"key":"fever_neck","q_th":"มีไข้ร่วมด้วยไหม?","type":"boolean"},{"key":"light_sensitivity","q_th":"แพ้แสงสว่าง (Photophobia) ไหม?","type":"boolean"},{"key":"rash_neck","q_th":"มีผื่นหรือจุดแดงตามร่างกายไหม?","type":"boolean"},{"key":"headache_neck","q_th":"มีอาการปวดหัวรุนแรงร่วมด้วยไหม?","type":"boolean"}]'),

('8B20.0','ปวดหัวข้างเดียวร่วมกับคลื่นไส้','Migraine headache','head','neurological',2,false,
'[{"key":"migraine_aura","q_th":"มีอาการนำ (Aura) เช่น เห็นแสง ตาพร่า ชาหน้า ก่อนปวดหัวไหม?","type":"boolean"},{"key":"migraine_duration","q_th":"ปวดหัวนานแค่ไหน?","type":"radio","options":["น้อยกว่า 4 ชั่วโมง","4-72 ชั่วโมง","มากกว่า 72 ชั่วโมง"]},{"key":"migraine_trigger","q_th":"มีอะไรกระตุ้นให้ปวดหัวไหม?","type":"radio","options":["แสงสว่าง/เสียง","ความเครียด","ประจำเดือน","อาหารบางชนิด","ไม่แน่ใจ"]}]'),

-- ── CHEST / CARDIOVASCULAR / RESPIRATORY ─────────────────────
('MA80','เจ็บหรือแน่นหน้าอก','Chest pain / Tightness','chest','cardiovascular',4,true,
'[{"key":"chest_character","q_th":"ลักษณะความเจ็บ?","type":"radio","options":["แน่น กดทับ เหมือนมีอะไรทับหน้าอก","แสบร้อนกลางอก","แทงจี๊ด คมเหมือนมีดแทง","เจ็บเมื่อหายใจหรือไอ","กดเจ็บที่ผนังหน้าอก"]},{"key":"radiation","q_th":"ปวดร้าวไปที่ไหนบ้าง?","type":"radio","options":["แขนซ้าย","คอหรือกราม","ไหล่","หลัง","ไม่ร้าว"]},{"key":"cold_sweat","q_th":"มีเหงื่อออกเย็นๆ ร่วมด้วยไหม?","type":"boolean"},{"key":"nausea_chest","q_th":"คลื่นไส้หรืออาเจียนร่วมด้วยไหม?","type":"boolean"},{"key":"exertion_related","q_th":"เจ็บมากขึ้นเมื่อออกแรง และดีขึ้นเมื่อพักไหม?","type":"boolean"},{"key":"eating_related","q_th":"อาการเกี่ยวข้องกับการกินอาหารไหม? (เช่น หลังกินอาหาร)","type":"boolean"}]'),

('MA81','ใจสั่น หัวใจเต้นเร็วผิดปกติ','Palpitation','chest','cardiovascular',3,false,
'[{"key":"palp_rate","q_th":"หัวใจเต้นเร็วหรือผิดจังหวะ?","type":"radio","options":["เต้นเร็วแต่สม่ำเสมอ","เต้นไม่สม่ำเสมอ กระโดด","รู้สึกเต้นแรง"]},{"key":"palp_onset","q_th":"เกิดขึ้นเฉียบพลัน หยุดเฉียบพลัน หรือค่อยๆ?","type":"radio","options":["เฉียบพลันทั้งเริ่มและหยุด","ค่อยๆ เริ่มและค่อยๆ หาย"]},{"key":"syncope_palp","q_th":"มีวิงเวียนหรือเป็นลมร่วมด้วยไหม?","type":"boolean"},{"key":"thyroid_symptoms","q_th":"น้ำหนักลด มือสั่น หรือร้อนง่ายผิดปกติร่วมด้วยไหม?","type":"boolean"}]'),

('MB23.4','หายใจลำบาก หอบเหนื่อย','Dyspnea / Shortness of breath','chest','respiratory',4,true,
'[{"key":"dyspnea_onset","q_th":"หายใจลำบากเกิดขึ้นอย่างไร?","type":"radio","options":["ทันทีเฉียบพลัน","ค่อยๆ แย่ลงหลายชั่วโมง/วัน","เป็นมาหลายสัปดาห์/เดือน"]},{"key":"exertional_dyspnea","q_th":"หายใจลำบากเมื่อออกแรงหรือขณะพักด้วย?","type":"radio","options":["เฉพาะตอนออกแรงมาก","ออกแรงเพียงเล็กน้อยก็หอบ","หอบแม้แต่ขณะพัก"]},{"key":"orthopnea","q_th":"นอนราบแล้วหายใจลำบากกว่าตอนนั่งหรือยืนไหม?","type":"boolean"},{"key":"wheeze","q_th":"มีเสียงหวีดหรือแน่นหน้าอกร่วมด้วยไหม?","type":"boolean"},{"key":"leg_swelling","q_th":"มีขาบวมร่วมด้วยไหม?","type":"boolean"}]'),

('CA22','ไอ','Cough','chest','respiratory',1,false,
'[{"key":"cough_type","q_th":"ลักษณะการไอ?","type":"radio","options":["ไอแห้งๆ ไม่มีเสมหะ","ไอมีเสมหะขาวหรือใส","ไอมีเสมหะเหลือง/เขียว","ไอเป็นเลือด"]},{"key":"cough_duration","q_th":"ไอมานานแค่ไหน?","type":"radio","options":["น้อยกว่า 2 สัปดาห์","2-8 สัปดาห์","มากกว่า 8 สัปดาห์ (ไอเรื้อรัง)"]},{"key":"night_cough","q_th":"ไอมากตอนกลางคืนหรือตอนเช้าไหม?","type":"boolean"},{"key":"smoker_cough","q_th":"คุณสูบบุหรี่อยู่หรือเคยสูบบุหรี่ไหม?","type":"boolean"},{"key":"weight_loss_cough","q_th":"น้ำหนักลดร่วมกับการไอไหม?","type":"boolean"}]'),

('CA23','ไอเป็นเลือด','Hemoptysis','chest','respiratory',4,true,
'[{"key":"blood_amount","q_th":"ปริมาณเลือดที่ไอออกมา?","type":"radio","options":["มีเลือดปนในเสมหะเล็กน้อย","ไอออกมาเป็นเลือดสดหลายช้อนโต๊ะ","ไอออกมาเป็นเลือดสดจำนวนมาก"]},{"key":"smoking_hemoptysis","q_th":"สูบบุหรี่อยู่หรือเคยสูบ?","type":"boolean"},{"key":"weight_loss_hemoptysis","q_th":"น้ำหนักลด เหงื่อออกกลางคืน ร่วมด้วยไหม?","type":"boolean"}]'),

-- ── ABDOMEN / GI ──────────────────────────────────────────────
('MD81','ปวดท้อง','Abdominal pain','abdomen','GI',2,false,
'[{"key":"pain_location","q_th":"ปวดบริเวณไหน?","type":"radio","options":["ลิ้นปี่ (ท้องส่วนบนกลาง)","ชายโครงขวาบน","ชายโครงซ้ายบน","ท้องน้อยขวา","ท้องน้อยซ้าย","รอบสะดือ","ทั่วท้อง"]},{"key":"pain_character","q_th":"ลักษณะการปวด?","type":"radio","options":["ปวดบีบเป็นพักๆ (Colicky)","ปวดตลอดเวลา ตื้อๆ","ปวดแสบร้อน","ปวดแบบเกร็ง"]},{"key":"food_relation","q_th":"อาการเกี่ยวข้องกับอาหารไหม?","type":"radio","options":["แย่ลงหลังกินข้าว","ดีขึ้นหลังกินข้าว","ปวดก่อนกินข้าว","ไม่เกี่ยว"]},{"key":"rebound_tender","q_th":"เมื่อกดแล้วปล่อยมือ เจ็บมากขึ้นไหม? (Rebound tenderness)","type":"boolean"},{"key":"fever_abdominal","q_th":"มีไข้ร่วมด้วยไหม?","type":"boolean"}]'),

('MD84','ถ่ายเป็นเลือด','Rectal bleeding / Hematochezia','abdomen','GI',4,true,
'[{"key":"blood_color","q_th":"สีของเลือดที่ถ่ายออกมา?","type":"radio","options":["เลือดสดแดงสด","เลือดปนอุจจาระ สีคล้ำกว่าปกติ","อุจจาระดำเหมือนน้ำมันดิน (Melena)"]},{"key":"blood_amount_stool","q_th":"ปริมาณเลือดมากน้อยแค่ไหน?","type":"radio","options":["เล็กน้อย เห็นบนกระดาษชำระ","ปานกลาง ปนอุจจาระ","มาก เลือดออกชัดเจน"]},{"key":"bowel_change","q_th":"ลักษณะอุจจาระเปลี่ยนไปจากเดิมไหม?","type":"boolean"},{"key":"pain_abdominal","q_th":"มีปวดท้องร่วมด้วยไหม?","type":"boolean"},{"key":"weight_loss_bowel","q_th":"น้ำหนักลดร่วมด้วยไหม?","type":"boolean"}]'),

('ME05.4','ตัวเหลือง ตาเหลือง','Jaundice','abdomen','GI',3,false,
'[{"key":"jaundice_duration","q_th":"เหลืองมานานแค่ไหน?","type":"radio","options":["น้อยกว่า 1 สัปดาห์","1-4 สัปดาห์","มากกว่า 1 เดือน"]},{"key":"dark_urine","q_th":"ปัสสาวะมีสีเข้มเหมือนน้ำชาไหม?","type":"boolean"},{"key":"pale_stool","q_th":"อุจจาระมีสีซีดขาวผิดปกติไหม?","type":"boolean"},{"key":"abdominal_pain_jaundice","q_th":"มีปวดท้องบริเวณชายโครงขวาร่วมด้วยไหม?","type":"boolean"},{"key":"fever_jaundice","q_th":"มีไข้ร่วมด้วยไหม?","type":"boolean"},{"key":"weight_loss_jaundice","q_th":"น้ำหนักลดร่วมด้วยไหม?","type":"boolean"}]'),

('MD90.4','คลื่นไส้ อาเจียน','Nausea / Vomiting','abdomen','GI',2,false,
'[{"key":"vomit_blood","q_th":"มีเลือดปนในสิ่งที่อาเจียนออกมาไหม? (สีแดงหรือน้ำตาลคล้ายกากกาแฟ)","type":"boolean"},{"key":"vomit_content","q_th":"สิ่งที่อาเจียนออกมาเป็นอะไร?","type":"radio","options":["อาหารที่เพิ่งกิน","น้ำดีสีเหลืองเขียว","เลือดหรือกากกาแฟ","ไม่ได้อาเจียน"]},{"key":"abdominal_pain_nausea","q_th":"มีปวดท้องร่วมด้วยไหม?","type":"boolean"},{"key":"fever_nausea","q_th":"มีไข้ร่วมด้วยไหม?","type":"boolean"},{"key":"last_meal","q_th":"อาการเริ่มหลังจากกินอาหารไหม?","type":"boolean"}]'),

('ME04.5','ท้องเสีย อุจจาระเหลว','Diarrhea','abdomen','GI',2,false,
'[{"key":"diarrhea_duration","q_th":"ท้องเสียมานานแค่ไหน?","type":"radio","options":["น้อยกว่า 2 สัปดาห์ (เฉียบพลัน)","2-4 สัปดาห์","มากกว่า 4 สัปดาห์ (เรื้อรัง)"]},{"key":"bloody_diarrhea","q_th":"อุจจาระมีเลือดหรือมูกปนไหม?","type":"boolean"},{"key":"frequency","q_th":"ถ่ายบ่อยแค่ไหน?","type":"radio","options":["3-5 ครั้ง/วัน","6-10 ครั้ง/วัน","มากกว่า 10 ครั้ง/วัน"]},{"key":"dehydration","q_th":"มีอาการขาดน้ำ เช่น ปากแห้ง ไม่ค่อยปัสสาวะไหม?","type":"boolean"}]'),

-- ── GENERAL SYSTEMIC ──────────────────────────────────────────
('MG29.0','มีไข้','Fever','general','general',2,false,
'[{"key":"fever_degree","q_th":"ไข้สูงสุดที่วัดได้?","type":"radio","options":["37.5-38°C","38-39°C","39-40°C","มากกว่า 40°C","ไม่ได้วัด แต่ตัวร้อน"]},{"key":"fever_pattern","q_th":"รูปแบบไข้?","type":"radio","options":["ไข้ตลอดเวลา","ไข้เป็นๆ หายๆ (เป็นทุกวัน/เว้นวัน)","ไข้สูงสลับปกติ (Remittent)"]},{"key":"rash_fever","q_th":"มีผื่นหรือจุดแดงตามตัวร่วมด้วยไหม?","type":"boolean"},{"key":"travel_history","q_th":"เพิ่งเดินทางไปต่างประเทศหรือต่างจังหวัดไหม?","type":"boolean"},{"key":"neck_stiff_fever","q_th":"มีคอแข็งหรือแพ้แสงสว่างร่วมด้วยไหม?","type":"boolean"}]'),

('MG22','เหนื่อยล้าผิดปกติ อ่อนเพลียมาก','Fatigue / Malaise','general','general',2,false,
'[{"key":"fatigue_duration","q_th":"เหนื่อยล้าผิดปกติมานานแค่ไหน?","type":"radio","options":["น้อยกว่า 2 สัปดาห์","2-4 สัปดาห์","1-6 เดือน","มากกว่า 6 เดือน"]},{"key":"fatigue_severity","q_th":"ส่งผลต่อชีวิตประจำวันแค่ไหน?","type":"radio","options":["เล็กน้อย ยังทำงานได้","ปานกลาง ทำงานได้บางส่วน","รุนแรง ทำกิจวัตรไม่ได้"]},{"key":"mood_fatigue","q_th":"มีอาการซึมเศร้า เบื่อหน่าย ไม่สนใจสิ่งต่างๆ ร่วมด้วยไหม?","type":"boolean"},{"key":"weight_change","q_th":"น้ำหนักเปลี่ยนแปลงร่วมด้วยไหม?","type":"radio","options":["ไม่เปลี่ยน","ลดลงโดยไม่ตั้งใจ","เพิ่มขึ้น"]}]'),

('5B81','น้ำหนักลดโดยไม่ตั้งใจ','Unintentional weight loss','general','general',3,false,
'[{"key":"weight_loss_kg","q_th":"ลดไปกี่กิโลกรัมใน 6 เดือนที่ผ่านมา?","type":"number"},{"key":"weight_loss_period","q_th":"ลดภายในกี่เดือน?","type":"number"},{"key":"appetite","q_th":"ความอยากอาหารเป็นอย่างไร?","type":"radio","options":["เบื่ออาหารมาก","อยากอาหารปกติแต่น้ำหนักลด","กินมากขึ้นแต่น้ำหนักยังลด"]},{"key":"night_sweat_wl","q_th":"มีเหงื่อออกตอนกลางคืนร่วมด้วยไหม?","type":"boolean"},{"key":"fever_wl","q_th":"มีไข้ร่วมด้วยไหม?","type":"boolean"}]'),

('MG23','เหงื่อออกตอนกลางคืน','Night sweats','general','general',2,false,
'[{"key":"night_sweat_severity","q_th":"เหงื่อออกมากแค่ไหน?","type":"radio","options":["เล็กน้อย เสื้อเปียกบ้าง","ปานกลาง ต้องเปลี่ยนเสื้อ","มาก ต้องเปลี่ยนผ้าปูที่นอน"]},{"key":"fever_ns","q_th":"มีไข้ร่วมด้วยไหม?","type":"boolean"},{"key":"weight_loss_ns","q_th":"น้ำหนักลดร่วมด้วยไหม?","type":"boolean"},{"key":"lymph_node","q_th":"มีต่อมน้ำเหลืองโตที่คอ รักแร้ หรือขาหนีบไหม?","type":"boolean"}]'),

('MG40','บวม (Edema)','Peripheral edema','general','cardiovascular',2,false,
'[{"key":"edema_location","q_th":"บวมที่ไหน?","type":"radio","options":["ขาและเท้าสองข้าง","ขาข้างเดียว","ใบหน้าและรอบดวงตา","ทั้งตัว"]},{"key":"edema_onset","q_th":"บวมเกิดขึ้นอย่างไร?","type":"radio","options":["ค่อยๆ เป็นหลายสัปดาห์","เฉียบพลัน"]},{"key":"pit_edema","q_th":"กดแล้วมีรอยบุ๋มไหม?","type":"boolean"},{"key":"dyspnea_edema","q_th":"มีหายใจลำบากร่วมด้วยไหม?","type":"boolean"}]'),

-- ── SKIN ──────────────────────────────────────────────────────
('ED00','ผื่น','Rash / Skin lesion','skin','dermatological',1,false,
'[{"key":"rash_type","q_th":"ลักษณะผื่น?","type":"radio","options":["ผื่นแดงราบ","ตุ่มน้ำ","ตุ่มหนอง","ผื่นนูนแดง (Urticaria/ลมพิษ)","จุดเลือดออกใต้ผิวหนัง"]},{"key":"rash_itch","q_th":"ผื่นคันไหม?","type":"boolean"},{"key":"rash_spread","q_th":"ผื่นกระจายหรือขยายตัวไหม?","type":"boolean"},{"key":"rash_fever","q_th":"มีไข้ร่วมด้วยไหม?","type":"boolean"},{"key":"new_drug","q_th":"เพิ่งเริ่มยาใหม่หรือสัมผัสสิ่งแปลกปลอมไหม?","type":"boolean"}]'),

('ED10','จุดเลือดออกใต้ผิวหนัง','Petechiae / Purpura','skin','dermatological',4,true,
'[{"key":"petechiae_location","q_th":"จุดเลือดออกอยู่ที่ไหน?","type":"radio","options":["ขาและเท้า","แขน","ทั่วร่างกาย","เฉพาะจุด"]},{"key":"fever_petechiae","q_th":"มีไข้ร่วมด้วยไหม?","type":"boolean"},{"key":"dengue_risk","q_th":"อยู่ในพื้นที่ที่มียุงชุกชุม หรือมีคนรอบข้างเป็นไข้ไหม?","type":"boolean"}]'),

('EF00','มีก้อนหรือตุ่มผิดปกติ','Lump / Mass','skin','general',3,false,
'[{"key":"lump_location","q_th":"ก้อนอยู่ที่ไหน?","type":"radio","options":["คอ (ต่อมน้ำเหลือง)","รักแร้","ขาหนีบ","เต้านม","ท้อง","อื่นๆ"]},{"key":"lump_size","q_th":"ขนาดก้อน?","type":"radio","options":["น้อยกว่า 1 ซม.","1-3 ซม.","มากกว่า 3 ซม."]},{"key":"lump_tender","q_th":"กดเจ็บไหม?","type":"boolean"},{"key":"lump_growth","q_th":"ก้อนโตขึ้นเรื่อยๆ ไหม?","type":"boolean"},{"key":"lump_duration","q_th":"มีก้อนนี้มานานแค่ไหน?","type":"radio","options":["น้อยกว่า 2 สัปดาห์","2-4 สัปดาห์","1-3 เดือน","มากกว่า 3 เดือน"]}]'),

-- ── ADDITIONAL HIGH-PRIORITY SYMPTOMS ─────────────────────────
('MC00','หัวใจหยุดเต้น / หมดสติ','Syncope / Loss of consciousness','general','cardiovascular',4,true,
'[{"key":"syncope_warning","q_th":"มีอาการเตือนก่อนหมดสติไหม? เช่น เหงื่อออก ใจสั่น ตามัว","type":"boolean"},{"key":"syncope_duration","q_th":"หมดสตินานแค่ไหน?","type":"radio","options":["ไม่กี่วินาที","1-5 นาที","มากกว่า 5 นาที"]},{"key":"seizure","q_th":"มีชักหรือกระตุกร่วมด้วยไหม?","type":"boolean"},{"key":"chest_pain_syncope","q_th":"มีเจ็บหน้าอกก่อนหรือหลังหมดสติไหม?","type":"boolean"}]'),

('5C80.4','กระหายน้ำมาก ปัสสาวะบ่อย','Polyuria / Polydipsia','general','endocrine',2,false,
'[{"key":"duration_polyuria","q_th":"อาการเป็นมานานแค่ไหน?","type":"radio","options":["น้อยกว่า 1 สัปดาห์","1-4 สัปดาห์","มากกว่า 1 เดือน"]},{"key":"weight_loss_polyuria","q_th":"น้ำหนักลดร่วมด้วยไหม?","type":"boolean"},{"key":"family_dm","q_th":"ครอบครัวเป็นเบาหวานไหม?","type":"boolean"}]'),

('FA80.6','ปวดข้อ','Joint pain / Arthralgia','limbs','musculoskeletal',1,false,
'[{"key":"joint_location","q_th":"ปวดข้อไหนบ้าง?","type":"radio","options":["ข้อเล็กๆ มือและเท้า","ข้อใหญ่ เข่า สะโพก","ข้อสันหลัง","หลายข้อพร้อมกัน"]},{"key":"joint_swelling","q_th":"ข้อบวมแดงร้อนร่วมด้วยไหม?","type":"boolean"},{"key":"morning_stiffness","q_th":"มีข้อฝืดตอนเช้า (Morning stiffness) ไหม? นานแค่ไหน?","type":"radio","options":["ไม่มี","น้อยกว่า 30 นาที","มากกว่า 30 นาที"]},{"key":"fever_joint","q_th":"มีไข้ร่วมด้วยไหม?","type":"boolean"}]')

on conflict (code) do nothing;

-- ─────────────────────────────────────────────────────────────
-- CONDITIONS (30 โรคหลัก — ICD-11 coded)
-- ─────────────────────────────────────────────────────────────
insert into public.conditions
  (icd11_code, name_th, name_en, category, severity, urgency_level,
   prevalence_thailand, specialty_required, encyclopedia_slug)
values
('BA80','กล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน','Acute Myocardial Infarction','cardiovascular','critical',4,'พบ 30,000+ รายต่อปีในไทย','อายุรแพทย์โรคหัวใจ (Cardiologist)','cardiovascular-disease'),
('BA83','โรคหลอดเลือดสมอง','Ischemic Stroke','neurological','critical',4,'สาเหตุการเสียชีวิตอันดับ 3 ของไทย','อายุรแพทย์ระบบประสาท (Neurologist)',NULL),
('8A00','เยื่อหุ้มสมองอักเสบ','Meningitis','neurological','critical',4,'พบได้ทุกช่วงอายุ','อายุรแพทย์โรคติดเชื้อ (Infectious Disease)',NULL),
('BA01','ความดันโลหิตสูง','Hypertension','cardiovascular','moderate',2,'พบ 24-28% ของผู้ใหญ่ไทย','อายุรแพทย์ (Internal Medicine)','hypertension'),
('BC23','ภาวะหัวใจล้มเหลว','Heart Failure','cardiovascular','severe',3,'เกี่ยวข้องกับโรคหัวใจเรื้อรัง','อายุรแพทย์โรคหัวใจ (Cardiologist)',NULL),
('5A11','เบาหวานชนิดที่ 2','Type 2 Diabetes Mellitus','endocrine','moderate',2,'พบ 8-11% ของผู้ใหญ่ไทย','อายุรแพทย์ต่อมไร้ท่อ (Endocrinologist)','type-2-diabetes'),
('5A00','ภาวะไทรอยด์เป็นพิษ','Hyperthyroidism','endocrine','moderate',2,'พบ 1-2% ของประชากรไทย','อายุรแพทย์ต่อมไร้ท่อ',NULL),
('5A10','ภาวะไทรอยด์ทำงานน้อย','Hypothyroidism','endocrine','mild',2,NULL,'อายุรแพทย์ต่อมไร้ท่อ',NULL),
('2C61','มะเร็งเต้านม','Breast Cancer','cancer','severe',2,'มะเร็งพบบ่อยอันดับ 1 ในผู้หญิงไทย','ศัลยแพทย์มะเร็งวิทยา (Surgical Oncologist)','breast-cancer'),
('2C83','มะเร็งลำไส้ใหญ่','Colorectal Cancer','cancer','severe',2,'มะเร็งพบบ่อยอันดับ 3 ของไทย','ศัลยแพทย์ระบบทางเดินอาหาร','colorectal-cancer'),
('2C12','มะเร็งปอด','Lung Cancer','cancer','severe',2,'มะเร็งพบบ่อยอันดับ 2 ในผู้ชายไทย','อายุรแพทย์โรคปอด/มะเร็งวิทยา','lung-cancer'),
('2C71','มะเร็งตับ','Hepatocellular Carcinoma','cancer','severe',2,'ไทยเป็นพื้นที่ HBV endemic — อัตราสูง','อายุรแพทย์ระบบทางเดินอาหาร/ตับ','liver-cancer'),
('GC00','มะเร็งปากมดลูก','Cervical Cancer','cancer','severe',2,'พบ 6,000 รายต่อปีในไทย','สูตินรีแพทย์มะเร็งวิทยา (Gynecologic Oncologist)','cervical-cancer'),
('2B33','มะเร็งต่อมน้ำเหลือง','Lymphoma','cancer','severe',2,NULL,'อายุรแพทย์มะเร็งวิทยา (Oncologist)',NULL),
('3A20','มะเร็งเม็ดเลือดขาว','Leukemia','cancer','severe',2,NULL,'อายุรแพทย์มะเร็งวิทยา',NULL),
('1D2Y','วัณโรค','Tuberculosis','infectious','severe',3,'พบ 70 ต่อ 100,000 ประชากร — สูงกว่าค่าเฉลี่ยโลก','อายุรแพทย์โรคปอด (Pulmonologist)',NULL),
('1D50','ไข้เลือดออก','Dengue Fever','infectious','severe',3,'ระบาดทั่วประเทศไทยช่วงฤดูฝน','กุมารแพทย์/อายุรแพทย์ (Pediatrician/Internist)',NULL),
('DB93','ไวรัสตับอักเสบบี','Hepatitis B','infectious','severe',2,'ไทยเป็น endemic — HBsAg positivity ~5-8%','อายุรแพทย์ระบบทางเดินอาหาร (Gastroenterologist)',NULL),
('AB30','COVID-19','COVID-19','infectious','moderate',3,NULL,'อายุรแพทย์โรคติดเชื้อ',NULL),
('1A95','ไข้ไทฟอยด์','Typhoid Fever','infectious','moderate',3,'พบในพื้นที่สุขาภิบาลไม่ดี','อายุรแพทย์โรคติดเชื้อ',NULL),
('6A70','โรคซึมเศร้า','Major Depressive Disorder','psychiatric','moderate',2,'พบ 5-7% ของประชากรไทย','จิตแพทย์/นักจิตวิทยาคลินิก','depression'),
('6B00','โรควิตกกังวลทั่วไป','Generalized Anxiety Disorder','psychiatric','mild',2,NULL,'จิตแพทย์',NULL),
('CA22.0','โรคหอบหืด','Bronchial Asthma','respiratory','moderate',2,'พบ 6-8% ของประชากรไทย','อายุรแพทย์โรคปอด (Pulmonologist)',NULL),
('CA22.1','โรคปอดอุดกั้นเรื้อรัง','COPD','respiratory','severe',2,'เกี่ยวข้องกับการสูบบุหรี่ระยะยาว','อายุรแพทย์โรคปอด',NULL),
('DA91','แผลเปปติก/กระเพาะอาหาร','Peptic Ulcer Disease','GI','moderate',2,NULL,'อายุรแพทย์ระบบทางเดินอาหาร',NULL),
('8B20','ไมเกรน','Migraine','neurological','mild',2,'พบ 15% ของประชากรไทย','อายุรแพทย์ระบบประสาท (Neurologist)',NULL),
('5B56','โรคอ้วน','Obesity','endocrine','moderate',2,'BMI ≥ 30 พบ 37% ของผู้ใหญ่ไทย','อายุรแพทย์/เวชศาสตร์ครอบครัว',NULL),
('3A00','โลหิตจาง','Anemia','other','moderate',2,NULL,'อายุรแพทย์',NULL),
('FA24','โรคข้อเข่าเสื่อม','Osteoarthritis','musculoskeletal','mild',1,NULL,'ออร์โธปิดิกส์',NULL),
('BA41','โรคหลอดเลือดหัวใจตีบ (Stable Angina)','Stable Angina Pectoris','cardiovascular','moderate',2,'เกี่ยวข้องกับ CAD','อายุรแพทย์โรคหัวใจ','cardiovascular-disease')

on conflict (icd11_code) do nothing;

-- ─────────────────────────────────────────────────────────────
-- DIFFERENTIAL DIAGNOSIS MAPPINGS
-- Based on: Harrison's Principles of Internal Medicine, 21st ed.
-- Thai MoPH Clinical Practice Guidelines
-- WHO ICD-11 Clinical Descriptions
-- ALL SCORES PENDING PHYSICIAN VALIDATION
-- ─────────────────────────────────────────────────────────────
do $$
declare
  -- Conditions
  c_ami     uuid; c_stroke  uuid; c_meningitis uuid;
  c_htn     uuid; c_hf      uuid; c_t2dm      uuid;
  c_hyperthyroid uuid; c_hypothyroid uuid;
  c_ca_breast uuid; c_ca_colorectal uuid; c_ca_lung uuid;
  c_ca_liver  uuid; c_ca_cervix uuid;
  c_lymphoma  uuid; c_leukemia  uuid;
  c_tb      uuid; c_dengue  uuid; c_hepb    uuid;
  c_covid   uuid; c_typhoid uuid;
  c_mdd     uuid; c_gad     uuid;
  c_asthma  uuid; c_copd    uuid; c_pud     uuid;
  c_migraine uuid; c_angina uuid;
  c_anemia  uuid; c_obesity uuid;

  -- Symptoms
  s_headache     uuid; s_thunderclap  uuid; s_vertigo      uuid;
  s_vision_blur  uuid; s_hemiweakness uuid; s_aphasia      uuid;
  s_neck_stiff   uuid; s_migraine_ha  uuid;
  s_chest_pain   uuid; s_palpitation  uuid; s_dyspnea      uuid;
  s_cough        uuid; s_hemoptysis   uuid;
  s_abd_pain     uuid; s_rectal_bleed uuid; s_jaundice     uuid;
  s_nausea       uuid; s_diarrhea     uuid;
  s_fever        uuid; s_fatigue      uuid; s_weight_loss  uuid;
  s_night_sweat  uuid; s_edema        uuid;
  s_rash         uuid; s_petechiae    uuid; s_lump         uuid;
  s_syncope      uuid; s_polyuria     uuid;
begin
  -- Load condition IDs
  select id into c_ami        from public.conditions where icd11_code='BA80';
  select id into c_stroke     from public.conditions where icd11_code='BA83';
  select id into c_meningitis from public.conditions where icd11_code='8A00';
  select id into c_htn        from public.conditions where icd11_code='BA01';
  select id into c_hf         from public.conditions where icd11_code='BC23';
  select id into c_t2dm       from public.conditions where icd11_code='5A11';
  select id into c_hyperthyroid from public.conditions where icd11_code='5A00';
  select id into c_hypothyroid  from public.conditions where icd11_code='5A10';
  select id into c_ca_breast  from public.conditions where icd11_code='2C61';
  select id into c_ca_colorectal from public.conditions where icd11_code='2C83';
  select id into c_ca_lung    from public.conditions where icd11_code='2C12';
  select id into c_ca_liver   from public.conditions where icd11_code='2C71';
  select id into c_ca_cervix  from public.conditions where icd11_code='GC00';
  select id into c_lymphoma   from public.conditions where icd11_code='2B33';
  select id into c_leukemia   from public.conditions where icd11_code='3A20';
  select id into c_tb         from public.conditions where icd11_code='1D2Y';
  select id into c_dengue     from public.conditions where icd11_code='1D50';
  select id into c_hepb       from public.conditions where icd11_code='DB93';
  select id into c_covid      from public.conditions where icd11_code='AB30';
  select id into c_typhoid    from public.conditions where icd11_code='1A95';
  select id into c_mdd        from public.conditions where icd11_code='6A70';
  select id into c_gad        from public.conditions where icd11_code='6B00';
  select id into c_asthma     from public.conditions where icd11_code='CA22.0';
  select id into c_copd       from public.conditions where icd11_code='CA22.1';
  select id into c_pud        from public.conditions where icd11_code='DA91';
  select id into c_migraine   from public.conditions where icd11_code='8B20';
  select id into c_angina     from public.conditions where icd11_code='BA41';
  select id into c_anemia     from public.conditions where icd11_code='3A00';
  select id into c_obesity    from public.conditions where icd11_code='5B56';

  -- Load symptom IDs
  select id into s_headache     from public.symptoms where code='MG30.0';
  select id into s_thunderclap  from public.symptoms where code='MG30.1';
  select id into s_vertigo      from public.symptoms where code='MB40.1';
  select id into s_vision_blur  from public.symptoms where code='9D90.0';
  select id into s_hemiweakness from public.symptoms where code='MB48';
  select id into s_aphasia      from public.symptoms where code='MC80';
  select id into s_neck_stiff   from public.symptoms where code='MG44';
  select id into s_migraine_ha  from public.symptoms where code='8B20.0';
  select id into s_chest_pain   from public.symptoms where code='MA80';
  select id into s_palpitation  from public.symptoms where code='MA81';
  select id into s_dyspnea      from public.symptoms where code='MB23.4';
  select id into s_cough        from public.symptoms where code='CA22';
  select id into s_hemoptysis   from public.symptoms where code='CA23';
  select id into s_abd_pain     from public.symptoms where code='MD81';
  select id into s_rectal_bleed from public.symptoms where code='MD84';
  select id into s_jaundice     from public.symptoms where code='ME05.4';
  select id into s_nausea       from public.symptoms where code='MD90.4';
  select id into s_diarrhea     from public.symptoms where code='ME04.5';
  select id into s_fever        from public.symptoms where code='MG29.0';
  select id into s_fatigue      from public.symptoms where code='MG22';
  select id into s_weight_loss  from public.symptoms where code='5B81';
  select id into s_night_sweat  from public.symptoms where code='MG23';
  select id into s_edema        from public.symptoms where code='MG40';
  select id into s_rash         from public.symptoms where code='ED00';
  select id into s_petechiae    from public.symptoms where code='ED10';
  select id into s_lump         from public.symptoms where code='EF00';
  select id into s_syncope      from public.symptoms where code='MC00';
  select id into s_polyuria     from public.symptoms where code='5C80.4';

  -- ── INSERT DIFFERENTIAL DX MAPPINGS ────────────────────────
  insert into public.differential_dx
    (condition_id, symptom_id, base_score,
     modifier_age_over_50, modifier_age_over_60,
     modifier_male, modifier_female,
     modifier_smoker, modifier_ex_smoker_5y,
     modifier_heavy_alcohol, modifier_obese,
     modifier_diabetes, modifier_hypertension,
     modifier_hbv, modifier_family_hx,
     modifier_duration_chronic, modifier_duration_acute,
     modifier_severity_high, modifier_sudden_onset,
     modifier_worsening, modifier_night_predominant)
  values

  -- ══════════════════════════════════════════════════════════════
  -- AMI — Acute Myocardial Infarction
  -- Key: chest pain + radiation + cold sweat + male + age + risk factors
  -- ══════════════════════════════════════════════════════════════
  (c_ami, s_chest_pain,   0.25, 0.15, 0.10, 0.12, -0.05, 0.12, 0.08, 0.05, 0.03, 0.10, 0.08, 0, 0.15, -0.05, 0.10, 0.12, 0.15, 0.05, 0),
  (c_ami, s_dyspnea,      0.12, 0.08, 0.05, 0.05, -0.02, 0.05, 0.03, 0.02, 0.02, 0.05, 0.03, 0, 0.05, -0.03, 0.08, 0.08, 0.10, 0.05, 0.03),
  (c_ami, s_palpitation,  0.08, 0.05, 0.03, 0.05, -0.02, 0.03, 0.02, 0.01, 0.01, 0.03, 0.02, 0, 0.05, 0,      0.05, 0.05, 0.10, 0.05, 0.03),
  (c_ami, s_syncope,      0.12, 0.08, 0.05, 0.08, -0.03, 0.05, 0.03, 0.02, 0.02, 0.05, 0.03, 0, 0.05, -0.05, 0.10, 0.12, 0.15, 0.05, 0),
  (c_ami, s_fatigue,      0.05, 0.05, 0.03, 0.03,  0.03, 0.03, 0.02, 0.01, 0.02, 0.05, 0.03, 0, 0.03, 0.03,  0.05, 0.03, 0.05, 0, 0.05),
  (c_ami, s_nausea,       0.07, 0.05, 0.03, 0.05,  0.03, 0.03, 0.02, 0.01, 0.01, 0.03, 0.02, 0, 0.03, -0.05, 0.05, 0.05, 0.05, 0.05, 0),

  -- ══════════════════════════════════════════════════════════════
  -- STABLE ANGINA
  -- ══════════════════════════════════════════════════════════════
  (c_angina, s_chest_pain,  0.20, 0.12, 0.08, 0.10, -0.03, 0.10, 0.06, 0.03, 0.03, 0.08, 0.06, 0, 0.12, 0.10, 0, 0.08, 0, 0.08, 0.05),
  (c_angina, s_dyspnea,     0.10, 0.08, 0.05, 0.05, -0.02, 0.05, 0.03, 0.02, 0.02, 0.05, 0.03, 0, 0.05, 0.05, 0, 0.05, 0, 0.05, 0.03),

  -- ══════════════════════════════════════════════════════════════
  -- STROKE — Ischemic
  -- Key: sudden hemiweakness, aphasia, facial droop
  -- ══════════════════════════════════════════════════════════════
  (c_stroke, s_hemiweakness, 0.50, 0.15, 0.10, 0.05, 0.05, 0.08, 0.05, 0.03, 0.03, 0.08, 0.12, 0, 0.05, -0.10, 0.10, 0.05, 0.20, 0.03, 0),
  (c_stroke, s_aphasia,      0.55, 0.15, 0.10, 0.05, 0.05, 0.08, 0.05, 0.03, 0.03, 0.08, 0.12, 0, 0.05, -0.10, 0.10, 0.05, 0.20, 0.03, 0),
  (c_stroke, s_vision_blur,  0.15, 0.10, 0.08, 0.05, 0.03, 0.05, 0.03, 0.02, 0.02, 0.08, 0.08, 0, 0.05, -0.05, 0.08, 0.05, 0.15, 0.03, 0),
  (c_stroke, s_headache,     0.10, 0.08, 0.05, 0.03, 0.02, 0.03, 0.02, 0.01, 0.01, 0.05, 0.05, 0, 0.03, -0.05, 0.05, 0.03, 0.10, 0.03, 0),
  (c_stroke, s_syncope,      0.12, 0.08, 0.05, 0.05, 0.03, 0.05, 0.03, 0.02, 0.02, 0.05, 0.05, 0, 0.05, -0.05, 0.08, 0.05, 0.12, 0.03, 0),

  -- ══════════════════════════════════════════════════════════════
  -- MENINGITIS
  -- Key triad: fever + neck stiffness + headache
  -- ══════════════════════════════════════════════════════════════
  (c_meningitis, s_neck_stiff,   0.50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.20, 0.15, 0.05, 0.15, 0.10, 0),
  (c_meningitis, s_thunderclap,  0.45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.20, 0.15, 0.05, 0.15, 0.10, 0),
  (c_meningitis, s_headache,     0.15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.05, 0.10, 0.03, 0.10, 0.05, 0),
  (c_meningitis, s_fever,        0.20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.05, 0.10, 0.03, 0.10, 0.05, 0),
  (c_meningitis, s_petechiae,    0.35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.15, 0.15, 0.05, 0.10, 0.05, 0),

  -- ══════════════════════════════════════════════════════════════
  -- HYPERTENSION
  -- Common + often found incidentally
  -- ══════════════════════════════════════════════════════════════
  (c_htn, s_headache,     0.25, 0.12, 0.08, 0.03, 0.03, 0.05, 0.03, 0.02, 0.08, 0.05, 0, 0, 0.08, 0.08, 0.05, 0.05, 0.05, 0.03, 0.03),
  (c_htn, s_vertigo,      0.15, 0.10, 0.08, 0.02, 0.02, 0.03, 0.02, 0.01, 0.05, 0.03, 0, 0, 0.05, 0.05, 0.03, 0.05, 0.03, 0.02, 0.03),
  (c_htn, s_vision_blur,  0.12, 0.10, 0.08, 0.02, 0.02, 0.03, 0.02, 0.01, 0.05, 0.03, 0, 0, 0.05, 0.05, 0.03, 0.05, 0.03, 0.02, 0.03),
  (c_htn, s_chest_pain,   0.08, 0.08, 0.05, 0.02, 0, 0.03, 0.02, 0.01, 0.05, 0.03, 0, 0, 0.05, 0.03, 0.02, 0.03, 0.05, 0.02, 0.02),
  (c_htn, s_palpitation,  0.08, 0.05, 0.03, 0.02, 0.02, 0.02, 0.01, 0.01, 0.03, 0.02, 0, 0, 0.03, 0.03, 0.02, 0.03, 0.03, 0.02, 0.02),

  -- ══════════════════════════════════════════════════════════════
  -- HEART FAILURE
  -- Key: dyspnea + edema + orthopnea + fatigue
  -- ══════════════════════════════════════════════════════════════
  (c_hf, s_dyspnea,      0.30, 0.12, 0.10, 0.05, 0.05, 0.03, 0.02, 0.02, 0.05, 0.05, 0.10, 0, 0.10, 0.15, -0.05, 0.08, 0.08, 0, 0.12),
  (c_hf, s_edema,        0.35, 0.12, 0.10, 0.05, 0.05, 0.02, 0.01, 0.02, 0.05, 0.05, 0.10, 0, 0.10, 0.15, -0.05, 0.05, 0.05, 0, 0.08),
  (c_hf, s_fatigue,      0.15, 0.08, 0.06, 0.03, 0.03, 0.02, 0.01, 0.01, 0.03, 0.03, 0.05, 0, 0.05, 0.10, 0, 0.03, 0.03, 0, 0.08),
  (c_hf, s_cough,        0.12, 0.08, 0.06, 0.03, 0.03, 0.02, 0.01, 0.01, 0.03, 0.03, 0.08, 0, 0.08, 0.08, 0, 0.03, 0.03, 0, 0.10),

  -- ══════════════════════════════════════════════════════════════
  -- TYPE 2 DIABETES
  -- ══════════════════════════════════════════════════════════════
  (c_t2dm, s_polyuria,     0.45, 0.12, 0.08, 0.02, 0.03, 0.03, 0.02, 0.02, 0.12, 0.05, 0, 0, 0.15, 0.08, 0, 0.05, 0.05, 0, 0.03),
  (c_t2dm, s_fatigue,      0.15, 0.08, 0.05, 0.02, 0.02, 0.02, 0.01, 0.01, 0.08, 0.05, 0, 0, 0.10, 0.05, 0, 0.03, 0.03, 0, 0.03),
  (c_t2dm, s_vision_blur,  0.12, 0.08, 0.05, 0.02, 0.02, 0.02, 0.01, 0.01, 0.08, 0.03, 0, 0, 0.08, 0.05, 0, 0.03, 0.03, 0, 0.03),
  (c_t2dm, s_weight_loss,  0.08, 0.05, 0.03, 0.02, 0.02, 0.02, 0.01, 0.01, 0.05, 0.03, 0, 0, 0.05, 0.03, 0, 0.05, 0.03, 0, 0.03),

  -- ══════════════════════════════════════════════════════════════
  -- HYPERTHYROIDISM
  -- Key: palpitation + weight loss + heat intolerance + tremor
  -- ══════════════════════════════════════════════════════════════
  (c_hyperthyroid, s_palpitation, 0.30, 0.05, 0.03, -0.05, 0.10, 0.02, 0.01, 0.01, 0.01, 0.03, 0.02, 0, 0.05, 0.05, 0, 0.05, 0.05, 0, 0.03),
  (c_hyperthyroid, s_weight_loss, 0.20, 0.05, 0.03, -0.03, 0.08, 0.02, 0.01, 0.01, 0.01, 0.02, 0.02, 0, 0.05, 0.05, 0, 0.05, 0.03, 0, 0.03),
  (c_hyperthyroid, s_fatigue,     0.10, 0.03, 0.02, -0.02, 0.05, 0.01, 0.01, 0.01, 0.01, 0.02, 0.02, 0, 0.03, 0.05, 0, 0.03, 0.02, 0, 0.03),
  (c_hyperthyroid, s_night_sweat, 0.12, 0.03, 0.02, -0.02, 0.08, 0.01, 0.01, 0.01, 0.01, 0.02, 0.01, 0, 0.03, 0.05, 0, 0.03, 0.02, 0, 0.05),

  -- ══════════════════════════════════════════════════════════════
  -- TUBERCULOSIS
  -- Classic Thai triad: chronic cough + weight loss + night sweats
  -- ══════════════════════════════════════════════════════════════
  (c_tb, s_cough,        0.25, 0.05, 0.03, 0.08, -0.03, 0.15, 0.08, 0.05, 0, 0, 0.05, 0.05, 0.15, 0, 0.25, 0, 0.08, 0, 0.08, 0.10),
  (c_tb, s_hemoptysis,   0.35, 0.08, 0.05, 0.08, -0.03, 0.15, 0.08, 0.05, 0, 0, 0.05, 0.05, 0.15, 0, 0.20, 0, 0.10, 0, 0.10, 0.08),
  (c_tb, s_night_sweat,  0.30, 0.05, 0.03, 0.05, -0.02, 0.12, 0.06, 0.05, 0, 0, 0.05, 0.05, 0.12, 0, 0.20, 0, 0.08, 0, 0.08, 0.35),
  (c_tb, s_weight_loss,  0.28, 0.05, 0.03, 0.05, -0.02, 0.12, 0.06, 0.05, 0, 0, 0.05, 0.05, 0.12, 0, 0.20, 0, 0.08, 0, 0.08, 0.05),
  (c_tb, s_fever,        0.15, 0.03, 0.02, 0.03, -0.01, 0.08, 0.04, 0.03, 0, 0, 0.03, 0.03, 0.08, 0, 0.12, 0, 0.05, 0, 0.05, 0.08),
  (c_tb, s_fatigue,      0.15, 0.03, 0.02, 0.03, -0.01, 0.08, 0.04, 0.03, 0, 0, 0.03, 0.03, 0.08, 0, 0.15, 0, 0.05, 0, 0.05, 0.05),

  -- ══════════════════════════════════════════════════════════════
  -- DENGUE — Thailand endemic, seasonal
  -- Key: fever + rash/petechiae + bone/eye pain
  -- ══════════════════════════════════════════════════════════════
  (c_dengue, s_fever,       0.30, -0.05, -0.08, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.20, 0.08, 0.05, 0.05, 0, 0.05),
  (c_dengue, s_petechiae,   0.40, -0.05, -0.08, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.20, 0.05, 0.05, 0.08, 0, 0.08),
  (c_dengue, s_rash,        0.20, -0.05, -0.08, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.10, 0.05, 0.05, 0.05, 0, 0.05),
  (c_dengue, s_fatigue,     0.15, -0.03, -0.05, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.10, 0.05, 0.03, 0.05, 0, 0.03),
  (c_dengue, s_nausea,      0.12, -0.03, -0.05, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.08, 0.05, 0.03, 0.03, 0, 0.03),

  -- ══════════════════════════════════════════════════════════════
  -- HEPATITIS B
  -- ══════════════════════════════════════════════════════════════
  (c_hepb, s_jaundice,    0.35, 0.05, 0.03, 0.05, -0.02, 0.05, 0.03, 0.15, 0, 0, 0, 0, 0.20, 0.10, 0.05, 0.08, 0.08, 0, 0.05),
  (c_hepb, s_fatigue,     0.15, 0.03, 0.02, 0.03, -0.01, 0.03, 0.02, 0.08, 0, 0, 0, 0, 0.12, 0.05, 0.03, 0.05, 0.05, 0, 0.03),
  (c_hepb, s_abd_pain,    0.12, 0.03, 0.02, 0.03, -0.01, 0.03, 0.02, 0.08, 0, 0, 0, 0, 0.10, 0.05, 0.03, 0.05, 0.05, 0, 0.03),
  (c_hepb, s_nausea,      0.10, 0.02, 0.01, 0.02, -0.01, 0.02, 0.01, 0.05, 0, 0, 0, 0, 0.08, 0.03, 0.02, 0.05, 0.03, 0, 0.03),

  -- ══════════════════════════════════════════════════════════════
  -- LUNG CANCER
  -- Key: chronic cough + hemoptysis + weight loss + smoking hx
  -- ══════════════════════════════════════════════════════════════
  (c_ca_lung, s_cough,        0.15, 0.12, 0.10, 0.08, -0.05, 0.18, 0.12, 0.03, 0, 0, 0, 0, 0.10, 0, 0.25, 0, 0.08, 0, 0.10, 0.08),
  (c_ca_lung, s_hemoptysis,   0.25, 0.12, 0.10, 0.08, -0.05, 0.18, 0.12, 0.03, 0, 0, 0, 0, 0.10, 0, 0.20, 0, 0.12, 0, 0.10, 0.05),
  (c_ca_lung, s_weight_loss,  0.20, 0.10, 0.08, 0.05, -0.03, 0.15, 0.10, 0.03, 0, 0, 0, 0, 0.08, 0, 0.20, 0, 0.10, 0, 0.10, 0.05),
  (c_ca_lung, s_dyspnea,      0.12, 0.08, 0.06, 0.05, -0.02, 0.12, 0.08, 0.02, 0, 0, 0, 0, 0.05, 0, 0.15, 0, 0.08, 0, 0.08, 0.05),
  (c_ca_lung, s_chest_pain,   0.10, 0.08, 0.06, 0.05, -0.02, 0.10, 0.06, 0.02, 0, 0, 0, 0, 0.05, 0, 0.15, 0, 0.08, 0, 0.08, 0.05),
  (c_ca_lung, s_fatigue,      0.12, 0.08, 0.06, 0.05, -0.02, 0.10, 0.06, 0.02, 0, 0, 0, 0, 0.05, 0, 0.15, 0, 0.08, 0, 0.08, 0.03),
  (c_ca_lung, s_night_sweat,  0.10, 0.08, 0.06, 0.05, -0.02, 0.10, 0.06, 0.02, 0, 0, 0, 0, 0.05, 0, 0.15, 0, 0.08, 0, 0.08, 0.15),

  -- ══════════════════════════════════════════════════════════════
  -- LIVER CANCER (HCC)
  -- Key: RUQ pain + jaundice + weight loss + HBV background
  -- ══════════════════════════════════════════════════════════════
  (c_ca_liver, s_jaundice,     0.25, 0.10, 0.08, 0.08, -0.03, 0.08, 0.04, 0.15, 0, 0.35, 0.10, 0, 0.05, 0, 0.20, 0, 0.10, 0, 0.10, 0.05),
  (c_ca_liver, s_weight_loss,  0.22, 0.10, 0.08, 0.05, -0.02, 0.05, 0.03, 0.12, 0, 0.30, 0.08, 0, 0.03, 0, 0.18, 0, 0.10, 0, 0.10, 0.05),
  (c_ca_liver, s_abd_pain,     0.18, 0.08, 0.06, 0.05, -0.02, 0.05, 0.03, 0.10, 0, 0.25, 0.08, 0, 0.03, 0, 0.15, 0, 0.10, 0, 0.08, 0.03),
  (c_ca_liver, s_fatigue,      0.12, 0.06, 0.04, 0.03, -0.01, 0.03, 0.02, 0.08, 0, 0.20, 0.05, 0, 0.02, 0, 0.12, 0, 0.06, 0, 0.06, 0.03),

  -- ══════════════════════════════════════════════════════════════
  -- COLORECTAL CANCER
  -- Key: rectal bleeding + bowel change + weight loss
  -- ══════════════════════════════════════════════════════════════
  (c_ca_colorectal, s_rectal_bleed, 0.30, 0.15, 0.12, 0.05, 0.05, 0.05, 0.03, 0.08, 0.03, 0.03, 0.03, 0, 0.12, 0, 0.25, 0, 0.10, 0, 0.10, 0.05),
  (c_ca_colorectal, s_abd_pain,     0.15, 0.12, 0.10, 0.03, 0.03, 0.03, 0.02, 0.05, 0.02, 0.02, 0.02, 0, 0.08, 0, 0.20, 0, 0.08, 0, 0.10, 0.03),
  (c_ca_colorectal, s_weight_loss,  0.18, 0.12, 0.10, 0.03, 0.03, 0.05, 0.03, 0.05, 0.02, 0.02, 0.02, 0, 0.10, 0, 0.20, 0, 0.10, 0, 0.10, 0.03),
  (c_ca_colorectal, s_fatigue,      0.10, 0.08, 0.06, 0.02, 0.02, 0.03, 0.02, 0.03, 0.01, 0.01, 0.01, 0, 0.06, 0, 0.15, 0, 0.06, 0, 0.06, 0.03),

  -- ══════════════════════════════════════════════════════════════
  -- LYMPHOMA
  -- Classic B symptoms: fever + night sweats + weight loss
  -- + lymphadenopathy
  -- ══════════════════════════════════════════════════════════════
  (c_lymphoma, s_lump,         0.35, 0.08, 0.05, 0.05, 0.05, 0.03, 0.02, 0.03, 0, 0, 0, 0, 0.10, 0, 0.15, 0, 0.10, 0, 0.10, 0.05),
  (c_lymphoma, s_night_sweat,  0.28, 0.08, 0.05, 0.05, 0.03, 0.03, 0.02, 0.03, 0, 0, 0, 0, 0.08, 0, 0.20, 0, 0.10, 0, 0.10, 0.30),
  (c_lymphoma, s_weight_loss,  0.25, 0.08, 0.05, 0.05, 0.03, 0.03, 0.02, 0.03, 0, 0, 0, 0, 0.08, 0, 0.20, 0, 0.10, 0, 0.10, 0.05),
  (c_lymphoma, s_fever,        0.18, 0.05, 0.03, 0.03, 0.02, 0.02, 0.01, 0.02, 0, 0, 0, 0, 0.05, 0, 0.15, 0, 0.08, 0, 0.08, 0.05),
  (c_lymphoma, s_fatigue,      0.15, 0.05, 0.03, 0.03, 0.02, 0.02, 0.01, 0.02, 0, 0, 0, 0, 0.05, 0, 0.12, 0, 0.06, 0, 0.06, 0.03),
  (c_lymphoma, s_dyspnea,      0.10, 0.05, 0.03, 0.03, 0.02, 0.02, 0.01, 0.02, 0, 0, 0, 0, 0.05, 0, 0.10, 0, 0.06, 0, 0.06, 0.03),

  -- ══════════════════════════════════════════════════════════════
  -- LEUKEMIA
  -- Key: fatigue + easy bruising + petechiae + recurrent infections
  -- ══════════════════════════════════════════════════════════════
  (c_leukemia, s_petechiae,   0.35, 0.05, 0.03, 0.03, 0.03, 0.02, 0.01, 0.02, 0, 0, 0, 0, 0.08, 0, 0.15, 0, 0.10, 0, 0.08, 0.05),
  (c_leukemia, s_fatigue,     0.20, 0.05, 0.03, 0.03, 0.03, 0.02, 0.01, 0.02, 0, 0, 0, 0, 0.05, 0, 0.12, 0, 0.08, 0, 0.06, 0.03),
  (c_leukemia, s_fever,       0.18, 0.05, 0.03, 0.03, 0.02, 0.02, 0.01, 0.02, 0, 0, 0, 0, 0.05, 0, 0.12, 0, 0.08, 0, 0.06, 0.03),
  (c_leukemia, s_lump,        0.15, 0.05, 0.03, 0.03, 0.02, 0.02, 0.01, 0.02, 0, 0, 0, 0, 0.05, 0, 0.10, 0, 0.06, 0, 0.05, 0.03),
  (c_leukemia, s_weight_loss, 0.15, 0.05, 0.03, 0.03, 0.02, 0.02, 0.01, 0.02, 0, 0, 0, 0, 0.05, 0, 0.12, 0, 0.08, 0, 0.06, 0.03),

  -- ══════════════════════════════════════════════════════════════
  -- MAJOR DEPRESSIVE DISORDER
  -- Key: fatigue + anhedonia + weight change + sleep disturbance
  -- ══════════════════════════════════════════════════════════════
  (c_mdd, s_fatigue,      0.25, 0.05, 0.03, -0.05, 0.08, 0.03, 0.02, 0.03, 0.03, 0.03, 0, 0, 0.03, 0.18, 0, 0.05, 0.03, 0, 0.08, 0.10),
  (c_mdd, s_weight_loss,  0.15, 0.03, 0.02, -0.03, 0.06, 0.02, 0.01, 0.02, 0.02, 0.02, 0, 0, 0.02, 0.12, 0, 0.05, 0.02, 0, 0.06, 0.08),
  (c_mdd, s_night_sweat,  0.05, 0.02, 0.01, -0.02, 0.05, 0.01, 0.01, 0.01, 0.01, 0.01, 0, 0, 0.01, 0.08, 0, 0.02, 0.01, 0, 0.03, 0.08),
  (c_mdd, s_headache,     0.08, 0.02, 0.01, -0.02, 0.05, 0.01, 0.01, 0.01, 0.01, 0.01, 0, 0, 0.01, 0.06, 0, 0.02, 0.01, 0, 0.03, 0.05),

  -- ══════════════════════════════════════════════════════════════
  -- PEPTIC ULCER DISEASE
  -- ══════════════════════════════════════════════════════════════
  (c_pud, s_abd_pain,      0.30, 0.08, 0.05, 0.05, 0.03, 0.08, 0.05, 0.15, 0.05, 0.02, 0, 0, 0.05, 0.05, 0.12, 0, 0.08, 0, 0.08, 0.05),
  (c_pud, s_nausea,        0.15, 0.05, 0.03, 0.03, 0.02, 0.05, 0.03, 0.08, 0.03, 0.01, 0, 0, 0.03, 0.03, 0.08, 0, 0.05, 0, 0.05, 0.03),
  (c_pud, s_rectal_bleed,  0.15, 0.08, 0.05, 0.05, 0.02, 0.08, 0.05, 0.15, 0.03, 0.02, 0, 0, 0.05, 0.03, 0.12, 0, 0.10, 0, 0.08, 0.05),

  -- ══════════════════════════════════════════════════════════════
  -- MIGRAINE
  -- ══════════════════════════════════════════════════════════════
  (c_migraine, s_headache,    0.35, -0.05, -0.08, -0.05, 0.12, 0.02, 0.01, 0.03, 0.01, 0.02, 0, 0, 0.02, 0.05, 0.05, 0.10, 0.12, 0.08, 0.05),
  (c_migraine, s_migraine_ha, 0.65, -0.05, -0.08, -0.05, 0.12, 0.02, 0.01, 0.03, 0.01, 0.02, 0, 0, 0.02, 0.05, 0.05, 0.10, 0.12, 0.08, 0.05),
  (c_migraine, s_nausea,      0.20, -0.03, -0.05, -0.03, 0.08, 0.01, 0.01, 0.02, 0.01, 0.01, 0, 0, 0.01, 0.03, 0.03, 0.08, 0.08, 0.05, 0.03),
  (c_migraine, s_vision_blur, 0.15, -0.03, -0.05, -0.03, 0.08, 0.01, 0.01, 0.02, 0.01, 0.01, 0, 0, 0.01, 0.03, 0.03, 0.08, 0.08, 0.05, 0.03),
  (c_migraine, s_vertigo,     0.10, -0.02, -0.03, -0.02, 0.05, 0.01, 0.01, 0.01, 0.01, 0.01, 0, 0, 0.01, 0.02, 0.02, 0.05, 0.05, 0.03, 0.02),

  -- ══════════════════════════════════════════════════════════════
  -- ASTHMA
  -- ══════════════════════════════════════════════════════════════
  (c_asthma, s_dyspnea,    0.28, -0.08, -0.10, -0.03, 0.05, 0.05, 0.03, 0.02, 0, 0.05, 0, 0, 0.05, 0, 0.05, 0.08, 0.12, 0, 0.12, 0.15),
  (c_asthma, s_cough,      0.25, -0.08, -0.10, -0.03, 0.05, 0.05, 0.03, 0.02, 0, 0.05, 0, 0, 0.05, 0, 0.05, 0.08, 0.10, 0, 0.10, 0.15),
  (c_asthma, s_chest_pain, 0.08, -0.03, -0.05, -0.01, 0.02, 0.02, 0.01, 0.01, 0, 0.02, 0, 0, 0.02, 0, 0.02, 0.03, 0.05, 0, 0.05, 0.08),

  -- ══════════════════════════════════════════════════════════════
  -- COPD
  -- Key: progressive dyspnea + chronic cough + heavy smoking hx
  -- ══════════════════════════════════════════════════════════════
  (c_copd, s_dyspnea,    0.25, 0.15, 0.12, 0.08, -0.05, 0.25, 0.15, 0.03, 0, 0.03, 0, 0, 0.05, 0, 0.30, 0, 0.08, 0, 0.15, 0.05),
  (c_copd, s_cough,      0.25, 0.15, 0.12, 0.08, -0.05, 0.25, 0.15, 0.03, 0, 0.03, 0, 0, 0.05, 0, 0.30, 0, 0.08, 0, 0.15, 0.10),
  (c_copd, s_fatigue,    0.12, 0.08, 0.06, 0.05, -0.02, 0.12, 0.08, 0.02, 0, 0.02, 0, 0, 0.03, 0, 0.15, 0, 0.05, 0, 0.08, 0.03),

  -- ══════════════════════════════════════════════════════════════
  -- ANEMIA
  -- Key: fatigue + dyspnea on exertion + palpitations
  -- ══════════════════════════════════════════════════════════════
  (c_anemia, s_fatigue,      0.25, 0.05, 0.03, -0.05, 0.10, 0.02, 0.01, 0.03, 0, 0.05, 0, 0, 0.05, 0.08, 0.10, 0, 0.05, 0, 0.05, 0.05),
  (c_anemia, s_dyspnea,      0.15, 0.05, 0.03, -0.03, 0.08, 0.02, 0.01, 0.02, 0, 0.05, 0, 0, 0.03, 0.05, 0.08, 0, 0.05, 0, 0.05, 0.03),
  (c_anemia, s_palpitation,  0.12, 0.03, 0.02, -0.02, 0.06, 0.01, 0.01, 0.02, 0, 0.03, 0, 0, 0.03, 0.05, 0.06, 0, 0.03, 0, 0.03, 0.03),
  (c_anemia, s_vertigo,      0.10, 0.03, 0.02, -0.02, 0.06, 0.01, 0.01, 0.01, 0, 0.03, 0, 0, 0.02, 0.05, 0.05, 0, 0.03, 0, 0.03, 0.02),
  (c_anemia, s_headache,     0.08, 0.02, 0.01, -0.01, 0.04, 0.01, 0.01, 0.01, 0, 0.02, 0, 0, 0.02, 0.03, 0.05, 0, 0.03, 0, 0.03, 0.02),

  -- ══════════════════════════════════════════════════════════════
  -- BREAST CANCER
  -- Key: breast lump (covered via EF00 with location modifier)
  -- ══════════════════════════════════════════════════════════════
  (c_ca_breast, s_lump,         0.30, 0.12, 0.08, -0.20, 0.35, 0.03, 0.02, 0.02, 0.02, 0.02, 0, 0, 0.12, 0, 0.15, 0, 0.10, 0, 0.10, 0.03),
  (c_ca_breast, s_fatigue,      0.05, 0.05, 0.03, -0.05, 0.08, 0.01, 0.01, 0.01, 0.01, 0.01, 0, 0, 0.05, 0, 0.08, 0, 0.05, 0, 0.05, 0.02),
  (c_ca_breast, s_weight_loss,  0.08, 0.05, 0.03, -0.05, 0.10, 0.01, 0.01, 0.01, 0.01, 0.01, 0, 0, 0.05, 0, 0.10, 0, 0.05, 0, 0.05, 0.02),

  -- ══════════════════════════════════════════════════════════════
  -- COVID-19
  -- ══════════════════════════════════════════════════════════════
  (c_covid, s_fever,       0.22, -0.03, -0.05, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.15, 0.08, 0.03, 0.08, 0, 0.05),
  (c_covid, s_cough,       0.20, -0.03, -0.05, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.15, 0.08, 0.03, 0.08, 0, 0.05),
  (c_covid, s_dyspnea,     0.15, 0.05, 0.03, 0, 0, 0, 0, 0, 0, 0.03, 0.03, 0, 0.03, -0.10, 0.05, 0.03, 0.10, 0, 0.08),
  (c_covid, s_fatigue,     0.18, -0.02, -0.03, 0, 0, 0, 0, 0, 0, 0.02, 0.02, 0, 0.02, -0.10, 0.08, 0.03, 0.05, 0, 0.05)

  on conflict (condition_id, symptom_id) do nothing;
end $$;

-- ─────────────────────────────────────────────────────────────
-- SOCIAL HISTORY QUESTIONS
-- ─────────────────────────────────────────────────────────────
insert into public.social_history_questions
  (category, question_key, question_th, question_en, input_type, options, depends_on, depends_value, display_order, clinical_weight)
values
-- SMOKING
('smoking','smoking_status',
 'คุณสูบบุหรี่หรือบุหรี่ไฟฟ้าหรือไม่?',
 'Do you currently smoke or vape?',
 'radio','["ไม่เคยสูบเลย","สูบอยู่ในปัจจุบัน","เคยสูบแต่เลิกแล้ว"]',
 null,null,1,
 'cardiovascular_risk, lung_cancer_risk, copd_risk, multiple_cancer_risk'),

('smoking','cigarettes_per_day',
 'สูบวันละกี่มวน (เฉลี่ย)?',
 'How many cigarettes per day on average?',
 'number',null,
 'smoking_status','สูบอยู่ในปัจจุบัน',2,
 'pack_year = (cigs/day ÷ 20) × years_smoked'),

('smoking','years_smoked_current',
 'สูบบุหรี่มานานกี่ปีแล้ว?',
 'For how many years have you been smoking?',
 'number',null,
 'smoking_status','สูบอยู่ในปัจจุบัน',3,
 'pack_year_calculation; ≥20 pack-years = NLST lung cancer screening criteria'),

('smoking','years_smoked_former',
 'เคยสูบมานานกี่ปี?',
 'For how many years did you smoke?',
 'number',null,
 'smoking_status','เคยสูบแต่เลิกแล้ว',4,
 'pack_year_calculation'),

('smoking','cigarettes_per_day_former',
 'ตอนที่สูบ สูบวันละกี่มวน (เฉลี่ย)?',
 'How many cigarettes per day did you smoke on average?',
 'number',null,
 'smoking_status','เคยสูบแต่เลิกแล้ว',5,
 'pack_year_calculation'),

('smoking','quit_years_ago',
 'เลิกสูบมากี่ปีแล้ว?',
 'How many years ago did you quit smoking?',
 'number',null,
 'smoking_status','เคยสูบแต่เลิกแล้ว',6,
 'CVD risk: quit<5y=high, quit5-15y=moderate, quit>15y≈baseline; Lung cancer: quit<15y still elevated'),

-- ALCOHOL — AUDIT-C validated screening
('alcohol','alcohol_status',
 'คุณดื่มเครื่องดื่มแอลกอฮอล์หรือไม่?',
 'Do you drink alcohol?',
 'radio','["ไม่ดื่มเลย","ดื่มอยู่ในปัจจุบัน","เคยดื่มแต่เลิกแล้ว"]',
 null,null,7,
 'liver_disease_risk, head_neck_cancer_risk, breast_cancer_risk, cardiovascular_risk'),

('alcohol','audit_c_frequency',
 'โดยเฉลี่ยดื่มแอลกอฮอล์บ่อยแค่ไหน? (AUDIT-C Q1)',
 'How often do you have a drink containing alcohol? (AUDIT-C Q1)',
 'radio',
 '["ไม่เคยดื่ม","เดือนละครั้งหรือน้อยกว่า","2-4 ครั้งต่อเดือน","2-3 ครั้งต่อสัปดาห์","4 ครั้งขึ้นไปต่อสัปดาห์"]',
 'alcohol_status','ดื่มอยู่ในปัจจุบัน',8,
 'AUDIT-C Q1: score 0,1,2,3,4'),

('alcohol','audit_c_amount',
 'เมื่อดื่ม ปกติดื่มกี่แก้วมาตรฐาน? (1 แก้ว = เบียร์กระป๋อง / ไวน์ 150ml / สุราเดี่ยว 45ml)',
 'How many drinks containing alcohol do you have on a typical day? (AUDIT-C Q2)',
 'radio',
 '["1-2 แก้ว","3-4 แก้ว","5-6 แก้ว","7-9 แก้ว","10 แก้วขึ้นไป"]',
 'alcohol_status','ดื่มอยู่ในปัจจุบัน',9,
 'AUDIT-C Q2: score 0,1,2,3,4'),

('alcohol','audit_c_binge',
 'ใน 1 ปีที่ผ่านมา ดื่มหนัก (≥6 แก้วมาตรฐาน) ในคราวเดียวบ่อยแค่ไหน? (AUDIT-C Q3)',
 'How often do you have ≥6 drinks on one occasion? (AUDIT-C Q3)',
 'radio',
 '["ไม่เคย","น้อยกว่าเดือนละครั้ง","เดือนละครั้ง","สัปดาห์ละครั้ง","ทุกวันหรือเกือบทุกวัน"]',
 'alcohol_status','ดื่มอยู่ในปัจจุบัน',10,
 'AUDIT-C Q3: score 0,1,2,3,4. Total ≥3(F)/≥4(M) = hazardous drinking. Liver cancer risk +'),

('alcohol','years_drinking',
 'ดื่มแอลกอฮอล์เป็นประจำมานานกี่ปี?',
 'How many years have you been drinking regularly?',
 'number',null,
 'alcohol_status','ดื่มอยู่ในปัจจุบัน',11,
 'cumulative_liver_risk; >10 years heavy drinking = cirrhosis risk'),

('alcohol','alcohol_quit_years',
 'เลิกดื่มมากี่ปีแล้ว?',
 'How many years ago did you quit drinking?',
 'number',null,
 'alcohol_status','เคยดื่มแต่เลิกแล้ว',12,
 'liver_recovery: quit>5y = reduced cirrhosis progression'),

-- EXERCISE — WHO Global Action Plan 2022
('exercise','exercise_days',
 'ออกกำลังกายกี่วันต่อสัปดาห์?',
 'How many days per week do you do moderate-intensity exercise?',
 'radio',
 '["ไม่ออกกำลังกายเลย","1-2 วัน","3-4 วัน","5 วันขึ้นไป"]',
 null,null,13,
 'CVD protective, T2DM protective, cancer protective. WHO guideline: ≥150 min/week moderate'),

('exercise','exercise_minutes',
 'แต่ละครั้งออกกำลังกายนานแค่ไหน?',
 'How long is each exercise session?',
 'radio',
 '["น้อยกว่า 20 นาที","20-30 นาที","30-60 นาที","มากกว่า 1 ชั่วโมง"]',
 'exercise_days',null,14,
 'WHO target: ≥150 min/week = cardiovascular_protective, diabetes_risk -30%'),

-- DIET
('diet','vegetable_servings',
 'กินผักและผลไม้รวมกันวันละกี่ส่วน? (1 ส่วน = ผักสด/สุก 80g หรือผลไม้ 1 ชิ้น)',
 'How many servings of vegetables and fruits do you eat per day?',
 'radio',
 '["0-1 ส่วน","2-3 ส่วน","4-5 ส่วน","มากกว่า 5 ส่วน"]',
 null,null,15,
 'cancer_protective, cardiovascular_protective. WHO: ≥5 servings/day'),

('diet','red_meat_per_week',
 'กินเนื้อแดงแปรรูป (ไส้กรอก หมูยอ เนื้อเค็ม แฮม) บ่อยแค่ไหน?',
 'How often do you eat processed red meat (sausage, salted meat, ham)?',
 'radio',
 '["แทบไม่กิน","1-2 ครั้ง/สัปดาห์","3-5 ครั้ง/สัปดาห์","ทุกวัน"]',
 null,null,16,
 'IARC Group 1 carcinogen: colorectal_cancer_risk +18% per 50g/day processed meat'),

('diet','sugary_drinks',
 'ดื่มเครื่องดื่มหวาน (น้ำอัดลม ชาเย็น กาแฟเย็น) บ่อยแค่ไหน?',
 'How often do you drink sugar-sweetened beverages?',
 'radio',
 '["แทบไม่ดื่ม","2-3 ครั้ง/สัปดาห์","1 ครั้ง/วัน","2 ครั้งขึ้นไป/วัน"]',
 null,null,17,
 'T2DM_risk, obesity_risk, cardiovascular_risk')

on conflict (question_key) do nothing;

-- ─────────────────────────────────────────────────────────────
-- RISK TOOLS SEED
-- ─────────────────────────────────────────────────────────────
insert into public.risk_tools
  (tool_key, name_th, name_en, description_th, target_condition,
   validated_population, reference_guideline, questions, scoring_logic, interpretation)
values

('audit_c',
 'AUDIT-C แบบประเมินการดื่มแอลกอฮอล์',
 'AUDIT-C Alcohol Screening',
 'แบบประเมิน 3 คำถามมาตรฐานสากลสำหรับคัดกรองการดื่มแอลกอฮอล์ในระดับอันตราย',
 'alcohol',
 'ผ่านการรับรองในหลายประเทศ รวมถึงประชากรเอเชีย',
 'Babor TF et al, WHO 2001; Bush K et al, Arch Intern Med 1998',
 '[{"key":"q1","q_th":"โดยเฉลี่ยดื่มแอลกอฮอล์บ่อยแค่ไหน?","options":["ไม่เคยดื่ม=0","เดือนละครั้งหรือน้อยกว่า=1","2-4 ครั้ง/เดือน=2","2-3 ครั้ง/สัปดาห์=3","4+ ครั้ง/สัปดาห์=4"]},{"key":"q2","q_th":"ดื่มกี่แก้วมาตรฐานต่อวัน?","options":["1-2=0","3-4=1","5-6=2","7-9=3","10+=4"]},{"key":"q3","q_th":"ดื่มหนัก ≥6 แก้วในคราวเดียวบ่อยแค่ไหน?","options":["ไม่เคย=0","น้อยกว่าเดือนละครั้ง=1","เดือนละครั้ง=2","สัปดาห์ละครั้ง=3","ทุกวัน=4"]}]',
 '{"formula":"sum_of_q1_q2_q3","max_score":12}',
 '{"male":{"low":"0-3","hazardous":"4-12"},"female":{"low":"0-2","hazardous":"3-12"},"notes":"Score ≥4(ชาย) ≥3(หญิง) = Positive screen for hazardous drinking"}'),

('phq9',
 'PHQ-9 แบบประเมินโรคซึมเศร้า',
 'Patient Health Questionnaire-9',
 'แบบประเมิน 9 คำถามมาตรฐานสากลสำหรับคัดกรองและติดตามอาการซึมเศร้า',
 'depression',
 'ผ่านการทดสอบในประชากรไทยและเอเชียตะวันออกเฉียงใต้',
 'Kroenke K et al, J Gen Intern Med 2001; Thai version validated Lotrakul M 2008',
 '[{"key":"q1","q_th":"รู้สึกไม่สนุกหรือสนใจทำสิ่งต่างๆ น้อยลง"},{"key":"q2","q_th":"รู้สึกเศร้า ท้อแท้ สิ้นหวัง"},{"key":"q3","q_th":"นอนหลับยาก หรือนอนมากเกินไป"},{"key":"q4","q_th":"รู้สึกเหนื่อยล้าหรือไม่มีแรง"},{"key":"q5","q_th":"ไม่อยากอาหาร หรือกินมากเกินไป"},{"key":"q6","q_th":"รู้สึกแย่กับตัวเอง หรือรู้สึกว่าตัวเองล้มเหลว"},{"key":"q7","q_th":"สมาธิไม่ดี ไม่สามารถจดจ่อกับสิ่งต่างๆ"},{"key":"q8","q_th":"เคลื่อนไหวหรือพูดช้ากว่าปกติ หรือกระสับกระส่ายผิดปกติ"},{"key":"q9","q_th":"คิดว่าตนเองไม่อยากมีชีวิตอยู่ หรืออยากทำร้ายตัวเอง"}]',
 '{"scale":"0=ไม่เลย, 1=วันที่ 2-3, 2=มากกว่าครึ่งของวัน, 3=เกือบทุกวัน","max_score":27,"note":"Q9>0 requires immediate safety assessment"}',
 '{"ranges":{"1-4":"ซึมเศร้าน้อยมาก","5-9":"ซึมเศร้าน้อย","10-14":"ซึมเศร้าปานกลาง","15-19":"ซึมเศร้าค่อนข้างมาก","20-27":"ซึมเศร้ามาก"},"cutoff_for_mdd":10}'),

('gad7',
 'GAD-7 แบบประเมินโรควิตกกังวล',
 'Generalized Anxiety Disorder Scale-7',
 'แบบประเมิน 7 คำถามมาตรฐานสากลสำหรับคัดกรองโรควิตกกังวล',
 'anxiety',
 'ผ่านการทดสอบในประชากรทั่วไป',
 'Spitzer RL et al, Arch Intern Med 2006',
 '[{"key":"q1","q_th":"รู้สึกประหม่า วิตกกังวล หรือตึงเครียด"},{"key":"q2","q_th":"ไม่สามารถหยุดหรือควบคุมความกังวลได้"},{"key":"q3","q_th":"กังวลมากเกินไปกับเรื่องต่างๆ"},{"key":"q4","q_th":"ผ่อนคลายได้ยาก"},{"key":"q5","q_th":"นั่งอยู่นิ่งๆ ไม่ได้"},{"key":"q6","q_th":"หงุดหงิดหรือรู้สึกขุ่นเคืองง่าย"},{"key":"q7","q_th":"รู้สึกกลัวว่าจะเกิดเรื่องร้ายๆ ขึ้น"}]',
 '{"scale":"0=ไม่เลย, 1=วันที่ 2-3, 2=มากกว่าครึ่งของวัน, 3=เกือบทุกวัน","max_score":21}',
 '{"ranges":{"0-4":"วิตกกังวลน้อยมาก","5-9":"วิตกกังวลน้อย","10-14":"วิตกกังวลปานกลาง","15-21":"วิตกกังวลมาก"},"cutoff_for_gad":10}')

on conflict (tool_key) do nothing;
