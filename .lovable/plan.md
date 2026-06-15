
# Theme Edit Section — Split View Redesign

## লক্ষ্য
ইউজার ড্যাশবোর্ড থেকে থিম সিলেক্ট করলে একটা ডেডিকেটেড এডিটর পেজ খুলবে যেখানে **বামে ওই থিমের নিজস্ব কন্ট্রোল প্যানেল (ফর্ম)** আর **ডানে লাইভ প্রিভিউ** পাশাপাশি থাকবে। আপাতত শুধু **Simple** থিম থাকবে — বাকি সব থিম সরিয়ে দেওয়া হবে।

## স্কোপ

### ১. থিম ক্লিনআপ
- বাকি সব থিম (Standard / Pro / Elite ইত্যাদি specialized themes) কোডবেস ও ডেটাবেস থেকে সরাবো।
- শুধু `simple` থিম রাখবো — ডিফল্ট ও একমাত্র অপশন।
- থিম পিকার / মার্কেটিং থিম গ্যালারি / pricing tier UI সরানো বা hide করা হবে।
- bKash পেমেন্ট-রিলেটেড premium theme UI সরাবো (যেহেতু কোনো paid theme নেই)।

### ২. নতুন এডিটর লেআউট — Split View

```text
┌──────────────────────────────────────────────────────────┐
│  Topbar: theme name · Save · Publish · Back              │
├──────────────────┬───────────────────────────────────────┤
│                  │                                       │
│  Control Panel   │        Live Preview (iframe)          │
│  (Simple theme)  │        Desktop / Mobile toggle        │
│  - Hero          │                                       │
│  - Bio           │   রিয়েলটাইম আপডেট হবে                  │
│  - Skills        │                                       │
│  - Projects      │                                       │
│  - Contact       │                                       │
│                  │                                       │
└──────────────────┴───────────────────────────────────────┘
```

- **বাম প্যানেল (~40%)**: scrollable accordion/sections, প্রতিটা section-এ ওই থিমের জন্য প্রয়োজনীয় ফিল্ড।
- **ডান প্যানেল (~60%)**: লাইভ প্রিভিউ, ফর্মে টাইপ করলে সাথে সাথে update।
- মোবাইলে: tab toggle (Edit / Preview)।

### ৩. Per-Theme Control Panel আর্কিটেকচার
এমনভাবে বানানো হবে যাতে ভবিষ্যতে নতুন থিম এলে **শুধু ওই থিমের জন্য আলাদা control panel কম্পোনেন্ট** বানালেই কাজ করে।

```text
src/components/theme-editors/
  ├── simple/
  │     ├── SimpleControlPanel.tsx   ← এই থিমের ফর্ম
  │     └── schema.ts                ← ফিল্ড definition
  └── registry.ts                    ← themeId → ControlPanel mapping
```

Editor page করবে `registry[themeId]` lookup → ওই থিমের প্যানেল রেন্ডার।

### ৪. Flow
1. Dashboard → "Edit Portfolio" → `/editor` রুট
2. (একটাই থিম, তাই auto-select)
3. Split view খুলবে → বামে Simple-এর ফিল্ড, ডানে লাইভ Simple theme preview
4. Save → Supabase-এ persist
5. Publish → existing approval workflow

## টেকনিক্যাল ডিটেইলস
- নতুন route: `/editor` (protected)
- State: ফর্ম state React Hook Form + Zod, debounced save
- Live preview: same React tree, props-driven (iframe লাগবে না প্রথমে)
- DB: existing `portfolios` table-ই ব্যবহার, schema পরিবর্তন নেই
- Migration: existing user-দের যাদের non-simple theme সিলেক্ট করা ছিল, তাদের `theme = 'simple'` এ migrate করবো
- পুরনো theme ফাইল ও routes ডিলিট

## যা থাকবে না (এই স্কোপে)
- নতুন থিম যোগ করা
- পেমেন্ট flow পরিবর্তন (premium theme নেই, তাই এমনিতেই বাদ)
- ব্যাকএন্ড schema পরিবর্তন

কনফার্ম করলে implement শুরু করবো।
