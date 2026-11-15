// 맵 1: 바둑판 마을 — 네모난 구역마다 집이 따닥따닥 붙어 있는 마을
registerMap({
  id: 'town-grid',
  order: 1,
  icon: '🏘️',
  name: '바둑판 마을',
  desc: '네모난 성벽 안에 집이 빽빽한 마을. 길이 바둑판처럼 곧아서 처음 하기 좋아요.',
  build(m) {
    const N = 8, BW = 56, SW = 14, PITCH = BW + SW;           // 구역 수, 구역 크기, 길 너비
    const HALF = (N * BW + (N + 1) * SW) / 2;
    const center = i => -HALF + SW + BW / 2 + i * PITCH;      // i번째 구역 가운데
    const street = k => -HALF + SW / 2 + k * PITCH;           // k번째 길 가운데

    m.setup({
      extent: HALF + 6,
      bounds: { kind: 'rect', hx: HALF, hz: HALF },
      ground: { kind: 'rect', hx: HALF, hz: HALF },
      titanHunt: 0
    });

    // 대피소는 가운데 근처 구역에
    const SI = Math.floor(N / 2) - 1;
    m.shelter(center(SI), center(SI));

    // 길: 바둑판 모양 교차로
    const id = [];
    for (let k = 0; k <= N; k++) {
      id.push([]);
      for (let l = 0; l <= N; l++) id[k].push(m.node(street(k), street(l), { spawn: k === 0 || l === 0 || k === N || l === N }));
    }
    for (let k = 0; k <= N; k++) for (let l = 0; l <= N; l++) {
      if (k < N) m.edge(id[k][l], id[k + 1][l], { w: SW });
      if (l < N) m.edge(id[k][l], id[k][l + 1], { w: SW });
    }

    // 사방 성벽(보기만 하는 장식)
    const WL = HALF * 2 + 20;
    const wall = { h: 46, color: 0x8a857b, decor: true };
    m.building({ x: 0, z: -HALF - 5, w: WL, d: 10, ...wall });
    m.building({ x: 0, z: HALF + 5, w: WL, d: 10, ...wall });
    m.building({ x: -HALF - 5, z: 0, w: 10, d: WL, ...wall });
    m.building({ x: HALF + 5, z: 0, w: 10, d: WL, ...wall });

    // 집: 구역마다 북쪽 줄(문이 북쪽)과 남쪽 줄(문이 남쪽)
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      if (i === SI && j === SI) continue;
      const bx = center(i), bz = center(j);
      for (const side of [-1, 1]) {
        const cnt = Math.random() < 0.7 ? 4 : (Math.random() < 0.5 ? 3 : 5);
        const raw = []; let sum = 0;
        for (let q = 0; q < cnt; q++) { const r = m.rand(0.8, 1.25); raw.push(r); sum += r; }
        let cx = bx - BW / 2;
        for (let q = 0; q < cnt; q++) {
          const w = raw[q] / sum * BW;                         // 옆집과 딱 붙도록 폭을 꽉 채워요
          m.house({ x: cx + w / 2, z: bz + side * 15, w, d: 26, ry: side === 1 ? 0 : Math.PI });
          cx += w;
        }
      }
    }
  }
});
