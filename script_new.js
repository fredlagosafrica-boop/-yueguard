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
  'ifa_content.js?v=2026052601',
  'wiki_content.js?v=2026052301',
  'sales_content.js?v=2026052320',
  'referral_content.js?v=20260516',
  'materials_content.js?v=20260516',
  'chatbot_content.js?v=20260516',
  'biyuan_content.js?v=2026052301',
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

// 使用声明弹窗
function acceptDisclaimer(){localStorage.setItem("disclaimerAccepted","1"),document.getElementById("disclaimerModal").style.display="none"}
function showDisclaimer(){var e=document.getElementById("disclaimerModal");"1"!==localStorage.getItem("disclaimerAccepted")?e.style.display="flex":e.style.display="none"}
document.addEventListener("DOMContentLoaded",showDisclaimer);

// 密码锁屏
var SITE_PASSWORD = "8888";

function checkPassword(){
  var val = document.getElementById("lockInput").value;
  if(val === SITE_PASSWORD){
    localStorage.setItem("siteUnlocked","1");
    document.getElementById("passwordLock").style.display = "none";
    showDisclaimer();
  } else {
    var err = document.getElementById("lockError");
    err.classList.add("show");
    document.getElementById("lockInput").value = "";
    setTimeout(function(){ err.classList.remove("show"); }, 2000);
  }
}

document.getElementById("lockInput").addEventListener("keyup",function(e){
  if(e.key==="Enter") checkPassword();
});

function showPasswordLock(){
  if(localStorage.getItem("siteUnlocked")==="1"){
    document.getElementById("passwordLock").style.display = "none";
    showDisclaimer();
  } else {
    document.getElementById("passwordLock").style.display = "flex";
  }
}
document.addEventListener("DOMContentLoaded",showPasswordLock);
