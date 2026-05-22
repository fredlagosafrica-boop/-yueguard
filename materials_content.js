// ============ chunks/materials_content.js ============
// 一级分类4：素材资料库（现有内容，已在网站上）
// 保留原有结构：3.1公众号 / 3.2小红书 / 3.3图片 / 3.4综合

contentData.categories.push({
  id: '素材',
  name: '🖼️ 素材资料库',
  subtitle: '内容创作素材汇总',
  children: [
    {
      id: 'content01',
      name: '3.1 公众号题材',
      children: [
        { id: 'content01a', title: '3.1.1 2025年', content: '<h2>3.1.1 2025年公众号题材</h2><p>内容待补充...</p>' },
        { id: 'content01b', title: '3.1.2 2026年', content: '<h2>3.1.2 2026年公众号题材</h2><p>内容待补充...</p>' },
        { id: 'content01c', title: '3.1.3 2027年', content: '<h2>3.1.3 2027年公众号题材</h2><p>内容待补充...</p>' }
      ]
    },
    {
      id: 'content02',
      name: '3.2 小红书题材',
      children: [
        { id: 'content02a', title: '3.2.1 2025年', content: '<h2>3.2.1 2025年小红书题材</h2><p>内容待补充...</p>' },
        { id: 'content02b', title: '3.2.2 2026年', content: '<h2>3.2.2 2026年小红书题材</h2><p>内容待补充...</p>' },
        { id: 'content02c', title: '3.2.3 2027年', content: '<h2>3.2.3 2027年小红书题材</h2><p>内容待补充...</p>' }
      ]
    },
    {
      id: 'content03',
      name: '3.3 图片题材',
      children: [
        { id: 'content03a', title: '3.3.1 2025年', content: '<h2>3.3.1 2025年图片题材</h2><p>内容待补充...</p>' },
        { id: 'content03b', title: '3.3.2 2026年', content: '<h2>3.3.2 2026年图片题材</h2><p>内容待补充...</p>' },
        { id: 'content03c', title: '3.3.3 2027年', content: '<h2>3.3.3 2027年图片题材</h2><p>内容待补充...</p>' }
      ]
    },
    {
      id: 'content04',
      name: '3.4 综合题材',
      children: [
        { id: 'content04a', title: '3.4.1 2025年', content: '<h2>3.4.1 2025年综合题材</h2><p>内容待补充...</p>' },
        { id: 'content04b', title: '3.4.2 2026年', content: '<h2>3.4.2 2026年综合题材</h2><p>内容待补充...</p>' },
        { id: 'content04c', title: '3.4.3 2027年', content: '<h2>3.4.3 2027年综合题材</h2><p>内容待补充...</p>' }
      ]
    },
    {
      id: 'content05',
      name: '3.5 APP下载指引',
      children: [
        { 
          id: 'content05a', 
          title: 'LifeBee APP 操作说明', 
          content: '<h2>LifeBee APP 操作说明</h2><p>恒玥团队专用APP操作指引文档，支持团队日常业务管理。</p><p style="margin-top:20px;"><a href="assets/LifeBee_APP操作説明.pdf" target="_blank" style="display:inline-block;background:#c9a84c;color:#0a1628;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:bold;">📥 下载PDF完整版</a></p><p style="margin-top:15px;color:#888;font-size:14px;">文件大小：9.4MB，共33页</p>' 
        }
      ]
    },
    {
      id: 'content06',
      name: '3.6 ZUU直营新人行政手册',
      children: [
        { 
          id: 'content06a', 
          title: 'ZUU直营新人行政手册', 
          content: '<h2>ZUU直营新人行政手册</h2><p>ZUU直营新人入职行政手册，包含入职流程、行政指引及日常操作规范。</p><p style="margin-top:20px;"><a href="assets/ZUU直营新人行政手册.pdf" target="_blank" style="display:inline-block;background:#c9a84c;color:#0a1628;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:bold;">📥 下载PDF完整版</a></p><p style="margin-top:15px;color:#888;font-size:14px;">文件大小：15MB</p>' 
        }
      ]
    }
  ]
});

onChunkLoaded();
