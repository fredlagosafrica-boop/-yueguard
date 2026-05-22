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
  'ifa_content.js',
  'wiki_content.js',
  'sales_content.js',
  'referral_content.js',
  'materials_content.js',
  'chatbot_content.js',
  'biyuan_content.js',
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
  contentData.categories.forEach(function(cat) {
    // 匹配分类名
    if (cat.name && cat.name.toLowerCase().includes(keyword)) {
      results.push({ type: 'category', cat: cat.name, title: cat.name, item: cat });
    }
    // 匹配子类
    if (cat.children) {
      cat.children.forEach(function(child) {
        if (child.name && child.name.toLowerCase().includes(keyword)) {
          results.push({ type: 'child', cat: cat.name, title: child.name, item: child, catId: cat.id });
        }
        // 匹配内容项
        if (child.children) {
          child.children.forEach(function(sub) {
            var matchTitle = sub.name && sub.name.toLowerCase().includes(keyword);
            var matchContent = sub.content && sub.content.toLowerCase().includes(keyword);
            if (matchTitle || matchContent) {
              results.push({ type: 'item', cat: cat.name, title: sub.name || sub.title || '未命名', item: sub, catId: cat.id, childId: child.id, matchContent: matchContent ? sub.content : null });
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
      return '<div class="search-result-item" data-type="' + r.type + '" data-cat="' + (r.catId || '') + '" data-child="' + (r.childId || '') + '" data-title="' + encodeURIComponent(r.title) + '">' +
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
      var title = decodeURIComponent(this.getAttribute('data-title'));
      openSearchResult(type, catId, childId, title);
    };
  });
}

function openSearchResult(type, catId, childId, title) {
  var resultsContainer = document.getElementById('searchResults');
  if (resultsContainer) resultsContainer.classList.remove('active');
  document.getElementById('searchInput').value = '';
  
  if (type === 'category') {
    var cat = contentData.categories.find(function(c) { return c.name === title; });
    if (cat) {
      showCategory(cat);
    } else {
      // fallback: 遍历找
      for (var i = 0; i < contentData.categories.length; i++) {
        if (contentData.categories[i].name === title) {
          showCategory(contentData.categories[i]);
          break;
        }
      }
    }
  } else if (type === 'child') {
    var cat = contentData.categories.find(function(c) { return c.id === catId; });
    if (cat) {
      var child = cat.children.find(function(c) { return c.name === title; });
      if (child) showChild(cat, child);
    }
  } else if (type === 'item') {
    var cat2 = contentData.categories.find(function(c) { return c.id === catId; });
    if (cat2) {
      var child2 = cat2.children.find(function(c) { return c.id === childId; });
      if (child2) {
        var item = child2.children.find(function(i) { return (i.name || i.title) === title; });
        if (item) showChild(cat2, child2, item.id);
      }
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

  var html = '<span class="breadcrumb-item" onclick="restoreToIndex(0)">首页</span>';

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
}

function updateBreadcrumbDocOnly(cat, child, item) {
  var breadcrumb = document.getElementById('breadcrumb');
  if (!breadcrumb) return;

  var html = '<span class="breadcrumb-item" onclick="restoreToIndex(0)">首页</span>';

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

function showChild(cat, child) {
  var contentArea = document.getElementById('contentArea');
  var detailArea = document.getElementById('detailArea');
  if (!contentArea || !detailArea) return;

  contentArea.style.display = 'none';
  detailArea.style.display = 'block';

  var docTitle = document.getElementById('docTitle');
  var docContent = document.getElementById('docContent');
  if (docTitle) docTitle.textContent = cat.name + ' - ' + child.name;

  if (!docContent) return;

  viewStack.push({ view: 'child', catId: cat.id, childId: child.id });
  updateBreadcrumb();

  // 构建子项列表，支持第3层有children的情况
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
        html = html.replace(/(<div class="child-item"[^>]* onclick="showDoc[^"]+">)/, '$1' + snippetHtml.replace('class="child-item-snippet"', 'class="child-item-snippet child-snippet-inline"'));
      }
    }
  });
  html += '</div>';
  docContent.innerHTML = html;
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

  var docTitle = document.getElementById('docTitle');
  var docContent = document.getElementById('docContent');
  if (docTitle) docTitle.textContent = cat.name + ' - ' + child.name;
  if (docContent) {
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
  var cat = contentData.categories.find(function(c) { return c.id === catId; });
  if (!cat) return;

  // 递归搜索：支持任意深度的 children 查找
  function findItem(children, targetId) {
    if (!children) return null;
    for (var i = 0; i < children.length; i++) {
      if (children[i].id === targetId) return children[i];
      if (children[i].children) {
        var found = findItem(children[i].children, targetId);
        if (found) return found;
      }
    }
    return null;
  }

  var item = findItem(cat.children, itemId);
  if (!item) return;

  // 有 children 的项目 → 调用 showChild 显示子项目列表
  if (item.children && item.children.length > 0) {
    showChild(cat, item);
    return;
  }

  var docContent = document.getElementById('docContent');
  if (docContent) {
    var rawContent = item.content || '<p>内容待补充...</p>';
    // 如果有搜索关键词，对内容进行高亮处理
    if (lastSearchKeyword) {
      rawContent = rawContent.replace(new RegExp(lastSearchKeyword, 'gi'), '<mark class="search-highlight">$&</mark>');
    }
    docContent.innerHTML = '<div class="doc-view">' + rawContent + '</div>';
  }

  var docTitle = document.getElementById('docTitle');
  if (docTitle) docTitle.textContent = item.name || item.title || '';

  viewStack.push({ view: 'doc', catId: catId, childId: itemId, itemId: itemId });
  updateBreadcrumb();
  
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
  if (navArea) navArea.style.display = 'block';
  if (contentArea) contentArea.style.display = 'none';
  if (detailArea) detailArea.style.display = 'none';

  viewStack = [{ view: 'home' }];
  updateBreadcrumb();
  renderCategories();
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
