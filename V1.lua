-- =================================================================
-- 🚀 MULTI-SCRIPT CONCURRENT RUNNER (EXECUTE ALL 4 SCRIPTS) 🚀
-- =================================================================

-- ลิงก์สคริปต์ทั้ง 4 ตัวของคุณ
local scripts = {
    "https://raw.githubusercontent.com/ppplllooo492-art/ppplllooo492-gmail.com/refs/heads/main/FGJ.V99.lua",
    "https://raw.githubusercontent.com/ppplllooo492-art/ppplllooo492-gmail.com/refs/heads/main/FG.lua",
    "https://raw.githubusercontent.com/ppplllooo492-art/ppplllooo492-gmail.com/refs/heads/main/ML.lua",
    "https://raw.githubusercontent.com/ppplllooo492-art/GG/refs/heads/temp/V18.%25L.lua"
}

-- วนลูปและรันสคริปต์พร้อมกันแบบแยก Thread (ไม่บล็อกกันเอง)
for index, url in ipairs(scripts) do
    task.spawn(function()
        local success, err = pcall(function()
            local scriptContent = game:HttpGet(url)
            loadstring(scriptContent)()
        end)
        
        if success then
            print("[Success]: สคริปต์ตัวที่ " .. index .. " ทำงานแล้ว")
        else
            warn("[Error]: สคริปต์ตัวที่ " .. index .. " โหลดไม่สำเร็จเนื่องจาก: " .. tostring(err))
        end
    end)
end
