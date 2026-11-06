const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.post('/api/generate-web', async (req, res) => {
    const { prompt, features } = req.body;

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ 
            success: false, 
            message: 'ไม่พบ OPENAI_API_KEY ในไฟล์ .env กรุณาตรวจสอบและตั้งค่าก่อนใช้งาน!' 
        });
    }

    const systemInstruction = `คุณคือผู้เชี่ยวชาญด้านการเขียนเว็บ Full Frontend Developer
    หน้าที่ของคุณคือสร้างหน้าเว็บแบบแยกไฟล์อย่างเป็นระบบให้กับผู้ใช้งาน โดยต้องตอบกลับเป็นข้อมูล JSON รูปแบบเดียวเท่านั้น ห้ามตอบเป็นคำพูดอธิบายอื่นเด็ดขาด
    
    รูปแบบ JSON ที่คุณต้องส่งกลับมา:
    {
      "html": "โค้ดในไฟล์ index.html ทั้งหมด (ต้องมีส่วนหัว !DOCTYPE, html, head, body ครบถ้วน และต้องลิงก์ <link rel='stylesheet' href='css/style.css'> และ <script src='js/script.js'></script> ไว้ด้วย)",
      "css": "โค้ดตกแต่งเพิ่มเติมในไฟล์ style.css โดยหน้าเว็บหลักจะรองรับ Tailwind CSS อยู่แล้ว ให้เสริมดีไซน์เพิ่มเติม คลาส แอนิเมชัน หรือโทนสีเฉพาะตัวที่นี่",
      "js": "โค้ด JavaScript สำหรับลูกเล่น ความเคลื่อนไหว หรือปุ่มกดโต้ตอบในไฟล์ script.js"
    }
    
    ข้อบังคับที่ต้องยึดตามที่ผู้ใช้ติ๊กเลือก:
    - แถบเมนูด้านบน (Navbar): ${features.navbar ? 'ต้องเขียนใส่มาใน HTML' : 'ไม่ต้องมี'}
    - แบนเนอร์หน้าแรก (Hero Section): ${features.hero ? 'ต้องเขียนใส่มาใน HTML พร้อมปุ่มกดที่โดดเด่นสะดุดตา' : 'ไม่ต้องมี'}
    - ฟอร์มติดต่อเรา (Contact Form): ${features.contactForm ? 'ต้องสร้างฟอร์มกรอกสวยงามพร้อมระบบตรวจจับการกดส่งด้วย JS' : 'ไม่ต้องมี'}
    - แถบข้อมูลด้านล่าง (Footer): ${features.footer ? 'ต้องเขียนใส่มา in HTML มีเครดิตและไอคอนทางสังคมออนไลน์' : 'ไม่ต้องมี'}

    สำคัญที่สุด: ใช้ Tailwind CSS สำหรับโครงสร้างหลัก และเขียนโค้ดแต่ละไฟล์ให้สมบูรณ์พร้อมทำงานร่วมกันทันที ห้ามส่งข้อความหรือมาร์กดาวน์นอกเหนือจาก JSON ก้อนนี้`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                response_format: { type: "json_object" },
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: `จงทำตามเงื่อนไขและสร้างเว็บไซต์ตามความต้องการภาษาไทยนี้: ${prompt}` }
                ],
                temperature: 0.2
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            const rawJsonString = data.choices[0].message.content.trim();
            const parsedFiles = JSON.parse(rawJsonString);
            
            res.json({ 
                success: true, 
                files: {
                    html: parsedFiles.html,
                    css: parsedFiles.css,
                    js: parsedFiles.js
                }
            });
        } else {
            res.status(500).json({ success: false, message: 'AI ไม่สามารถแปลงข้อมูลโครงสร้างไฟล์ได้', detail: data });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดภายในระบบหลังบ้าน หรือคีย์ OpenAI ผิดพลาด' });
    }
});

app.listen(PORT, () => {
    console.log(`[SUCCESS] AI WebCrafter Server runs at http://localhost:${PORT}`);
});
