import React, { useEffect, useMemo, useState } from "react";

const defaultCategories = [
  {
    id: "mystery",
    name: "神秘宗教",
    description: "神秘文献、宗教圣物、教派秘闻、禁忌知识",
    weight: 95,
    keywords: [
      "死海古卷",
      "约柜",
      "共济会",
      "圣殿",
      "秘教",
      "古卷",
      "圣物",
      "异端",
      "禁书",
      "梵蒂冈",
      "宗教符号"
    ]
  },
  {
    id: "extreme_case",
    name: "真实离奇事件",
    description: "真实人物、诡异案件、悬案、极端心理",
    weight: 100,
    keywords: [
      "多重人格",
      "悬案",
      "失踪",
      "怪异事件",
      "真实案件",
      "离奇",
      "未破",
      "心理实验",
      "都市传说",
      "怪谈"
    ]
  },
  {
    id: "science_taboo",
    name: "科学禁区",
    description: "基因编辑、克隆、人类伦理边界、怪病",
    weight: 88,
    keywords: [
      "基因编辑",
      "克隆",
      "朊病毒",
      "伦理",
      "人体实验",
      "优生学",
      "禁区",
      "脑科学",
      "生物学异常"
    ]
  },
  {
    id: "culture_shock",
    name: "文化奇观",
    description: "民族制度、服饰禁忌、婚俗葬俗、文化反差",
    weight: 84,
    keywords: [
      "彝族",
      "头巾",
      "婚俗",
      "葬俗",
      "部落",
      "古坟",
      "禁忌",
      "习俗",
      "仪式",
      "王权"
    ]
  },
  {
    id: "history_system",
    name: "历史/思想体系",
    description: "宗教分裂、哲学思想、制度演化、文明结构",
    weight: 66,
    keywords: [
      "老子",
      "教会分裂",
      "天皇",
      "制度演变",
      "文明史",
      "思想史",
      "帝国",
      "宗教史"
    ]
  }
];

const seedPool = [
  {
    title: "梵蒂冈秘密档案馆里到底存了什么？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-11",
    snippet: "围绕档案馆的误解、真实馆藏范围，以及最适合短视频切入的神秘角度。",
    rawTags: ["宗教", "档案馆", "禁忌知识", "神秘"]
  },
  {
    title: "历史上最著名的集体幻觉事件有哪些？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-10",
    snippet: "从心理学到社会恐慌，再到被神秘化的案例，故事性非常强。",
    rawTags: ["群体心理", "真实事件", "离奇案例"]
  },
  {
    title: "被禁止的人体实验：哪些实验改变了医学伦理？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-09",
    snippet: "科学进步背后的黑暗代价，这类内容天然有禁区感。",
    rawTags: ["人体实验", "科学禁区", "伦理"]
  },
  {
    title: "古代有哪些让现代人难以理解的婚姻制度？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-08",
    snippet: "文化冲击非常强，评论区容易讨论起来。",
    rawTags: ["婚俗", "文化反差", "制度"]
  },
  {
    title: "消失的圣物：历史上那些下落不明的宗教遗物",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-11",
    snippet: "约柜式选题的扩展池，和你高播放模型高度一致。",
    rawTags: ["圣物", "宗教", "失落文物"]
  },
  {
    title: "历史上的完美犯罪真的存在吗？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-07",
    snippet: "非常适合延展到三亿日元、密室悬案、身份谜团。",
    rawTags: ["悬案", "真实案件", "完美犯罪"]
  },
  {
    title: "哪些古代禁书曾被视为危险知识？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-06",
    snippet: "禁书、秘本、异端审判，这条线非常适合系列化。",
    rawTags: ["禁书", "古卷", "异端"]
  },
  {
    title: "世界上最诡异的失踪案，后来都怎样了？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-05",
    snippet: "比纯历史更容易做出强钩子 hook（钩子）。",
    rawTags: ["失踪", "离奇案件", "神秘"]
  },
  {
    title: "那些被误解最深的宗教符号，原来最初不是这个意思",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-04",
    snippet: "兼顾知识增量和生活化传播感。",
    rawTags: ["符号", "宗教", "文化来源"]
  },
  {
    title: "历史上真的有人试图制造完美人类吗？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-03",
    snippet: "从优生学到基因编辑，危险而且抓人。",
    rawTags: ["优生学", "基因", "科学伦理"]
  }
];

function normalizeText(text) {
  return String(text || "").toLowerCase();
}

function scoreItem(item, categories) {
  const text = normalizeText(
    `${item.title} ${item.snippet} ${(item.rawTags || []).join(" ")}`
  );

  let bestCategory = categories[0];
  let bestScore = -1;
  let bestHits = 0;

  for (const cat of categories) {
    let hits = 0;
    for (const kw of cat.keywords) {
      if (text.includes(normalizeText(kw))) hits += 1;
    }
    const score = cat.weight + hits * 8;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
      bestHits = hits;
    }
  }

  const freshnessBoost =
    item.source !== "Seed Pool" ? 10 : item.date === "2026-03-11" ? 5 : 0;

  return {
    ...item,
    category: bestCategory.name,
    score: bestScore + freshnessBoost,
    reason: `命中「${bestCategory.name}」模型，关键词匹配 ${bestHits} 个`
  };
}

function dedupeByTitle(items) {
  const map = new Map();
  for (const item of items) {
    const key = item.title.trim().toLowerCase();
    if (!map.has(key)) map.set(key, item);
  }
  return [...map.values()];
}

async function fetchWikipediaIdeas() {
  const keywords = [
    "mystery",
    "occult",
    "forbidden book",
    "unsolved disappearance",
    "religious relic",
    "human experiment"
  ];

  const all = [];

  for (const keyword of keywords) {
    const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
      keyword
    )}&limit=5&namespace=0&format=json&origin=*`;

    const res = await fetch(url);
    if (!res.ok) continue;

    const data = await res.json();
    const titles = data?.[1] || [];
    const descriptions = data?.[2] || [];
    const links = data?.[3] || [];

    titles.forEach((title, index) => {
      all.push({
        title,
        source: "Wikipedia",
        url: links[index] || "#",
        date: new Date().toISOString().slice(0, 10),
        snippet: descriptions[index] || "Wikipedia 词条线索",
        rawTags: [keyword, "百科", "公开数据"]
      });
    });
  }

  return all;
}

async function fetchHackerNewsIdeas() {
  const queryWords = [
    "history",
    "religion",
    "mystery",
    "crime",
    "genetics"
  ];

  const all = [];

  for (const word of queryWords) {
    const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(
      word
    )}&tags=story&hitsPerPage=6`;

    const res = await fetch(url);
    if (!res.ok) continue;

    const data = await res.json();
    const hits = data?.hits || [];

    hits.forEach((hit) => {
      all.push({
        title: hit.title || "Untitled",
        source: "Hacker News",
        url: hit.url || "#",
        date: hit.created_at ? hit.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
        snippet: hit.story_text || hit._highlightResult?.title?.value || "HN 公开讨论线索",
        rawTags: [word, "discussion", "news"]
      });
    });
  }

  return all;
}

export default function App() {
  const [categories, setCategories] = useState(defaultCategories);
  const [items, setItems] = useState(seedPool);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("准备就绪");
  const [lastUpdated, setLastUpdated] = useState("");

  const scoredItems = useMemo(() => {
    let result = dedupeByTitle(items)
      .map((item) => scoreItem(item, categories))
      .sort((a, b) => b.score - a.score);

    if (keyword.trim()) {
      const q = normalizeText(keyword.trim());
      result = result.filter((item) => {
        const combined = normalizeText(
          `${item.title} ${item.snippet} ${item.category} ${(item.rawTags || []).join(" ")}`
        );
        return combined.includes(q);
      });
    }

    if (selectedCategory !== "全部") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    return result;
  }, [items, categories, keyword, selectedCategory]);

  function updateWeight(id, value) {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, weight: Number(value) } : cat))
    );
  }

  function importJson() {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        alert("JSON 必须是数组 array（数组）");
        return;
      }

      const normalized = parsed.map((item, index) => ({
        title: item.title || `未命名内容 ${index + 1}`,
        source: item.source || "Imported",
        url: item.url || "#",
        date: item.date || new Date().toISOString().slice(0, 10),
        snippet: item.snippet || item.description || "",
        rawTags: Array.isArray(item.rawTags)
          ? item.rawTags
          : Array.isArray(item.tags)
          ? item.tags
          : []
      }));

      setItems((prev) => dedupeByTitle([...normalized, ...prev]));
      setJsonInput("");
      setStatusText(`已导入 ${normalized.length} 条内容`);
    } catch (error) {
      alert(`导入失败：${error.message}`);
    }
  }

  function resetToSeed() {
    setItems(seedPool);
    setStatusText("已恢复默认内容池");
    setLastUpdated("");
  }

  async function fetchOnlineContent() {
    setLoading(true);
    setStatusText("正在联网抓取公开内容...");
    try {
      const [wikiItems, hnItems] = await Promise.all([
        fetchWikipediaIdeas(),
        fetchHackerNewsIdeas()
      ]);

      const merged = dedupeByTitle([...wikiItems, ...hnItems, ...seedPool]);
      setItems(merged);
      setLastUpdated(new Date().toLocaleString());
      setStatusText(`联网完成，抓到 ${merged.length} 条候选内容`);
    } catch (error) {
      console.error(error);
      setStatusText("联网失败。可能是网络、接口限制，或者目标站点暂时不可用。");
      alert("联网失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setStatusText("准备就绪");
  }, []);

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Idea Scout</p>
          <h1>抬頭紋选题雷达</h1>
          <p className="hero-desc">
            基于你现有账号的流量模型，把内容按
            <strong> 神秘宗教 / 真实离奇事件 / 科学禁区 / 文化奇观 / 历史体系 </strong>
            自动分类、打分、筛选。
          </p>
        </div>

        <div className="hero-actions">
          <button className="primary-btn" onClick={fetchOnlineContent} disabled={loading}>
            {loading ? "抓取中..." : "联网刷新内容池"}
          </button>
          <button className="ghost-btn" onClick={resetToSeed}>
            恢复默认池
          </button>
        </div>
      </header>

      <section className="status-bar">
        <span>状态：{statusText}</span>
        <span>最后更新：{lastUpdated || "暂无"}</span>
        <span>当前候选：{scoredItems.length}</span>
      </section>

      <main className="layout">
        <aside className="sidebar">
          <div className="panel">
            <h2>流量模型权重</h2>
            <p className="panel-tip">
              这里就是你的 content model（内容模型）控制台。越高，越优先推荐。
            </p>

            {categories.map((cat) => (
              <div className="weight-item" key={cat.id}>
                <div className="weight-top">
                  <div>
                    <strong>{cat.name}</strong>
                    <p>{cat.description}</p>
                  </div>
                  <span>{cat.weight}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={cat.weight}
                  onChange={(e) => updateWeight(cat.id, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="panel">
            <h2>筛选器</h2>
            <input
              className="text-input"
              placeholder="搜关键词，比如：约柜 / 基因 / 失踪"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <select
              className="select-input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="全部">全部分类</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="panel">
            <h2>批量导入 JSON</h2>
            <p className="panel-tip">
              你以后从别处抓到的内容，只要转成 JSON，就能直接塞进来。
            </p>
            <textarea
              className="json-box"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`[
  {
    "title": "某个失落圣物的真实来历",
    "source": "RSS抓取",
    "url": "https://example.com",
    "date": "2026-03-11",
    "snippet": "一段摘要",
    "rawTags": ["宗教", "圣物", "神秘"]
  }
]`}
            />
            <button className="primary-btn full-width" onClick={importJson}>
              导入内容
            </button>
          </div>
        </aside>

        <section className="content">
          <div className="panel">
            <h2>推荐榜单</h2>
            <p className="panel-tip">
              我说句主观一点的话，你这个号最该放大的，还是
              <strong> 真实离奇事件 + 神秘宗教 + 科学禁区 </strong>，
              这三条线最有爆相。
            </p>

            <div className="cards">
              {scoredItems.map((item, index) => (
                <article className="idea-card" key={`${item.title}-${index}`}>
                  <div className="card-top">
                    <div className="badges">
                      <span className="badge rank">TOP {index + 1}</span>
                      <span className="badge category">{item.category}</span>
                      <span className="badge score">匹配分 {item.score}</span>
                    </div>

                    <a
                      className="source-link"
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      查看来源
                    </a>
                  </div>

                  <h3>{item.title}</h3>
                  <p className="snippet">{item.snippet}</p>

                  <div className="tag-row">
                    {(item.rawTags || []).map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="meta-row">
                    <span>{item.source}</span>
                    <span>{item.date}</span>
                  </div>

                  <div className="reason-box">
                    <strong>推荐理由：</strong>
                    {item.reason}
                  </div>
                </article>
              ))}

              {scoredItems.length === 0 && (
                <div className="empty-state">
                  没搜到内容。你换个关键词，或者点一下“联网刷新内容池”。
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}