// ==============================================================
//  새 맵 만드는 방법 (이 파일을 복사해서 시작하세요)
//  1) 이 파일을 복사해서 maps/내맵.js 로 이름을 바꿔요.
//  2) 아래 id 를 다른 맵과 겹치지 않는 영어 이름으로 바꾸고, name/desc 를 적어요.
//  3) maps/maps.js 의 목록에 'maps/내맵.js' 를 한 줄 추가해요.
//  4) 게임을 새로고침하면 맵 고르기 화면에 나타나요!
//
//  좌표: x는 오른쪽(동쪽), z는 아래쪽(남쪽). 가운데가 (0, 0) 이에요.
//  집의 ry(회전): 0이면 문이 남쪽(+z)을 봐요. Math.PI 면 북쪽, Math.PI/2 면 동쪽.
//  (오리지널 이름·그림만 쓰세요. 다른 작품의 이름/캐릭터는 쓰지 않아요)
//
//  쓸 수 있는 도구 m.*
//   m.setup({ sky, fog:[가까운,먼], extent, bounds, ground, outerColor, roads, titanHunt, config })
//   m.shelter(x, z)                    대피소 (꼭 하나 필요)
//   m.node(x, z, {spawn:true})         길의 교차로 (spawn:true 면 거인이 거기서 나타나요)
//   m.edge(a, b, {w:14})               교차로 a와 b를 잇는 길 (거인과 시민이 이 길을 따라 움직여요)
//   m.house({x, z, w, d, ry})          집 (다른 것과 겹치면 놓이지 않아요)
//   m.building({x, z, w, d, h, ry, roofH, color, roofColor})   안에 못 들어가는 단단한 건물
//   m.tower({x, z, r, h, coneH})       둥근 탑
//   m.ring({r, t, h, gates:[{a, w}]})  둥근 성벽 (a: 문 방향 각도, 0=남쪽 90°=동쪽)
//   m.forest({r0, r1, count}) / m.tree(x, z) / m.mountain({x, z, r, h})   바깥 풍경
//   m.zone({x, z, r}) 또는 m.zone({x, z, hw, hd})   집을 못 짓게 막는 구역
// ==============================================================
registerMap({
  id: 'my-map',                 // 영어 이름 (다른 맵과 겹치면 안 돼요)
  order: 99,                    // 작을수록 앞에 나와요
  icon: '🗺️',
  name: '내가 만든 맵',
  desc: '작은 광장 마을 예시예요.',
  build(m) {
    m.setup({
      extent: 160,
      bounds: { kind: 'rect', hx: 150, hz: 150 },
      ground: { kind: 'rect', hx: 150, hz: 150 }
    });
    m.shelter(-70, -70);                         // 대피소

    // 길: 네모난 큰길 하나 + 가운데 십자 길
    const a = m.node(-100, -100, { spawn: true }), b = m.node(100, -100, { spawn: true });
    const c = m.node(100, 100, { spawn: true }),   d = m.node(-100, 100, { spawn: true });
    const e = m.node(0, -100), f = m.node(100, 0), g = m.node(0, 100), h = m.node(-100, 0), o = m.node(0, 0);
    m.path([a, e, b, f, c, g, d, h, a]);
    m.edge(e, o); m.edge(f, o); m.edge(g, o); m.edge(h, o);

    // 집: 길 옆에 한 줄로 (북쪽 길은 남쪽을, 남쪽 길은 북쪽을 보게)
    for (let x = -85; x <= 85; x += 22) {
      m.house({ x, z: -123, w: 20, d: 26, ry: 0 });          // 북쪽 길 위쪽 줄 (문이 남쪽)
      m.house({ x, z: 123, w: 20, d: 26, ry: Math.PI });     // 남쪽 길 아래쪽 줄 (문이 북쪽)
    }
  }
});
