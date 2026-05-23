// ============ IFA内容库 - 分块架构（逐层返回修复版 v2）============
// 匹配 index.html 结构：navArea/categoryGrid/contentArea/detailArea
// ─────────────────────────────────────────────

const contentData = { categories: [] };

let loadedChunks = 0;
const totalChunks = 7;

// 视图堆栈：追踪完整导航路径
// 每个条目: { view: 'home'|'category'|'child'|'doc', catId, childId, itemId }
let viewStack = [{ view: 'home' }];

function onChunkLoaded() {
  loadedChunks++;
  if (loadedChunks >= totalChunks) {
    renderCategories();
  }
}

// ─── 动态加载 content chunks（根目录，无chunks/前缀）────
var scripts = [
  'ifa_content.js?v=2026052355',
  'wiki_content.js?v=2026052301',
  'sales_content.js?v=2026052403',
  'referral_content.js?v=20260516',
  'materials_content.js?v=20260516',
  'chatbot_content.js?v=20260516',
  'biyuan_content.js?v=2026052301',
  's_2_1_1_x_一对一沟通补充_s2_038.js?v=05232045',
  's_2_1_1_x_七项核心内容缺一不可_s2_103.js?v=05232045',
  's_2_1_1_x_专业术语转化_s2_109.js?v=05232045',
  's_2_1_1_x_两地分居跨境家庭客群_s2_007.js?v=05232045',
  's_2_1_1_x_严格禁止回佣返佣利益输送_s2_026.js?v=05232045',
  's_2_1_1_x_个人专业资质背书核心必备_s2_053.js?v=05232045',
  's_2_1_1_x_中年提前养老规划客群_s2_019.js?v=05232045',
  's_2_1_1_x_互动答疑_s2_114.js?v=05232045',
  's_2_1_1_x_互动答疑话术_s2_123.js?v=05232045',
  's_2_1_1_x_从业身份合规边界_s2_024.js?v=05232045',
  's_2_1_1_x_价值输出_s2_061.js?v=05232045',
  's_2_1_1_x_企业主家业传承客群_s2_001.js?v=05232045',
  's_2_1_1_x_低龄本科留学规划客群_s2_011.js?v=05232045',
  's_2_1_1_x_保守型理财置换客群_s2_021.js?v=05232045',
  's_2_1_1_x_保费合规提示话术_s2_122.js?v=05232045',
  's_2_1_1_x_保费适配技巧_s2_118.js?v=05232045',
  's_2_1_1_x_信息分类归档_s2_040.js?v=05232045',
  's_2_1_1_x_候鸟式跨境养老客群_s2_015.js?v=05232045',
  's_2_1_1_x_借力权威_s2_130.js?v=05232045',
  's_2_1_1_x_全家移民前置规划客群_s2_013.js?v=05232045',
  's_2_1_1_x_内地定居配置港险跨境客群_s2_006.js?v=05232045',
  's_2_1_1_x_内容定位_s2_068.js?v=05232045',
  's_2_1_1_x_再婚重组家庭_s2_002.js?v=05232045',
  's_2_1_1_x_分客群港险产品对比表精准匹配一_s2_043.js?v=05232045',
  's_2_1_1_x_匹配目标_s2_090.js?v=05232045',
  's_2_1_1_x_及时止损_s2_131.js?v=05232045',
  's_2_1_1_x_合规底线_s2_126.js?v=05232045',
  's_2_1_1_x_合规披露话术_s2_121.js?v=05232045',
  's_2_1_1_x_合规提示话术_s2_101.js?v=05232045',
  's_2_1_1_x_合规注意_s2_039.js?v=05232045',
  's_2_1_1_x_合规要点类_s2_069.js?v=05232045',
  's_2_1_1_x_告知原则_s2_092.js?v=05232045',
  's_2_1_1_x_售后与续期合规_s2_029.js?v=05232045',
  's_2_1_1_x_团队服务优势背书差异化竞争力_s2_054.js?v=05232045',
  's_2_1_1_x_基础职业信息_s2_031.js?v=05232045',
  's_2_1_1_x_处理逻辑_s2_125.js?v=05232045',
  's_2_1_1_x_多币种配置话术_s2_099.js?v=05232045',
  's_2_1_1_x_如实告知义务合规核保最大诚信原_s2_027.js?v=05232045',
  's_2_1_1_x_子女定居海外父母养老客群_s2_014.js?v=05232045',
  's_2_1_1_x_子女教育储备中产客群_s2_018.js?v=05232045',
  's_2_1_1_x_官方核心合规提示原文摘录解读_s2_051.js?v=05232045',
  's_2_1_1_x_官方核验与投诉渠道权威指引_s2_052.js?v=05232045',
  's_2_1_1_x_官方核验路径与操作_s2_023.js?v=05232045',
  's_2_1_1_x_实操类_s2_071.js?v=05232045',
  's_2_1_1_x_客户确认_s2_112.js?v=05232045',
  's_2_1_1_x_客群痛点分析_s2_062.js?v=05232045',
  's_2_1_1_x_客群需求二次确认_s2_102.js?v=05232045',
  's_2_1_1_x_宣传与推广合规红线_s2_028.js?v=05232045',
  's_2_1_1_x_家庭结构信息_s2_033.js?v=05232045',
  's_2_1_1_x_对香港保险的认知程度_s2_035.js?v=05232045',
  's_2_1_1_x_工薪白领稳健储蓄客群_s2_016.js?v=05232045',
  's_2_1_1_x_差异化切入_s2_095.js?v=05232045',
  's_2_1_1_x_差异化解答_s2_129.js?v=05232045',
  's_2_1_1_x_建立专业信任_s2_077.js?v=05232045',
  's_2_1_1_x_开放式提问话术_s2_097.js?v=05232045',
  's_2_1_1_x_异议1香港保险理赔麻烦跨境维权_s2_132.js?v=05232045',
  's_2_1_1_x_异议2分红不确定担心收益达不到_s2_133.js?v=05232045',
  's_2_1_1_x_异议3赴港投保太麻烦能不能在内_s2_134.js?v=05232045',
  's_2_1_1_x_异议4内地每人每年只有5万美金_s2_135.js?v=05232045',
  's_2_1_1_x_异议5香港保险和内地保险比优势_s2_136.js?v=05232045',
  's_2_1_1_x_异议6担心你没有持牌资质或者香_s2_137.js?v=05232045',
  's_2_1_1_x_异议7中介给我承诺返佣你这里没_s2_138.js?v=05232045',
  's_2_1_1_x_异议分类_s2_124.js?v=05232045',
  's_2_1_1_x_引导方式_s2_067.js?v=05232045',
  's_2_1_1_x_引流引导_s2_072.js?v=05232045',
  's_2_1_1_x_意向筛选_s2_064.js?v=05232045',
  's_2_1_1_x_房贷车贷负债中产客群_s2_017.js?v=05232045',
  's_2_1_1_x_投保前期准备合规前置避免遗漏_s2_044.js?v=05232045',
  's_2_1_1_x_投保合规禁忌红线不可触碰_s2_046.js?v=05232045',
  's_2_1_1_x_投保后期跟进合规收尾降低纠纷_s2_045.js?v=05232045',
  's_2_1_1_x_拆解逻辑_s2_084.js?v=05232045',
  's_2_1_1_x_持牌资质硬性要求_s2_022.js?v=05232045',
  's_2_1_1_x_提问逻辑_s2_093.js?v=05232045',
  's_2_1_1_x_收益与风险专项讲解_s2_110.js?v=05232045',
  's_2_1_1_x_收益及风险披露话术_s2_120.js?v=05232045',
  's_2_1_1_x_方案优化_s2_104.js?v=05232045',
  's_2_1_1_x_方案呈现技巧_s2_115.js?v=05232045',
  's_2_1_1_x_方案自查_s2_105.js?v=05232045',
  's_2_1_1_x_方案讲解话术_s2_119.js?v=05232045',
  's_2_1_1_x_普通客群渠道_s2_057.js?v=05232045',
  's_2_1_1_x_术语转化技巧_s2_116.js?v=05232045',
  's_2_1_1_x_核心内容逐项讲解_s2_111.js?v=05232045',
  's_2_1_1_x_核心禁忌_s2_058.js?v=05232045',
  's_2_1_1_x_核心要点_s2_081.js?v=05232045',
  's_2_1_1_x_核心需求_s2_087.js?v=05232045',
  's_2_1_1_x_核心需求痛点_s2_034.js?v=05232045',
  's_2_1_1_x_案例1少儿重疾理赔三口之家客群_s2_047.js?v=05232045',
  's_2_1_1_x_案例2全球医疗理赔跨境留学客群_s2_048.js?v=05232045',
  's_2_1_1_x_案例3储蓄分红保单领取养老规划_s2_049.js?v=05232045',
  's_2_1_1_x_案例4非标体理赔健康异常客群_s2_050.js?v=05232045',
  's_2_1_1_x_案例分享_s2_060.js?v=05232045',
  's_2_1_1_x_案例支撑技巧_s2_117.js?v=05232045',
  's_2_1_1_x_次要需求_s2_088.js?v=05232045',
  's_2_1_1_x_沟通切入方式_s2_063.js?v=05232045',
  's_2_1_1_x_沟通原则_s2_085.js?v=05232045',
  's_2_1_1_x_海外华侨侨眷客群_s2_009.js?v=05232045',
  's_2_1_1_x_港人在内地生活安居客群_s2_008.js?v=05232045',
  's_2_1_1_x_潜在需求_s2_089.js?v=05232045',
  's_2_1_1_x_留存证据_s2_127.js?v=05232045',
  's_2_1_1_x_痛点共鸣_s2_094.js?v=05232045',
  's_2_1_1_x_痛点共鸣话术_s2_098.js?v=05232045',
  's_2_1_1_x_硕博高端留学客群_s2_012.js?v=05232045',
  's_2_1_1_x_禁止行为_s2_083.js?v=05232045',
  's_2_1_1_x_第一步重申客户痛点_s2_106.js?v=05232045',
  's_2_1_1_x_第三步产品优势提炼_s2_108.js?v=05232045',
  's_2_1_1_x_第二步分方案讲解_s2_107.js?v=05232045',
  's_2_1_1_x_线上调研首选_s2_037.js?v=05232045',
  's_2_1_1_x_背书资料使用注意事项_s2_055.js?v=05232045',
  's_2_1_1_x_自由职业个体户中产客群_s2_020.js?v=05232045',
  's_2_1_1_x_规则传递_s2_066.js?v=05232045',
  's_2_1_1_x_规避盲目推介_s2_041.js?v=05232045',
  's_2_1_1_x_诚信合规底线_s2_096.js?v=05232045',
  's_2_1_1_x_误区1纠正无需赴港可投保_s2_074.js?v=05232045',
  's_2_1_1_x_误区2纠正香港保险分红必达_s2_075.js?v=05232045',
  's_2_1_1_x_误区3纠正香港保险理赔很难_s2_076.js?v=05232045',
  's_2_1_1_x_调研合规注意事项_s2_042.js?v=05232045',
  's_2_1_1_x_财富传承高净值话术_s2_100.js?v=05232045',
  's_2_1_1_x_资产规模信息_s2_032.js?v=05232045',
  's_2_1_1_x_资料留存_s2_113.js?v=05232045',
  's_2_1_1_x_资质披露_s2_059.js?v=05232045',
  's_2_1_1_x_赴港投保硬性合规要求缺一不可_s2_025.js?v=05232045',
  's_2_1_1_x_跟进时机_s2_065.js?v=05232045',
  's_2_1_1_x_跨境婚姻家庭客群_s2_010.js?v=05232045',
  's_2_1_1_x_跨境需求情况_s2_036.js?v=05232045',
  's_2_1_1_x_转介绍触达_s2_079.js?v=05232045',
  's_2_1_1_x_违规操作负面后果_s2_030.js?v=05232045',
  's_2_1_1_x_适配感知_s2_086.js?v=05232045',
  's_2_1_1_x_避免急于推销_s2_073.js?v=05232045',
  's_2_1_1_x_避免硬反驳_s2_128.js?v=05232045',
  's_2_1_1_x_避坑类_s2_070.js?v=05232045',
  's_2_1_1_x_陌生触达_s2_078.js?v=05232045',
  's_2_1_1_x_隐性需求挖掘_s2_082.js?v=05232045',
  's_2_1_1_x_隔代祖辈赠与_s2_003.js?v=05232045',
  's_2_1_1_x_隔代祖辈赠与传承客群_s2_004.js?v=05232045',
  's_2_1_1_x_风险告知_s2_091.js?v=05232045',
  's_2_1_1_x_风险提示触达_s2_080.js?v=05232045',
  's_2_1_1_x_高净值客群渠道_s2_056.js?v=05232045',
  's_2_1_1_x_高知专业人士传承客群_s2_005.js?v=05232045',
];

function loadScript(i) {
  if (i >= scripts.length) {
    renderCategories();
    return;
  }
  var script = document.createElement('script');
  script.src = scripts[i];
  script.onload = function() { loadScript(i + 1); };
  script.onerror = function() { console.error('Failed to load: ' + scripts[i]); loadScript(i + 1); };
  document.head.appendChild(script);
}

loadScript(0);

// ─── 搜索功能 ───
var lastSearchKeyword = ''; // 记录最近搜索关键词，用于内容高亮

function handleSearch(keyword) {
  var resultsContainer = document.getElementById('searchResults');
  if (!resultsContainer) return;
  
  if (!keyword || keyword.trim().length < 1) {
    resultsContainer.classList.remove('active');
    return;
  }
  
  keyword = keyword.trim().toLowerCase();
  lastSearchKeyword = keyword; // 记录关键词
  var results = [];
  
  // 遍历所有分类、子类、内容项进行搜索
  if (!contentData || !contentData.categories || contentData.categories.length === 0) {
    resultsContainer.innerHTML = '<div class="search-no-result">内容加载中，请稍候...</div>';
    resultsContainer.classList.add('active');
    return;
  }
  
  contentData.categories.forEach(function(cat) {
    // 匹配分类名
    if (cat.name && cat.name.toLowerCase().includes(keyword)) {
      results.push({ type: 'category', cat: cat.name, catId: cat.id, title: cat.name, item: cat });
    }
    // 匹配子类
    if (cat.children) {
      cat.children.forEach(function(child) {
        if (child.name && child.name.toLowerCase().includes(keyword)) {
          results.push({ type: 'child', cat: cat.name, title: child.name, item: child, catId: cat.id });
        }
        // 匹配直接挂在 child 下的 items（如 flat 类内容库）
        if (child.items) {
          child.items.forEach(function(it) {
            var matchTitle = it.name && it.name.toLowerCase().includes(keyword);
            var matchContent = it.content && it.content.toLowerCase().includes(keyword);
            if (matchTitle || matchContent) {
              results.push({ type: 'item', cat: cat.name, title: it.name || it.title || '未命名', item: it, catId: cat.id, childId: child.id, matchContent: matchContent ? it.content : null });
            }
          });
        }
        // 匹配子子分类 child.children（递归查到底）
        if (child.children) {
          child.children.forEach(function(sub) {
            var matchTitle = sub.name && sub.name.toLowerCase().includes(keyword);
            var matchContent = sub.content && sub.content.toLowerCase().includes(keyword);
            if (matchTitle || matchContent) {
              results.push({ type: 'item', cat: cat.name, title: sub.name || sub.title || '未命名', item: sub, catId: cat.id, childId: child.id, matchContent: matchContent ? sub.content : null });
            }
            // 递归：sub 也可能有 items 或更深层 children
            if (sub.items) {
              sub.items.forEach(function(it) {
                var mT = it.name && it.name.toLowerCase().includes(keyword);
                var mC = it.content && it.content.toLowerCase().includes(keyword);
                if (mT || mC) {
                  results.push({ type: 'item', cat: cat.name, title: it.name || it.title || '未命名', item: it, catId: cat.id, childId: child.id, matchContent: mC ? it.content : null });
                }
              });
            }
            if (sub.children) {
              sub.children.forEach(function(sub2) {
                var mT2 = sub2.name && sub2.name.toLowerCase().includes(keyword);
                var mC2 = sub2.content && sub2.content.toLowerCase().includes(keyword);
                if (mT2 || mC2) {
                  results.push({ type: 'item', cat: cat.name, title: sub2.name || sub2.title || '未命名', item: sub2, catId: cat.id, childId: child.id, matchContent: mC2 ? sub2.content : null });
                }
                // 第四层
                if (sub2.items) {
                  sub2.items.forEach(function(it2) {
                    var mT3 = it2.name && it2.name.toLowerCase().includes(keyword);
                    var mC3 = it2.content && it2.content.toLowerCase().includes(keyword);
                    if (mT3 || mC3) {
                      results.push({ type: 'item', cat: cat.name, title: it2.name || it2.title || '未命名', item: it2, catId: cat.id, childId: child.id, matchContent: mC3 ? it2.content : null });
                    }
                  });
                }
                if (sub2.children) {
                  sub2.children.forEach(function(sub3) {
                    var mT3 = sub3.name && sub3.name.toLowerCase().includes(keyword);
                    var mC3 = sub3.content && sub3.content.toLowerCase().includes(keyword);
                    if (mT3 || mC3) {
                      results.push({ type: 'item', cat: cat.name, title: sub3.name || sub3.title || '未命名', item: sub3, catId: cat.id, childId: child.id, matchContent: mC3 ? sub3.content : null });
                    }
                    // 第五层（安全兜底）
                    if (sub3.items) {
                      sub3.items.forEach(function(it3) {
                        var mT4 = it3.name && it3.name.toLowerCase().includes(keyword);
                        var mC4 = it3.content && it3.content.toLowerCase().includes(keyword);
                        if (mT4 || mC4) {
                          results.push({ type: 'item', cat: cat.name, title: it3.name || it3.title || '未命名', item: it3, catId: cat.id, childId: child.id, matchContent: mC4 ? it3.content : null });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
  
  // 渲染结果
  if (results.length === 0) {
    resultsContainer.innerHTML = '<div class="search-no-result">未找到相关内容</div>';
  } else {
    resultsContainer.innerHTML = results.slice(0, 20).map(function(r) {
      // 提取内容匹配片段
      var snippet = '';
      if (r.type === 'item' && r.matchContent) {
        var plain = r.matchContent.replace(/<[^>]+>/g, ''); // 去掉HTML标签
        var idx = plain.toLowerCase().indexOf(keyword);
        if (idx > -1) {
          var start = Math.max(0, idx - 15);
          var end = Math.min(plain.length, idx + keyword.length + 20);
          snippet = '...' + plain.slice(start, end) + '...';
          snippet = snippet.replace(new RegExp(keyword, 'gi'), '<mark>$&</mark>');
        }
      }
      return '<div class="search-result-item" data-type="' + r.type + '" data-cat="' + (r.catId || '') + '" data-child="' + (r.childId || '') + '" data-itemid="' + (r.item.id || '') + '" data-title="' + encodeURIComponent(r.title) + '">' +
        '<div class="result-cat">' + r.cat + ' ' + (r.type === 'category' ? '(分类)' : r.type === 'child' ? '(子分类)' : '(内容)') + '</div>' +
        '<div class="result-title">' + r.title + '</div>' +
        (snippet ? '<div class="result-snippet">' + snippet + '</div>' : '') + '</div>';
    }).join('');
  }
  
  resultsContainer.classList.add('active');
  
  // 绑定点击事件（事件委托）
  resultsContainer.querySelectorAll('.search-result-item').forEach(function(el) {
    el.onclick = function() {
      var type = this.getAttribute('data-type');
      var catId = this.getAttribute('data-cat');
      var childId = this.getAttribute('data-child');
      var itemId = this.getAttribute('data-itemid');
      var title = decodeURIComponent(this.getAttribute('data-title'));
      openSearchResult(type, catId, childId, title, itemId);
    };
  });
}

function openSearchResult(type, catId, childId, title, itemId) {
  var resultsContainer = document.getElementById('searchResults');
  if (resultsContainer) resultsContainer.classList.remove('active');
  document.getElementById('searchInput').value = '';
  
  if (type === 'category') {
    var cat = catId ? contentData.categories.find(function(c) { return c.id === catId; }) : null;
    if (!cat) cat = contentData.categories.find(function(c) { return c.name === title; });
    if (cat) showCategory(cat);
  } else if (type === 'child') {
    var cat = contentData.categories.find(function(c) { return c.id === catId; });
    if (cat) {
      var child = cat.children.find(function(c) { return c.name === title; });
      if (child) showChild(cat, child);
    }
  } else if (type === 'item') {
    // 搜索结果点击 → 直接用 itemId 跳转到文章页
    if (itemId) {
      showDoc(catId, childId, itemId);
    }
  }
}

// 点击空白处关闭搜索结果
document.addEventListener('click', function(e) {
  var searchBox = document.getElementById('searchBox');
  var resultsContainer = document.getElementById('searchResults');
  if (searchBox && !searchBox.contains(e.target)) {
    if (resultsContainer) resultsContainer.classList.remove('active');
  }
});

// ─── 渲染函数 ───
function renderCategories() {
  var grid = document.getElementById('categoryGrid');
  if (!grid) return;
  grid.innerHTML = '';
  contentData.categories.forEach(function(cat) {
    var card = document.createElement('div');
    card.className = 'category-item';
    card.innerHTML = '<div class="cat-icon">' + (cat.icon || '📁') + '</div>' +
      '<div class="cat-name">' + cat.name + '</div>' +
      '<div class="cat-sub">' + (cat.subtitle || '') + '</div>';
    card.onclick = function() { showCategory(cat); };
    grid.appendChild(card);
  });
}

// 恢复任意历史视图（用于面包屑点击）
function restoreToIndex(idx) {
  if (idx < 0 || idx >= viewStack.length) return;

  // 截断堆栈到目标位置
  viewStack = viewStack.slice(0, idx + 1);
  var target = viewStack[idx];

  if (target.view === 'home') {
    goHome();
  } else if (target.view === 'category') {
    var cat = contentData.categories.find(function(c) { return c.id === target.catId; });
    if (cat) restoreCategory(cat);
  } else if (target.view === 'child') {
    var cat2 = contentData.categories.find(function(c) { return c.id === target.catId; });
    var child2 = cat2 ? cat2.children.find(function(ch) { return ch.id === target.childId; }) : null;
    if (cat2 && child2) restoreChild(cat2, child2);
  } else if (target.view === 'doc') {
    restoreToIndex(idx - 1);
    var cat3 = contentData.categories.find(function(c) { return c.id === target.catId; });
    var child3 = cat3 ? cat3.children.find(function(ch) { return ch.id === target.childId; }) : null;
    var item3 = child3 ? child3.children.find(function(i) { return i.id === target.itemId; }) : null;
    if (cat3 && child3 && item3) {
      var docContent = document.getElementById('docContent');
      var docTitle = document.getElementById('docTitle');
      if (docContent) docContent.innerHTML = '<div class="doc-view">' + item3.content + '</div>';
      if (docTitle) docTitle.textContent = item3.name || item3.title || '';
      updateBreadcrumbDocOnly(cat3, child3, item3);
    }
  }
}

function updateBreadcrumb() {
  var breadcrumb = document.getElementById('breadcrumb');
  if (!breadcrumb) return;

  var html = '<span class="breadcrumb-item" onclick="goHome()">首页</span>';

  for (var i = 1; i < viewStack.length; i++) {
    var v = viewStack[i];
    var label = '';
    var isLast = (i === viewStack.length - 1);

    if (v.view === 'category') {
      var cat = contentData.categories.find(function(c) { return c.id === v.catId; });
      label = cat ? cat.name : '';
    } else if (v.view === 'child') {
      var cat2 = contentData.categories.find(function(c) { return c.id === v.catId; });
      var child = cat2 ? cat2.children.find(function(ch) { return ch.id === v.childId; }) : null;
      label = child ? child.name : '';
    } else if (v.view === 'doc') {
      var cat3 = contentData.categories.find(function(c) { return c.id === v.catId; });
      var child3 = cat3 ? cat3.children.find(function(ch) { return ch.id === v.childId; }) : null;
      var item3 = child3 ? child3.children.find(function(it) { return it.id === v.itemId; }) : null;
      label = item3 ? (item3.name || item3.title) : '';
    }

    if (label) {
      if (isLast) {
        html += '<span class="sep"> › </span><span class="breadcrumb-current">' + label + '</span>';
      } else {
        html += '<span class="sep"> › </span><span class="breadcrumb-item" onclick="restoreToIndex(' + i + ')">' + label + '</span>';
      }
    }
  }

  breadcrumb.innerHTML = html;
  console.log('[updateBreadcrumb] html=', html);
}

function updateBreadcrumbDocOnly(cat, child, item) {
  var breadcrumb = document.getElementById('breadcrumb');
  if (!breadcrumb) return;

  var html = '<span class="breadcrumb-item" onclick="goHome()">首页</span>';

  for (var i = 1; i < viewStack.length; i++) {
    var v = viewStack[i];
    var label = '';
    var isLast = (i === viewStack.length - 1);

    if (v.view === 'category') {
      var c = contentData.categories.find(function(c) { return c.id === v.catId; });
      label = c ? c.name : '';
    } else if (v.view === 'child') {
      var c = contentData.categories.find(function(c) { return c.id === v.catId; });
      var ch = c ? c.children.find(function(ch) { return ch.id === v.childId; }) : null;
      label = ch ? ch.name : '';
    } else if (v.view === 'doc') {
      var c = contentData.categories.find(function(c) { return c.id === v.catId; });
      var ch = c ? c.children.find(function(ch) { return ch.id === v.childId; }) : null;
      var it = ch ? ch.children.find(function(it) { return it.id === v.itemId; }) : null;
      label = it ? (it.name || it.title) : '';
    }

    if (label) {
      if (isLast) {
        html += '<span class="sep"> › </span><span class="breadcrumb-current">' + label + '</span>';
      } else {
        html += '<span class="sep"> › </span><span class="breadcrumb-item" onclick="restoreToIndex(' + i + ')">' + label + '</span>';
      }
    }
  }

  breadcrumb.innerHTML = html;
}

function showCategory(cat) {
  var navArea = document.getElementById('navArea');
  var contentArea = document.getElementById('contentArea');
  var detailArea = document.getElementById('detailArea');
  if (!navArea || !contentArea || !detailArea) return;

  navArea.style.display = 'none';
  detailArea.style.display = 'none';
  contentArea.style.display = 'block';

  viewStack.push({ view: 'category', catId: cat.id });
  updateBreadcrumb();

  var contentTitle = document.getElementById('contentTitle');
  var itemList = document.getElementById('itemList');
  if (contentTitle) contentTitle.textContent = cat.name;
  if (!itemList) return;

  itemList.innerHTML = '';
  cat.children.forEach(function(child) {
    var item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = '<span class="item-name">' + child.name + '</span><span class="item-arrow">›</span>';
    item.onclick = function() { showChild(cat, child); };
    itemList.appendChild(item);
  });
}

function restoreCategory(cat) {
  var navArea = document.getElementById('navArea');
  var contentArea = document.getElementById('contentArea');
  var detailArea = document.getElementById('detailArea');
  if (!navArea || !contentArea || !detailArea) return;

  navArea.style.display = 'none';
  detailArea.style.display = 'none';
  contentArea.style.display = 'block';

  var contentTitle = document.getElementById('contentTitle');
  var itemList = document.getElementById('itemList');
  if (contentTitle) contentTitle.textContent = cat.name;
  if (itemList) {
    itemList.innerHTML = '';
    cat.children.forEach(function(child) {
      var item = document.createElement('div');
      item.className = 'item-row';
      item.innerHTML = '<span class="item-name">' + child.name + '</span><span class="item-arrow">›</span>';
      item.onclick = function() { showChild(cat, child); };
      itemList.appendChild(item);
    });
  }

  updateBreadcrumb();
}

function showChild(cat, child, itemIdToShow) {
  var contentArea = document.getElementById('contentArea');
  var detailArea = document.getElementById('detailArea');
  if (!contentArea || !detailArea) return;

  contentArea.style.display = 'none';
  detailArea.style.display = 'block';
  window.scrollTo(0, 0);

  var docTitle = document.getElementById('docTitle');
  var docContent = document.getElementById('docContent');
  if (docTitle) docTitle.textContent = cat.name + ' - ' + child.name;

  if (!docContent) return;

  viewStack.push({ view: 'child', catId: cat.id, childId: child.id });
  updateBreadcrumb();

  // 如果传入了 itemIdToShow，直接跳转到文章
  if (itemIdToShow) {
    showDoc(cat.id, child.id, itemIdToShow);
    return;
  }

  // 如果没有 children（叶子节点），直接显示内容
  if (!child.children || child.children.length === 0) {
    showDoc(cat.id, child.id, child.id);
    return;
  }

  // 构建子项列表，支持第3层有children的情况
  console.log('[showChild] 开始渲染子目录列表，清空docContent');
  var html = '<div class="child-items-list">';
  child.children.forEach(function(item) {
    // 提取内容摘要（如果有content字段）
    var snippetHtml = '';
    if (item.content) {
      var plain = item.content.replace(/<[^>]+>/g, '');
      var short = plain.length > 60 ? plain.slice(0, 60) + '...' : plain;
      snippetHtml = '<div class="child-item-snippet">' + short + '</div>';
    }
    if (item.children && item.children.length > 0) {
      // 第3层节点还有children → 第4层 → 点击展开显示第4层列表
      html += '<div class="child-item has-children" onclick="expandSubChildren(this, \'' + cat.id + '\',\'' + child.id + '\',\'' + item.id + '\')">' +
        '<span class="child-item-title">' + (item.name || item.title) + '</span><span class="child-item-arrow child-arrow">›</span></div>' +
        '<div class="sub-child-list" style="display:none;padding-left:16px;">';
      item.children.forEach(function(sub) {
        html += '<div class="child-item" onclick="showDoc(\'' + cat.id + '\',\'' + child.id + '\',\'' + sub.id + '\')">' +
          '<span class="child-item-title">' + (sub.name || sub.title) + '</span><span class="child-item-arrow">›</span></div>';
      });
      html += '</div>';
    } else {
      // 第3层没有children → 直接是文章
      html += '<div class="child-item" onclick="showDoc(\'' + cat.id + '\',\'' + child.id + '\',\'' + item.id + '\')">' +
        '<span class="child-item-title">' + (item.name || item.title) + '</span><span class="child-item-arrow">›</span></div>';
      if (snippetHtml) {
        var lastItem = html.lastIndexOf('<div class="child-item"');
        var insertPos = html.indexOf('</div>', lastItem) + 6;
        html = html.slice(0, insertPos) + snippetHtml.replace('class="child-item-snippet"', 'class="child-item-snippet child-snippet-inline"') + html.slice(insertPos);
      }
    }
  });
  html += '</div>';
  docContent.innerHTML = ''; // 强制清空
  docContent.innerHTML = html;
  console.log('[showChild] 渲染完成，innerHTML已设置');
}

// 展开第4层子节点（点击有children的第3层节点时触发）
function expandSubChildren(el, catId, childId, itemId) {
  var subList = el.nextElementSibling;
  if (subList && subList.classList.contains('sub-child-list')) {
    var isHidden = subList.style.display === 'none';
    subList.style.display = isHidden ? 'block' : 'none';
    el.querySelector('.child-arrow').textContent = isHidden ? '∨' : '›';
  }
}

function restoreChild(cat, child) {
  var contentArea = document.getElementById('contentArea');
  var detailArea = document.getElementById('detailArea');
  if (!contentArea || !detailArea) return;

  contentArea.style.display = 'none';
  detailArea.style.display = 'block';
  window.scrollTo(0, 0);

  var docTitle = document.getElementById('docTitle');
  var docContent = document.getElementById('docContent');
  if (docTitle) docTitle.textContent = cat.name + ' - ' + child.name;
  if (docContent) {
    docContent.innerHTML = ''; // 先清空旧内容
    var html = '<div class="child-items-list">';
    child.children.forEach(function(item) {
      if (item.children && item.children.length > 0) {
        html += '<div class="child-item has-children" onclick="expandSubChildren(this, \'' + cat.id + '\',\'' + child.id + '\',\'' + item.id + '\')">' +
          '<span class="child-item-title">' + (item.name || item.title) + '</span><span class="child-item-arrow child-arrow">›</span></div>' +
          '<div class="sub-child-list" style="display:none;padding-left:16px;">';
        item.children.forEach(function(sub) {
          html += '<div class="child-item" onclick="showDoc(\'' + cat.id + '\',\'' + child.id + '\',\'' + sub.id + '\')">' +
            '<span class="child-item-title">' + (sub.name || sub.title) + '</span><span class="child-item-arrow">›</span></div>';
        });
        html += '</div>';
      } else {
        html += '<div class="child-item" onclick="showDoc(\'' + cat.id + '\',\'' + child.id + '\',\'' + item.id + '\')">' +
          '<span class="child-item-title">' + (item.name || item.title) + '</span><span class="child-item-arrow">›</span></div>';
      }
    });
    html += '</div>';
    docContent.innerHTML = html;
  }

  updateBreadcrumb();
}

function showDoc(catId, childId, itemId) {
  console.log('[DEBUG showDoc] catId:', catId, 'childId:', childId, 'itemId:', itemId);
  console.log('[DEBUG showDoc] REFERRAL_UPDATES["ref-4-2-3"]?', !!window.REFERRAL_UPDATES && !!window.REFERRAL_UPDATES['ref-4-2-3']);
  var cat = contentData.categories.find(function(c) { return c.id === catId; });
  if (!cat) { console.log('[DEBUG showDoc] cat not found!'); return; }

  // 递归搜索：支持任意深度的 children + items 混合查找（含稀疏数组防护）
  function findItemDeep(nodes, targetId) {
    if (!nodes) return null;
    for (var i = 0; i < nodes.length; i++) {
      if (!nodes[i]) continue; // 稀疏数组防护，跳过 undefined/null 空位
      if (nodes[i].id === targetId) return nodes[i];
      // items 数组里的直接项目（如 flat 结构）
      if (nodes[i].items) {
        for (var j = 0; j < nodes[i].items.length; j++) {
          if (nodes[i].items[j] && nodes[i].items[j].id === targetId) return nodes[i].items[j];
        }
      }
      // children 嵌套
      if (nodes[i].children) {
        var found = findItemDeep(nodes[i].children, targetId);
        if (found) return found;
      }
    }
    return null;
  }

  var item = findItemDeep(cat.children, itemId);
  if (!item) return;

  // 热补丁：优先用 referral_update.js 里的更新内容（即使有 children 也优先显示补丁内容）
  if (window.REFERRAL_UPDATES && window.REFERRAL_UPDATES[itemId]) {
    console.log('[DEBUG showDoc] HOT PATCH APPLIED for itemId:', itemId);
    var rawContent = window.REFERRAL_UPDATES[itemId];
    // 显示详情区，隐藏分类列表区
    var categoryGrid = document.getElementById('categoryGrid');
    var contentArea = document.getElementById('contentArea');
    var detailArea = document.getElementById('detailArea');
    if (categoryGrid) categoryGrid.style.display = 'none';
    if (contentArea) contentArea.style.display = 'none';
    if (detailArea) detailArea.style.display = 'block';
    var docContent = document.getElementById('docContent');
    if (docContent) docContent.innerHTML = '<div class="doc-view">' + rawContent + '</div>';
    var docTitle = document.getElementById('docTitle');
    if (docTitle) docTitle.textContent = item.name || item.title || '';
    viewStack.push({ view: 'doc', catId: catId, childId: itemId, itemId: itemId });
    updateBreadcrumb();
    return;
  }

  // 有 children 的项目 → 调用 showChild 显示子项目列表
  if (item.children && item.children.length > 0) {
    showChild(cat, item);
    return;
  }

  // 显示详情区，隐藏分类列表区
  var categoryGrid = document.getElementById('categoryGrid');
  var contentArea = document.getElementById('contentArea');
  var detailArea = document.getElementById('detailArea');
  if (categoryGrid) categoryGrid.style.display = 'none';
  if (contentArea) contentArea.style.display = 'none';
  if (detailArea) detailArea.style.display = 'block';

  var docContent = document.getElementById('docContent');
  if (docContent) {
    docContent.innerHTML = ''; // 先清空旧内容
    rawContent = item.content || '<p>内容待补充...</p>';
    if (lastSearchKeyword) {
      rawContent = rawContent.replace(new RegExp(lastSearchKeyword, 'gi'), '<mark class="search-highlight">$&</mark>');
    }
    docContent.innerHTML = '<div class="doc-view">' + rawContent + '</div>';
  }

  var docTitle = document.getElementById('docTitle');
  if (docTitle) docTitle.textContent = item.name || item.title || '';

  viewStack.push({ view: 'doc', catId: catId, childId: itemId, itemId: itemId });
  updateBreadcrumb();
  window.scrollTo(0, 0); // 每次进入文章都滚动到顶部
  
  // 如果有高亮内容，滚动到第一个高亮位置
  if (lastSearchKeyword) {
    setTimeout(function() {
      var highlight = document.querySelector('.search-highlight');
      if (highlight) {
        highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }
}

function goHome() {
  var navArea = document.getElementById('navArea');
  var contentArea = document.getElementById('contentArea');
  var detailArea = document.getElementById('detailArea');
  var categoryGrid = document.getElementById('categoryGrid');
  if (navArea) navArea.style.display = 'block';
  if (categoryGrid) categoryGrid.style.display = 'grid';
  if (contentArea) contentArea.style.display = 'none';
  if (detailArea) detailArea.style.display = 'none';

  viewStack = [{ view: 'home' }];
  updateBreadcrumb();
  renderCategories();

  // DEBUG
  console.log('[goHome] navArea.display=' + (navArea ? navArea.style.display : 'null') +
    ' categoryGrid.display=' + (categoryGrid ? categoryGrid.style.display : 'null') +
    ' contentArea.display=' + (contentArea ? contentArea.style.display : 'null'));
}

function goBack() {
  if (viewStack.length <= 1) {
    goHome();
    return;
  }

  viewStack.pop();
  var prev = viewStack[viewStack.length - 1];

  if (prev.view === 'home') {
    goHome();
  } else if (prev.view === 'category') {
    var cat = contentData.categories.find(function(c) { return c.id === prev.catId; });
    if (cat) restoreCategory(cat);
  } else if (prev.view === 'child') {
    var cat2 = contentData.categories.find(function(c) { return c.id === prev.catId; });
    var child2 = cat2 ? cat2.children.find(function(ch) { return ch.id === prev.childId; }) : null;
    if (cat2 && child2) restoreChild(cat2, child2);
  } else if (prev.view === 'doc') {
    var cat3 = contentData.categories.find(function(c) { return c.id === prev.catId; });
    var child3 = cat3 ? cat3.children.find(function(ch) { return ch.id === prev.childId; }) : null;
    if (cat3 && child3) restoreChild(cat3, child3);
  }
}

function goBackChild() {
  for (var i = viewStack.length - 2; i >= 0; i--) {
    if (viewStack[i].view === 'child') {
      restoreToIndex(i);
      return;
    }
  }
  goHome();
}

function adjustFontSize(delta) {
  var content = document.getElementById('docContent');
  if (!content) return;
  var current = parseInt(content.style.fontSize) || 15;
  current = Math.max(12, Math.min(24, current + delta));
  content.style.fontSize = current + 'px';
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMode() {
  document.body.classList.toggle('dark-mode');
  var btn = document.getElementById('modeToggle');
  if (btn) btn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}
