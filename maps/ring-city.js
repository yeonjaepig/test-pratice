// 맵 2: 삼중 성벽 도시 — 겹겹이 둘러싼 세 개의 둥근 성벽 안에 왕궁이 있는 도시
// (이름은 모두 이 게임만의 이름이에요: 바깥 하란 성벽, 가운데 미르텐 성벽, 안쪽 에셀 성벽)
registerMap({
  id: 'ring-city',
  order: 2,
  icon: '🏰',
  name: '삼중 성벽 왕도',
  desc: '하란·미르텐·에셀, 세 겹의 둥근 성벽. 한가운데 왕궁, 바깥에는 남문 요새와 숲과 산이 있어요. 성벽을 타고 넘어 보세요!',
  build(m) {
    const PI = Math.PI;
    // 성벽 반지름과 길 반지름
    const WALL_OUT = 370, WALL_MID = 255, WALL_IN = 150;      // 바깥 하란 / 가운데 미르텐 / 안쪽 에셀 성벽
    const RA = 75, RB = 202, RC = 312;                       // 안쪽 마을 / 가운데 마을 / 바깥 마을을 도는 큰길

    m.setup({
      sky: 0xa5d8ff,
      fog: [230, 900],
      extent: 580,
      bounds: { kind: 'circle', r: 560 },
      ground: { kind: 'circle', r: 382 },
      outerColor: 0x5a9a48,
      roads: { draw: true, color: 0x5f5c56 },
      titanHunt: 0.4              // 거인이 나 쪽으로 걸어올 때가 많아요
    });

    // ----- 대피소: 안쪽 성벽 안, 서쪽 -----
    m.shelter(-110, 0);

    // ----- 성벽 (a: 문 방향. 0°=남쪽, 90°=동쪽, 180°=북쪽, 270°=서쪽) -----
    m.zone({ x: 0, z: 0, r: 44 });   // 왕궁 자리
    m.ring({ r: WALL_OUT, t: 12, h: 52, gates: [{ a: 0, w: 26 }, { a: PI, w: 26 }], towerRoof: 0x8d4a35 });
    m.ring({ r: WALL_MID, t: 10, h: 44, gates: [{ a: PI / 2, w: 24 }, { a: PI * 1.5, w: 24 }], towerRoof: 0x6e5546 });
    m.ring({ r: WALL_IN, t: 9, h: 36, gates: [{ a: 0, w: 24 }, { a: PI, w: 24 }], bastions: 8, bastionR: 12, bastionPhase: PI / 8, towerRoof: 0x3f6fa8 });

    // ----- 왕궁 -----
    m.building({ x: 0, z: 0, w: 34, d: 34, h: 30, roofH: 12, color: 0xd2cbbb, roofColor: 0x3f6fa8 });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      m.tower({ x: sx * 22, z: sz * 22, r: 7, h: 38, coneH: 12, color: 0xc5beae, coneColor: 0x3f6fa8 });
    }

    // ----- 길 -----
    const ring = (R, n, spawn) => {   // 둥근 큰길: n개의 교차로
      const ids = [];
      for (let i = 0; i < n; i++) { const a = i * 2 * PI / n; ids.push(m.node(Math.sin(a) * R, Math.cos(a) * R)); }
      for (let i = 0; i < n; i++) m.edge(ids[i], ids[(i + 1) % n], { w: 14 });
      return ids;
    };
    const A = ring(RA, 12), B = ring(RB, 24), C = ring(RC, 24);
    const at = (R, a) => m.node(Math.sin(a) * R, Math.cos(a) * R);
    // 성문을 지나는 길: 큰길 - 성문 - 큰길
    const gate = (from, to, R, a) => { const g = at(R, a); m.edge(from, g, { w: 14 }); m.edge(g, to, { w: 14 }); return g; };
    gate(A[0], B[0], WALL_IN, 0);          // 안쪽 성벽 남문
    gate(A[6], B[12], WALL_IN, PI);        // 안쪽 성벽 북문
    gate(B[6], C[6], WALL_MID, PI / 2);    // 가운데 성벽 동문
    gate(B[18], C[18], WALL_MID, PI * 1.5);// 가운데 성벽 서문
    // 바깥 성벽 남문 + 바깥 길(남문 요새로 이어져요)
    const gs = at(WALL_OUT, 0); m.edge(C[0], gs, { w: 14 });
    const o1 = m.node(0, 470, { noCitizen: true }), o2 = m.node(0, 525, { spawn: true }),
          oe = m.node(150, 490, { spawn: true }), ow = m.node(-150, 490, { spawn: true });
    m.edge(gs, o1, { w: 14, noCitizen: true });
    m.edge(o1, o2, { w: 14, noCitizen: true }); m.edge(o1, oe, { w: 14, noCitizen: true }); m.edge(o1, ow, { w: 14, noCitizen: true });
    // 바깥 성벽 북문 + 북쪽 바깥 길
    const gn = at(WALL_OUT, PI); m.edge(C[12], gn, { w: 14 });
    const n1 = m.node(0, -450, { noCitizen: true }), n2 = m.node(0, -525, { spawn: true }),
          ne = m.node(150, -490, { spawn: true }), nw = m.node(-150, -490, { spawn: true });
    m.edge(gn, n1, { w: 14, noCitizen: true });
    m.edge(n1, n2, { w: 14, noCitizen: true }); m.edge(n1, ne, { w: 14, noCitizen: true }); m.edge(n1, nw, { w: 14, noCitizen: true });

    // ----- 남문 요새 (바깥 성벽 남문 앞) -----
    for (const s of [-1, 1]) {
      m.building({ x: s * 50, z: 425, w: 62, d: 46, h: 26, roofH: 10, color: 0xa39d90, roofColor: 0x6e5546 });
      m.tower({ x: s * 24, z: 404, r: 7, h: 36, coneH: 10, color: 0xb0aa9d, coneColor: 0x8d4a35 });
      m.tower({ x: s * 80, z: 404, r: 8, h: 34, coneH: 10, color: 0xb0aa9d, coneColor: 0x8d4a35 });
      m.zone({ x: s * 50, z: 425, hw: 38, hd: 30 });
    }

    // ----- 집: 큰길 양쪽에 따닥따닥 (문이 큰길 쪽을 봐요) -----
    // sideSign +1: 큰길 바깥쪽 줄, -1: 안쪽 줄
    const row = (roadR, sideSign) => {
      const rc = roadR + sideSign * 22;
      const start = m.rand(0, 0.2);
      let th = start;
      for (let guard = 0; guard < 400; guard++) {
        const w = m.rand(11, 19);
        const gap = 1 + 13 * (w + 1) / rc;          // 둥글게 놓을 때 안쪽 모서리가 겹치지 않게
        const dth = (w + gap) / rc;
        if (th + dth > start + 2 * PI) break;
        const c = th + (w / 2 + gap / 2) / rc;
        m.house({ x: Math.sin(c) * rc, z: Math.cos(c) * rc, w, d: 26, ry: sideSign > 0 ? c + PI : c });
        th += dth;
      }
    };
    for (const R of [RA, RB, RC]) { row(R, 1); row(R, -1); }

    // ----- 바깥 풍경: 숲과 산 -----
    m.forest({ r0: 392, r1: 545, count: 420 });
    for (let i = 0; i < 16; i++) {
      const a = i * 2 * PI / 16 + m.rand(-0.1, 0.1), r = m.rand(660, 780);
      m.mountain({ x: Math.sin(a) * r, z: Math.cos(a) * r, r: m.rand(90, 150), h: m.rand(120, 210) });
    }
  }
});
