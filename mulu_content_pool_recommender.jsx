import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Link as LinkIcon, Sparkles, Tag, Filter, Database, Globe, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

const defaultCategories = [
  {
    id: "mystery",
    name: "神秘宗教",
    description: "神秘文献、宗教圣物、教派秘闻、未解象征",
    weight: 95,
    keywords: ["死海古卷", "约柜", "共济会", "圣殿", "神秘文书", "古卷", "圣物", "异端", "宗教仪式", "秘教", "失落文献", "古代禁书"]
  },
  {
    id: "extreme_case",
    name: "真实离奇事件",
    description: "真实人物、诡异案件、极端心理、悬案奇案",
    weight: 100,
    keywords: ["多重人格", "比利", "悬案", "未破案件", "离奇失踪", "心理实验", "诡异案件", "怪异事件", "都市传说", "异常记录"]
  },
  {
    id: "science_taboo",
    name: "科学禁区",
    description: "基因编辑、克隆、人类伦理边界、怪病",
    weight: 88,
    keywords: ["基因编辑", "克隆", "朊病毒", "伦理争议", "人体实验", "神经科学", "科学禁区", "技术伦理", "生物学异常"]
  },
  {
    id: "culture_shock",
    name: "文化奇观",
    description: "民族制度、服饰禁忌、习俗来源、文化反差",
    weight: 84,
    keywords: ["彝族", "头巾", "禁忌", "葬俗", "婚俗", "部落制度", "奇特习俗", "文化符号", "古坟", "王权礼制"]
  },
  {
    id: "history_system",
    name: "历史/思想体系",
    description: "宗教分裂、哲学思想、权力结构、文明演化",
    weight: 66,
    keywords: ["老子", "教会分裂", "天皇", "制度演变", "思想史", "宗教史", "文明史", "帝国", "王朝"]
  }
];

const starterSources = [
  {
    id: "s1",
    name: "Google News RSS（示例）",
    type: "rss",
    endpoint: "https://news.google.com/rss/search?q=%E7%A5%9E%E7%A7%98+OR+%E5%8F%A4%E5%8D%B7+OR+%E6%82%AC%E6%A1%88&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    enabled: true,
    note: "新闻类线索，适合抓新近话题。"
  },
  {
    id: "s2",
    name: "Wikipedia / MediaWiki API（示例）",
    type: "json",
    endpoint: "https://zh.wikipedia.org/w/api.php?action=opensearch&search=%E5%8F%A4%E5%8D%B7&limit=10&namespace=0&format=json&origin=*",
    enabled: true,
    note: "适合拓展人物、事件、概念的背景词条。"
  },
  {
    id: "s3",
    name: "Reddit RSS（示例）",
    type: "rss",
    endpoint: "https://www.reddit.com/search.rss?q=unsolved%20mystery",
    enabled: false,
    note: "适合抓怪谈、悬案、冷门讨论。"
  }
];

const seedPool = [
  {
    title: "梵蒂冈秘密档案馆里到底存了什么？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-10",
    snippet: "围绕档案馆的误解、真正馆藏范围、最有传播性的几个神秘切口。",
    rawTags: ["神秘档案", "宗教", "梵蒂冈", "禁忌知识"]
  },
  {
    title: "历史上最著名的‘集体幻觉’事件有哪些？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-09",
    snippet: "从心理学、社会恐慌到神秘事件，兼具故事性和讨论度。",
    rawTags: ["群体心理", "真实事件", "离奇案例"]
  },
  {
    title: "被禁止的人体实验：哪些实验改变了医学伦理？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-08",
    snippet: "科学进步背后最黑暗的一面，天然带有禁区感。",
    rawTags: ["人体实验", "科学禁区", "伦理"]
  },
  {
    title: "古代有哪些让现代人难以理解的婚姻制度？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-08",
    snippet: "文化差异巨大，观众很容易停留和转发。",
    rawTags: ["婚俗", "文化反差", "制度"]
  },
  {
    title: "消失的圣物：历史上那些下落不明的宗教遗物",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-11",
    snippet: "约柜式选题的扩展池，和你的高播放模型高度贴合。",
    rawTags: ["圣物", "宗教", "失落文物", "约柜同类"]
  },
  {
    title: "历史上的‘完美犯罪’真的存在吗？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-11",
    snippet: "可以延展到三亿日元、密室悬案、身份谜团。",
    rawTags: ["悬案", "真实案件", "完美犯罪"]
  },
  {
    title: "哪些古代禁书曾被视为危险知识？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-07",
    snippet: "禁书、秘本、异端审判，这类题材很适合做系列。",
    rawTags: ["禁书", "古卷", "异端"]
  },
  {
    title: "世界上最诡异的失踪案，后来都怎样了？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-06",
    snippet: "比纯历史更容易打出讨论区和完播率。",
    rawTags: ["失踪", "离奇案件", "神秘"]
  },
  {
    title: "那些被误解最深的宗教符号，原来最初不是这个意思",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-05",
    snippet: "兼顾知识增量和日常可传播性。",
    rawTags: ["符号", "宗教", "文化来源"]
  },
  {
    title: "历史上真的有人试图制造‘完美人类’吗？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-11",
    snippet: "从优生学到基因编辑，危险又吸睛。",
    rawTags: ["优生学", "基因", "科学伦理"]
  },
  {
    title: "古代帝王为什么迷信某些石头、器物或动物？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-04",
    snippet: "你很适合把具体器物切进去，再讲背后的权力象征。",
    rawTags: ["器物", "迷信", "象征"]
  },
  {
    title: "宗教分裂后，普通人的生活到底发生了什么变化？",
    source: "Seed Pool",
    url: "#",
    date: "2026-03-03",
    snippet: "偏体系，但可以通过生活变化做得不枯燥。",
    rawTags: ["宗教史", "分裂", "生活史"]
  }
];

function scoreItem(item, categories) {
  const text = `${item.title} ${item.snippet} ${(item.rawTags || []).join(" ")}`.toLowerCase();

  let bestCategory = categories[0];
  let bestScore = -1;
  let allMatches = [];

  categories.forEach((cat) => {
    let keywordHits = 0;
    for (const kw of cat.keywords) {
      if (text.includes(kw.toLowerCase())) keywordHits += 1;
    }
    const score = cat.weight + keywordHits * 8;
    allMatches.push({ cat: cat.name, score, keywordHits });
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
    }
  });

  const freshnessBoost = item.date === "2026-03-11" ? 8 : item.date === "2026-03-10" ? 5 : 0;
  const finalScore = bestScore + freshnessBoost;

  return {
    ...item,
    category: bestCategory.name,
    score: finalScore,
    reason: `命中“${bestCategory.name}”模型；关键词匹配 ${allMatches.find((m) => m.cat === bestCategory.name)?.keywordHits ?? 0} 个`,
  };
}

export default function MuluContentPoolRecommender() {
  const [categories, setCategories] = useState(defaultCategories);
  const [sources, setSources] = useState(starterSources);
  const [keyword, setKeyword] = useState("");
  const [manualJson, setManualJson] = useState("");
  const [items, setItems] = useState(seedPool);
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const scored = useMemo(() => {
    let base = items.map((item) => scoreItem(item, categories)).sort((a, b) => b.score - a.score);

    if (keyword.trim()) {
      const k = keyword.trim().toLowerCase();
      base = base.filter((item) => {
        return (
          item.title.toLowerCase().includes(k) ||
          item.snippet.toLowerCase().includes(k) ||
          (item.rawTags || []).join(" ").toLowerCase().includes(k) ||
          item.category.toLowerCase().includes(k)
        );
      });
    }

    if (selectedCategory !== "全部") {
      base = base.filter((i) => i.category === selectedCategory);
    }

    return base;
  }, [items, categories, keyword, selectedCategory]);

  const addSource = () => {
    setSources((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: "自定义来源",
        type: "rss",
        endpoint: "https://example.com/feed.xml",
        enabled: false,
        note: "你可以替换成真实 RSS / JSON API。",
      },
    ]);
  };

  const updateSource = (id, patch) => {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const removeSource = (id) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const importJson = () => {
    try {
      const parsed = JSON.parse(manualJson);
      if (!Array.isArray(parsed)) throw new Error("JSON 必须是数组");
      const normalized = parsed.map((x, idx) => ({
        title: x.title || `未命名条目 ${idx + 1}`,
        source: x.source || "Imported",
        url: x.url || "#",
        date: x.date || "2026-03-11",
        snippet: x.snippet || x.description || "",
        rawTags: x.rawTags || x.tags || [],
      }));
      setItems((prev) => [...normalized, ...prev]);
      setManualJson("");
    } catch (err) {
      alert(`导入失败：${err.message}`);
    }
  };

  const refreshIdeas = () => {
    const remixed = [...seedPool]
      .map((item) => ({
        ...item,
        title: item.title.replace("历史上", "有没有人真的").replace("为什么", "到底为什么"),
      }))
      .concat(seedPool)
      .slice(0, 20);
    setItems(remixed);
  };

  const setWeight = (id, value) => {
    setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, weight: value[0] } : cat)));
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className="rounded-3xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="w-5 h-5" />
                牧录内容池引擎
              </CardTitle>
              <CardDescription>
                按你账号现有流量模型做推荐：神秘宗教 / 真实离奇事件 / 科学禁区 / 文化奇观 / 历史体系。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-2xl bg-white p-3">
                  <div className="text-neutral-500">当前候选</div>
                  <div className="text-2xl font-semibold">{scored.length}</div>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <div className="text-neutral-500">已接入来源</div>
                  <div className="text-2xl font-semibold">{sources.length}</div>
                </div>
              </div>
              <Button className="w-full rounded-2xl" onClick={refreshIdeas}>
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新推荐
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="w-5 h-5" />
                内容分类权重
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {categories.map((cat) => (
                <div key={cat.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{cat.name}</div>
                      <div className="text-xs text-neutral-500">{cat.description}</div>
                    </div>
                    <Badge variant="secondary" className="rounded-full">{cat.weight}</Badge>
                  </div>
                  <Slider value={[cat.weight]} min={20} max={120} step={1} onValueChange={(v) => setWeight(cat.id, v)} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="w-5 h-5" />
                来源池
              </CardTitle>
              <CardDescription>
                这里先给你放了几个 starter（起步）来源。真实上线时建议接 RSS + API + 你自己的手工选题库。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sources.map((s) => (
                <div key={s.id} className="rounded-2xl border p-3 bg-white space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Input value={s.name} onChange={(e) => updateSource(s.id, { name: e.target.value })} />
                    <Button variant="outline" size="icon" onClick={() => removeSource(s.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input value={s.endpoint} onChange={(e) => updateSource(s.id, { endpoint: e.target.value })} />
                  <div className="flex flex-wrap gap-2">
                    <Badge className="rounded-full">{s.type.toUpperCase()}</Badge>
                    <Badge variant={s.enabled ? "default" : "secondary"} className="rounded-full">
                      {s.enabled ? "已启用" : "未启用"}
                    </Badge>
                  </div>
                  <div className="text-xs text-neutral-500">{s.note}</div>
                </div>
              ))}
              <Button variant="outline" className="w-full rounded-2xl" onClick={addSource}>
                <Plus className="w-4 h-4 mr-2" />
                新增来源
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className="rounded-3xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Globe className="w-5 h-5" />
                推荐池
              </CardTitle>
              <CardDescription>
                逻辑：按你账号的爆款模型打分，自动贴分类、排序、保留灵感线索。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-[1fr_180px] gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-neutral-400" />
                  <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="搜关键词，比如：约柜 / 失踪 / 基因 / 禁书" className="pl-9 rounded-2xl" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-2xl border bg-white px-3 text-sm"
                >
                  <option>全部</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-3">
                {scored.map((item, idx) => (
                  <motion.div key={`${item.title}-${idx}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="rounded-3xl border-0 shadow-sm bg-white">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className="rounded-full">TOP {idx + 1}</Badge>
                              <Badge variant="secondary" className="rounded-full">{item.category}</Badge>
                              <Badge variant="outline" className="rounded-full">匹配分 {item.score}</Badge>
                            </div>
                            <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
                          </div>
                          <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm underline underline-offset-4">
                            <LinkIcon className="w-4 h-4" />
                            来源
                          </a>
                        </div>

                        <p className="text-sm text-neutral-600 leading-6">{item.snippet}</p>

                        <div className="flex flex-wrap gap-2">
                          {(item.rawTags || []).map((tag) => (
                            <Badge key={tag} variant="outline" className="rounded-full">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span>{item.source}</span>
                          <span>{item.date}</span>
                        </div>

                        <div className="rounded-2xl bg-neutral-50 p-3 text-sm">
                          <span className="font-medium">推荐理由：</span>
                          {item.reason}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">批量导入 JSON</CardTitle>
              <CardDescription>
                你后面可以把别处抓到的内容流，统一转成 JSON 扔进来。格式：title / source / url / date / snippet / rawTags。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={manualJson}
                onChange={(e) => setManualJson(e.target.value)}
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
                className="min-h-[220px] rounded-2xl"
              />
              <Button className="rounded-2xl" onClick={importJson}>导入内容</Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">你下一步最该怎么接</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-neutral-700 leading-7 space-y-2">
              <p>1. 先把你的内容池拆成 5 个主分类，不要再把所有灵感混在一起。</p>
              <p>2. 真正上线时，加一个简单后端：定时抓 RSS / API → 存数据库 → 用这套打分逻辑自动分类。</p>
              <p>3. 再加一个“已写脚本 / 已发 / 待做 / 可复刻”状态栏，你就不是灵感堆积，而是内容生产线了。</p>
              <p>4. 你最值得优先扩大的不是纯历史，而是“真实离奇事件 + 神秘宗教 + 科学禁区”这三条线。</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
