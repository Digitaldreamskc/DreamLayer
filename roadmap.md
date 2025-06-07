# DreamLayer Dev Roadmap

## ✅ Core Setup (Complete)
- [x] ERC-7160 Minting
- [x] Story Protocol SDK Config
- [x] Irys Integration
- [x] FastAPI Backend Skeleton
- [x] ERC-6551 Base Config
- [x] Wallet + Mint UI

---

## ⚙️ In Progress

### 🎨 Dynamic NFT Update Flow
- [ ] Create `src/services/MetadataUpdateQueue.ts`
- [ ] Add reaction/play count support
- [ ] Add `PUT /api/metadata/{token_id}/update` endpoint
- [ ] Hook into frontend activity (e.g. play, like)

### 🧠 TBA Integration
- [ ] Create `src/services/TBAService.ts`
- [ ] Support royalty distribution from license sales
- [ ] Log TBA history
- [ ] Detect TBAs on wallet connect

### 🔎 Indexing & Search
- [ ] Create `/src/services/IndexingService.ts`
- [ ] Add Typesense or Elastic backend
- [ ] Add `/api/search` endpoint
- [ ] Implement `/src/components/SearchInterface.tsx`

### 🧮 Analytics Dashboard
- [ ] Create `/src/components/analytics/`
  - `MetricsDisplay.tsx`, `ActivityFeed.tsx`, `RevenueChart.tsx`
- [ ] Create `/src/hooks/useAnalytics.ts`
- [ ] Add `/api/analytics/` routes

### 🚀 Queueing and Caching
- [ ] Add `src/lib/redis.ts`
- [ ] Set up BullMQ queues
- [ ] Add cache invalidation logic

---

## 🔜 Optional/Advanced

- [ ] TBA token gating for license download
- [ ] ERC-6551 reputation or verification
- [ ] DAW plugin handshake prototype (VST JSON license inject)
- [ ] Mint-based gated streaming link (demo)
